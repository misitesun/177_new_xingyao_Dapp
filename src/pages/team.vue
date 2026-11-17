<template>
    <div class="team-page">
        <navBar :url="'team'" />

        <mescroll-vue class="team-scroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <section class="community-hero">
                <div class="community-copy">
                    <h1>{{ $t('我的社区') }}</h1>
                    <p>{{ $t('懂资金流动，也懂去中心化精神。') }}</p>
                </div>

                <div class="community-card">
                    <div class="community-level" v-if="userInfo.node_id == 1">
                        <img src="@img/team1.png" alt="" class="community-star" />
                        <div class="shareholder-label">
                            <img src="@img/team2.png" alt="" />
                            <span>{{ $t('战略股东') }}</span>
                        </div>
                    </div>
                    <div class="community-level" v-if="userInfo.node_id == 2">
                        <img src="@img/team0.png" alt="" class="community-star" />
                        <div class="shareholder-label">
                            <img src="@img/team3.png" alt="" />
                            <span style="color: #85BCFF;">{{ $t('社区股东') }}</span>
                        </div>
                    </div>
                    

                    <div class="level-row">
                        <div class="df-aic mb-20">
                            <span class="level-label">当前等级</span>
                            <img :src="userInfo.level.icon" alt="" class="img-40 ml-20 level-badge">
                        </div>
                        <div class="fsz-24 mb-20">{{ $t('我的地址') }}</div>
                        <div class="fsz-28 fw-b">{{ myAddress | addrHide }}</div>
                    </div>

                    <div class="card-divider"></div>

                    <div class="community-stats df-aic-jusb">
                        <div class="stat-item">
                            <div class="stat-value">{{ userInfo.team_count }}</div>
                            <div class="stat-label">{{ $t('社区人数') }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ userInfo.referral_count }}</div>
                            <div class="stat-label">{{ $t('直推人数') }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ userInfo.team_kpi }}</div>
                            <div class="stat-label">{{ $t('团队业绩') }}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="members-section">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('成员列表') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="member-list">
                    <div
                        class="member-card"
                        v-for="(item, index) in list"
                        :key="index"
                    >
                        <div class="member-top df-aic-jusb">
                            <div class="member-address text-line-1">{{ item.address | addrHide }}</div>
                            <div class="label" v-if="item.node_id == 2">
                                <img src="@img/team3.png" alt="" />
                                <span style="color: #85BCFF;">{{ $t('社区股东') }}</span>
                            </div>
                            <div class="label" v-if="item.node_id == 1">
                                <img src="@img/team2.png" alt="" />
                                <span>{{ $t('战略股东') }}</span>
                            </div>
                            <img :src="item.level.icon" alt="" class="img-40 mr-10 member-badge">
                        </div>
                        <div class="member-time">{{ item.created_at }}</div>
                        <div class="member-bottom df-aic-jusb">
                            <span>{{ $t('团队业绩') }}</span>
                            <strong>{{ item.team_kpi }} SOL</strong>
                        </div>
                        <div class="member-bottom df-aic-jusb">
                            <span>{{ $t('个人业绩') }}</span>
                            <strong>{{ item.kpi }} SOL</strong>
                        </div>
                    </div>
                    <noData v-if="list.length == 0" />
                </div>
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
                    size: 4,
                },
            },
            list: [],
            userInfo: {},
            myAddress: '',
        }
    },
    mounted() {
        this.myAddress = this.$store.state.address;
        this.$http.get('/api/users/my').then((res) => {
            if (res.code == 200) {
                this.userInfo = res.data
            }
        })
    },
    methods: {
        mescrollInit(mescroll) {
            this.mescroll = mescroll
        },
        upCallback(page, mescroll) {
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
            this.$http.get('/api/users/my/referrals', {
                page_no: page.num,
                page_size: 10
            }).then((res) => {
                if (res.code == 200) {
                    let arr = res.data.referrals;
                    if (page.num === 1) this.list = []
                    this.list = this.list.concat(arr)
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length)
                    })
                }
            }).catch((e) => {
                mescroll.endErr()
            })
        },
    },
}
</script>

