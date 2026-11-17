<template>
    <div class="swap-page">
        <navBar :url="'swap'" />

        <mescroll-vue class="swap-scroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <section class="swap-hero">
                <div class="hero-copy">
                    <div class="hero-title df-aic">
                        <img src="@img/swap1.png" alt="" />
                        <span>{{ $t('即时闪兑') }}</span>
                    </div>
                    <p>{{ $t('一键闪兑，多资产即时流通') }}</p>
                </div>
                <img src="@img/swap2.png" alt="" class="hero-coins" />
            </section>

            <section class="swap-panel">
                <div class="swap-card swap-card-from">
                    <div class="card-label-row df-aic-jusb">
                        <span>{{ $t('转出金额') }}</span>
                        <div class="balance df-aic">
                            <img src="@img/swap3.png" alt="" />
                            <span>{{ formatAmount(currentBalance, 6) }} {{ currentSymbol }}</span>
                            <b @click.stop="setMaxAmount">{{ $t('全部') }}</b>
                        </div>
                    </div>

                    <div class="coin-row df-aic-jusb">
                        <div class="coin-select df-aic" @click="show = true">
                            <img src="@img/star.png" alt="" class="coin-icon" v-if="selectCoin === 'star'"/>
                            <img src="@img/shine.png" alt="" class="coin-icon" v-if="selectCoin === 'shine'"/>
                            <img src="@img/sol.png" alt="" class="coin-icon" v-if="selectCoin === 'sol'"/>
                            <span v-if="selectCoin === 'star'">STAR</span>
                            <span v-if="selectCoin === 'shine'">SHINE</span>
                            <span v-if="selectCoin === 'sol'">SOL</span>
                            <i></i>
                        </div>
                        <div class="amount-box">
                            <input
                                v-model="amount"
                                type="text"
                                class="amount-input text-right"
                                placeholder="0.00"
                                @input="normalizeAmount"
                            >
                            <span>≈ {{ sourceUsdText }} USD</span>
                        </div>
                    </div>
                </div>

                <div class="swap-arrow df-aic-jucen">
                    <img src="@img/swap4.png" alt="" />
                </div>

                <div class="swap-card swap-card-to">
                    <div class="card-label-row df-aic-jusb">
                        <span>{{ $t('转入金额') }}</span>
                        <div class="balance df-aic">
                            <img src="@img/swap3.png" alt="" />
                            <span>{{ formatAmount(targetBalance, 6) }} {{ targetSymbol }}</span>
                        </div>
                    </div>

                    <div class="coin-row df-aic-jusb">
                        <div class="coin-select coin-fixed df-aic">
                            <img :src="targetCoinIcon" alt="" class="coin-icon" />
                            <span>{{ targetSymbol }}</span>
                        </div>
                        <div class="amount-box">
                            <strong>{{ estimatedSolAmount }}</strong>
                            <span>≈ {{ targetUsdText }} USD</span>
                        </div>
                    </div>

                    <!-- <div class="order-tip df-aic" v-if="isStarToSol && minerOrderAmount !== '0'">
                        <img src="@img/swap5.png" alt="" />
                        <span>转入矿机订单：{{ minerOrderAmount }} SOL</span>
                    </div> -->
                </div>

                <div class="confirm-btn df-aic-jucen" :class="{ disabled: isSubmitting || !isCurrentSwapEnabled }" @click="submitSwap">
                    {{ isSubmitting ? $t('加载中 ...') : (!isCurrentSwapEnabled ? $t('暂未开放') : $t('确认闪兑')) }}
                </div>
            </section>

            <section class="records-section">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('闪兑记录') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="record-list">
                    <div class="record-card" v-for="(item, index) in list" :key="index">
                        <div class="record-head df-aic-jusb">
                            <div class="record-pair df-aic">
                                <div class="pair-icons">
                                    <img :src="item.fromIcon" alt="" class="pair-icon pair-icon-front" />
                                    <img src="@img/sol.png" alt="" class="pair-icon pair-icon-back" />
                                </div>
                                <span>{{ item.from }} <em>→</em> SOL</span>
                            </div>
                            <div class="record-mining" v-if="item.order">
                                <strong>{{ item.order }}</strong>
                                <span>{{ $t('矿机') }}</span>
                            </div>
                        </div>

                        <div class="record-time">{{ item.time }}</div>

                        <div class="record-row df-aic-jusb">
                            <span>{{ $t('转出金额') }}</span>
                            <strong>{{ item.outAmount }} {{ item.from }}</strong>
                        </div>
                        <div class="record-row df-aic-jusb">
                            <span>{{ $t('转入金额') }}</span>
                            <strong class="gold">{{ item.inAmount }} SOL</strong>
                        </div>
                    </div>
                </div>
                <noData v-if="list.length == 0"></noData>
            </section>
        </mescroll-vue>

        <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
    </div>
