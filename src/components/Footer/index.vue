<template>
  <a-layout-footer :style="{ textAlign: 'center' }">{{ msg }}{{ name }}</a-layout-footer>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {
      msg: "2018 Beijing SciResearch Best Med-Tech Co. Ltd",
      name: "北京赛乐贝医药科技有限公司"
    };
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.el-footer {
  background: rgba(238, 238, 238, 1);
  color: #999999;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 1368px) {
  .el-footer {
    height: 40px !important;
    line-height: 40px;
  }
}
</style>

