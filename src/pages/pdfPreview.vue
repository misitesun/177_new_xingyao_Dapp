<template>
    <div class="pdf-preview-page">
        <van-nav-bar
            :title="$t('PDF预览')"
            @click-left="$go(1, 1)"
            :fixed="true"
            :placeholder="true"
            z-index="99"
            :border="false"
        >
            <template #left>
                <van-icon name="arrow-left" size="20" color="#fff" />
            </template>
        </van-nav-bar>

        <div class="viewer-toolbar" role="toolbar" :aria-label="$t('PDF预览')">
            <button
                type="button"
                class="tool-btn"
                :aria-label="$t('缩小')"
                :disabled="zoom <= minZoom"
                @click="zoomOut"
            >
                <van-icon name="minus" size="18" />
            </button>
            <button type="button" class="zoom-value" :aria-label="$t('适合宽度')" @click="resetZoom">
                {{ zoomPercent }}%
            </button>
            <button
                type="button"
                class="tool-btn"
                :aria-label="$t('放大')"
                :disabled="zoom >= maxZoom"
                @click="zoomIn"
            >
                <van-icon name="plus" size="18" />
            </button>
            <div v-if="pageCount" class="page-total">{{ $t('共 {count} 页', { count: pageCount }) }}</div>
        </div>

        <PdfViewer :src="pdfSource" :zoom="zoom" @loaded="handleLoaded" />
    </div>
</template>

<script>
import PdfViewer from '@/components/PdfViewer.vue'
import detailPdf from '@/assets/pdf/detail.pdf'

export default {
    name: 'PdfPreviewPage',
    components: {
        PdfViewer,
    },
    data() {
        return {
            pdfSource: detailPdf,
            pageCount: 0,
            zoom: 1,
            minZoom: 0.75,
            maxZoom: 2,
            zoomStep: 0.25,
        }
    },
    computed: {
        zoomPercent() {
            return Math.round(this.zoom * 100)
        },
    },
    methods: {
        handleLoaded(pageCount) {
            this.pageCount = pageCount
        },
        zoomIn() {
            this.zoom = Math.min(this.maxZoom, this.zoom + this.zoomStep)
        },
        zoomOut() {
            this.zoom = Math.max(this.minZoom, this.zoom - this.zoomStep)
        },
        resetZoom() {
            this.zoom = 1
        },
    },
}
</script>

<style scoped lang="less">
.pdf-preview-page {
    min-height: 100vh;
    padding-bottom: 30px;
    position: relative;
    z-index: 3;
    background: rgba(0, 0, 0, 0.82);
}

.viewer-toolbar {
    width: 690px;
    height: 80px;
    margin: 20px auto 0;
    padding: 0 24px;
    position: sticky;
    top: 88px;
    z-index: 10;
    display: flex;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 20px;
    background: rgba(22, 18, 12, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

.tool-btn,
.zoom-value {
    height: 52px;
    border: 1px solid rgba(239, 177, 82, 0.35);
    background: rgba(255, 255, 255, 0.06);
    color: #f9e0b7;
}

.tool-btn {
    width: 52px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.tool-btn:disabled {
    opacity: 0.35;
}

.zoom-value {
    min-width: 100px;
    margin: 0 14px;
    padding: 0 16px;
    border-radius: 26px;
    font-size: 22px;
}

.page-total {
    margin-left: auto;
    color: rgba(255, 255, 255, 0.55);
    font-size: 22px;
}
</style>
