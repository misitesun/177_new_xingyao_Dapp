import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
    mode: 'history',
    base: '/h5/',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    routes: [
        // 登录
        {
            path: '/',
            name: 'login',
            component: () =>
                import("@/pages/login"),
        },
        // 首页
        {
            path: '/index',
            name: 'index',
            component: () =>
                import("@/pages/index"),
        },
        // 公告
        {
            path: '/noticeList',
            name: 'noticeList',
            component: () =>
                import("@/pages/noticeList"),
        },
        // 公告详情
        {
            path: '/noticeDetail',
            name: 'noticeDetail',
            component: () =>
                import("@/pages/noticeDetail"),
        },
        // 团队
        {
            path: '/team',
            name: 'team',
            component: () =>
                import("@/pages/team"),
        },
        // 闪兑
        {
            path: '/swap',
            name: 'swap',
            component: () =>
                import("@/pages/swap"),
        },
        // 理财
        {
            path: '/finance',
            name: 'finance',
            component: () =>
                import("@/pages/finance"),
        },
        // 我的资产
        {
            path: '/assets',
            name: 'assets',
            component: () =>
                import("@/pages/assets"),
        },
        // 资产记录
        {
            path: '/assetsRecord',
            name: 'assetsRecord',
            component: () =>
                import("@/pages/assetsRecord"),
        },
        // 我的矿机
        {
            path: '/machine',
            name: 'machine',
            component: () =>
                import("@/pages/machine"),
        },
        // 股东购买
        {
            path: '/shareholder',
            name: 'shareholder',
            component: () =>
                import("@/pages/shareholder"),
        },
        // 股东分红池
        {
            path: '/dividend',
            name: 'dividend',
            component: () =>
                import("@/pages/dividend"),
        },
        // 等级分红池
        {
            path: '/levelDividend',
            name: 'levelDividend',
            component: () =>
                import("@/pages/levelDividend"),
        },
        // 平台介绍 PDF 预览
        {
            path: '/pdfPreview',
            name: 'pdfPreview',
            component: () =>
                import("@/pages/pdfPreview"),
        },
    ]
})


// 登录拦截 本地没有存token,请重新登录
router.beforeEach((to, from, next) => {
    // 判断有没有登录
    if (!localStorage.getItem('token')) {
        if (to.path == "/") {
            next();
        } else {
            router.push('/')
        }
    } else {
        next();
    }
});


// 解决跳转相同路由报错问题
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
export default router;
