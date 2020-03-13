<template>
  <div class="home">
    <p class="tit">
      公告栏
      <a-icon type="sound" />

      <a-button type="primary"  :disabled="!placing" @click="allRemind" style="float:right;margin:12px;">标记全部已读</a-button>
    </p>
    <a-list class="demo-loadmore-list" itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <span style="font-size:12px">{{item.is_read}}</span>
        <a v-if="'已读'!=item.is_read" class="detail" @click="detail(item)">标记已读</a>
        <a v-if="'已读'==item.is_read" class="sty" ></a>
        <a-list-item-meta>
          <p slot="title">【{{item.con}}】</p>
          <p class="time" slot="title">{{item.d}}</p>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { remindlist, remindAll,remindRead } from "@/api/default";
export default {
  inject: ["reload"],
  name: "Welcome",
  
  data() {
    return {
      data: [],
      placing:!1,     
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let data;
      let placing;
      remindlist().then(res => {
        if (res.data.w_total > 0) placing = res.data.w_total;
        if (res.data.wj_list.length > 0) data = res.data.wj_list;
        if (res.data.nd_list.length > 0) data = res.data.nd_list;
        if (res.data.nd_list.length > 0&&res.data.wj_list.length > 0) data = res.data.nd_list.concat(res.data.wj_list);
        this.data = data;
        this.placing = placing;
      });
    },
    allRemind() {
      remindAll({ idarr: this.data }).then(res => {
        if (res.err_no === 200) {
          this.$message.success(res.message);
          this.reload()
          
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    detail(n) {
      remindRead({id:n.id,table:n.table})
     /* if (n.table === "qsq") {
        this.$router.push({
          path:'/index/psqAdd',
          query:{
            id:n.id
          }
        })
      } else {
        this.$router.push({
          path: "/index/addEvaluation",
          query:{
            id:n.id
          }
        });
      }*/
    }
  }
};
</script>

<style lang="stylus" scoped>
.tit {
  height: 56px;
  line-height: 56px;
  padding-left: 32px;
  font-weight: 700;
  background-color: rgba(#64B4FF, 0.2);
  color: #1890FF;
}

.ant-list-item {
  height: 106px;
}

.detail {
  color: #1890FF;
  font-size: 12px;
  padding: 0 110px 0 20px;
}

.ant-list-item-meta {
  flex: inherit;
  width: 70%;

  p {
    line-height: 20px;
  }
}

.time {
  padding-left: 8px;
  color: #999999;
  font-size: 12px;
  padding-top: 10px;
}

.ant-list-split .ant-list-item {
  border-bottom: 1px dashed #e8e8e8;
  margin: 10px 20px;
  align-items: normal;
  padding-top: 20px;
  // padding-bottom:30px;
}
</style>
