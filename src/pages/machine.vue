<template>
    <div class="machine-page">
        <navBar :url="'machine'" />

        <mescroll-vue class="machine-scroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <section class="machine-hero">
                <h1>{{ $t('我的矿机') }}</h1>
                <p>{{ $t('实时查看矿机购买记录，掌握订单状态与收益动态') }}</p>
            </section>

            <section class="machine-list">
                <div class="machine-card" v-for="(item, index) in list" :key="index">
                    <div class="machine-card-head df-aic-jusb">
                        <div>
                            <strong>{{ item.totalAmount }} SHINE SOL</strong>
                            <span>{{ $t('总释放') }}</span>
                        </div>
                        <div class="progress-box">
                            <div class="progress-track">
                                <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
                            </div>
                            <span>{{ item.statusKey ? $t(item.statusKey) : item.progressText }}</span>
                        </div>
                    </div>

                    <div class="machine-row df-aic-jusb">
                        <span>{{ $t('已释放') }}</span>
                        <strong class="gold">{{ item.releasedAmount }} SHINE SOL</strong>
                    </div>
                    <div class="machine-row df-aic-jusb">
                        <span>{{ $t('时间') }}</span>
                        <strong class="muted">{{ item.time }}</strong>
                    </div>
                </div>

                <noData v-if="list.length == 0"></noData>
            </section>
        </mescroll-vue>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mescroll: null,
            mescrollUp: {
                callback: this.upCallback,
                page: {
                    size: 10,
                },
            },
            list: [],
        }
    },
    methods: {
        mescrollInit(mescroll) {
            this.mescroll = mescroll
        },
        setMescrollText() {
            if(this.mescroll){
                this.mescroll.optDown.textInOffset = this.$t('下拉刷新')
                this.mescroll.optDown.textOutOffset = this.$t('释放更新')
                this.mescroll.optDown.textLoading = this.$t('加载中 ...')
                this.mescroll.optDown.textSuccess = this.$t('加载成功')
                this.mescroll.optDown.textErr = this.$t('加载失败')
                this.mescroll.optUp.textInOffset = this.$t('下拉刷新')
                this.mescroll.optUp.textOutOffset = this.$t('释放更新')
                this.mescroll.optUp.textLoading = this.$t('加载中 ...')
                this.mescroll.optUp.textSuccess = this.$t('加载成功')
                this.mescroll.optUp.textSuccess = this.$t('加载失败')
                this.mescroll.optUp.empty.tip = this.$t('暂无数据')
                this.mescroll.optUp.textNoMore = this.$t('没有更多了')
            }
        },
        upCallback(page, mescroll) {
            this.setMescrollText()
            this.$http.get('/api/swap/release_list', {
                page_no: page.num,
                page_size: page.size || 10
            }).then((res) => {
                if (res.code == 200) {
                    const arr = ((res.data && res.data.release_orders) || []).map(item => this.normalizeReleaseOrder(item))
                    if (page.num === 1) this.list = []
                    this.list = this.list.concat(arr)
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length)
                    })
                } else {
                    mescroll.endErr()
                }
            }).catch((err) => {
                console.log('矿机释放订单列表获取失败', err)
                mescroll.endErr()
            })
        },
        normalizeReleaseOrder(item) {
            const totalAmount = this.formatAmount(item.out_amount)
            const releasedAmount = this.formatAmount(item.release_amount)
            const isCompleted = Number(item.status) === 2

            return {
                totalAmount,
                releasedAmount,
                time: item.created_at || '',
                progress: this.getProgress(item.out_amount, item.release_amount, isCompleted),
                progressText: isCompleted ? '' : `${releasedAmount}/${totalAmount} SHINE SOL`,
                statusKey: isCompleted ? '已完成' : '',
            }
        },
        getProgress(totalAmount, releaseAmount, isCompleted) {
            if (isCompleted) return 100
            const total = this.toNumber(totalAmount)
            const released = this.toNumber(releaseAmount)
            if (total <= 0) return 0
            return Math.max(0, Math.min(100, (released / total) * 100))
        },
        toNumber(value) {
            const number = Number(String(value || '0').replace(/,/g, ''))
            return Number.isFinite(number) ? number : 0
        },
        formatAmount(value) {
            if (value === undefined || value === null || value === '') return '0'
            return String(value)
        },
    },
}
</script>

<style scoped lang="less">
.machine-page {
    position: relative;
    z-index: 3;
    width: 750px;
    min-height: 100vh;
    color: #FFFFFF;
    background: #030306;

    .machine-scroll {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 750px;
        height: auto;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background:
            radial-gradient(circle at 50% -110px, rgba(103, 27, 133, 0.58) 0, rgba(103, 27, 133, 0.18) 240px, rgba(0, 0, 0, 0) 520px),
            radial-gradient(circle at 92% 250px, rgba(35, 117, 255, 0.22) 0, rgba(35, 117, 255, 0) 260px),
            linear-gradient(180deg, #180720 0%, #08070E 650px, #000 100%);

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .machine-hero {
        padding: 56px 30px 0;

        h1 {
            margin: 0;
            color: #FFD99F;
            font-size: 42px;
            font-weight: 700;
            line-height: 1.2;
        }

        p {
            margin: 26px 0 0;
            color: rgba(255, 255, 255, 0.48);
            font-size: 28px;
            line-height: 1.35;
            word-break: break-word;
        }
    }

    .machine-list {
        padding: 46px 30px 70px;
    }

    .machine-card {
        width: 690px;
        min-height: 284px;
        margin: 0 auto 20px;
        padding: 34px 30px 30px;
        border-radius: 20px;
        background:
            radial-gradient(circle at 80% 8%, rgba(42, 48, 68, 0.74) 0, rgba(42, 48, 68, 0) 250px),
            linear-gradient(135deg, rgba(35, 36, 47, 0.96) 0%, rgba(27, 25, 34, 0.96) 100%);
        box-shadow: inset 0 0 36px rgba(255, 255, 255, 0.02);
    }

    .machine-card-head {
        align-items: flex-start;

        strong {
            display: block;
            color: #FFFFFF;
            font-size: 34px;
            font-weight: 700;
            line-height: 1;
            word-break: break-word;
        }

        span {
            display: block;
            margin-top: 24px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 26px;
            line-height: 1.2;
        }
    }

    .progress-box {
        width: 260px;
        padding-top: 6px;
        text-align: right;

        span {
            display: block;
            margin-top: 18px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 26px;
            line-height: 1.2;
            word-break: break-word;
        }
    }

    .progress-track {
        width: 200px;
        height: 14px;
        margin-left: auto;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
    }

    .progress-bar {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #F8B85A 0%, #FFE1AD 100%);
    }

    .machine-row {
        margin-top: 28px;
        color: rgba(255, 255, 255, 0.42);
        font-size: 26px;

        &:first-of-type {
            margin-top: 42px;
        }

        strong {
            max-width: 390px;
            color: #FFFFFF;
            font-size: 26px;
            font-weight: 500;
            text-align: right;
            line-height: 1.2;
            word-break: break-word;
        }

        .gold {
            color: #F8C165;
        }

        .muted {
            color: rgba(255, 255, 255, 0.48);
        }
    }
}
</style>
