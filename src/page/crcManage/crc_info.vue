<template>
  <div class="crcInfoPage">
    <div class="title">人员信息</div>
    <div class="content infoContent">
      <div class="crcinfo">
        <div class="infoItem">
          <div class="infoTitle">姓名：</div>
          <div class="infoDesc">{{info.uname}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">从业开始时间：</div>
          <div class="infoDesc">{{info.work_time|parseTime('{y}-{m}-{d}')}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">性别：</div>
          <div class="infoDesc">{{info.sex}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">手机号：</div>
          <div class="infoDesc">{{info.phone}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">身份证号：</div>
          <div class="infoDesc">{{info.pidnum}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">个人附件：</div>
          <div class="infoDesc" @click="download">{{info.file_name}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">工作经历：</div>
          <div class="infoDesc">
            <div class="infoDescItem" v-for="item in info.work" :key="item">{{item}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="diploma">
        <div class="imgCont">
          <div class="imgTitle">证书</div>
          <img
            :src="info.file_address"
            alt="证书"
            :style="{width:'120px',height:'163px',border:'1px solid #ddd'}"
          />
        </div>
        <a-button class="diplomaBtn" type="primary" @click="showModal">查看证书</a-button>
      </div>-->
    </div>
    <div class="title">综合评价</div>
    <div class="content">
      <a-table
        :pagination="false"
        :columns="columns1"
        :dataSource="list1"
        :rowKey="(record,index)=> index"
        :scroll="{ x: 1200}"
        bordered
      ></a-table>
    </div>
    <!--  -->
    <div class="title">项目评价</div>
    <div class="content">
      <a-table
        :pagination="false"
        :columns="columns2"
        :dataSource="list2"
        :rowKey="(record,index)=> index"
        :scroll="{ x: 1080}"
        bordered
      >
        <template slot="action" slot-scope="text, record, index">
          <a :style="{color:'#1890FF'}" @click.stop="() => to_info(text,record,index)">查看详情</a>
        </template>
      </a-table>
    </div>
    <!--  -->
    <div class="title">关联项目</div>
    <div class="content">
      <a-table
        :pagination="false"
        :columns="columns3"
        :dataSource="list3"
        :rowKey="(record,index)=> index"
        :scroll="{ x: 1300}"
        bordered
      >
        <template slot="action" slot-scope="text, record, index">
          <a :style="{color:'#1890FF'}" @click.stop="() => to_projectInfo(text,record,index)">查看详情</a>
        </template>
      </a-table>
    </div>
    <!-- 弹窗 -->
    <!-- <a-modal
      title="证书"
      :visible="visible"
      @ok="handleOk"
      :footer="null"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <img :src="info.file_address" alt :style="{width:'100%',height:'auto'}" />
    </a-modal>-->
  </div>
</template>

<script>
const columns1 = [
  {
    key: "evaluate1",
    title: "工作态度和责任心",
    dataIndex: "evaluate1",
    width: 200
  },
  {
    key: "evaluate2",
    title: "临床研究过程中的沟通、协调和配合能力",
    dataIndex: "evaluate2",
    width: 200
  },
  {
    key: "evaluate3",
    title: "GCP、伦理原则的掌握和运用（例如，预防和识别试验的风险",
    dataIndex: "evaluate3",
    width: 200
  },
  {
    key: "evaluate4",
    title: "试验方案的熟悉程度和执行情况（例如，平均单个病例发生方案偏离数量）",
    dataIndex: "evaluate4",
    width: 200
  },
  {
    key: "evaluate5",
    title: "文档和数据管理（例如，EDC录入和query 解答",
    dataIndex: "evaluate5",
    width: 200
  },
  { key: "num", title: "证书数量", dataIndex: "num", width: 200 }
];
const columns2 = [
  {
    key: "1",
    title: "项目简称",
    dataIndex: "items_name",
    width: 200
  },
  { key: "2", title: "科室", dataIndex: "dept", width: 140 },
  { key: "3", title: "研究者", dataIndex: "pi", width: 140 },
  { key: "4", title: "研究中心", dataIndex: "inst_name", width: 200 },
  { key: "5", title: "总分", dataIndex: "total", width: 140 },
  { key: "6", title: "证书数量", dataIndex: "num", width: 140 },
  {
    key: "5",
    title: "操作",
    width: 120,
    scopedSlots: { customRender: "action" }
  }
];
const columns3 = [
  {
    key: "1",
    title: "项目简称",
    dataIndex: "name",
    width: 200
  },
  { key: "2", title: "研究中心", dataIndex: "inst_name", width: 200 },
  { key: "3", title: "科室", dataIndex: "dept", width: 140 },
  { key: "4", title: "研究者", dataIndex: "pi", width: 140 },
  { key: "5", title: "试验类型", dataIndex: "test_name", width: 100 },
  { key: "6", title: "试验分期", dataIndex: "stage_name", width: 200 },
  { key: "7", title: "启动时间", dataIndex: "start_time", width: 200 },
  {
    key: "8",
    title: "操作",
    width: 120,
    scopedSlots: { customRender: "action" }
  }
];
import { crc_info } from "@/api/crc_manage";
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      info: {},
      columns1,
      columns2,
      columns3,
      list1: [],
      list2: [],
      list3:[],
      visible: false
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    handleCancel(e) {
      this.visible = false;
    },
    to_info(text, item, index) {
      this.$router.push({ path: `/index/crcEvaluateDesc/${this.info.uid}?items=${item.items_id}`});
    },
    to_projectInfo(text, item, index) {
      this.$router.push({ path: `/index/itemDetail/?id=${item.id}`});
    },
    download() {
      this.$confirm({
        title: "提示",
        content: "是否确定下载？",
        onOk: () => {
          let a = document.createElement('a')
          a.href ="/" + this.info.file_address
          a.click();
        },
        onCancel() {}
      });
    }
  },
  mounted() {
    crc_info({ uid: this.id }).then(res => {
      this.info = res.data;
      this.list1[0] = (() => {
        for (let key in res.data.zonghe) {
          res.data.zonghe[key] =
            res.data.zonghe[key] == null ? 0 : res.data.zonghe[key];
        }
        return res.data.zonghe;
      })();
      this.list2 = res.data.list;
      this.list3 = res.data.itlist||[]
    });
  }
};
</script>

<style lang="stylus" scoped>
.title {
  height: 54px;
  line-height: 54px;
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 500;
  color: #5a5a5a;
  padding-left: 45px;
  position: relative;
  margin-bottom: 18px;

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

.content {
  padding: 0 30px 30px;
}

.infoContent {
  display: flex;

  .crcinfo {
    width: 50%;

    .infoItem {
      display: flex;
      line-height: 60px;
    }

    .infoTitle {
      color: #666666;
    }

    .infoDesc {
      color: #252525;
      display: flex;
      flex-direction: column;
      align-items: center;
    }


    
  }

  .diploma {
    width: 50%;
    padding-left: 32px;
    padding-top: 24px;
    padding-bottom: 130px;
    display: flex;
    align-items: flex-end;

    .imgCont {
      .imgTitle {
        line-height: 40px;
        color: #000000;
        font-size: 16px;
      }
    }

    img {
      display: block;
      margin-right: 50px;
    }

    .diplomaBtn {
      // align-self bottom
    }
  }
}
</style>