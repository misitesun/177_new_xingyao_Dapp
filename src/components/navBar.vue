<template>
    <div class="navbar">
        <div class="navbar-box df-aic-jusb pr-30">
            <div class="df-aic ml-30 animate__animated animate__fadeInLeft" @click="isShow = !isShow">
                <img src="@common/starshine-sol-logo.png" alt="StarShine SOL" class="logo" width="640" height="166" />
            </div>

            <div class="df-aic animate__animated animate__fadeInRight">
                <!-- 语言 -->
                <img src="@common/lang.png" alt="" class="img-44 ml-20" @click="langShow = !langShow" />
                <div class="fsz-22 fw-b ml-10 address df-aic-jucen">{{ address | addrHide }}</div>
                <img src="@common/nav-list.png" alt="" class="img-48 ml-20" @click="isShow = true" v-if="!isShow">
                <img src="@img/navClose.png" alt="" class="nav-close ml-20" @click="isShow = false" v-else>
            </div>
        </div>
        <div class="lang u-text-center" v-if="langShow">
            <div class="item fsz-24 fw-b" :class="{ 'ac': lang == item.code }" v-for="(item, index) in langList"
                :key="index" @click="changeLang(item)">{{ item.name }}</div>
        </div>

        <div class="slide-menu">
            <div class="menu-content" :class="{ 'menu-show': isShow }">
                <div class="menu-inner">
                    <div class="invite-card">
                        <div class="invite-title df-aic">
                            <img src="@img/nav1.png" alt="" class="invite-title-icon">
                            <span>{{ $t('邀请链接') }}</span>
                        </div>
                        <div class="df-aic-jusb link" @click="copyCode">
                            <div class="fsz-24 text-line-1">{{ inviteUrl || $t('复制专属邀请链接') }}</div>
                            <img src="@img/navCopy.png" alt="" class="img-32">
                        </div>
                    </div>
                    <div class="menu-title">{{ $t('服务') }}</div>
                    <div class="menu-list">
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'index' }" @click="isShow = false, $go(2,'/index')">
                            <div class="df-aic">
                                <img src="@img/navIcon1.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('首页') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'finance' }" @click="$go(2,'/finance')">
                            <div class="df-aic">
                                <img src="@img/navIcon6.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('理财') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'assets' }" @click="$go(2,'/assets')">
                            <div class="df-aic">
                                <img src="@img/navIcon3.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('我的资产') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'swap' }" @click="$go(2,'/swap')">
                            <div class="df-aic">
                                <img src="@img/navIcon5.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('闪兑') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'machine' }" @click="$go(2,'/machine')">
                            <div class="df-aic">
                                <img src="@img/navIcon2.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('矿机订单') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'team' }" @click="isShow = false, $go(2,'/team')">
                            <div class="df-aic">
                                <img src="@img/navIcon4.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('社区') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'shareholder' }" @click="isShow = false, $go(2,'/shareholder')">
                            <div class="df-aic">
                                <img src="@img/navIcon9.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('股东购买') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'dividend' }" @click="$go(2,'/dividend')">
                            <div class="df-aic">
                                <img src="@img/navIcon7.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('股东分红池') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                        <div class="menu-item df-aic-jusb" :class="{ 'menu-item-active': url == 'levelDividend' }" @click="$go(2,'/levelDividend')">
                            <div class="df-aic">
                                <img src="@img/navIcon8.png" alt="" class="menu-icon">
                                <span class="fsz-28 fw-b ml-18">{{ $t('等级分红池') }}</span>
                            </div>
                            <img src="@img/navArrow.png" alt="" class="menu-arrow">
                        </div>
                    </div>
                    <!-- <div class="menu-footer">STARSHINE · SOL生态</div> -->
                </div>
            </div>
            <div v-if="isShow" class="menu-mask" @click="isShow = false"></div>
        </div>

    </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers'
