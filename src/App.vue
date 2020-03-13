<template>
  <div id="app">
    <a-locale-provider :locale="zh_CN">
    <router-view v-if="isRouterAlive"/>
    </a-locale-provider>
  </div>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  name: "App",
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      zh_CN,
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
};
</script>

<style lang="stylus">
@import 'common/stylus/style.styl'
</style>
