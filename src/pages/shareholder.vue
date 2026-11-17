<template>
    <div class="shareholder-page">
        <navBar :url="'shareholder'" />

        <main class="shareholder-content">
            <div class="page-background" aria-hidden="true">
                <img src="@img/figma-background.png" alt="" class="background-image">
                <div class="background-overlay"></div>
            </div>

            <div class="shareholder-tabs" role="tablist">
                <button
                    type="button"
                    class="shareholder-tab"
                    :class="{ active: currentShareholder.nodeId == 2 }"
                    @click="selectShareholder(2)"
                >
                    {{ $t('社区股东') }}
                </button>
                <button
                    type="button"
                    class="shareholder-tab"
                    :class="{ active: currentShareholder.nodeId == 1 }"
                    @click="selectShareholder(1)"
                >
                    {{ $t('战略股东') }}
                </button>
            </div>

            <section class="purchase-card" :class="{ 'purchase-card-big': currentShareholder.nodeId == 1 }">
                <img src="@img/shareholder-card.svg" alt="" class="purchase-card-frame" aria-hidden="true">
                <div class="purchase-card-label">{{ $t('分红金额') }}</div>
                <div class="dividend-amount">${{ currentShareholder.dividendAmount }}</div>

                <div class="crystal-frame" aria-hidden="true">
                    <img src="@img/figma-crystal.png" alt="" class="crystal-image">
                </div>

                <button
                    type="button"
                    class="purchase-button"
                    :class="{ disabled: isSubmitting }"
                    :disabled="isSubmitting"
                >
                    ${{ currentShareholder.purchasePrice }}/{{ $t('已售罄') }}
                    <!-- {{ $t('购买') }} -->
                </button>
            </section>

            <!-- 隐藏股东权益标题及说明卡片 -->
            <section v-if="false" class="rights-heading section-title df-aic-jucen">
                <img src="@img/index7.png" alt="" class="title-base" aria-hidden="true">
                <img src="@img/index5.png" alt="" class="title-side title-side-left">
                <h2>{{ $t('股东权益') }}</h2>
                <img src="@img/index6.png" alt="" class="title-side title-side-right">
            </section>

            <section v-if="false" class="rights-panel">
                <div class="rights-content">
                    <div class="rights-title">
                        <span class="rights-fire">🔥</span>
                        <span>{{ $t('股东限量开放席位', { name: $t(currentShareholder.nameKey), seats: currentShareholder.seats }) }}</span>
                    </div>

                    <div class="rights-break rights-break-double"></div>

                    <div class="participation-line">
                        <span class="rights-diamond">💎</span>
                        <span>{{ $t('每席参与金额：') }}</span>
                        <span>{{ currentShareholder.purchasePrice }} USDT</span>
                    </div>

                    <p class="rights-desc">
                        {{ $t('成为星耀SOL生态股东描述', { name: $t(currentShareholder.nameKey) }) }}
                    </p>
                    <p class="rights-desc">
                        {{ $t('共同推动星耀生态发展描述') }}
                    </p>

                    <div class="rights-break"></div>

                    <div class="rights-list">
                        <div v-for="(item, index) in currentShareholder.items" :key="index" class="rights-item">
                            {{ index + 1 }}.{{ $t(item.key, item.params) }}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import { Toast } from 'vant'

const PROJECT_ADDRESS = process.env.VUE_APP_PROJECT_ADDRESS

