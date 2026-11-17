<template>
    <div class="dividend-page">
        <navBar :url="'dividend'" />
        <section class="finance-hero">
            <div class="finance-title-row df-aic-jucen">
                <img src="@img/finance1.png" alt="" class="img-58">
                <h1 class="color-main-transparent">{{ $t('股东分红池') }}</h1>
                <img src="@img/finance2.png" alt="" class="img-58">
            </div>
            <p>{{ $t('参与星耀生态共建，按股东席位权益共享平台成长收益') }}</p>
        </section>

        <section class="num">
            <div class="df-aic-jucen">
                <span class="color-main-transparent fsz-40 fw-b">{{ formatAmount(dividendInfo.self_dividend) }}</span>
                <span class="color-main-transparent fsz-24 fw-b mt-10 ml-10">STAR</span>
            </div>
            <div class="fsz-24 color-ff5 text-center mt-20">{{ $t('自己当前已分红') }}</div>
        </section>

        <section class="list">
            <div class="item item1">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('战略股东') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>
                <div class="df-aic-jusb mt-30">
                    <div class="flex-1">
                        <div class="df-aic-jucen">
                            <span class="fsz-36 fw-b">{{ formatAmount(dividendInfo.big_node.total_pool) }}</span>
                            <span class="fsz-24 fw-b mt-10 ml-10">SOL</span>
                        </div>
                        <div class="fsz-24 color-ff5 mt-20">{{ $t('累计分红池金额') }}</div>
                    </div>
                    <img src="@img/dividend5.png" alt="" class="border">
                    <div class="flex-1">
                        <div class="df-aic-jucen">
                            <span class="fsz-36 fw-b">{{ formatAmount(dividendInfo.big_node.pending_pool) }}</span>
                            <span class="fsz-24 fw-b mt-10 ml-10">SOL</span>
                        </div>
                        <div class="fsz-24 color-ff5 mt-20">{{ $t('待分红金额') }}</div>
                    </div>
                </div>
            </div>

            <div class="item item2">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('社区股东') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>
                <div class="df-aic-jusb mt-30">
                    <div class="flex-1">
                        <div class="df-aic-jucen">
                            <span class="fsz-36 fw-b">{{ formatAmount(dividendInfo.small_node.total_pool) }}</span>
                            <span class="fsz-24 fw-b mt-10 ml-10">SOL</span>
                        </div>
                        <div class="fsz-24 color-ff5 mt-20">{{ $t('累计分红池金额') }}</div>
                    </div>
                    <img src="@img/dividend5.png" alt="" class="border">
                    <div class="flex-1">
                        <div class="df-aic-jucen">
                            <span class="fsz-36 fw-b">{{ formatAmount(dividendInfo.small_node.pending_pool) }}</span>
                            <span class="fsz-24 fw-b mt-10 ml-10">SOL</span>
                        </div>
                        <div class="fsz-24 color-ff5 mt-20">{{ $t('待分红金额') }}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'dividend',
    data() {
        return {
            dividendInfo: {
                self_dividend: '0',
                big_node: {
                    total_pool: '0',
                    pending_pool: '0',
                },
                small_node: {
                    total_pool: '0',
                    pending_pool: '0',
                },
            },
        }
    },
    mounted() {
        this.loadFinanceNodeDividend()
    },
    methods: {
        loadFinanceNodeDividend() {
            this.$http.get('/api/report/finance_node_dividend').then((res) => {
                if (res.code == 200) {
                    const data = res.data || {}
                    this.dividendInfo = {
                        self_dividend: data.self_dividend || '0',
                        big_node: {
                            total_pool: (data.big_node && data.big_node.total_pool) || '0',
                            pending_pool: (data.big_node && data.big_node.pending_pool) || '0',
                        },
                        small_node: {
                            total_pool: (data.small_node && data.small_node.total_pool) || '0',
                            pending_pool: (data.small_node && data.small_node.pending_pool) || '0',
                        },
                    }
                }
            }).catch((err) => {
                console.log('节点分红金额获取失败', err)
            })
        },
        formatAmount(value) {
            if (value === undefined || value === null || value === '') return '0'
            return String(value)
        },
    }
}
</script>

<style lang="less" scoped>
.dividend-page {
    min-height: 100vh;
    background: url('@img/dividend1.png') no-repeat left top #000;
    background-size: 100% 750px;
    .finance-hero {
        margin-bottom: 500px;
        padding: 72px 30px 0;
        text-align: center;

        p {
            margin: 10px 0 0;
            color: rgba(255, 255, 255, 0.5);
            font-size: 28px;
            line-height: 1.35;
        }
    }
    .num{
        width: 690px;
        height: 168px;
        margin: auto;
        background: url('@img/dividend2.png') no-repeat center;
        background-size: 100% 100%;
        padding-top: 35px;
    }

    .list{
        .item{
            width: 690px;
            height: 244px;
            margin: 40px auto;
            .border{
                width: 1px;
                height: 100px;
            }
            .flex-1{
                flex: 1;
                text-align: center;
            }
        }
        .item1{
            background: url('@img/dividend3.png') no-repeat center;
            background-size: 100% 100%;
        }
        .item2{
            background: url('@img/dividend4.png') no-repeat center;
            background-size: 100% 100%;
        }
        .section-title {
            position: relative;
            height: 80px;
            margin: 0 auto;
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
                bottom: 0;
                width: 540px;
                height: 44px;
            }

            h2 {
                position: relative;
                z-index: 1;
                min-width: 0;
                max-width: 330px;
                margin: 0;
                color: #ffdeb3;
                font-size: 32px;
                font-weight: 700;
                line-height: 1.15;
                margin: 0 20px;
                white-space: normal;
                overflow-wrap: break-word;
            }
        }
    }
}
</style>
