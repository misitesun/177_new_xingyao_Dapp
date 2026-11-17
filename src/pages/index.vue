<template>
    <div class="page-index">
        <section class="index-hero">
            <navBar :url="'index'" />
            <div class="hero-copy animate__animated animate__backInUp">
                <h1 class="color-main-transparent">{{ $t('照亮未来 超越极限闪耀') }}</h1>
                <p>{{ $t('由SOL驱动，由社区推动，一颗心一个未来，每颗星都能闪耀') }}</p>
            </div>

            <div class="notice-bar df-aic animate__animated animate__backInUp">
                <img src="@img/index1.png" alt="" class="notice-icon" />
                <div class="notice-viewport" @click="$go(2, '/noticeList')">
                    <van-swipe
                        class="notice-swipe"
                        vertical
                        :autoplay="2600"
                        :show-indicators="false"
                        :touchable="false"
                    >
                        <van-swipe-item v-for="(item,index) in notices" :key="index">{{ item.title }}</van-swipe-item>
                    </van-swipe>
                </div>
                <img src="@common/nav-arrow.png" alt="" class="notice-arrow" />
            </div>

            <div class="platform-section animate__animated animate__backInUp">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('平台介绍') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="platform-desc">
                    {{ $t('STARSHINE是搭建于SOL基金会旗下生态。携手打造，高速.低手续费集群，让社区共识.节点生态.双币经济.WEB3应用.DEFI收益。于一体的数字经济生态,以达到高性能低成本，实现快速交易大规模应用。') }}
                </div>

                <div class="platform-feature-list df-aic-jusb">
                    <div class="platform-feature">
                        <img src="@img/index8.png" alt="" />
                        <div>{{ $t('多资产参与') }}</div>
                    </div>
                    <div class="platform-feature">
                        <img src="@img/index9.png" alt="" />
                        <div>{{ $t('链上透明') }}</div>
                    </div>
                    <div class="platform-feature">
                        <img src="@img/index10.png" alt="" />
                        <div>{{ $t('社区共建') }}</div>
                    </div>
                    <div class="platform-feature">
                        <img src="@img/index11.png" alt="" />
                        <div>{{ $t('长期赋能') }}</div>
                    </div>
                </div>

            </div>

            <div class="core-members-section animate__animated animate__backInUp">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('核心成员') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="members-viewport" :aria-label="$t('核心成员')">
                    <div class="members-track">
                        <div
                            v-for="copyIndex in 2"
                            :key="copyIndex"
                            class="members-sequence"
                            :aria-hidden="copyIndex === 2 ? 'true' : null"
                        >
                            <article
                                v-for="member in members"
                                :key="`${copyIndex}-${member.name}`"
                                class="member-card"
                            >
                                <img :src="member.image" :alt="member.name" class="member-photo" />
                                <div class="member-info">
                                    <div class="member-name">{{ member.name }}</div>
                                    <div class="member-role">{{ $t(member.roleKey) }}</div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    class="platform-document"
                    :aria-label="$t('查看平台介绍PDF')"
                    @click="openPlatformPdf"
                >
                    <img src="@img/platform-pdf-left.png" alt="" class="document-page document-page-left" />
                    <img src="@img/platform-pdf-right.png" alt="" class="document-page document-page-right" />
                    <img src="@img/platform-pdf-front.png" alt="" class="document-page document-page-front" />
                </button>
            </div>

            <div class="official-section animate__animated animate__backInUp">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('官方战略合作伙伴') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="official-intro">
                    <div>{{ $t('SOLANA（SOL公链）官方战略合作伙伴') }}</div>
                    <div>{{ $t('权威合作，真实可验，与全球顶级伙伴共建生态新格局') }}</div>
                </div>

                <div class="partner-panel">
                    <div class="partner-heading df-aic">
                        <span class="heading-no">01</span>
                        <span>{{ $t('全球传统巨头战略合作伙伴（企业级深度合作）') }}</span>
                    </div>

                    <div class="giant-grid">
                        <div class="giant-card">
                            <div>{{ $t('云基础设施：') }}</div>
                            <img src="@img/index12.png" alt="" />
                        </div>
                        <div class="giant-card">
                            <div>{{ $t('全球支付巨头：') }}</div>
                            <img src="@img/index13.png" alt="" />
                        </div>
                        <div class="giant-card">
                            <div>{{ $t('电商：') }}</div>
                            <img src="@img/index14.png" alt="" />
                        </div>
                        <div class="giant-card">
                            <div>{{ $t('金融机构：') }}</div>
                            <img src="@img/index15.png" alt="" />
                        </div>
                    </div>

                    <div class="partner-heading partner-heading-next df-aic">
                        <span class="heading-no">02</span>
                        <span>{{ $t('SOLANA生态官方头部项目（基金会认可核心生态伙伴）') }}</span>
                    </div>

                    <div class="ecosystem-block">
                        <div class="ecosystem-line df">
                            <div class="ecosystem-tab df-aic-jucen">{{ $t('DEFI核心') }}</div>
                            <div class="ecosystem-scroll">
                                <div class="ecosystem-row df-aic">
                                    <img src="@img/swiperA1.png" alt="" />
                                    <img src="@img/swiperA2.png" alt="" />
                                    <img src="@img/swiperA3.png" alt="" />
                                    <img src="@img/swiperA4.png" alt="" />
                                    <img src="@img/swiperA5.png" alt="" />
                                    <img src="@img/swiperA6.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div class="ecosystem-line df">
                            <div class="ecosystem-tab df-aic-jucen">{{ $t('NFT与工具') }}</div>
                            <div class="ecosystem-scroll">
                                <div class="ecosystem-row df-aic">
                                    <img src="@img/swiperB1.png" alt="" />
                                    <img src="@img/swiperB2.png" alt="" />
                                    <img src="@img/swiperB3.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div class="ecosystem-line df">
                            <div class="ecosystem-tab df-aic-jucen">{{ $t('钱包&托管') }}</div>
                            <div class="ecosystem-scroll">
                                <div class="ecosystem-row df-aic">
                                    <img src="@img/swiperC1.png" alt="" />
                                    <img src="@img/swiperC2.png" alt="" />
                                    <img src="@img/swiperC3.png" alt="" />
                                    <img src="@img/swiperC4.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="partner-heading partner-heading-next">
                        <span class="heading-no">03</span>
                        <span>{{ $t('峰会/活动官方战略合作伙伴（SOLANA SUMMIT公示名单）') }}</span>
                    </div>

                    <div class="marquee-viewport">
                        <div class="marquee-track marquee-track-d">
                            <img src="@img/swiperD1.png" alt="" />
                            <img src="@img/swiperD2.png" alt="" />
                            <img src="@img/swiperD3.png" alt="" />
                            <img src="@img/swiperD4.png" alt="" />
                            <img src="@img/swiperD5.png" alt="" />
                            <img src="@img/swiperD6.png" alt="" />
                            <img src="@img/swiperD7.png" alt="" />
                            <img src="@img/swiperD1.png" alt="" />
                            <img src="@img/swiperD2.png" alt="" />
                            <img src="@img/swiperD3.png" alt="" />
                            <img src="@img/swiperD4.png" alt="" />
                            <img src="@img/swiperD5.png" alt="" />
                            <img src="@img/swiperD6.png" alt="" />
                            <img src="@img/swiperD7.png" alt="" />
                        </div>
                    </div>

                    <div class="partner-heading partner-heading-next df-aic">
                        <span class="heading-no">04</span>
                        <span>{{ $t('跨行业合规合作方') }}</span>
                    </div>

                    <div class="marquee-viewport">
                        <div class="marquee-track marquee-track-e">
                            <img src="@img/swiperE1.png" alt="" />
                            <img src="@img/swiperE2.png" alt="" />
                            <img src="@img/swiperE3.png" alt="" />
                            <img src="@img/swiperE4.png" alt="" />
                            <img src="@img/swiperE5.png" alt="" />
                            <img src="@img/swiperE1.png" alt="" />
                            <img src="@img/swiperE2.png" alt="" />
                            <img src="@img/swiperE3.png" alt="" />
                            <img src="@img/swiperE4.png" alt="" />
                            <img src="@img/swiperE5.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="contact-section" v-if="false">
                <div class="section-title df-aic-jucen">
                    <img src="@img/index5.png" alt="" class="title-side title-side-left" />
                    <h2>{{ $t('联系方式') }}</h2>
                    <img src="@img/index6.png" alt="" class="title-side title-side-right" />
                    <img src="@img/index7.png" alt="" class="title-base" />
                </div>

                <div class="contact-content df-aic-jusb">
                    <div class="contact-list">
                        <div class="contact-item df-aic-jusb">
                            <div class="df-aic">
                                <img src="@img/footer1.png" alt="" class="contact-icon" />
                                <span>{{ $t('Telegeam社群') }}</span>
                            </div>
                            <img src="@img/footer4.png" alt="" class="contact-arrow" />
                        </div>
                        <div class="contact-item df-aic-jusb">
                            <div class="df-aic">
                                <img src="@img/footer2.png" alt="" class="contact-icon" />
                                <span>{{ $t('Youtube') }}</span>
                            </div>
                            <img src="@img/footer4.png" alt="" class="contact-arrow" />
                        </div>
                        <div class="contact-item df-aic-jusb">
                            <div class="df-aic">
                                <img src="@img/footer3.png" alt="" class="contact-icon" />
                                <span>{{ $t('Twitter（X）') }}</span>
                            </div>
                            <img src="@img/footer4.png" alt="" class="contact-arrow" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    data() {
        return {
            notices: [],
            members: [
                {
                    name: 'Lily Liu｜刘莉莉',
                    roleKey: 'SOL基金会总裁 President',
                    image: require('@/assets/img/member-lily-liu.png'),
                },
                {
                    name: 'Raj Gokal',
                    roleKey: '董事会成员（Solana Labs联合创始人）',
                    image: require('@/assets/img/member-raj-gokal.png'),
                },
                {
                    name: 'VINCENT HARRINGTON',
                    roleKey: '基金会代表',
                    image: require('@/assets/img/new-home-1.png'),
                },
                {
                    name: '迈克博士',
                    roleKey: '全球首席运营官',
                    image: require('@/assets/img/new-home-2.png'),
                },
                {
                    name: 'Anatoly Yakovenko（Toly）',
                    roleKey: 'Solana协议创造者',
                    image: require('@/assets/img/member-anatoly-yakovenko.png'),
                },
                
                {
                    name: 'Mable Jiang｜江佳',
                    roleKey: 'Solana董事会成员',
                    image: require('@/assets/img/member-mable-jiang.png'),
                },
                {
                    name: 'Patrick von Felten',
                    roleKey: 'Solana董事会成员',
                    image: require('@/assets/img/member-placeholder.png'),
                },
                {
                    name: 'Wolfgang Albrecht',
                    roleKey: 'Solana董事会成员',
                    image: require('@/assets/img/member-placeholder.png'),
                },
                {
                    name: 'Leopold Schabel',
                    roleKey: 'Solana董事会成员',
                    image: require('@/assets/img/member-placeholder.png'),
                },
            ],
        }
    },
    mounted() {
        this.$http.get('/api/notices',{page_no:1,page_size:10}).then((res) => {
            if (res.code == 200) {
                this.notices = res.data.notices;
            }
        })
    },
    methods: {
        openPlatformPdf() {
            this.$go(2, '/pdfPreview')
        },
    },
}
</script>