export default {
    name: 'shareholder',
    data() {
        return {
            big_price: 0,
            small_price: 0,
            shareholderNodeId: 2,
            isSubmitting: false,
        }
    },
    computed: {
        currentShareholder() {
            const isSmall = this.shareholderNodeId == 2

            return {
                nodeId: this.shareholderNodeId,
                nameKey: isSmall ? '社区股东' : '战略股东',
                seats: isSmall ? 1000 : 500,
                dividendAmount: isSmall ? '10,000' : '20,000',
                purchasePrice: isSmall
                    ? (this.small_price || '1000')
                    : (this.big_price || '2000'),
                items: [
                    {
                        key: '权益提现手续费分红',
                        params: { rate: isSmall ? '3%' : '2%' },
                    },
                    {
                        key: '权益卖出币分红',
                        params: { rate: isSmall ? '4%' : '6%' },
                    },
                    {
                        key: '权益上线入金分红',
                        params: {
                            rate: '5%',
                            amount: isSmall ? 10000 : 20000,
                        },
                    },
                    {
                        key: '权益推荐奖励',
                        params: { rate: '30%' },
                    },
                    { key: '权益运营中心优先申请' },
                    { key: '权益社区讲师优先申请' },
                    { key: '权益餐费补贴申请' },
                    { key: '权益沙龙会优先申请' },
                ],
            }
        },
    },
    mounted() {
        this.loadNodePrice()
    },
    methods: {
        loadNodePrice() {
            this.$http.get('/api/node').then((res) => {
                if (res.code == 200) {
                    this.big_price = res.data.big_price
                    this.small_price = res.data.small_price
                }
            }).catch((err) => {
                console.log('股东价格获取失败', err)
            })
        },
        selectShareholder(nodeId) {
            this.shareholderNodeId = nodeId
        },
        normalizeAmount(amount) {
            if (amount === undefined || amount === null) {
                return ''
            }
            return String(amount).replace(/,/g, '').trim()
        },
        getNodePrice(nodeId) {
            return this.normalizeAmount(nodeId == 1 ? this.big_price : this.small_price)
        },
        normalizeDonateInfo(data) {
            const info = data || {}
            const donateInfo = {
                id: info.id,
                amount: info.amount,
                referrer: info.referrer,
                deadline: info.deadline,
                signature: info.sign,
            }
            const missing = Object.keys(donateInfo).filter((key) => {
                return donateInfo[key] === undefined || donateInfo[key] === null || donateInfo[key] === ''
            })
            if (missing.length > 0) {
                console.log('api/node 返回参数不完整：', info, missing)
                throw new Error(this.$t('接口返回参数不完整'))
            }
            return donateInfo
        },
        async initUsdtContract() {
            if (typeof window.ethereum === 'undefined') {
                throw new Error(this.$t('请先安装钱包'))
            }
            const usdtInit = await this.$dapp.erc20.init('USDT')
            this.$store.commit('setAddress', usdtInit.account)
            localStorage.setItem('address', usdtInit.account)
            return usdtInit
        },
        async ensureUsdtReady(usdtInit, needAmount) {
            const usdtBalance = await usdtInit.balanceOf()
            console.log('USDT余额：', usdtBalance)
            if (Number(usdtBalance) < Number(needAmount)) {
                throw new Error(this.$t('USDT余额不足'))
            }

            const allowance = await usdtInit.allowance(PROJECT_ADDRESS)
            console.log('USDT授权额度：', allowance)
            if (Number(allowance) < Number(needAmount)) {
                const approveTx = await usdtInit.approve(PROJECT_ADDRESS, '21000000000000000000000000')
                console.log('USDT授权交易已发出：', approveTx)
                await approveTx.wait()
                console.log('USDT授权交易已确认')
            }
        },
        async toBuy(nodeId) {
            if (this.isSubmitting) {
                return
            }

            const needAmount = this.getNodePrice(nodeId)
            if (!needAmount || Number(needAmount) <= 0) {
                this.$toast(this.$t('节点价格获取失败'), 'fail')
                return
            }

            this.isSubmitting = true
            try {
                Toast.loading({
                    message: 'Loading...',
                    forbidClick: true,
                    loadingType: 'spinner',
                    duration: 0,
                })

                const usdtInit = await this.initUsdtContract()
                await this.ensureUsdtReady(usdtInit, needAmount)

                const res = await this.$http.post('/api/node', {
                    node_id: nodeId,
                })
                if (res.code != 200) {
                    throw new Error(this.$t('创建订单失败'))
                }

                const info = this.normalizeDonateInfo(res.data)
                const projectInit = await this.$dapp.project.init()
                const tx = await projectInit.donate(
                    info.id,
                    info.amount,
                    info.referrer,
                    info.deadline,
                    info.signature
                )
                console.log('donate交易已发出：', tx)
                await tx.wait()
                console.log('donate交易已确认')
                Toast.clear()
                this.$messageTip.success(this.$t('购买成功'))
            } catch (error) {
                console.log('购买股东失败：', error)
                const message = error && error.message ? error.message : this.$t('系统繁忙')
                this.$toast(message, 'fail')
            } finally {
                this.isSubmitting = false
                setTimeout(() => {
                    Toast.clear()
                }, 1000)
            }
        },
    },
}
</script>

<style lang="less" scoped>
.shareholder-page {
    min-height: 100vh;
    overflow-x: hidden;
    background: #000;
}

.shareholder-content {
    position: relative;
    isolation: isolate;
    display: flex;
    width: 750px;
    min-height: calc(100vh - 90px);
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 78px 30px 140px;
    overflow: hidden;
    background: #000;
}