</template>

<script>
import { Toast } from 'vant'
import { ethers } from 'ethers'
import starIcon from '@img/star.png'
import shineIcon from '@img/shine.png'
import solIcon from '@img/sol.png'

const PROJECT_ADDRESS = process.env.VUE_APP_PROJECT_ADDRESS
const ROUTER_ADDRESS = process.env.VUE_APP_ROUTER_ADDRESS
const MAX_APPROVE_AMOUNT = '21000000000000000000000000'
const MIN_RECEIVE_RATE_BPS = 6850

export default {
    data() {
        return {
            amount: '',
            starBalance: '0',
            shineBalance: '0',
            solBalance: '0',
            vsolAddress: '',
            priceConfig: {
                star_price: '0',
                shine_price: '0',
                sol_price: '0',
                shine_swap_switch: 0,
                star_swap_switch: 0,
            },
            starToSolRate: '0',
            estimatedSolAmount: '0',
            minerOrderAmount: '0',
            isSubmitting: false,
            quoteTimer: null,
            mescroll: null,
            mescrollUp: {
                callback: this.upCallback,
                page: {
                    size: 10,
                },
            },
            show: false,
            actions: [
                {
                    name: 'STAR',
                    value: 'star',
                },
                {
                    name: 'SHINE',
                    value: 'shine',
                },
                {
                    name: 'SOL',
                    value: 'sol',
                },
            ],
            selectCoin: 'star',
            list: [],
        }
    },
    mounted() {
        this.loadTokenBalances()
        this.loadVsolAddress()
        this.loadConfig()
    },
    beforeDestroy() {
        if (this.quoteTimer) {
            clearTimeout(this.quoteTimer)
        }
    },
    computed: {
        currentSymbol() {
            return this.selectCoin.toUpperCase()
        },
        targetSymbol() {
            return this.selectCoin === 'sol' ? 'SHINE' : 'SOL'
        },
        currentBalance() {
            if (this.selectCoin === 'shine') return this.shineBalance
            if (this.selectCoin === 'sol') return this.solBalance
            return this.starBalance
        },
        targetBalance() {
            return this.targetSymbol === 'SHINE' ? this.shineBalance : this.solBalance
        },
        targetCoinIcon() {
            return this.targetSymbol === 'SHINE' ? shineIcon : solIcon
        },
        isStarToSol() {
            return this.selectCoin === 'star'
        },
        isRouterSwap() {
            return this.selectCoin === 'shine' || this.selectCoin === 'sol'
        },
        sourceUsdText() {
            return this.formatUsdAmount(this.getUsdAmount(this.amount, this.currentSymbol))
        },
        targetUsdText() {
            return this.formatUsdAmount(this.getUsdAmount(this.estimatedSolAmount, this.targetSymbol))
        },
        isCurrentSwapEnabled() {
            return this.isSwapEnabled(this.currentSymbol)
        },
    },
    methods: {
        onSelect(item) {
            this.selectCoin = item.value
            this.show = false
            this.estimatedSolAmount = '0'
            this.minerOrderAmount = '0'
            this.updateEstimatedAmount()
        },
        normalizeAmount(e) {
            let value = (e.target.value || '').replace(/[^\d.]/g, '')
            const parts = value.split('.')
            if (parts.length > 2) {
                value = `${parts[0]}.${parts.slice(1).join('')}`
            }
            if (value.startsWith('.')) {
                value = `0${value}`
            }
            value = value.replace(/^0+(?=\d)/, '')
            this.amount = value
            this.updateEstimatedAmount()
        },
        setMaxAmount() {
            this.amount = this.trimAmount(this.currentBalance)
            this.updateEstimatedAmount()
        },
        clearSwapInput() {
            this.amount = ''
            this.estimatedSolAmount = '0'
            this.minerOrderAmount = '0'
        },
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
            this.$http.get('/api/swap/list', {
                page_no: page.num,
                page_size: page.size || 10
            }).then((res) => {
                if (res.code == 200) {
                    const arr = ((res.data && res.data.swap_orders) || []).map(item => this.normalizeSwapRecord(item))
                    if (page.num === 1) this.list = []
                    this.list = this.list.concat(arr)
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length)
                    })
                } else {
                    mescroll.endErr()
                }
            }).catch((err) => {
                console.log('闪兑记录获取失败', err)
                mescroll.endErr()
            })
        },
        normalizeSwapRecord(item) {
            const releaseAmount = this.formatApiAmount(item.release_amount)

            return {
                from: 'STAR',
                fromIcon: starIcon,
                time: item.created_at || '',
                outAmount: this.formatApiAmount(item.from_amount),
                inAmount: this.formatApiAmount(item.sol_amount || item.onchain_amount),
                order: releaseAmount > 0 ? `${releaseAmount} SOL` : '',
            }
        },
        getTokenAddress(symbol) {
            if (symbol === 'STAR') return process.env.VUE_APP_STAR_ADDRESS
            if (symbol === 'SHINE') return process.env.VUE_APP_SHINE_ADDRESS
            if (symbol === 'SOL') return process.env.VUE_APP_SOL_ADDRESS
            return ''
        },
        async getTokenContract(symbol) {
            if (!this.getTokenAddress(symbol)) {
                throw new Error(`${symbol}_TOKEN_ADDRESS_MISSING`)
            }
            return this.$dapp.erc20.init(symbol)
        },
        async loadTokenBalances() {
            try {
                const star = await this.getTokenContract('STAR')
                this.starBalance = await star.balanceOf()
            } catch (err) {
                console.log('STAR余额获取失败', err)
            }

            try {
                const shine = await this.getTokenContract('SHINE')
                this.shineBalance = await shine.balanceOf()
            } catch (err) {
                console.log('SHINE余额获取失败', err)
            }

            try {
                const sol = await this.getTokenContract('SOL')
                this.solBalance = await sol.balanceOf()
            } catch (err) {
                console.log('SOL余额获取失败', err)
            }
        },
        async loadVsolAddress() {
            try {
                const project = await this.$dapp.project.init()
                this.vsolAddress = await project.vsol()
                console.log('Project vsol地址：', this.vsolAddress)
            } catch (err) {
                console.log('Project vsol地址获取失败', err)
            }
        },
        loadConfig() {
            this.$http.get('/api/config').then((res) => {
                if (res.code == 200) {
                    this.priceConfig = {
                        ...this.priceConfig,
                        ...(res.data || {}),
                    }
                    this.updateStarToSolRate()
                    this.updateEstimatedAmount()
                }
            }).catch((err) => {
                console.log('价格配置获取失败', err)
            })
        },
        updateEstimatedAmount() {
            if (this.isRouterSwap) {
                this.scheduleRouterQuote()
                return
            }
            this.updateStarToSolEstimate()
        },
        updateStarToSolRate() {
            const rate = this.getConfigExchangeAmount('1', 'STAR', 'SOL')
            this.starToSolRate = this.formatDisplayNumber(rate, 6)
            console.log('1 STAR 可兑换 SOL：', this.starToSolRate)
        },
        updateStarToSolEstimate() {
            if (!this.amount || !/^\d+(\.\d+)?$/.test(this.amount) || Number(this.amount) <= 0) {
                this.estimatedSolAmount = '0'
                return
            }
            this.estimatedSolAmount = this.formatDisplayNumber(
                this.getConfigExchangeAmount(this.amount, 'STAR', 'SOL'),
                6
            )
        },
        scheduleRouterQuote() {
            if (this.quoteTimer) {
                clearTimeout(this.quoteTimer)
            }
            if (!this.isRouterSwap) {
                this.updateStarToSolEstimate()
                return
            }
            this.quoteTimer = setTimeout(() => {
                this.loadRouterQuote()
            }, 400)
        },
        async loadRouterQuote() {
            if (!this.isRouterSwap || !this.amount || !/^\d+(\.\d+)?$/.test(this.amount) || Number(this.amount) <= 0) {
                this.estimatedSolAmount = '0'
                return
            }
            try {
                const router = await this.$dapp.router.init()
                const amountOut = await router.getAmountsOut(this.amount, this.getRouterPath())
                this.estimatedSolAmount = this.formatDisplayNumber(amountOut, 6)
                console.log(`${this.currentSymbol}兑换${this.targetSymbol}可兑换数量：`, this.estimatedSolAmount)
            } catch (err) {
                this.estimatedSolAmount = '0'
                console.log(`${this.currentSymbol}兑换${this.targetSymbol}报价获取失败`, err)
            }
        },
        getRouterPath() {
            const fromAddress = this.getTokenAddress(this.currentSymbol)
            const toAddress = this.getTokenAddress(this.targetSymbol)
            if (!fromAddress) {
                throw new Error(`${this.currentSymbol}_TOKEN_ADDRESS_MISSING`)
            }
            if (!toAddress) {
                throw new Error(`${this.targetSymbol}_TOKEN_ADDRESS_MISSING`)
            }
            return [fromAddress, toAddress]
        },
        validateSwapAmount() {
            if (!this.amount || !/^\d+(\.\d+)?$/.test(this.amount) || Number(this.amount) <= 0) {
                this.$toast(this.$t('请输入闪兑金额'))
                return false
            }
            return true
        },
        isSwapEnabled(symbol) {
            const normalizedSymbol = String(symbol || '').toUpperCase()
            if (normalizedSymbol === 'SOL') return true

            const switchKey = normalizedSymbol === 'STAR'
                ? 'star_swap_switch'
                : 'shine_swap_switch'
            return Number(this.priceConfig[switchKey]) === 1
        },
        validateSwapAvailability() {
            if (this.isCurrentSwapEnabled) return true
            this.$toast(this.$t('暂未开放'))
            return false
        },
        async submitSwap() {
            if (this.isSubmitting || !this.validateSwapAvailability() || !this.validateSwapAmount()) return

            this.isSubmitting = true
            Toast.loading({
                message: this.$t('加载中 ...'),
                forbidClick: true,
                loadingType: 'spinner',
                duration: 0
            })

            try {
                if (this.isRouterSwap) {
                    await this.submitRouterSwap()
                    return
                }

                const star = await this.getTokenContract('STAR')

                const balance = await star.balanceOf()
                console.log('star余额',balance)
                const allowance = await star.allowance(PROJECT_ADDRESS)
                console.log('star授权数量',allowance)
                this.starBalance = balance || '0'

                if (this.toTokenWei(balance).lt(this.toTokenWei(this.amount))) {
                    throw new Error('INSUFFICIENT_STAR_BALANCE')
                }

                if (this.toTokenWei(allowance).lt(this.toTokenWei(this.amount))) {
                    const approveTx = await star.approve(PROJECT_ADDRESS, MAX_APPROVE_AMOUNT)
                    await approveTx.wait()
                }

                const res = await this.$http.post('/api/swap', {
                    amount: this.amount
                })
                if (res.code != 200) {
                    throw new Error('CREATE_SWAP_ORDER_FAILED')
                }

                const info = res.data || {}
                const signature = info.sign || info.signature
                // exchangeStarForSol 的签名参数来自后端，金额均为 Wei，前端不能二次换算。
                if (info.id === undefined || info.id === null || !info.star_amount || !info.sol_amount || info.shine_bps === undefined || !info.deadline || !signature) {
                    throw new Error('INVALID_SWAP_ORDER_PARAMS')
                }
                console.log(info)

                const project = await this.$dapp.project.init()
                const tx = await project.exchangeStarForSol(
                    info.id,
                    info.star_amount,
                    info.sol_amount,
                    info.shine_bps,
                    info.deadline,
                    signature
                )
                await tx.wait()

                this.clearSwapInput()
                await this.loadTokenBalances()
                setTimeout(() => {
                    if (this.mescroll) {
                        this.mescroll.resetUpScroll()
                    }
                }, 2000)
                Toast.clear()
                this.$messageTip.success(this.$t('闪兑成功'))
            } catch (err) {
                console.log('STAR闪兑SOL失败', err)
                Toast.clear()
                this.$toast(this.getSwapErrorText(err), 'fail')
            } finally {
                this.isSubmitting = false
            }
        },
        async submitRouterSwap() {
            if (!ROUTER_ADDRESS) {
                throw new Error('ROUTER_ADDRESS_MISSING')
            }

            const fromSymbol = this.currentSymbol
            const toSymbol = this.targetSymbol
            const token = await this.getTokenContract(fromSymbol)
            const balance = await token.balanceOf()
            const allowance = await token.allowance(ROUTER_ADDRESS)

            if (fromSymbol === 'SHINE') {
                this.shineBalance = balance || '0'
            } else if (fromSymbol === 'SOL') {
                this.solBalance = balance || '0'
            }

            console.log(`${fromSymbol}余额`, balance)
            console.log(`${fromSymbol}授权Router数量`, allowance)

            if (this.toTokenWei(balance).lt(this.toTokenWei(this.amount))) {
                throw new Error(`INSUFFICIENT_${fromSymbol}_BALANCE`)
            }

            if (this.toTokenWei(allowance).lt(this.toTokenWei(this.amount))) {
                const approveTx = await token.approve(ROUTER_ADDRESS, MAX_APPROVE_AMOUNT)
                await approveTx.wait()
            }

            const router = await this.$dapp.router.init()
            const path = this.getRouterPath()
            const amountOut = await router.getAmountsOut(this.amount, path)
            const amountOutMin = this.getMinReceiveAmount(amountOut)
            const deadline = Math.floor(Date.now() / 1000) + 20 * 60

            console.log(`${fromSymbol}兑换${toSymbol}报价`, amountOut)
            console.log(`${fromSymbol}兑换${toSymbol}最小接收`, amountOutMin)

            const tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                this.amount,
                amountOutMin,
                path,
                router.account,
                deadline
            )
            console.log(`${fromSymbol}兑换${toSymbol}交易已发出`, tx)
            await tx.wait()
            console.log(`${fromSymbol}兑换${toSymbol}交易已确认`)

            this.clearSwapInput()
            await this.loadTokenBalances()
            if (this.mescroll) {
                this.mescroll.resetUpScroll()
            }
            Toast.clear()
            this.$messageTip.success(this.$t('闪兑成功'))
        },
        getSwapErrorText(err) {
            const message = err && err.message
            if (message === 'STAR_TOKEN_ADDRESS_MISSING') return this.$t('STAR合约地址未配置')
            if (message === 'SHINE_TOKEN_ADDRESS_MISSING') return this.$t('SHINE合约地址未配置')
            if (message === 'SOL_TOKEN_ADDRESS_MISSING') return this.$t('SOL合约地址未配置')
            if (message === 'ROUTER_ADDRESS_MISSING') return this.$t('ROUTER合约地址未配置')
            if (message === 'INSUFFICIENT_STAR_BALANCE') return this.$t('STAR余额不足')
            if (message === 'INSUFFICIENT_SHINE_BALANCE') return this.$t('SHINE余额不足')
            if (message === 'INSUFFICIENT_SOL_BALANCE') return this.$t('SOL余额不足')
            if (message === 'INVALID_SWAP_ORDER_PARAMS') return this.$t('接口返回参数不完整')
            if (message === 'CREATE_SWAP_ORDER_FAILED') return this.$t('创建订单失败')
            return this.$t('系统繁忙')
        },
        normalizeTokenAmount(value) {
            if (value === undefined || value === null || value === '') return '0'
            const raw = String(value).replace(/,/g, '').trim()
            if (/^\d+$/.test(raw) && raw.length > 12) {
                return ethers.utils.formatEther(raw)
            }
            return raw
        },
        toTokenNumber(value) {
            const number = Number(this.normalizeTokenAmount(value))
            return Number.isFinite(number) ? number : 0
        },
        formatTokenAmount(value, decimals = 4) {
            return this.toTokenNumber(value).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimals
            })
        },
        formatBpsTokenAmount(amountWei, bps, decimals = 4) {
            const amount = ethers.BigNumber.from(String(amountWei || '0'))
            const bpsValue = ethers.BigNumber.from(String(bps || '0'))
            return this.formatTokenAmount(amount.mul(bpsValue).div(10000).toString(), decimals)
        },
        formatAmount(value, decimals = 4) {
            return Number(String(value || '0').replace(/,/g, '')).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimals
            })
        },
        formatApiAmount(value) {
            if (value === undefined || value === null || value === '') return '0'
            return String(value)
        },
        formatDisplayNumber(value, decimals = 4) {
            const number = Number(String(value || '0').replace(/,/g, ''))
            return (Number.isFinite(number) ? number : 0).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimals
            })
        },
        formatUsdAmount(value) {
            return this.formatDisplayNumber(value, 2)
        },
        getConfigPrice(symbol) {
            const price = this.priceConfig[`${String(symbol || '').toLowerCase()}_price`]
            const number = Number(String(price || '0').replace(/,/g, ''))
            return Number.isFinite(number) && number > 0 ? number : 0
        },
        getUsdAmount(amount, symbol) {
            const tokenAmount = Number(String(amount || '0').replace(/,/g, ''))
            const tokenUsdtPrice = this.getConfigPrice(symbol)
            if (!Number.isFinite(tokenAmount) || tokenAmount <= 0 || tokenUsdtPrice <= 0) return 0
            return tokenAmount * tokenUsdtPrice
        },
        getConfigExchangeAmount(amount, fromSymbol, toSymbol) {
            const tokenAmount = Number(String(amount || '0').replace(/,/g, ''))
            const fromUsdtPrice = this.getConfigPrice(fromSymbol)
            const toUsdtPrice = this.getConfigPrice(toSymbol)
            if (!Number.isFinite(tokenAmount) || tokenAmount <= 0 || fromUsdtPrice <= 0 || toUsdtPrice <= 0) return 0
            return tokenAmount * fromUsdtPrice / toUsdtPrice
        },
        trimAmount(value) {
            return String(value || '0').replace(/,/g, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        },
        toTokenWei(value) {
            return ethers.utils.parseUnits(String(value || '0').replace(/,/g, ''), 18)
        },
        getMinReceiveAmount(amountOut) {
            const amountOutWei = this.toTokenWei(amountOut)
            return ethers.utils.formatEther(amountOutWei.mul(MIN_RECEIVE_RATE_BPS).div(10000))
        },
    },
}
</script>

