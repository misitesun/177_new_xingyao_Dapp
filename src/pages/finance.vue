<template>
    <div class="finance-page">
        <navBar :url="'finance'" />

        <mescroll-vue class="finance-scroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <section class="finance-hero">
                <div class="finance-title-row df-aic-jucen">
                    <img src="@img/finance1.png" alt="" class="img-58">
                    <h1 class="color-main-transparent">{{ $t('星耀 SOL 理财') }}</h1>
                    <img src="@img/finance2.png" alt="" class="img-58">
                </div>
                <p>{{ $t('以链上透明机制驱动资产增值，开启智能理财新体验') }}</p>
            </section>

            <section class="finance-package-section" v-if="packages.length">
                <div class="package-panel">
                    <div class="package-head df-aic-jusb">
                        <span>{{ $t('入金区间') }}</span>
                        <span>{{ $t('释放倍数') }}</span>
                    </div>
                    <div class="package-list">
                        <div class="package-row df-aic-jusb" v-for="(item, index) in packages" :key="item.id || index">
                            <div class="package-range">{{ item.min_amount }}-{{ item.max_amount }} <em>SOL</em></div>
                            <strong>{{ item.multiplier }}</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section class="finance-form">
                <div class="amount-input df-aic-jusb">
                    <input v-model="amount" type="text" :placeholder="$t('请输入理财金额')" @input="normalizeAmount" />
                    <img src="@img/sol.png" alt="" />
                </div>
                <div class="confirm-btn df-aic-jucen" :class="{ disabled: isSubmitting }" @click="submitFinance">
                    {{ isSubmitting ? $t('加载中 ...') : $t('确认') }}
                </div>
            </section>

            <section class="orders-section">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('理财订单') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="order-list">
                    <div class="order-card" v-for="(item, index) in list" :key="index">
                        <div class="order-head df-aic-jusb">
                            <div>
                                <strong>{{ item.totalAmount }} SOL</strong>
                                <span>{{ $t('总释放') }}</span>
                            </div>
                            <div class="progress-box">
                                <div class="progress-track">
                                    <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
                                </div>
                                <span>{{ item.statusKey ? $t(item.statusKey) : item.progressText }}</span>
                            </div>
                        </div>

                        <div class="order-row df-aic-jusb">
                            <span>{{ $t('购买金额') }}</span>
                            <div class="gold">{{ item.buyAmount }} SOL</div>
                        </div>
                        <div class="order-row df-aic-jusb">
                            <span>{{ $t('已释放') }}</span>
                            <div>{{ item.releasedSol }} SOL</div>
                        </div>
                        <div class="order-row df-aic-jusb">
                            <span>{{ $t('已释放') }}</span>
                            <div>{{ item.releasedStar }} STAR</div>
                        </div>
                        <div class="order-row df-aic-jusb">
                            <span>{{ $t('时间') }}</span>
                            <div class="muted">{{ item.time }}</div>
                        </div>
                    </div>
                </div>

                <noData v-if="list.length == 0"></noData>
            </section>
        </mescroll-vue>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { ethers } from 'ethers'

const PROJECT_ADDRESS = process.env.VUE_APP_PROJECT_ADDRESS

