<template>
    <div class="assets-record-page">
        <van-nav-bar
            :title="$t('资产记录')"
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

        <mescroll-vue class="record-scroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <section class="record-hero">
                <div class="token-title df-aic">
                    <img :src="currentToken.icon" alt="" />
                    <h1>{{ currentToken.symbol }}</h1>
                </div>
                <p>{{ $t('查看资产余额变动明细') }}</p>
            </section>

            <section class="record-list">
                <div class="record-card" v-for="(item, index) in list" :key="item.id || index">
                    <div class="record-card-head df-aic-jusb">
                        <div class="record-main">
                            <strong>{{ item.remark }}</strong>
                            
                        </div>
                        <div class="record-amount" :class="{ income: item.isIncrease, expense: !item.isIncrease }">
                            {{ item.amount }} {{ item.symbol }}
                        </div>
                    </div>

                    <div class="record-meta">
                        <div class="df-aic-jusb">
                            <span>{{ $t('类型') }}</span>
                            <em :class="{ income: item.isIncrease, expense: !item.isIncrease }">{{ $t(item.typeKey) }}</em>
                        </div>
                        <div class="df-aic-jusb">
                            <span>{{ $t('时间') }}</span>
                            <span>{{ item.time }}</span>
                        </div>
                    </div>
                </div>

                <noData v-if="list.length == 0"></noData>
            </section>
        </mescroll-vue>
    </div>
</template>

<script>
const tokenMap = {
    star_balance: {
        symbol: 'STAR',
        icon: require('@img/star.png'),
    },
    shine_balance: {
        symbol: 'SHINE',
        icon: require('@img/shine.png'),
    },
}

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
    computed: {
        currentCcy() {
            return this.$route.query.ccy || 'star_balance'
        },
        currentToken() {
            return tokenMap[this.currentCcy] || {
                symbol: this.getCcySymbol(this.currentCcy),
                icon: require('@img/star.png'),
            }
        },
    },
    watch: {
        '$route.query.ccy'() {
            if (this.mescroll) {
                this.mescroll.resetUpScroll()
            }
        },
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
            this.$http.get('/api/users/my/balance_logs', {
                page_no: page.num,
                page_size: page.size || 10,
                ccy: this.currentCcy,
            }).then((res) => {
                if (res.code == 200) {
                    const arr = this.getLogArray(res.data.asset_logs).map(item => this.normalizeLog(item))
                    if (page.num === 1) this.list = []
                    this.list = this.list.concat(arr)
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length)
                    })
                } else {
                    mescroll.endErr()
                }
            }).catch((err) => {
                console.log('资产流水获取失败', err)
                mescroll.endErr()
            })
        },
        getLogArray(data) {
            if (Array.isArray(data)) return data
            const source = data && (data.balance_logs || data.logs || data.list || data.records || data.data)
            if (Array.isArray(source)) return source
            if (source && Array.isArray(source.data)) return source.data
            return []
        },
        normalizeLog(item) {
            const ccy = item.balance_type || item.ccy || this.currentCcy
            const isIncrease = this.isIncreaseType(item.type)

            return {
                id: item.id,
                symbol: this.getCcySymbol(ccy),
                amount: this.formatApiValue(item.amount),
                remark: this.formatApiValue(item.content || item.title || item.desc || item.description) || this.$t('资产流水'),
                time: this.formatApiValue(item.created_at || item.updated_at || item.time),
                isIncrease,
                typeKey: isIncrease ? '增加' : '减少',
            }
        },
        isIncreaseType(type) {
            const value = String(type === undefined || type === null ? '' : type).toLowerCase()
            return value === '1' || value === 'increase' || value === 'in' || value === '+'
        },
        getCcySymbol(ccy) {
            if (ccy === 'star_balance') return 'STAR'
            if (ccy === 'shine_balance') return 'SHINE'
            return String(ccy || '').replace(/_balance$/g, '').toUpperCase() || '--'
        },
        formatApiValue(value) {
            if (value === undefined || value === null) return ''
            return String(value)
        },
    },
}
</script>

<style scoped lang="less">
.assets-record-page {
    position: relative;
    z-index: 3;
    width: 750px;
    min-height: 100vh;
    color: #FFFFFF;
    background: #030306;

    .record-scroll {
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

    .record-hero {
        padding: 56px 30px 0;

        .token-title {
            img {
                width: 52px;
                height: 52px;
                margin-right: 16px;
                flex: 0 0 52px;
            }
        }

        h1 {
            margin: 0;
            color: #FFD99F;
            font-size: 42px;
            font-weight: 700;
            line-height: 1.2;
        }

        p {
            margin: 24px 0 0;
            color: rgba(255, 255, 255, 0.48);
            font-size: 28px;
            line-height: 1.35;
            word-break: break-word;
        }
    }

    .record-list {
        padding: 42px 30px 70px;
    }

    .record-card {
        width: 690px;
        min-height: 188px;
        margin-bottom: 22px;
        padding: 30px;
        border-radius: 18px;
        background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(44, 48, 68, 0.54) 100%),
            rgba(22, 22, 28, 0.92);
        box-shadow: inset 0 0 28px rgba(255, 255, 255, 0.02);
    }

    .record-card-head {
        align-items: flex-start;
    }

    .record-main {
        min-width: 0;
        flex: 1;
        padding-right: 22px;

        strong {
            display: block;
            color: #FFFFFF;
            font-size: 30px;
            font-weight: 700;
            line-height: 1.35;
            word-break: break-word;
        }

        span {
            display: block;
            margin-top: 12px;
            color: rgba(255, 255, 255, 0.48);
            font-size: 24px;
            line-height: 1.3;
            word-break: break-word;
        }
    }

    .record-amount {
        max-width: 280px;
        color: #FFD084;
        font-size: 30px;
        font-weight: 700;
        line-height: 1.35;
        text-align: right;
        word-break: break-word;

        &.income {
            color: #FFD084;
        }

        &.expense {
            color: rgba(255, 255, 255, 0.72);
        }
    }

    .record-meta {
        margin-top: 26px;

        > div {
            min-height: 38px;
            margin-top: 12px;
        }

        span {
            color: rgba(255, 255, 255, 0.48);
            font-size: 24px;
        }

        em {
            max-width: 430px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 24px;
            font-style: normal;
            text-align: right;
            word-break: break-word;

            &.income {
                color: #FFD084;
            }

            &.expense {
                color: rgba(255, 255, 255, 0.64);
            }
        }
    }
}
</style>
