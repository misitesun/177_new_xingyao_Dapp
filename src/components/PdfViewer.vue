<template>
    <div ref="viewer" class="pdf-viewer" :aria-busy="loading ? 'true' : 'false'">
        <div v-if="loading" class="viewer-state">
            <van-loading type="spinner" color="#EFB152" size="30px" />
            <div class="state-text">{{ loadingText }}</div>
        </div>

        <div v-else-if="errorMessage" class="viewer-state viewer-error">
            <van-icon name="warning-o" size="32" color="#EFB152" />
            <div class="state-text">{{ $t('PDF加载失败') }}</div>
            <button type="button" class="retry-btn common-btn" @click="loadDocument">
                {{ $t('重新加载') }}
            </button>
        </div>

        <div v-show="!errorMessage && pageCount" ref="pages" class="pdf-pages">
            <div
                v-for="pageNumber in pageCount"
                :key="pageNumber"
                class="pdf-page"
                :data-page="pageNumber"
            >
                <canvas :data-page-canvas="pageNumber"></canvas>
                <div class="page-number">{{ pageNumber }} / {{ pageCount }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// 开发环境交给 Webpack 提供 Worker，支持热更新且不依赖重启后的复制配置。
// 生产环境改用构建时复制的 .js，避免线上服务器把 .mjs 返回为 octet-stream。
pdfjsLib.GlobalWorkerOptions.workerSrc = process.env.NODE_ENV === 'production'
    ? `${process.env.BASE_URL}js/pdf.worker.min.js`
    : new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

export default {
    name: 'PdfViewer',
    props: {
        src: {
            type: String,
            required: true,
        },
        zoom: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            loading: true,
            loadingProgress: 0,
            errorMessage: '',
            pageCount: 0,
            pdfDocument: null,
            loadingTask: null,
            renderTasks: [],
            renderVersion: 0,
            loadVersion: 0,
            resizeObserver: null,
            resizeTimer: null,
            lastViewerWidth: 0,
            isDestroyed: false,
        }
    },
    computed: {
        loadingText() {
            const progress = this.loadingProgress ? ` ${this.loadingProgress}%` : ''
            return `${this.$t('PDF加载中')}${progress}`
        },
    },
    watch: {
        src() {
            this.loadDocument()
        },
        zoom() {
            this.queueRender()
        },
    },
    mounted() {
        this.installResizeListener()
        this.loadDocument()
    },
    beforeDestroy() {
        this.isDestroyed = true
        this.loadVersion += 1
        this.renderVersion += 1
        clearTimeout(this.resizeTimer)
        this.cancelRenderTasks()
        this.removeResizeListener()
        this.destroyDocument()
    },
    methods: {
        async loadDocument() {
            const loadVersion = ++this.loadVersion

            this.renderVersion += 1
            this.cancelRenderTasks()
            this.destroyDocument()
            this.loading = true
            this.loadingProgress = 0
            this.errorMessage = ''
            this.pageCount = 0

            try {
                const loadingTask = pdfjsLib.getDocument({
                    url: this.src,
                    isEvalSupported: false,
                })

                this.loadingTask = loadingTask
                loadingTask.onProgress = ({ loaded, total }) => {
                    if (loadVersion !== this.loadVersion || !total) return
                    this.loadingProgress = Math.min(100, Math.round((loaded / total) * 100))
                }

                const pdfDocument = await loadingTask.promise
                if (loadVersion !== this.loadVersion || this.isDestroyed) {
                    await pdfDocument.destroy()
                    return
                }

                this.pdfDocument = pdfDocument
                this.pageCount = pdfDocument.numPages
                this.$emit('loaded', this.pageCount)

                await this.$nextTick()
                await this.renderPages()

                if (loadVersion === this.loadVersion && !this.isDestroyed) {
                    this.loading = false
                    this.$emit('rendered')
                }
            } catch (error) {
                if (loadVersion !== this.loadVersion || this.isDestroyed || this.isRenderCancelled(error)) {
                    return
                }

                console.log('PDF加载失败', error)
                this.loading = false
                this.errorMessage = error && error.message ? error.message : 'PDF load failed'
                this.$emit('error', error)
            }
        },
        async renderPages() {
            if (!this.pdfDocument || !this.$refs.pages) return

            const renderVersion = ++this.renderVersion
            this.cancelRenderTasks()

            const pagesElement = this.$refs.pages
            const pagesStyle = window.getComputedStyle(pagesElement)
            const horizontalPadding = parseFloat(pagesStyle.paddingLeft) + parseFloat(pagesStyle.paddingRight)
            const availableWidth = Math.max(1, pagesElement.clientWidth - horizontalPadding)
            const outputScale = Math.min(window.devicePixelRatio || 1, 2)

            try {
                for (let pageNumber = 1; pageNumber <= this.pageCount; pageNumber += 1) {
                    if (renderVersion !== this.renderVersion || this.isDestroyed) return

                    const page = await this.pdfDocument.getPage(pageNumber)
                    const originalViewport = page.getViewport({ scale: 1 })
                    const fitScale = availableWidth / originalViewport.width
                    const viewport = page.getViewport({ scale: fitScale * this.zoom })
                    const canvas = pagesElement.querySelector(`[data-page-canvas="${pageNumber}"]`)

                    if (!canvas) continue

                    const context = canvas.getContext('2d', { alpha: false })
                    canvas.width = Math.floor(viewport.width * outputScale)
                    canvas.height = Math.floor(viewport.height * outputScale)
                    canvas.style.width = `${Math.floor(viewport.width)}px`
                    canvas.style.height = `${Math.floor(viewport.height)}px`

                    const renderTask = page.render({
                        canvasContext: context,
                        viewport,
                        transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
                        background: '#ffffff',
                    })

                    this.renderTasks.push(renderTask)
                    await renderTask.promise
                    this.renderTasks = this.renderTasks.filter(task => task !== renderTask)
                }
            } catch (error) {
                if (!this.isRenderCancelled(error)) throw error
            }
        },
        queueRender() {
            if (!this.pdfDocument || this.isDestroyed) return

            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(async () => {
                try {
                    await this.$nextTick()
                    await this.renderPages()
                } catch (error) {
                    if (!this.isRenderCancelled(error)) {
                        console.log('PDF渲染失败', error)
                        this.errorMessage = error && error.message ? error.message : 'PDF render failed'
                        this.$emit('error', error)
                    }
                }
            }, 120)
        },
        installResizeListener() {
            this.lastViewerWidth = this.$refs.viewer.clientWidth

            if (window.ResizeObserver) {
                this.resizeObserver = new ResizeObserver((entries) => {
                    const width = entries[0] ? entries[0].contentRect.width : 0
                    if (!width || Math.abs(width - this.lastViewerWidth) < 1) return

                    this.lastViewerWidth = width
                    this.queueRender()
                })
                this.resizeObserver.observe(this.$refs.viewer)
                return
            }

            window.addEventListener('resize', this.handleWindowResize)
        },
        removeResizeListener() {
            if (this.resizeObserver) {
                this.resizeObserver.disconnect()
                this.resizeObserver = null
            }
            window.removeEventListener('resize', this.handleWindowResize)
        },
        handleWindowResize() {
            const width = this.$refs.viewer ? this.$refs.viewer.clientWidth : 0
            if (!width || Math.abs(width - this.lastViewerWidth) < 1) return

            this.lastViewerWidth = width
            this.queueRender()
        },
        cancelRenderTasks() {
            this.renderTasks.forEach((task) => {
                if (task && typeof task.cancel === 'function') task.cancel()
            })
            this.renderTasks = []
        },
        destroyDocument() {
            if (this.loadingTask && typeof this.loadingTask.destroy === 'function') {
                this.loadingTask.destroy()
            } else if (this.pdfDocument && typeof this.pdfDocument.destroy === 'function') {
                this.pdfDocument.destroy()
            }

            this.loadingTask = null
            this.pdfDocument = null
        },
        isRenderCancelled(error) {
            return error && error.name === 'RenderingCancelledException'
        },
    },
}
</script>

<style scoped lang="less">
.pdf-viewer {
    min-height: 600px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

.viewer-state {
    min-height: 480px;
    padding: 80px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
}

.state-text {
    margin-top: 24px;
    font-size: 26px;
    line-height: 1.5;
}

.retry-btn {
    min-width: 180px;
    height: 68px;
    margin-top: 30px;
    padding: 0 32px;
    border: none;
    font-size: 24px;
}

.pdf-pages {
    width: 100%;
    padding: 24px;
}

.pdf-page {
    width: 100%;
    margin: 0 auto 30px;
}

.pdf-page canvas {
    display: block;
    max-width: none;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
}

.page-number {
    width: max-content;
    min-width: 92px;
    height: 40px;
    margin: 14px auto 0;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(239, 177, 82, 0.35);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.65);
    color: rgba(255, 255, 255, 0.65);
    font-size: 20px;
}
</style>
