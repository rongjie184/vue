<template>
  <div class="content">
    <h1>项目信息</h1>
    <a-form>
      <a-row>
        <a-form-item label="项目简称*:">{{item.shortname}}</a-form-item>
        <a-form-item label="项目编号:">{{item.item_number}}</a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="试验类型*:">{{item.test_name}} {{item.field_id}}</a-form-item>
        <a-form-item label="试验分期*:">{{item.stage_name}}</a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="试验启动时间*:">{{item.start_time}}</a-form-item>
        <a-form-item label="试验结束时间:">{{item.end_time}}</a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="研究中心*:">{{item.inst_name}}</a-form-item>
        <a-form-item label="适应症*:">{{item.indication}}</a-form-item>
      </a-row>
      <a-row v-for="n in instList" :key="n.id">
        <a-form-item label="研究者:">{{n.uname}}</a-form-item>
        <a-form-item label="科室:">{{n.deptname}}</a-form-item>
      </a-row>
      <a-row v-for="(n,i) in crcList" :key="i">
        <a-form-item label="CRC姓名:">{{n.uname}}</a-form-item>
        <a-form-item label="授权起止时间:" v-if="n.start_time">{{n.start_time}} ~ {{n.end_time||'至今'}}</a-form-item>
      </a-row>
      <a-form-item label="备注:">{{item.desc}}</a-form-item>
      <a-row :gutter="24">
        <a-col offset="8">
          <a-button style="margin:0 auto" @click="back">返回</a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { getItemInfo } from "@/api/default";
export default {
  name: "addProject",
  data() {
    return {
      item: {},
      instList: [],
      crcList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getItemInfo({ id: this.$route.query.id }).then(res => {
        this.item = res.data.info;
        if (this.item.field_id === "1") {
          this.item.field_id = "肿瘤临床试验";
        } else if (this.item.field_id === "2") {
          this.item.field_id = "非肿瘤临床试验";
        } else {
          this.item.field_id = "";
        }
        this.instList = res.data.researcher_list;
        this.crcList = res.data.crc_list;
      });
    },
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
<style lang="stylus" scoped>
.content {
  padding: 30px;
}

h1 {
  border-left: 3px solid #1890FF;
  padding-left: 10px;
  color: #252525;
  font-weight: 700;
  font-size: 16px;
}

.ant-row {
  display: flex;
}

.ant-row .ant-form-item {
  width: 40%;
}
</style>