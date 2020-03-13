<template>
  <a-layout id="components-layout-demo-top-side-2">
    <Header />
    <a-layout :style="{justifyContent:'center'}">
      <Aside :list="navList" :style="{paddingTop:'18px'}" />
      <!-- main -->
      <!-- ,maxWidth:'940px' -->
      <a-layout :style="{paddingLeft:'22px'}">
        <!-- 标题 -->
        <a-breadcrumb
          :style="{margin: '18px 18px 18px 0',backgroundColor:'#ffffff',height:'54px',lineHeight:'54px',paddingLeft:'32px',fontSize:'14px'}"
        >
          <!-- <a-breadcrumb-item>{{this.$route.matched[1].meta.class}}</a-breadcrumb-item> -->
          <a-breadcrumb-item>{{this.$route.matched[1].meta.title}}</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 内容 -->
        <a-layout-content
          :style="{ background: '#fff',overflow:'hidden',overflowY:'scroll', marginRight:'18px', minHeight: '280px' }"
        >
          <keep-alive :include="aliveUrl">
            <router-view />
          </keep-alive>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import Header from "components/Header";
import Footer from "components/Footer";
import Aside from "components/Aside";
import Resign from "components/Resign";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["navList", "reSign", "urlArr", "aliveUrl"])
  },
  methods: {
    ...mapActions("user", ["getNavlist","getUserRole"])
  },
  created() {},
  mounted() {
    this.getNavlist();
    this.getUserRole();
  },
  components: {
    Header,
    Footer,
    Aside,
    Resign
  }
};
</script>
<style scoped lang="stylus">
#components-layout-demo-top-side-2 {
  height: 100%;
}
</style>