import {
    mapState,
    mapMutations
} from 'vuex'
export default {
    computed: {
        ...mapState(['address']),
    },
    props: ['url'],
    data() {
        return {
            switchAdd: false,
            lang: '',
            langShow: false,
            langList: [
                // {
                // name: '简体中文',
                // code: 'zh-Hans'
                // }, 
                {
                    name: '繁体中文',
                    code: 'zh-Hant'
                },
                {
                    name: 'English',
                    code: 'en'
                },
                {
                    name: '日本語',
                    code: 'ja'
                },
                {
                    name: '한국어',
                    code: 'ko'
                },
                {
                    name: 'Tiếng Việt',
                    code: 'vi'
                },
                {
                    name: 'ไทย',
                    code: 'ti'
                },
            ],
            inviteUrl: '',
            isShow: false,
        }
    },
    async mounted() {
        this.lang = localStorage.getItem('lang') || 'cn';
        if (typeof window.ethereum !== "undefined") {
            if (this.url !== 'login') {
                await this.getWeb3Init()
            }
            if (this.url !== 'login' && process.env.VUE_APP_CHAIN_ID == 56) {
                await this.switchEthereumChain()
            }
            var provider = await detectEthereumProvider();
            if (!provider) {
                return;
            }
            provider.on("accountsChanged", (accounts) => {
                console.log('========== accountsChanged 事件触发 ==========');
                console.log('新地址 (accounts[0]):', accounts[0]);
                console.log('旧地址 (store):', this.$store.state.address);
                console.log('旧地址 (localStorage):', localStorage.getItem('address'));
                
                const newAddress = accounts[0];
                const oldAddress = this.$store.state.address || localStorage.getItem('address');
                
                // 地址为空，忽略
                if (!newAddress) {
                    console.log('⚠️ 新地址为空，忽略此次事件');
                    return;
                }
                
                // 首次加载，旧地址为空
                if (!oldAddress) {
                    console.log('⚠️ 旧地址为空，可能是首次加载，更新地址');
                    this.$store.commit("setAddress", newAddress);
                    localStorage.setItem('address', newAddress);
                    return;
                }
                
                // 比较地址（忽略大小写）
                if (newAddress.toLowerCase() === oldAddress.toLowerCase()) {
                    console.log('✅ 地址未变更，忽略此次事件');
                    console.log('==========================================');
                    return;
                }
                
                // 地址真的变了
                console.log('❌ 检测到钱包地址变更！');
                console.log('旧地址:', oldAddress);
                console.log('新地址:', newAddress);
                console.log('清除 token 并重新登录...');
                console.log('==========================================');
                
                const hasToken = !!localStorage.getItem('token');
                localStorage.removeItem('token');
                localStorage.removeItem('address');
                this.$store.commit("setAddress", '');
                console.log('this.$route.path:', this.$route.path);
                if(this.$route.path == '/') {
                    this.$store.commit("setAddress", newAddress);
                    localStorage.setItem('address', newAddress);
                    if (hasToken) {
                        window.location.reload();
                    }
                    return;
                }
                this.$go(3,'/login')
            });
        }
        if(localStorage.getItem('token')){
            this.$http.get('/api/users/my').then((res) => {
            if (res.code == 200) {
                this.inviteUrl = window.location.protocol + '//' + window.location.host + '?ref=' + res.data.referral_code;
            }
        })
        }
    },
    methods: {
        copyCode() {
            this.$copyText(this.inviteUrl).then(() => {
                this.$messageTip.success(this.$t('复制成功'))
            }).catch(() => {
                this.$messageTip.error(this.$t('复制失败'))
            })
        },
        showMenu() {
            this.isShow = true
        },
        closeMenu() {
            this.isShow = false
        },
        changeLang(item) {
            console.log(item);
            localStorage.setItem('lang', item.code);
            this.lang = item.code;
            this.$i18n.locale = item.code;
            this.langShow = false;
            this.$emit('changeLang', item.code);
        },
        // 初始化
        async getWeb3Init() {
            this.erc20 = await this.$dapp.erc20.init('USDT');
            this.$store.commit("setAddress", this.erc20.account)
            localStorage.setItem('address', this.erc20.account)

        },
        // 检查网络链接
        async switchEthereumChain() {
            try {
                let id = process.env.VUE_APP_CHAIN_ID
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{
                        chainId: ethers.utils.hexValue(Number(id))
                    }]
                })
            } catch (e) {
                console.log('没有切换成功，并且e.code == 4902，则添加56');
                if (e.code == 4902) { //添加链
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x38',
                            chainName: 'BSC',
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18,
                            },
                            rpcUrls: ['https://bsc-dataseed.binance.org/'],
                            blockExplorerUrls: ['https://bscscan.com/'],
                        },],
                    })
                } else {
                    // this.$toast(e.message)
                    throw e
                }
            }
        },

    }
}
</script>

