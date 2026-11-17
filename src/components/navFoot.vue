<template>
    <footer>
        <div class="box df-aic-jusb pl-60 pr-60">
            <div class="item text-center" :class="{active: active === 'index'}" @click="$go(2, 'index')">
                <img src="@common/navFoot1Ac.png" alt="" class="img-40" v-if="active === 'index'">
                <img src="@common/navFoot1.png" alt="" class="img-40" v-else>
                <div class="fsz-24 mt-10" :class="{active: active === 'index'}">{{ $t('首页') }}</div>
            </div>
            <div class="item text-center" :class="{active: active === 'swap'}" @click="$go(2, 'swap')">
                <img src="@common/navFoot4Ac.png" alt="" class="img-40" v-if="active === 'swap'">
                <img src="@common/navFoot4.png" alt="" class="img-40" v-else>
                <div class="fsz-24 mt-10" :class="{active: active === 'swap'}">{{ $t('闪兑') }}</div>
            </div>
            <div class="item text-center" :class="{active: active === 'team'}" @click="$go(2, 'team')">
                <img src="@common/navFoot2Ac.png" alt="" class="img-40" v-if="active === 'team'">
                <img src="@common/navFoot2.png" alt="" class="img-40" v-else>
                <div class="fsz-24 mt-10" :class="{active: active === 'team'}">{{ $t('团队') }}</div>
            </div>
            <div class="item text-center" :class="{active: active === 'mine'}" @click="$go(2, 'mine')">
                <img src="@common/navFoot3Ac.png" alt="" class="img-40" v-if="active === 'mine'">
                <img src="@common/navFoot3.png" alt="" class="img-40" v-else>
                <div class="fsz-24 mt-10" :class="{active: active === 'mine'}">{{ $t('我的') }}</div>
            </div>
            
        </div>

    </footer>
</template>
<script>
export default {
    name: 'navFoot',
    props: {
        active: {
            type: String,
            default: 'index'
        }
    },
}
</script>
<style scoped lang="less">
footer {
    height: 98px;

    .box {
        width: 100%;
        height: 98px;
        position: fixed;
        background: #211503;
        left: 0;
        bottom: 0;
        z-index: 99;
        padding: 0 80px;

        .item {
            .img-40 {
                margin: auto;
            }

            .fsz-24 {
                color: rgba(255, 255, 255, 0.3);
            }
            .active{
                color: #FF922D;
            }
        }
    }
}
</style>