.page-background {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    .background-image,
    .background-overlay {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    .background-image {
        max-width: none;
        object-fit: cover;
        object-position: top center;
    }

    .background-overlay {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, #000 100%);
    }
}

.shareholder-tabs {
    display: flex;
    min-height: 56px;
    align-items: center;
    gap: 30px;

    .shareholder-tab {
        margin: 0;
        padding: 0;
        color: #fff;
        border: 0;
        outline: 0;
        background: transparent;
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        font-size: 28px;
        font-weight: 500;
        line-height: normal;
        white-space: nowrap;
        cursor: pointer;

        &.active {
            background: linear-gradient(90deg, #efb152 0%, #efcd80 49.397%, #efb152 100%);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            font-size: 32px!important;
        }
    }
}

.purchase-card {
    position: relative;
    isolation: isolate;
    display: flex;
    width: 690px;
    height: 278px;
    flex: 0 0 278px;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    margin-top: 30px;
    padding: 28px 30px 35px;

    .purchase-card-frame {
        position: absolute;
        inset: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        max-width: none;
        pointer-events: none;
    }

    &.purchase-card-big {
        .purchase-card-frame {
            filter: hue-rotate(74deg) saturate(1.05);
        }

        .crystal-image {
            left: -163.89%;
        }
    }
}

.purchase-card-label {
    color: #fff;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 28px;
    font-weight: 400;
    line-height: 40px;
    white-space: nowrap;
}

.dividend-amount {
    margin-top: 10px;
    color: transparent;
    background: linear-gradient(90deg, #fff 0%, #a8c8fe 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Poppins, "Microsoft YaHei", sans-serif;
    font-size: 56px;
    font-weight: 600;
    line-height: 68px;
    white-space: nowrap;
}

.crystal-frame {
    position: absolute;
    top: 0;
    left: 440px;
    width: 250px;
    height: 250px;
    overflow: hidden;
    pointer-events: none;

    .crystal-image {
        position: absolute;
        top: -27.15%;
        left: -36.11%;
        width: 300%;
        height: 200%;
        max-width: none;
    }
}

.purchase-button {
    display: flex;
    width: auto;
    min-width: 229px;
    height: 58px;
    align-items: center;
    justify-content: center;
    margin: auto 0 0;
    padding: 12px 40px;
    color: #000;
    border: 0;
    border-radius: 999px;
    outline: 0;
    background: linear-gradient(90deg, #efb152 0%, #efcd80 49.397%, #efb152 100%);
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 28px;
    font-weight: 600;
    line-height: normal;
    white-space: nowrap;
    cursor: pointer;

    &.disabled,
    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
}

.rights-heading {
    margin-top: 39px;
}

.section-title {
    position: relative;
    isolation: isolate;
    width: 690px;
    height: 80px;
    flex: 0 0 80px;
    text-align: center;

    .title-side {
        width: 170px;
        height: 40px;
        flex: 0 0 170px;
    }

    .title-base {
        position: absolute;
        left: 75px;
        bottom: 0;
        z-index: -1;
        width: 540px;
        height: 44px;
        pointer-events: none;
    }

    h2 {
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

.rights-panel {
    width: 690px;
    box-sizing: border-box;
    margin-top: 26px;
    overflow: hidden;
    border: 1px solid #7d4c10;
    border-radius: 20px;
    background: #000;
    box-shadow: inset 0 4px 20px rgba(222, 135, 43, 0.25);
}

.rights-content {
    width: 100%;
    box-sizing: border-box;
    padding: 22px 30px 28px;
    color: #fff;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 24px;
    line-height: 48px;
    white-space: normal;
    overflow-wrap: break-word;
}

.rights-title {
    display: flex;
    min-height: 48px;
    align-items: center;
    font-size: 32px;
    font-weight: 600;
    line-height: 48px;
}

.rights-fire {
    flex: 0 0 auto;
    margin-right: 8px;
    font-size: 32px;
    line-height: 48px;
}

.rights-break {
    height: 48px;
}

.rights-break-double {
    height: 48px;
}

.participation-line {
    display: flex;
    min-height: 48px;
    align-items: center;
    color: #d2b181;
    font-size: 26px;
    line-height: 48px;
    white-space: nowrap;
}

.rights-diamond {
    margin-right: 8px;
    font-size: 24px;
    line-height: 48px;
}

.rights-desc {
    margin: 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24px;
    line-height: 48px;
}

.rights-list {
    font-size: 24px;
    line-height: 48px;
}

.rights-item {
    min-height: 48px;
}
</style>
