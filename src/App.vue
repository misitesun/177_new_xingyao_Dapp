<template>
	<div id="app" class="app">
		<keep-alive :include="keepAliveInclude">
			<transition name="fade" mode="out-in">
			<router-view class="router-view" />
			</transition>
		</keep-alive>
        <FlameBackground />
	</div>
</template>
<script>
    import FlameBackground from '@/components/FlameBackground.vue';
	export default {
		name: 'App',
		components: {
            FlameBackground
        },
		data() {
			return {
				keepAliveInclude: [],
			}
		},
		created() {
            if(!localStorage.getItem('lang')) {
                localStorage.setItem('lang', 'zh-Hans')
            }
		},
	}
</script>
<style lang="less">
	@import './assets/css/vantInit.less';
	*{box-sizing: border-box;}
	
	// 设置 html 和 body 的背景色，防止下拉刷新时显示白色
	html, body {
		background: #000;
		margin: 0;
		padding: 0;
		height: 100%;
		// 防止过度滚动
		overscroll-behavior: none;
		-webkit-overflow-scrolling: touch;
	}
	
	#app {
		min-height: 100vh;
		background: #000;
		margin: 0;
		padding: 0;
		color: #fff;
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
		cursor: pointer;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		line-height: 1;
		font-size: 22px;
        position: relative;
        z-index: 2;

		.df {
			display: flex;
		}

		.df-aic {
			display: flex;
			align-items: center;
		}

		.df-aic-jusb {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.df-aic-jucen {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.text-center{text-align: center;}
		.text-left{text-align: left;}
		.text-right{text-align: right;}
		.fw-b{font-weight: bold;}
		// 移除手动编写的字体大小类，改用上面的 mixin 生成
		.color-000{color: #3D2200;}
		.color-fff{color: #fff;}
		.color-red{color: #FF5F57;}
		.color-999{color: #999;}
		.color-666{color: #666;}
		.color-8c8c{color: #8C8C8C;}
		.color-9f9f{color: #9F9F9F;}
		.color-lv{color: #27C840;}
		.color-red{color: #ED4645;}
		.color-blue{color: #14C4F9;}
		.color-main{color: #F9E0B7;}
        .color-yellow{color: #FECD67;}
        .color-ff5{color: rgba(255, 255, 255, 0.5);}
        .color-orange{color: #FF7810;}
		// 文字渐变
		.color-main-transparent{
			display: inline-block;
			background: linear-gradient(180deg, #FFDEB3 0%, #EFB152 100%);
			-webkit-background-clip: text;
			background-clip: text;
			-webkit-text-fill-color: transparent;
			color: transparent;
            
		}
		// 毛玻璃
		.glass-bg{
			background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(10px);
		}
		.line-h-1{
			line-height: 1.6;
		}
		input{
			flex: 1;
			height: 100%;
			font-size: 26px;
			background: transparent;
			border: none;
		}
		//文本隐藏
		.text-line-1 {
		    overflow: hidden;
		    white-space: nowrap;
		    text-overflow: ellipsis;
		}
		.text-line-2 {
		    -webkit-line-clamp: 2;
		    --webkit-line-clamp: 2;
		}
		.text-line-3 {
		    -webkit-line-clamp: 3;
		    --webkit-line-clamp: 3;
		}
		.text-line-4 {
		    -webkit-line-clamp: 4;
		    --webkit-line-clamp: 4;
		}
		.text-line-5 {
		    -webkit-line-clamp: 5;
		    --webkit-line-clamp: 5;
		}
		.text-line-2, .text-line-3, .text-line-4, .text-line-5 {
		    overflow: hidden;
			word-break: break-all;
		    text-overflow: ellipsis; 
		    display: -webkit-box;
		    -webkit-box-orient: vertical;
		    line-clamp: var(--webkit-line-clamp);
		    -webkit-box-orient: vertical;
		}
		
	}

	/* 定义过渡类 */
	.fade-enter-active, .fade-leave-active {
	  transition: opacity 0.3s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
	  opacity: 0;
	}
	
	// 原有的字体大小类保持兼容（使用px单位）
	.generate-font-sizes(@start: 10, @end: 200, @step: 2) when (@start <= @end) {
	  .fsz-@{start} {
	    font-size: @start * 1px;
	  }
	  .img-@{start} {
	    width: @start * 1px;
	    height: @start * 1px;
	  }
	  .ml-@{start} {
		margin-left: @start * 1px;
	  }
	  .mr-@{start} {
		margin-right: @start * 1px;
	  }
	  .mt-@{start} {
		margin-top: @start * 1px;
	  }
	  .mb-@{start} {
		margin-bottom: @start * 1px;
	  }
	  .pl-@{start} {
		padding-left: @start * 1px;
	  }
	  .pr-@{start} {
		padding-right: @start * 1px;
	  }
	  .pt-@{start} {
		padding-top: @start * 1px;
	  }
	  .pb-@{start} {
		padding-bottom: @start * 1px;
	  }
	  .generate-font-sizes(@start + @step, @end, @step);
	}
	
	// 调用 mixin 生成所有类名 (20px, 22px, 24px ... 60px)
	.generate-font-sizes();
	
	// 通用按钮 点击效果
	.common-btn {
		transition: transform 0.2s;
		user-select: none;
        background: linear-gradient(90deg, #EFB152 0%, #F0CD80 49.4%, #EFB152 100%);
        border-radius: 999px;
        color: #000;
	}
	.common-btn:active {
		transform: scale(0.95);
	}

    .common-card{
        width: 690px;
        padding: 30px;
        background: linear-gradient(0deg, rgba(120, 97, 51, 0.2), rgba(120, 97, 51, 0.2)), rgba(51, 0, 1, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 30px;
        margin: auto;
    }

    .transfer-popup{
        width: 590px;
        border-radius: 37px;
        background: rgba(0, 0, 0, 0.6); // 半透明深色
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px); // 兼容部分移动端  
        color: #fff;
        padding: 30px;
        .value{
            padding: 0 30px;
            height: 80px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
        }
        .btn1{
            width: 255px;
            height: 76px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 38px;
        }
        .btn2{
            width: 255px;
            height: 76px;
            color: #000;
        }

    }
	
</style>