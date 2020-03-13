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
        <div class="infoItem" @click="download">
          <div class="infoTitle">个人附件：</div>
          <div class="infoDesc">{{info.file_name}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">工作经历：</div>
          <div class="infoDesc" v-for="item in info.work" :key="item">{{item}}</div>
        </div>
      </div>
    </div>
    <div class="title">项目信息</div>
    <div class="content infoContent">
      <div class="crcinfo">
        <div class="infoItem">
          <div class="infoTitle">项目简称*：</div>
          <div class="infoDesc">{{items.shortname}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">试验类型*：</div>
          <div class="infoDesc">{{items.test_name}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">试验启动时间*：</div>
          <div class="infoDesc">{{items.start_time|parseTime('{y}-{m}-{d}')}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">研究中心*：</div>
          <div class="infoDesc">{{items.inst_name}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">研究者：</div>
          <div class="infoDesc">
            <div class="infoDescItem" v-for="(item,index) in items.pi" :key="index">{{item.uname}}</div>
          </div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">CRC姓名：</div>
          <div class="infoDesc">
            <div class="infoDescItem" v-for="(item,index) in items.crc" :key="index">{{item.uname}}</div>
          </div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">备注：</div>
          <div class="infoDesc">{{items.desc}}</div>
        </div>
      </div>
      <div class="crcinfo">
        <div class="infoItem">
          <div class="infoTitle">项目编号：</div>
          <div class="infoDesc">{{items.item_number}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">试验分期*：</div>
          <div class="infoDesc">{{items.stage_name}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">试验结束时间：</div>
          <div class="infoDesc">{{items.end_time|parseTime('{y}-{m}-{d}')}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">适应症*：</div>
          <div class="infoDesc">{{items.indication}}</div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">科室：</div>
          <div class="infoDesc">
            <div class="infoDescItem" v-for="(item,index) in items.pi" :key="index">{{item.dept}}</div>
          </div>
        </div>
        <div class="infoItem">
          <div class="infoTitle">授权起止时间：</div>
          <div class="infoDesc">
            <div class="infoDescItem" v-for="(item,index) in items.crc" :key="index">{{item.time}}</div>
          </div>
        </div>
      </div>
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
    <div class="title">项目评价</div>
    <div class="content">
      <a-table
        :pagination="false"
        :columns="columns2"
        :dataSource="list2"
        :rowKey="(record,index)=> index"
        :scroll="{ x: 2000}"
        bordered
      >
        <template slot="certificate" slot-scope="text, record, index">
          <a
            v-if="record.is_zhengshu"
            :style="{color:'#1890FF'}"
            @click.stop="() => showCertificate(text,record,index)"
          >查看</a>
          <!-- is_finish==1 未生成 || is_zhengshu==1 有-->
          <a
            v-if="!record.is_zhengshu&&record.is_finish==1&&role.id!=3"
            :style="{color:'#1890FF'}"
            @click.stop="() => creatCertificate(text,record,index)"
          >生成完成证书</a>
        </template>
      </a-table>
    </div>
    <!-- 弹窗 -->
    <a-modal
      title="证书"
      :visible="visible"
      @ok="handleOk"
      :footer="null"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <img :src="file_address" alt :style="{width:'100%',height:'auto'}" />
    </a-modal>
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
  { key: "0", title: "评价人", dataIndex: "add_uname", width: 200 },
  { key: "2", title: "工作态度和责任心", dataIndex: "evaluate1", width: 200 },
  {
    key: "3",
    title: "临床研究过程中的沟通、协调和配合能力",
    dataIndex: "evaluate2",
    width: 200
  },
  {
    key: "4",
    title: "GCP、伦理原则的掌握和运用",
    dataIndex: "evaluate3",
    width: 200
  },
  {
    key: "5",
    title: "试验方案的熟悉程度和执行情况",
    dataIndex: "evaluate4",
    width: 200
  },
  { key: "6", title: "文档和数据管理", dataIndex: "evaluate5", width: 200 },
  { key: "1", title: "考评评语", dataIndex: "desc", width: 200 },
  { key: "7", title: "评价类型", dataIndex: "type_name", width: 200 },
  { key: "8", title: "评价时间", dataIndex: "add_time", width: 200 },
  {
    key: "9",
    title: "证书",
    dataIndex: "file_address",
    width: 200,
    scopedSlots: { customRender: "certificate" }
  }
];
import { crc_pingjia_info, create_finish_certificate } from "@/api/crc_manage";
import { mapGetters } from 'vuex';
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      info: {}, //综合信息
      items: {}, //项目信息
      columns1,
      columns2,
      list1: [],
      list2: [],
      visible: false,
      file_address: ""
    };
  },
  computed:{
    ...mapGetters(["role"])
  },
  methods: {
    handleOk(e) {
      this.visible = false;
    },
    handleCancel(e) {
      this.visible = false;
    },
    showCertificate(text, item, index) {
      this.file_address = item.file_address;
      this.visible = true;
    },
    creatCertificate(text, item, index) {
      this.$confirm({
        title: "确认生成证书?",
        content: "完成证书只能生成一次，确定生成？",
        onOk:()=>{
          return create_finish_certificate({ id: item.id }).then(res => {
            if (res.err_no == 200) {
              console.log(124)
              this.$message.success("生成成功");
              item.file_address = res.data;
              item.is_finish = 0
              item.is_zhengshu = 1
              return;
            }
            this.$message.error(`生成失败：${res.message}`);
          })
        },
        onCancel:()=>{}
      });
    },
    download() {
      this.$confirm({
        title: "提示",
        content: "是否确定下载？",
        okText: "确认",
        cancelText: "取消",
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
    crc_pingjia_info({ uid: this.id, items_id: this.$route.query.items }).then(
      res => {
        this.info = res.data;
        this.items = res.data.items;
        this.list1[0] = (() => {
          for (let key in res.data.zonghe) {
            res.data.zonghe[key] =
              res.data.zonghe[key] == null ? 0 : res.data.zonghe[key];
          }
          return res.data.zonghe;
        })();
        this.list2 = res.data.list;
      }
    );
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