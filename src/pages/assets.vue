<template>
    <div class="assets-page">
        <navBar :url="'assets'" />

        <main class="assets-scroll">
            <section class="assets-hero">
                <h1>{{ $t('我的资产') }}</h1>
                <p>{{ $t('实时掌握链上余额，清晰查看星耀生态资产动态') }}</p>

                <div class="asset-tabs df-aic">
                    <button
                        v-for="(item, index) in assetCards"
                        :key="index"
                        :class="{ active: activeAssetIndex === index }"
                        @click="selectAsset(index)"
                    >
                        {{ item.labelKey ? $t(item.labelKey) : getTokenLabel(item.symbol) }}
                    </button>
                </div>
            </section>

            <section class="asset-carousel-wrap">
                <div class="asset-carousel" ref="assetScroller" @scroll="handleAssetScroll">
                    <div
                        class="asset-card"
                        :class="item.cardClass"
                        v-for="(item,index) in assetCards"
                        :key="index"
                    >
                        <div class="asset-preview df-aic">
                            <span>{{ $t('资产预览') }}</span>
                            <!-- <i class="eye-icon" :class="{ closed: item.hidden }"></i> -->
                        </div>

                        <div class="asset-balance df-aic">
                            <img :src="item.icon" alt="" />
                            <strong>{{ item.balance }}</strong>
                        </div>

                        <div class="asset-actions df-aic" v-if="!item.readonly">
                            <button class="withdraw-btn df-aic-jucen" @click.stop="openWithdrawPopup(item)">
                                <img src="@img/assets3.png" alt="" />
                                <span>{{ $t('提现') }}</span>
                            </button>
                            <button class="record-btn df-aic" @click.stop="openAssetsRecord(item)">
                                <span>{{ $t('资产记录') }}</span>
                                <em></em>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="income-section">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('今日收益') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>
                <div class="income-grid">
                    <div
                        class="income-card"
                        v-for="(item, index) in todayIncome"
                        :key="'today-' + index"
                    >
                        <div class="income-label">{{ $t(item.labelKey) }}({{ getTokenLabel(item.token) }})</div>
                        <div class="income-value">
                            <strong>{{ item.valueMain }}</strong><span>{{ item.valueSub }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="income-section cumulative-section">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('累计收益') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>
                <div class="income-grid">
                    <div
                        class="income-card"
                        v-for="(item, index) in totalIncome"
                        :key="'total-' + index"
                    >
                        <div class="income-label">{{ $t(item.labelKey) }}({{ getTokenLabel(item.token) }})</div>
                        <div class="income-value">
                            <strong>{{ item.valueMain }}</strong><span>{{ item.valueSub }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <van-popup
            v-model="withdrawPopupVisible"
            class="withdraw-popup"
            round
            :close-on-click-overlay="!isWithdrawing"
        >
            <div class="withdraw-dialog">
                <div class="withdraw-title df-aic-jusb">
                    <strong>{{ $t('提现') }}</strong>
                    <button type="button" @click="closeWithdrawPopup">×</button>
                </div>

                <div class="withdraw-token df-aic-jusb" v-if="withdrawAsset">
                    <span>{{ $t('提现资产') }}</span>
                    <div class="df-aic">
                        <img :src="withdrawAsset.icon" alt="" />
                        <strong>{{ getTokenLabel(withdrawAsset.symbol) }}</strong>
                    </div>
                </div>

                <div class="withdraw-input-wrap df-aic-jusb">
                    <input
                        v-model="withdrawAmount"
                        type="text"
                        :placeholder="$t('请输入提现金额')"
                        @input="normalizeWithdrawAmount"
                    >
                    <span class="fsz-26 color-main" @click="withdrawAll">{{ $t('全部') }}</span>
                </div>

                <div
                    class="withdraw-submit df-aic-jucen"
                    :class="{ disabled: isWithdrawing }"
                    @click="submitWithdraw"
                >
                    {{ isWithdrawing ? $t('加载中 ...') : $t('确认提现') }}
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Toast } from 'vant'

const incomeFields = [
    {
        labelKey: '节点分红',
        token: 'STAR',
        field: 'node_dividend_star',
    },
    {
        labelKey: '节点分红',
        token: 'SHINE',
        field: 'node_dividend_shine',
    },
    {
        labelKey: '级别加权分红',
        token: 'SHINE',
        field: 'level_dividend',
    },
    {
        labelKey: '推荐奖励',
        token: 'STAR',
        field: 'referral_reward_star',
    },
    {
        labelKey: '团队奖励',
        token: 'STAR',
        field: 'team_reward_star',
    },
    {
        labelKey: '理财释放',
        token: 'STAR',
        field: 'finance_release_star',
    },
    {
        labelKey: '矿机释放',
        token: 'SHINE',
        field: 'miner_release_shine',
    },
]

function splitIncomeValue(value) {
    const raw = value === undefined || value === null || value === '' ? '0' : String(value)
    const [main, sub = ''] = raw.split('.')

    return {
        valueMain: main,
        valueSub: sub ? `.${sub}` : '',
    }
}

function buildIncomeList(report = {}) {
    return incomeFields.map(item => ({
        ...item,
        ...splitIncomeValue(report[item.field]),
    }))
}

export default {
    data() {
        return {
            activeAssetIndex: 0,
            scrollTimer: null,
            withdrawPopupVisible: false,
            withdrawAsset: null,
            withdrawAmount: '',
            isWithdrawing: false,
            withdrawRefreshTimer: null,
            assetCards: [
                {
                    symbol: 'STAR',
                    icon: require('@img/star.png'),
                    balance: '',
                    ccy: 'star_balance',
                    hidden: false,
                    cardClass: 'asset-card-star',
                },
                {
                    symbol: 'SHINE',
                    icon: require('@img/shine.png'),
                    balance: '',
                    ccy: 'shine_balance',
                    hidden: false,
                    cardClass: 'asset-card-shine',
                },
                {
                    symbol: 'STAR',
                    labelKey: '冻结STAR',
                    icon: require('@img/star.png'),
                    balance: '',
                    hidden: false,
                    readonly: true,
                    cardClass: 'asset-card-star',
                },
            ],
            todayIncome: buildIncomeList(),
            totalIncome: buildIncomeList(),
        }
    },
    mounted() {
        this.loadEarnings()
    },
    beforeDestroy() {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        }
        if (this.withdrawRefreshTimer) {
            clearTimeout(this.withdrawRefreshTimer)
        }
    },
    methods: {
        getTokenLabel(symbol) {
            return symbol === 'SHINE' ? 'SHINE SOL' : symbol
        },
        withdrawAll() {
            this.withdrawAmount = this.withdrawAsset.balance
        },
        selectAsset(index) {
            this.activeAssetIndex = index
            this.$nextTick(() => {
                const scroller = this.$refs.assetScroller
                if (!scroller || !scroller.children[index]) return
                const baseLeft = scroller.children[0].offsetLeft
                const targetLeft = scroller.children[index].offsetLeft - baseLeft
                scroller.scrollTo({
                    left: targetLeft,
                    behavior: 'smooth',
                })
            })
        },
        handleAssetScroll() {
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer)
            }
            this.scrollTimer = setTimeout(() => {
                const scroller = this.$refs.assetScroller
                if (!scroller || scroller.children.length < 2) return
                const first = scroller.children[0]
                const second = scroller.children[1]
                const step = second.offsetLeft - first.offsetLeft
                if (!step) return
                const index = Math.round(scroller.scrollLeft / step)
                this.activeAssetIndex = Math.max(0, Math.min(index, this.assetCards.length - 1))
            }, 80)
        },
        showComingSoon() {
            this.$toast(this.$t('暂未开放'))
        },
        openAssetsRecord(item) {
            this.$router.push({
                path: '/assetsRecord',
                query: {
                    ccy: item.ccy || this.getWithdrawCcy(item.symbol),
                },
            })
        },
        openWithdrawPopup(item) {
            this.withdrawAsset = item
            this.withdrawAmount = ''
            this.withdrawPopupVisible = true
        },
        closeWithdrawPopup() {
            if (this.isWithdrawing) return
            this.withdrawPopupVisible = false
            this.withdrawAmount = ''
        },
        normalizeWithdrawAmount(e) {
            let value = (e.target.value || '').replace(/[^\d.]/g, '')
            const parts = value.split('.')
            if (parts.length > 2) {
                value = `${parts[0]}.${parts.slice(1).join('')}`
            }
            if (value.startsWith('.')) {
                value = `0${value}`
            }
            value = value.replace(/^0+(?=\d)/, '')
            const decimalIndex = value.indexOf('.')
            if (decimalIndex !== -1) {
                value = `${value.slice(0, decimalIndex)}.${value.slice(decimalIndex + 1, decimalIndex + 19)}`
            }
            this.withdrawAmount = value
        },
        validateWithdrawAmount() {
            if (!this.withdrawAsset) {
                this.$toast(this.$t('请选择提现资产'))
                return false
            }
            if (!this.withdrawAmount || !/^\d+(\.\d+)?$/.test(this.withdrawAmount) || Number(this.withdrawAmount) <= 0) {
                this.$toast(this.$t('请输入提现金额'))
                return false
            }
            const balance = Number(String(this.withdrawAsset.balance || '0').replace(/,/g, ''))
            if (this.withdrawAsset.balance !== '' && Number.isFinite(balance) && balance < Number(this.withdrawAmount)) {
                this.$toast(this.$t('资产余额不足'))
                return false
            }
            return true
        },
        getWithdrawCcy(symbol) {
            if (symbol === 'STAR') return 'star_balance'
            if (symbol === 'SHINE') return 'shine_balance'
            return ''
        },
        async submitWithdraw() {
            if (this.isWithdrawing || !this.validateWithdrawAmount()) return

            this.isWithdrawing = true
            Toast.loading({
                message: this.$t('加载中 ...'),
                forbidClick: true,
                loadingType: 'spinner',
                duration: 0
            })

            try {
                const ccy = this.getWithdrawCcy(this.withdrawAsset.symbol)
                if (!ccy) {
                    throw new Error('INVALID_WITHDRAW_ASSET')
                }

                const res = await this.$http.post('/api/withdraw', {
                    amount: this.withdrawAmount,
                    ccy,
                })
                if (res.code != 200) {
                    throw new Error('CREATE_WITHDRAW_ORDER_FAILED')
                }

                const info = res.data || {}
                const deadline = info.deadline || info.expired_at
                const signature = info.sign || info.signature
                // /api/withdraw 返回 expired_at，合约参数名为 deadline；金额和 token 都必须使用后端签名原值。
                if (info.id === undefined || info.id === null || !info.token || !info.amount || !deadline || !signature) {
                    throw new Error('INVALID_WITHDRAW_ORDER_PARAMS')
                }

                const project = await this.$dapp.project.init()
                const tx = await project.withdrawToken(
                    info.id,
                    info.token,
                    info.amount,
                    deadline,
                    signature
                )
                await tx.wait()

                Toast.clear()
                this.$messageTip.success(this.$t('提现成功'))
                this.withdrawPopupVisible = false
                this.withdrawAmount = ''

                if (this.withdrawRefreshTimer) {
                    clearTimeout(this.withdrawRefreshTimer)
                }
                this.withdrawRefreshTimer = setTimeout(() => {
                    this.loadEarnings()
                }, 2000)
            } catch (err) {
                console.log('提现失败', err)
                Toast.clear()
                this.$toast(this.getWithdrawErrorText(err), 'fail')
            } finally {
                this.isWithdrawing = false
            }
        },
        getWithdrawErrorText(err) {
            const message = err && err.message
            if (message === 'INVALID_WITHDRAW_ORDER_PARAMS') return this.$t('接口返回参数不完整')
            if (message === 'CREATE_WITHDRAW_ORDER_FAILED') return this.$t('创建订单失败')
            if (message === 'INVALID_WITHDRAW_ASSET') return this.$t('请选择提现资产')
            return this.$t('系统繁忙')
        },
        loadEarnings() {
            this.$http.get('/api/report/earnings').then((res) => {
                if (res.code == 200) {
                    const data = res.data || {}
                    this.todayIncome = buildIncomeList(data.today || {})
                    this.totalIncome = buildIncomeList(data.total || {})
                }
            }).catch((err) => {
                console.log('收益报表获取失败', err)
            })

            this.$http.get('/api/users/my').then((res) => {
                if (res.code == 200) {
                    const data = res.data || {}
                    this.assetCards[0].balance = data.star_balance
                    this.assetCards[1].balance = data.shine_balance
                    this.assetCards[2].balance = data.frozen_star_balance
                }
            }).catch((err) => {
                console.log('资产余额获取失败', err)
            })
        },
    },
}
</script>