export default {
    data() {
        return {
            amount: '',
            isSubmitting: false,
            mescroll: null,
            mescrollUp: {
                callback: this.upCallback,
                page: {
                    size: 10,
                },
            },
            list: [],
            packages: []
        }
    },
    mounted() {
        console.log('SOL address:', process.env.VUE_APP_SOL_ADDRESS)
        console.log('isAddress:', ethers.utils.isAddress(process.env.VUE_APP_SOL_ADDRESS))
        this.loadFinancePackages()
    },
    methods: {
        loadFinancePackages() {
            this.$http.get('/api/finance').then((res) => {
                if (res.code == 200) {
                    this.packages = (res.data && res.data.packages) || []
                }
            }).catch((err) => {
                console.log('理财规则获取失败', err)
            })
        },
        normalizeAmount(e) {
            this.amount = (e.target.value || '').replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '')
        },
        mescrollInit(mescroll) {
            this.mescroll = mescroll
        },
        setMescrollText() {
            if (this.mescroll) {
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
            this.$http.get('/api/finance/list', {
                page_no: page.num,
                page_size: page.size || 10
            }).then((res) => {
                if (res.code == 200) {
                    const arr = ((res.data && res.data.finance_orders) || []).map(item => this.normalizeFinanceOrder(item))
                    if (page.num === 1) this.list = []
                    this.list = this.list.concat(arr)
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length)
                    })
                } else {
                    mescroll.endErr()
                }
            }).catch((err) => {
                console.log('理财订单列表获取失败', err)
                mescroll.endErr()
            })
        },
        normalizeFinanceOrder(item) {
            const totalAmount = this.formatAmount(item.out_amount)
            const releasedSol = this.formatAmount(item.release_amount)
            const isCompleted = Number(item.status) === 3

            return {
                totalAmount,
                buyAmount: this.formatAmount(item.amount),
                releasedSol,
                releasedStar: this.formatAmount(item.release_token_amount),
                time: item.created_at || '',
                progress: this.getProgress(item.out_amount, item.release_amount, isCompleted),
                progressText: isCompleted ? '' : `${releasedSol}/${totalAmount} SOL`,
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
        toTokenWei(value) {
            return ethers.utils.parseUnits(String(value || '0').replace(/,/g, ''), 18)
        },
        async getSolContract() {
            if (!process.env.VUE_APP_SOL_ADDRESS) {
                throw new Error('SOL_TOKEN_ADDRESS_MISSING')
            }
            return this.$dapp.erc20.init('SOL')
        },
        validateSubmitAmount() {
            if (!this.amount) {
                this.$toast(this.$t('请输入理财金额'))
                return false
            }
            if (!/^[1-9]\d*$/.test(this.amount)) {
                this.$toast(this.$t('请输入整数金额'))
                return false
            }
            return true
        },
        async submitFinance() {
            if (this.isSubmitting || !this.validateSubmitAmount()) return

            this.isSubmitting = true
            Toast.loading({
                message: this.$t('加载中 ...'),
                forbidClick: true,
                loadingType: 'spinner',
                duration: 0
            })

            try {
                const sol = await this.getSolContract()
                console.log('sol', sol)
                const balance = await sol.balanceOf()
                console.log('SOL余额：', balance)
                const allowance = await sol.allowance(PROJECT_ADDRESS)
                console.log('SOL授权额度：', allowance)

                if (this.toTokenWei(balance).lt(this.toTokenWei(this.amount))) {
                    throw new Error('INSUFFICIENT_SOL_BALANCE')
                }

                if (this.toTokenWei(allowance).lt(this.toTokenWei(this.amount))) {
                    const approveTx = await sol.approve(PROJECT_ADDRESS, '21000000000000000000000000')
                    await approveTx.wait()
                }

                const res = await this.$http.post('/api/finance', {
                    amount: this.amount
                })
                if (res.code != 200) {
                    throw new Error('CREATE_FINANCE_ORDER_FAILED')
                }

                const info = res.data || {}
                const signature = info.sign || info.signature
                // buyMiner 的签名参数来自后端，amount 是 Wei，不能在前端二次换算。
                if (info.id === undefined || info.id === null || !info.amount || !info.deadline || !signature) {
                    throw new Error('INVALID_FINANCE_ORDER_PARAMS')
                }

                const project = await this.$dapp.project.init()
                const tx = await project.buyMiner(info.id, info.amount, info.deadline, signature)
                await tx.wait()

                Toast.clear()
                this.$messageTip.success(this.$t('理财成功'))
                this.amount = ''
                setTimeout(() => {
                    this.mescroll.resetUpScroll()
                }, 2000)
            } catch (err) {
                console.log('理财下单失败', err)
                Toast.clear()
                this.$toast(this.getSubmitErrorText(err), 'fail')
            } finally {
                this.isSubmitting = false
            }
        },
        getSubmitErrorText(err) {
            const message = err && err.message
            if (message === 'SOL_TOKEN_ADDRESS_MISSING') return this.$t('SOL合约地址未配置')
            if (message === 'INSUFFICIENT_SOL_BALANCE') return this.$t('SOL余额不足')
            if (message === 'INVALID_FINANCE_ORDER_PARAMS') return this.$t('接口返回参数不完整')
            if (message === 'CREATE_FINANCE_ORDER_FAILED') return this.$t('创建订单失败')
            return this.$t('系统繁忙')
        },
    },
}
</script>