<style scoped lang="less">
.navbar {
    height: 90px;

    .nav-close {
        width: 48px;
        height: 48px;
        display: block;
    }

    .link{
        width: 100%;
        height: 84px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 20px;
        margin-top: 22px;
        padding: 0 28px;
        color: rgba(255, 255, 255, 0.78);
        .text-line-1{
            width: 490px;
        }
    }

    .lang {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 0 0 20px 20px;
        position: fixed;
        top: 88px;
        right: 0;
        z-index: 9;
        overflow: hidden;

        .item {
            height: 80px;
            line-height: 80px;
            text-align: center;
        }

        .ac {
            background: linear-gradient(90deg, #EFB152 0%, #F0CD80 49.4%, #EFB152 100%);
            color: #000;
        }
    }

    .navbar-box {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        width: 750px;
        height: 88px;
        background: rgba(0, 0, 0, 0.5);
    }

    .address {
        width: 210px;
        height: 52px;
        color: #3D2200;
        border-radius: 10px;
        background: linear-gradient(90deg, #EFB152 0%, #F0CD80 49.4%, #EFB152 100%);
        margin-left: 20px;
    }

    .logo {
        display: block;
        width: 216px;
        height: auto;
    }

    .slide-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9998;
        pointer-events: none;
        .menu-content {
            position: fixed;
            top: 88px;
            right: 0;
            bottom: 0;
            width: 750px;
            z-index: 2;
            transition: transform 0.32s cubic-bezier(.4,0,.2,1);
            transform: translateX(100%);
            display: flex;
            flex-direction: column;
            pointer-events: auto;
            background:
                radial-gradient(circle at 88% 6%, rgba(253, 204, 103, 0.1) 0, rgba(253, 204, 103, 0) 220px),
                linear-gradient(180deg, #151515 0%, #0F0F0F 100%);
            box-shadow: 0 20px 80px rgba(0, 0, 0, 0.7);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;

            .menu-inner {
                width: 690px;
                margin: 0 auto;
                padding: 46px 0 74px;
            }

            .invite-card {
                padding: 28px;
                border-radius: 26px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
            }

            .invite-title {
                color: #FFFFFF;
                font-size: 30px;
                font-weight: 700;
            }

            .invite-title-icon {
                width: 48px;
                height: 48px;
                margin-right: 18px;
            }

            .menu-title {
                margin-top: 48px;
                color: #FFFFFF;
                font-size: 30px;
                font-weight: 700;
            }

            .menu-list{
                margin-top: 22px;

                .menu-item{
                    height: 104px;
                    margin-bottom: 20px;
                    padding: 0 28px 0 20px;
                    color: rgba(255, 255, 255, 0.9);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
                }

                .menu-item-active {
                    color: #FFDDA9;
                    border-color: rgba(253, 204, 103, 0.62);
                    background: linear-gradient(90deg, rgba(253, 204, 103, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%);
                    box-shadow: 0 0 24px rgba(253, 204, 103, 0.12), inset 0 0 0 1px rgba(253, 204, 103, 0.16);
                }

                .menu-icon {
                    width: 68px;
                    height: 68px;
                    flex: 0 0 68px;
                }

                .menu-arrow {
                    width: 20px;
                    height: 20px;
                    flex: 0 0 20px;
                }
            }

            .menu-footer {
                margin-top: 34px;
                color: rgba(255, 221, 169, 0.42);
                font-size: 22px;
                text-align: center;
            }
        }
        .menu-show {
            transform: translateX(0);
        }
        .menu-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.58);
            z-index: 1;
            pointer-events: auto;
        }
    }


}
</style>
