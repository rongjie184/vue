<template>
  <div v-if="showPage">
    <part1 />
    <part2 />
    <part3 />
    <!-- 第三个表 -->
    <part4 v-if='smoShow' />
    <!--  -->
    <part5 />
    <!--  -->
    <part6 />
    <!--  -->
    <part7 />
    <!--  -->
    <part8 />
  </div>
</template>

<script>
import part1 from "./part1";
import part2 from "./part2";
import part3 from "./part3";
import part4 from "./part4";
import part5 from "./part5";
import part6 from "./part6";
import part7 from "./part7";
import part8 from "./part8";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      showPage:false,
      smoShow:true
    };
  },
  computed:{
    ...mapGetters(["role"])
  },
  methods: {
    showPageMethod(){
      if(this.role.id){
        this.showPage = true;
        this.smoShow = this.role.id === 1 ? false:true;
      }else{
        setTimeout(()=>{
          this.showPageMethod()
        },300)
      }
    }
  },
  mounted() {
    this.showPageMethod()
  },
  components: {
    part1,
    part2,
    part3,
    part4,
    part5,
    part6,
    part7,
    part8,
  }
};
</script>
<style lang="stylus">
.ant-form-item /deep/ {
  margin-bottom: 0;
}

.itemCont {
  .title {
    height: 54px;
    line-height: 54px;
    font-size: 14px;
    font-family: PingFangSC;
    font-weight: 500;
    color: #5a5a5a;
    padding-left: 45px;
    position: relative;
    background: rgba(250, 250, 250, 1);

    &::before {
      content: '';
      position: absolute;
      width: 3px;
      height: 14px;
      background: rgba(24, 144, 255, 1);
      top: 50%;
      left: 32px;
      transform: translateY(-50%);
    }
  }

  .main {
    padding: 0 30px;

    .chart {
      overflow: hidden;
    }
  }
}
</style>