<style scoped lang="less">
.swap-page {
    position: relative;
    z-index: 3;
    width: 750px;
    min-height: 100vh;
    color: #FFFFFF;
    background: #030306;

    .swap-scroll {
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

    .swap-hero {
        position: relative;
        min-height: 192px;
        padding: 50px 30px 20px;
        overflow: hidden;
    }

    .hero-copy {
        position: relative;
        z-index: 2;

        p {
            margin: 28px 0 0;
            color: rgba(255, 255, 255, 0.45);
            font-size: 28px;
            line-height: 1.3;
        }
    }

    .hero-title {
        color: #FFD99F;
        font-size: 40px;
        font-weight: 700;
        line-height: 1;

        img {
            width: 52px;
            height: 52px;
            margin-right: 18px;
        }
    }

    .hero-coins {
        position: absolute;
        right: 72px;
        top: 52px;
        width: 180px;
        height: 142px;
        z-index: 1;
    }

    .swap-panel {
        position: relative;
        padding: 0 30px;
    }

    .swap-card {
        position: relative;
        width: 690px;
        min-height: 266px;
        padding: 42px 28px 32px;
        border-radius: 38px;
        background:
            radial-gradient(circle at 82% 48%, rgba(41, 72, 184, 0.32) 0, rgba(41, 72, 184, 0) 245px),
            rgba(7, 6, 20, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }

    .swap-card-from {
        border: 2px solid rgba(48, 107, 252, 0.92);
        box-shadow: inset 0 0 45px rgba(55, 93, 255, 0.08), 0 0 26px rgba(57, 106, 255, 0.08);
    }

    .swap-card-to {
        margin-top: 24px;
        border: 2px solid rgba(135, 88, 7, 0.94);
        box-shadow: inset 0 0 45px rgba(255, 190, 79, 0.06), 0 0 26px rgba(255, 178, 52, 0.04);
    }

    .card-label-row {
        color: rgba(255, 255, 255, 0.72);
        font-size: 26px;
    }

    .balance {
        color: rgba(255, 255, 255, 0.55);
        font-size: 26px;
        font-weight: 700;

        img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }

        b {
            height: 42px;
            margin-left: 16px;
            padding: 0 18px;
            color: #FFFFFF;
            font-size: 24px;
            line-height: 42px;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.13);
        }
    }

    .coin-row {
        margin-top: 54px;
    }

    .coin-select {
        color: #FFFFFF;
        font-size: 40px;
        font-weight: 700;

        span {
            margin-left: 18px;
        }

        i {
            width: 0;
            height: 0;
            margin-left: 12px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 10px solid #FFFFFF;
        }
    }

    .coin-fixed {
        i {
            display: none;
        }
    }

    .coin-icon {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
    }

    .amount-box {
        text-align: right;
        .amount-input {
            width: 100%;
            height: 50px;
            border: none;
            outline: none;
            background: transparent;
            color: #FFFFFF;
            font-size: 50px!important;
        }

        strong {
            display: block;
            color: #FFFFFF;
            font-size: 50px;
            font-weight: 700;
            line-height: 1;
        }

        span {
            display: block;
            margin-top: 20px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 24px;
        }
    }

    .swap-arrow {
        position: absolute;
        left: 50%;
        top: 236px;
        z-index: 4;
        width: 84px;
        height: 84px;
        margin-left: -42px;

        img {
            width: 84px;
            height: 84px;
        }
    }

    .order-tip {
        margin-top: 54px;
        color: #FFD99F;
        font-size: 28px;
        line-height: 1;

        img {
            width: 28px;
            height: 28px;
            margin-right: 12px;
        }
    }

    .confirm-btn {
        width: 690px;
        height: 86px;
        margin-top: 30px;
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

    .records-section {
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

    .record-card {
        width: 690px;
        min-height: 282px;
        margin: 0 auto 22px;
        padding: 34px 30px 32px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(35, 36, 47, 0.96) 0%, rgba(27, 25, 34, 0.96) 100%);
        box-shadow: inset 0 0 36px rgba(255, 255, 255, 0.02);
    }

    .record-pair {
        color: #FFFFFF;
        font-size: 28px;
        font-weight: 700;

        em {
            margin: 0 8px;
            color: rgba(255, 255, 255, 0.44);
            font-style: normal;
        }
    }

    .pair-icons {
        position: relative;
        width: 78px;
        height: 54px;
        margin-right: 16px;
    }

    .pair-icon {
        position: absolute;
        top: 0;
        width: 54px;
        height: 54px;
        border-radius: 50%;
    }

    .pair-icon-front {
        left: 0;
        z-index: 2;
    }

    .pair-icon-back {
        right: 0;
        z-index: 1;
    }

    .record-mining {
        text-align: right;

        strong {
            display: block;
            color: #FFFFFF;
            font-size: 26px;
            font-weight: 700;
        }

        span {
            display: block;
            margin-top: 20px;
            color: rgba(255, 255, 255, 0.42);
            font-size: 26px;
        }
    }

    .record-time {
        margin-top: 26px;
        color: rgba(255, 255, 255, 0.45);
        font-size: 26px;
    }

    .record-row {
        margin-top: 34px;
        color: rgba(255, 255, 255, 0.42);
        font-size: 26px;

        strong {
            color: #FFFFFF;
            font-size: 26px;
            font-weight: 500;
        }

        .gold {
            color: #F8C165;
        }
    }
}
</style>