<style lang="less" scoped>
.page-index {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    background: url("@img/banner.png") no-repeat left -88px #000;
    background-size: 100% 780px;
}

.index-hero {
    position: relative;
    width: 750px;
    min-height: 100vh;
    margin: 0 auto;
    padding-top: 80px;
    padding-bottom: 80px;
    
}

.hero-copy {
    width: 750px;
    text-align: center;

    h1 {
        width: 690px;
        margin: 0;
        margin-left: auto;
        margin-right: auto;
        font-family: "STSong", "FZShuSong-Z01S", "SimSun", serif;
        font-size: 62px;
        font-weight: 400;
        line-height: 1.18;
        white-space: normal;
        overflow-wrap: break-word;
    }

    p {
        width: 690px;
        margin: 28px auto 0;
        color: #ffebd2;
        font-family: "FZShuSong-Z01S", "Microsoft YaHei", sans-serif;
        font-size: 24px;
        line-height: 1.5;
        text-align: center;
        overflow-wrap: break-word;
    }
}

.notice-bar {
    width: 690px;
    height: 64px;
    margin: 360px auto 0;
    padding: 0 20px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    background: rgba(255, 217, 95, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.notice-icon {
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
}

.notice-arrow {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
}

.notice-viewport {
    height: 36px;
    margin: 0 18px;
    overflow: hidden;
    flex: 1;
}

.notice-swipe {
    height: 36px;

    /deep/ .van-swipe-item {
        height: 36px;
        overflow: hidden;
        color: rgba(255, 255, 255, 0.8);
        font-size: 24px;
        line-height: 36px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.section-title {
    position: relative;
    width: 690px;
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

.platform-section {
    width: 750px;
    margin-top: 60px;
}

.platform-desc {
    width: 690px;
    margin: 58px auto 0;
    color: #dcc5ad;
    font-size: 24px;
    line-height: 1.9;
    text-align: center;
    overflow-wrap: break-word;
}

.platform-feature-list {
    width: 640px;
    margin: 42px auto 0;
}

.platform-feature {
    width: 130px;
    color: #dcc5ad;
    font-size: 24px;
    line-height: 1.2;
    text-align: center;
    white-space: normal;
    overflow-wrap: break-word;

    img {
        display: block;
        width: 54px;
        height: 54px;
        margin: 0 auto 24px;
    }
}

.platform-document {
    position: relative;
    display: block;
    width: 750px;
    height: 560px;
    padding: 0;
    overflow: hidden;
    appearance: none;
    border: 0;
    border-bottom: 2px solid transparent;
    border-image: linear-gradient(90deg, rgba(249, 178, 69, 0), #f9b245 50%, rgba(249, 178, 69, 0)) 1;
    background: linear-gradient(180deg, rgba(252, 213, 53, 0) 0%, rgba(252, 213, 53, 0.1) 100%);
    cursor: pointer;

    &::after {
        position: absolute;
        inset: 0;
        z-index: 4;
        content: "";
        background: linear-gradient(180deg, transparent 58%, rgba(239, 177, 82, 0.08) 100%);
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
    }

    &:active {
        .document-page {
            transform: translateY(4px) scale(0.99);
        }

        .document-page-front {
            transform: translateX(-50%) translateY(4px) scale(0.99);
        }

        &::after {
            opacity: 1;
        }
    }
}

.document-page {
    position: absolute;
    display: block;
    width: 242px;
    height: 342px;
    top: 164px;
    object-fit: cover;
    border-radius: 10px;
    opacity: 0.5;
    transition: transform 0.2s ease;
    pointer-events: none;
}

.document-page-left {
    left: 40px;
}

.document-page-right {
    right: 40px;
}

.document-page-front {
    top: 122px;
    left: 50%;
    z-index: 3;
    width: 280px;
    height: 396px;
    opacity: 1;
    transform: translateX(-50%);
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.35);
}

.core-members-section {
    width: 750px;
    margin-top: 80px;
}

.members-viewport {
    width: 720px;
    margin: 16px 0 0 30px;
    overflow: hidden;
}

.members-track {
    display: flex;
    width: max-content;
    animation: membersMarquee 36s linear infinite;
    will-change: transform;
}

.members-sequence {
    display: flex;
    gap: 16px;
    padding-right: 16px;
}

.member-card {
    width: 336px;
    height: 432px;
    padding: 18px;
    flex: 0 0 336px;
    overflow: hidden;
    border: 1px solid #cd8f3e;
    border-radius: 32px;
    background: linear-gradient(166.6deg, rgba(130, 78, 0, 0.2) 7.82%, rgba(0, 0, 0, 0.2) 92.18%);
}

.member-photo {
    display: block;
    width: 300px;
    height: 250px;
    object-fit: cover;
    object-position: center;
    border-radius: 20px;
    pointer-events: none;
}

.member-info {
    width: 276px;
    margin: 20px auto 0;
    text-align: center;
}

.member-name {
    color: #fff;
    font-family: "Poppins", "Microsoft YaHei", sans-serif;
    font-size: 28px;
    font-weight: 400;
    line-height: 1.22;
    overflow-wrap: break-word;
}

.member-role {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24px;
    line-height: 1.35;
    overflow-wrap: break-word;
}

@keyframes membersMarquee {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(-50%, 0, 0);
    }
}

@media (hover: hover) {
    .members-viewport:hover .members-track {
        animation-play-state: paused;
    }
}

@media (prefers-reduced-motion: reduce) {
    .members-viewport {
        overflow-x: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .members-track {
        animation: none;
    }

    .members-sequence[aria-hidden="true"] {
        display: none;
    }
}

.official-section {
    width: 750px;
    margin-top: 80px;
}

.official-intro {
    width: 690px;
    margin: 46px auto 0;
    color: #dcc5ad;
    font-size: 24px;
    line-height: 1.9;
    text-align: center;
    overflow-wrap: break-word;
}

.partner-panel {
    width: 690px;
    margin: 42px auto 0;
    padding: 30px 28px 34px;
    overflow: hidden;
    border: 1px solid rgba(239, 177, 82, 0.65);
    border-radius: 20px;
    background: linear-gradient(0deg, rgba(120, 97, 51, 0.16), rgba(120, 97, 51, 0.16)), rgba(0, 0, 0, 0.88);
    box-shadow: inset 0 0 26px rgba(239, 177, 82, 0.22);
}

.partner-heading {
    display: flex;
    align-items: flex-start;
    color: #ffdeb3;
    font-size: 24px;
    line-height: 1.35;
    white-space: normal;

    span:last-child {
        min-width: 0;
        flex: 1;
        overflow-wrap: break-word;
    }
}

.partner-heading-next {
    margin-top: 42px;
}

.heading-no {
    position: relative;
    width: 36px;
    height: 36px;
    margin-right: 16px;
    color: #ffdeb3;
    font-family: "Poppins", "Microsoft YaHei", sans-serif;
    font-size: 20px;
    line-height: 36px;
    text-align: center;
    flex: 0 0 36px;

    &::before {
        position: absolute;
        inset: 4px;
        z-index: -1;
        content: "";
        border: 1px solid rgba(255, 222, 179, 0.7);
        transform: rotate(45deg);
    }
}

.giant-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 28px;
}

.giant-card {
    height: 214px;
    padding: 28px 22px;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(90, 54, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 100%);

    div {
        color: #dcc5ad;
        font-size: 24px;
        line-height: 1.25;
        overflow-wrap: break-word;
    }

    img {
        display: block;
        max-width: 217px;
        max-height: 100px;
        margin-top: 42px;
    }
}

.ecosystem-block {
    margin-top: 28px;
}

.ecosystem-line {
    margin-top: 20px;

    &:first-child {
        margin-top: 0;
    }
}

.ecosystem-tab {
    width: 146px;
    height: 88px;
    box-sizing: border-box;
    padding: 0 12px;
    flex: 0 0 146px;
    color: #ffdeb3;
    font-size: 24px;
    line-height: 1.15;
    text-align: center;
    white-space: normal;
    overflow-wrap: break-word;
    border: 1px solid rgba(239, 177, 82, 0.65);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.58);
    box-shadow: inset 0 0 20px rgba(239, 177, 82, 0.18);
}

.ecosystem-scroll {
    width: 470px;
    height: 88px;
    margin-left: 14px;
    padding: 0 24px;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid rgba(239, 177, 82, 0.65);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.62);
    box-shadow: inset 0 0 20px rgba(239, 177, 82, 0.18);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.ecosystem-row {
    width: max-content;
    min-width: 100%;
    height: 100%;
    gap: 28px;

    img {
        display: block;
        flex: 0 0 auto;
        max-height: 32px;
    }
}

.marquee-viewport {
    width: 640px;
    margin-top: 28px;
    overflow: hidden;
}

.marquee-track {
    display: flex;
    width: max-content;
    gap: 12px;

    img {
        display: block;
        width: 180px;
        height: 60px;
        flex: 0 0 180px;
    }
}

.marquee-track-d {
    animation: partnerMarqueeD 20s linear infinite;
}

.marquee-track-e {
    animation: partnerMarqueeE 18s linear infinite;
}

@keyframes partnerMarqueeD {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-1344px);
    }
}

@keyframes partnerMarqueeE {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-960px);
    }
}

.contact-section {
    width: 750px;
    margin-top: 88px;
    padding-bottom: 80px;
}

.contact-content {
    padding-left: 30px;
    margin: 52px auto 0;
    background: url('@img/footer5.png') no-repeat right center;
    background-size: 350px 278px;
}

.contact-list {
    width: 371px;
    flex: 0 0 360px;
}

.contact-item {
    width: 371px;
    height: 68px;
    margin-top: 20px;
    padding: 0 28px;
    background: url('@img/footer6.png') no-repeat center center;
    background-size: 100% 100%;

    &:first-child {
        margin-top: 0;
    }

    span {
        min-width: 0;
        margin-left: 22px;
        color: #dcc5ad;
        font-size: 24px;
        line-height: 1.15;
        white-space: normal;
        overflow-wrap: break-word;
    }
}

.contact-icon {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
}

.contact-arrow {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
}

</style>