<style scoped lang="less">
.finance-page {
    position: relative;
    z-index: 3;
    width: 750px;
    min-height: 100vh;
    color: #FFFFFF;
    background: #030306;

    .finance-scroll {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 750px;
        height: auto;
        background:
            radial-gradient(circle at 50% -120px, rgba(103, 27, 133, 0.58) 0, rgba(103, 27, 133, 0.18) 240px, rgba(0, 0, 0, 0) 520px),
            radial-gradient(circle at 92% 250px, rgba(35, 117, 255, 0.22) 0, rgba(35, 117, 255, 0) 260px),
            linear-gradient(180deg, #180720 0%, #08070E 650px, #000 100%);
    }

    .finance-hero {
        padding: 72px 30px 0;
        text-align: center;

        p {
            margin: 34px 0 0;
            color: #FFFFFF;
            font-size: 28px;
            line-height: 1.35;
        }
    }

    .finance-title-row {
        h1 {
            margin: 0 24px;
            color: #FFD99F;
            font-size: 46px;
            font-weight: 700;
            line-height: 1.2;
        }
    }

    .title-leaf {
        display: inline-block;
        color: #FFD99F;
        font-size: 48px;
        line-height: 1;
    }

    .title-leaf-left {
        transform: rotate(-28deg);
    }

    .title-leaf-right {
        transform: scaleX(-1) rotate(-28deg);
    }

    .finance-package-section {
        margin-top: 30px;
        padding: 0 30px;
    }

    .package-panel {
        width: 690px;
        padding: 24px 30px 22px;
        border: 1px solid rgba(248, 188, 92, 0.42);
        border-radius: 18px;
        background:
            radial-gradient(circle at 90% 0, rgba(255, 216, 153, 0.18) 0, rgba(255, 216, 153, 0) 150px),
            linear-gradient(145deg, rgba(82, 51, 10, 0.44) 0%, rgba(16, 14, 22, 0.78) 100%);
        box-shadow: inset 0 0 24px rgba(255, 185, 74, 0.08);
    }

    .package-head {
        color: rgba(255, 255, 255, 0.58);
        font-size: 22px;
        line-height: 1.2;
    }

    .package-list {
        margin-top: 16px;
    }

    .package-row {
        min-height: 52px;
        padding: 12px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        line-height: 1.2;

        strong {
            color: #F9C66D;
            font-size: 24px;
            font-weight: 400;
        }
    }

    .package-range {
        min-width: 0;
        color: #FFFFFF;
        font-size: 24px;
        font-weight: 400;
        line-height: 1.2;
        word-break: break-word;

        em {
            margin-left: 4px;
            color: #FFD99F;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
        }
    }

    .finance-form {
        padding: 38px 30px 0;
    }

    .amount-input {
        width: 690px;
        height: 108px;
        padding: 0 30px;
        border: 2px solid rgba(205, 137, 27, 0.9);
        border-radius: 30px;
        background: rgba(13, 11, 18, 0.62);

        input {
            min-width: 0;
            flex: 1;
            border: none;
            outline: none;
            color: #FFFFFF;
            font-size: 32px;
            background: transparent;

            &::placeholder {
                color: rgba(255, 255, 255, 0.42);
            }
        }

        img {
            width: 60px;
            height: 60px;
            margin-left: 20px;
            flex: 0 0 60px;
        }
    }

    .confirm-btn {
        width: 690px;
        height: 88px;
        margin-top: 40px;
        color: #000000;
        font-size: 32px;
        font-weight: 700;
        border-radius: 44px;
        background: linear-gradient(90deg, #F6B64D 0%, #FFE0A6 50%, #F6B64D 100%);

        &.disabled {
            opacity: 0.65;
            pointer-events: none;
        }
    }

    .orders-section {
        padding: 44px 30px 70px;
    }

    .section-title {
        position: relative;
        width: 690px;
        height: 80px;
        margin: 0 auto 34px;
        text-align: center;

        h2 {
            position: relative;
            z-index: 2;
            margin: 0 20px;
            color: #FFDEB3;
            font-size: 32px;
            font-weight: 700;
            line-height: 62px;
        }
    }

    .title-side {
        width: 170px;
        height: 40px;
        object-fit: contain;
    }

    .title-base {
        position: absolute;
        left: 75px;
        bottom: 0;
        width: 540px;
        height: 44px;
        z-index: 1;
    }

    .order-card {
        width: 690px;
        margin: 0 auto 22px;
        padding: 34px 30px 32px;
        border-radius: 20px;
        background:
            radial-gradient(circle at 80% 10%, rgba(42, 48, 68, 0.72) 0, rgba(42, 48, 68, 0) 240px),
            linear-gradient(135deg, rgba(35, 36, 47, 0.96) 0%, rgba(27, 25, 34, 0.96) 100%);
        box-shadow: inset 0 0 36px rgba(255, 255, 255, 0.02);
    }

    .order-head {
        align-items: flex-start;

        strong {
            display: block;
            color: #FFFFFF;
            font-size: 34px;
            font-weight: 700;
            line-height: 1;
        }

        span {
            display: block;
            margin-top: 22px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 26px;
        }
    }

    .progress-box {
        width: 240px;
        padding-top: 6px;
        text-align: right;

        span {
            margin-top: 18px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 26px;
            line-height: 1.2;
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

    .order-row {
        margin-top: 26px;
        color: rgba(255, 255, 255, 0.42);
        font-size: 26px;

        &:first-of-type {
            margin-top: 44px;
        }

        div {
            color: #FFFFFF;
            font-size: 26px;
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
