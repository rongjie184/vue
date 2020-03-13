<template>
  <!-- 总体数据 -->
  <div class="itemCont">
    <div class="title">概况统计</div>
    <div class="main" id="part1">
      <div class="item" v-if="userInfo.id==1">
        <div :class="['icon',`index-0`]">
          <img src="@/assets/img/department.png" :style="{width:'30px',height:'30px',display:'block'}"/>
        </div>
        <div class="desc">
          <div :class="['number',`index-0`]">{{general_list[0].count}}</div>
          <div class="text">{{general_list[0].name}}</div>
        </div>
      </div>
      <div class="item">
        <div :class="['icon',`index-1`]">
          <img src="@/assets/img/reseacher.png" :style="{width:'24px',height:'32px',display:'block'}"/>
        </div>
        <div class="desc">
          <div :class="['number',`index-1`]">{{general_list[1].count}}</div>
          <div class="text">{{general_list[1].name}}</div>
        </div>
      </div>
      <div class="item">
        <div :class="['icon',`index-2`]">
          <img src="@/assets/img/smo.png" :style="{width:'30px',height:'30px',display:'block'}"/>
        </div>
        <div class="desc">
          <div :class="['number',`index-2`]">{{general_list[2].count}}</div>
          <div class="text">{{general_list[2].name}}</div>
        </div>
      </div>
      <div class="item">
        <div :class="['icon',`index-3`]">
          <img src="@/assets/img/crc.png" :style="{width:'29px',height:'32px',display:'block'}"/>
        </div>
        <div class="desc">
          <div :class="['number',`index-3`]">{{general_list[3].count}}</div>
          <div class="text">{{general_list[3].name}}</div>
        </div>
      </div>
      <!-- <div class="item" v-for="(item,index) in general_list" :key="item.number">
        <div :class="['icon',`index-${index}`]">
          <img v-if="index==0" src="@/assets/img/department.png" :style="{width:'30px',height:'30px',display:'block'}"/>
          <img v-if="index==1" src="@/assets/img/reseacher.png" :style="{width:'24px',height:'32px',display:'block'}"/>
          <img v-if="index==2" src="@/assets/img/smo.png" :style="{width:'30px',height:'30px',display:'block'}"/>
          <img v-if="index==3" src="@/assets/img/crc.png" :style="{width:'28px',height:'32px',display:'block'}"/>
        </div>
        <div class="desc">
          <div :class="['number',`index-${index}`]">{{item.count}}</div>
          <div class="text">{{item.name}}</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { get_general_num } from "@/api/data_manage";
import { get_role } from '../../api/evaluate_manage';
export default {
  data() {
    return {
      general_list: [
        { count: "", name: "机构总数"},
        { count: "", name: "研究者总数"},
        { count: "", name: "SMO公司总数"},
        { count: "", name: "CRC总数"}
      ],
      userInfo:{}
    };
  },
  mounted() {
    get_role().then(res => {
      this.userInfo = res.data;
    });
    get_general_num().then(res => {
      this.general_list[0].count = res.data.inst;
      this.general_list[1].count = res.data.researcher;
      this.general_list[2].count = res.data.smo;
      this.general_list[3].count = res.data.crc;
    });
  }
};
</script>

<style lang="stylus" scoped>
#part1 {
  min-height: 187px;
  overflow hidden
}

.item {
  float: left;
  margin: 30px 0;
  margin-right: 60px;

  .icon {
    width: 86px;
    height: 78px;
    float: left;
    display flex
    justify-content center;
    align-items center

    &.index-0 {
      background: #76ABFF;
    }

    &.index-1 {
      background: #FF8773;
    }

    &.index-2 {
      background: #FFB740;
    }

    &.index-3 {
      background: #70D7DE;
    }
  }

  .desc {
    width: 112px;
    height: 78px;
    float: right;
    text-align: center;
    background: #F5F5F5;
    padding-top: 8px;

    .number {
      font-size: 26px;
      font-family: PingFangSC;
      font-weight: 400;
      line-height: 34px;

      &.index-0 {
        color: #76ABFF;
      }

      &.index-1 {
        color: #FF8773;
      }

      &.index-2 {
        color: #FFB740;
      }

      &.index-3 {
        color: #70D7DE;
      }
    }

    .text {
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      line-height: 22px;
    }
  }
}
</style>>