<style scoped lang="less">
.assets-page {
    position: relative;
    z-index: 3;
    width: 750px;
    min-height: 100vh;
    color: #FFFFFF;
    background: #030306;

    .assets-scroll {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 750px;
        height: auto;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background:
            radial-gradient(circle at 50% -120px, rgba(105, 25, 132, 0.6) 0, rgba(105, 25, 132, 0.2) 230px, rgba(0, 0, 0, 0) 510px),
            radial-gradient(circle at 88% 320px, rgba(30, 95, 255, 0.2) 0, rgba(30, 95, 255, 0) 280px),
            linear-gradient(180deg, #18071F 0%, #080711 640px, #000000 100%);

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .assets-hero {
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
        }
    }

    .asset-tabs {
        margin-top: 44px;

        button {
            padding: 0;
            margin-right: 38px;
            border: none;
            color: rgba(255, 255, 255, 0.48);
            font-size: 32px;
            font-weight: 700;
            line-height: 1;
            letter-spacing: 0;
            background: transparent;

            &.active {
                color: #FFFFFF;
            }
        }
    }

    .asset-carousel-wrap {
        margin-top: 40px;
    }

    .asset-carousel {
        display: flex;
        gap: 20px;
        width: 750px;
        padding: 0 30px;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-padding-left: 30px;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .asset-card {
        width: 690px;
        height: 308px;
        flex: 0 0 690px;
        padding: 34px 30px 30px;
        scroll-snap-align: start;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
    }

    .asset-card-star {
        background-image: url('~@img/assets1.png');
    }

    .asset-card-shine {
        background-image: url('~@img/assets2.png');
    }

    .asset-preview {
        color: rgba(255, 255, 255, 0.5);
        font-size: 26px;
        line-height: 1;
        padding-top: 20px;
    }

    .eye-icon {
        position: relative;
        display: inline-block;
        width: 30px;
        height: 20px;
        margin-left: 12px;
        border: 3px solid rgba(255, 255, 255, 0.28);
        border-radius: 50%;

        &::after {
            content: '';
            position: absolute;
            left: 8px;
            top: 5px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.28);
        }

        &.closed {
            height: 16px;
            border-top: none;
            border-left: none;
            border-right: none;
            border-radius: 0 0 50% 50%;

            &::after {
                display: none;
            }
        }
    }

    .asset-balance {
        margin-top: 34px;

        img {
            width: 44px;
            height: 44px;
            margin-right: 14px;
            flex: 0 0 44px;
        }

        strong {
            min-width: 0;
            color: #FFFFFF;
            font-size: 40px;
            font-weight: 700;
            line-height: 1;
            word-break: break-word;
        }
    }

    .asset-actions {
        margin-top: 58px;

        button {
            height: 60px;
            padding: 0;
            border: none;
            color: #FFD99F;
            font-size: 26px;
            line-height: 1;
            background: transparent;
        }
    }

    .withdraw-btn {
        width: 150px;
        margin-right: 20px;
        border-radius: 30px !important;
        background: rgba(255, 255, 255, 0.1) !important;

        img {
            width: 28px;
            height: 28px;
            margin-right: 10px;
        }
    }

    .record-btn {
        color: rgba(255, 255, 255, 0.48) !important;

        em {
            display: block;
            width: 12px;
            height: 12px;
            margin-left: 8px;
            border-top: 2px solid rgba(255, 255, 255, 0.48);
            border-right: 2px solid rgba(255, 255, 255, 0.48);
            transform: rotate(45deg);
        }
    }

    .income-section {
        padding: 44px 30px 0;
    }

    .cumulative-section {
        padding-bottom: 70px;
    }

    .section-title {
        position: relative;
        width: 690px;
        height: 80px;
        margin: 0 auto 34px;
        text-align: center;

        .title-side {
            width: 170px;
            height: 40px;
            flex: 0 0 170px;
        }

        .title-side-left {
            left: 0;
        }

        .title-side-right {
            right: 0;
        }

        .title-base {
            position: absolute;
            left: 75px;
            bottom: 0;
            width: 540px;
            height: 44px;
        }

        h2 {
            position: relative;
            z-index: 1;
            min-width: 0;
            max-width: 330px;
            margin: 0 20px;
            color: #ffdeb3;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.15;
            white-space: normal;
            overflow-wrap: break-word;
        }
    }

    .income-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 22px 20px;
    }

    .income-card {
        height: 142px;
        padding: 28px 24px 20px;
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 166, 0, 0.2) 0%, rgba(255, 166, 0, 0) 100%),
            linear-gradient(180deg, rgba(26, 22, 22, 0.96) 0%, rgba(7, 7, 12, 0.98) 100%);
        box-shadow: inset 0 0 30px rgba(255, 210, 120, 0.03);
    }

    .income-label {
        color: #D9C8B7;
        font-size: 26px;
        line-height: 1.3;
        word-break: break-word;
    }

    .income-value {
        margin-top: 30px;
        color: #FFFFFF;
        line-height: 1;
        word-break: break-word;

        strong {
            font-size: 38px;
            font-weight: 700;
        }

        span {
            color: rgba(255, 255, 255, 0.46);
            font-size: 25px;
            font-weight: 700;
        }
    }

    .withdraw-popup {
        width: 630px;
        border-radius: 18px;
        overflow: hidden;
        background: rgba(5, 5, 8, 0.94);
        border: 1px solid rgba(255, 217, 159, 0.45);
        box-shadow: 0 0 46px rgba(255, 174, 56, 0.16);
    }

    .withdraw-dialog {
        padding: 34px 30px 36px;
        color: #FFFFFF;
        background:
            linear-gradient(180deg, rgba(255, 166, 0, 0.16) 0%, rgba(255, 166, 0, 0) 52%),
            rgba(0, 0, 0, 0.72);
    }

    .withdraw-title {
        strong {
            color: #FFD99F;
            font-size: 34px;
            line-height: 1.2;
        }

        button {
            width: 48px;
            height: 48px;
            padding: 0;
            border: none;
            color: rgba(255, 255, 255, 0.86);
            font-size: 44px;
            line-height: 42px;
            text-align: center;
            background: transparent;
        }
    }

    .withdraw-token {
        min-height: 76px;
        margin-top: 28px;
        padding: 0 22px;
        border-radius: 12px;
        color: rgba(255, 255, 255, 0.58);
        font-size: 26px;
        background: rgba(255, 255, 255, 0.08);

        img {
            width: 42px;
            height: 42px;
            margin-right: 12px;
            flex: 0 0 42px;
        }

        strong {
            color: #FFFFFF;
            font-size: 28px;
        }
    }

    .withdraw-input-wrap {
        height: 94px;
        margin-top: 24px;
        padding: 0 22px;
        border: 1px solid rgba(255, 166, 0, 0.72);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.04);

        input {
            width: 100%;
            height: 100%;
            padding: 0;
            border: none;
            outline: none;
            color: #FFFFFF;
            font-size: 32px;
            background: transparent;

            &::placeholder {
                color: rgba(255, 255, 255, 0.42);
            }
        }
    }

    .withdraw-submit {
        height: 84px;
        margin-top: 30px;
        border-radius: 42px;
        color: #000000;
        font-size: 30px;
        font-weight: 700;
        background: linear-gradient(90deg, #F4AF45 0%, #FFD88A 100%);

        &.disabled {
            opacity: 0.58;
            pointer-events: none;
        }
    }
}
</style>