<style scoped lang="less">
.team-page {
    position: relative;
    z-index: 3;
    width: 750px;
    min-height: 100vh;
    background: #030306;

    .team-scroll {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 750px;
        height: auto;
        background:
            radial-gradient(circle at 50% -110px, rgba(100, 25, 128, 0.56) 0, rgba(100, 25, 128, 0.18) 220px, rgba(0, 0, 0, 0) 470px),
            radial-gradient(circle at 96% 250px, rgba(246, 173, 62, 0.2) 0, rgba(246, 173, 62, 0) 210px),
            linear-gradient(180deg, #18071F 0%, #050508 560px, #000 100%);
    }

    .community-hero {
        position: relative;
        padding: 56px 30px 26px;
        overflow: hidden;
    }

    .community-copy {
        position: relative;
        z-index: 2;

        h1 {
            margin: 0;
            color: #FFD99F;
            font-size: 42px;
            font-weight: 700;
            line-height: 1.2;
        }

        p {
            margin: 26px 0 0;
            color: rgba(255, 255, 255, 0.5);
            font-size: 28px;
            line-height: 1.3;
        }
    }

    .community-card {
        position: relative;
        z-index: 1;
        width: 690px;
        margin-top: 46px;
        padding: 58px 30px 30px;
        border: 2px solid rgba(235, 159, 42, 0.8);
        border-radius: 28px;
        background:
            linear-gradient(180deg, rgba(255, 210, 159, 0.18) 0%, rgba(255, 255, 255, 0.08) 54%, rgba(255, 255, 255, 0.04) 100%),
            rgba(20, 18, 24, 0.72);
        box-shadow: inset 0 0 42px rgba(255, 205, 103, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
    .community-level {
        position: absolute;
        top: -170px;
        right: 0px;
    }

    .community-star {
        width: 330px;
        height: 222px;
        z-index: 2;
        pointer-events: none;
    }

    .shareholder-label {
        position: relative;
        width: 155px;
        height: 48px;
        z-index: 3;
        color: #FFD99F;
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        line-height: 48px;
        margin: auto;
        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 155px;
            height: 48px;
            z-index: -1;
        }
    }

    .level-row {
        position: relative;
        z-index: 4;
    }

    .level-label {
        color: #FFFFFF;
        font-size: 26px;
    }

    .level-badge {
        width: 120px;
        height: 54px;
    }

    .badge-gem {
        position: relative;
        width: 32px;
        height: 32px;
        margin-right: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, #71808b 0%, #e5ebef 50%, #545c65 100%);

        &::after {
            content: "";
            position: absolute;
            left: 8px;
            top: 8px;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(255, 255, 255, 0.78);
            transform: rotate(45deg);
        }
    }

    .badge-gem-v9,
    .badge-gem-v1 {
        background: linear-gradient(135deg, #2ADFC2 0%, #D7FFF6 48%, #1F8F8A 100%);
    }

    .badge-gem-v10 {
        background: linear-gradient(135deg, #FF9425 0%, #FFE8A2 50%, #F4A12C 100%);
    }

    .badge-gem-v8 {
        background: linear-gradient(135deg, #B756FF 0%, #F3C5FF 50%, #7D44F1 100%);
    }

    .badge-gem-v3,
    .badge-gem-v5 {
        background: linear-gradient(135deg, #3F72FF 0%, #BFD9FF 50%, #2755AF 100%);
    }

    .card-divider {
        width: 100%;
        height: 1px;
        margin-top: 32px;
        background: linear-gradient(90deg, rgba(255, 218, 169, 0), rgba(255, 218, 169, 0.2), rgba(255, 218, 169, 0));
    }

    .community-stats {
        margin-top: 38px;
    }

    .stat-item {
        width: 33.33%;
        text-align: center;
    }

    .stat-value {
        color: #FFFFFF;
        font-size: 30px;
        font-weight: 700;
        line-height: 1;
    }

    .stat-label {
        margin-top: 26px;
        color: rgba(255, 255, 255, 0.45);
        font-size: 26px;
    }

    .members-section {
        padding: 12px 30px 56px;
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

    .member-card {
        width: 690px;
        margin: 0 auto 22px;
        padding: 34px 30px 30px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(35, 36, 47, 0.96) 0%, rgba(27, 25, 34, 0.96) 100%);
        box-shadow: inset 0 0 36px rgba(255, 255, 255, 0.02);
    }

    .member-address {
        max-width: 420px;
        color: #FFFFFF;
        font-size: 34px;
        font-weight: 700;
        line-height: 1.1;
    }

    .member-time {
        margin-top: 22px;
        color: rgba(255, 255, 255, 0.45);
        font-size: 26px;
    }

    .member-bottom {
        margin-top: 38px;
        color: rgba(255, 255, 255, 0.45);
        font-size: 26px;

        strong {
            color: #FFFFFF;
            font-size: 26px;
            font-weight: 500;
        }
    }

    .member-badge {
        width: 120px;
        height: 54px;
    }
    .label {
        position: relative;
        width: 155px;
        height: 48px;
        z-index: 3;
        color: #FFD99F;
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        line-height: 48px;
        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 155px;
            height: 48px;
            z-index: -1;
        }
    }
}
</style>
