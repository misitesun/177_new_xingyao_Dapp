<template>
    <div ref="vantaRef" class="flame-background"></div>
  </template>
  
  <script>
  import * as THREE from 'three'
  // 切换回 fog
  import FOG from 'vanta/dist/vanta.fog.min'
  
  export default {
    name: "FlameBackground",
    data() {
      return {
        vantaEffect: null
      }
    },
    mounted() {
      this.initVanta()
    },
    beforeDestroy() {
      if (this.vantaEffect) {
        this.vantaEffect.destroy()
      }
    },
    methods: {
      initVanta() {
        try {
          this.vantaEffect = FOG({
            el: this.$refs.vantaRef,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            // 关键颜色配置：非常暗淡，接近黑色，只透出一点金
            highlightColor: 0x553300,  // 极暗金
            midtoneColor: 0x221100,    // 接近黑的褐色
            lowlightColor: 0x000000,   // 纯黑
            baseColor: 0x000000,       // 纯黑
            blurFactor: 1.2,          // 高模糊，柔和
            speed: 2,               // 稍快流动
            zoom: 0.8                 // 小缩放，让纹理显得更大、更像长条云雾
          })
        } catch (error) {
          console.error("Vanta Init Error:", error)
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .flame-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    opacity: 0.6; /* 稍微提高一点 opacity，因为颜色本身已经很暗了 */
  }
  </style>