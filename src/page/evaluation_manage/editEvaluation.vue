<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <div class="title">基本信息</div>
      <a-form-item
        class="formItem_select"
        label="CRC姓名"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 6 }"
      >
        <a-select
          :disabled="disable"
          v-decorator="[
          'crc_id',
          {rules: [{ required: true, message: '请选择CRC姓名!' }]}
        ]"
          showSearch
          :filterOption="filterOption"
          placeholder="请选择CRC姓名"
          @change="crc_change"
        >
          <a-select-option v-for="item in crc_list" :key="item.uid" :value="item.uid">{{item.uname}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        class="formItem_select"
        label="SMO公司"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 6 }"
      >
        <a-input v-show="false" disabled v-decorator="['smo_id']" placeholder="请选择SMO公司"></a-input>
        <a-input disabled v-decorator="['smo_name']" placeholder="请选择SMO公司"></a-input>
      </a-form-item>
      <a-form-item
        class="formItem_select"
        label="项目简称"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 6 }"
        showSearch
        :filterOption="filterOption"
      >
        <a-select
          :disabled="disable"
          v-decorator="[
          'item_id',
          {rules: [{ required: true, message: '请选择SMO公司!' }]}
        ]"
          placeholder="请选择项目简称"
        >
          <a-select-option
            v-for="item in project_list"
            :key="item.id"
            :value="item.id"
          >{{item.shortname}}</a-select-option>
        </a-select>
      </a-form-item>
      <div class="title">评价内容</div>
      <a-form-item class="formItem" label="评价类型">
        <a-radio-group
          :disabled="disable"
          v-decorator="[
        'type',
        {initialValue:1,rules: [{ required: true, message: '请选择评价类型!' }]}]"
        >
          <a-radio v-for="item in type_list" :key="item.id" :value="item.id">{{item.name}}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item class="formItem" label="1.工作态度和责任心">
        <a-input-number
          :min="1"
          :max="5"
          :step="0.1"
          :style="{width:'60%'}"
          placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
          :disabled="disable"
          v-decorator="[
          'evaluate1',
          {rules: [{ required: true, message: '请评价工作态度和责任心!' }]}
        ]"
        />
      </a-form-item>
      <a-form-item class="formItem" label="2.临床试验过程中的沟通、协调、和配合能力">
        <a-input-number
          :min="1"
          :max="5"
          :step="0.1"
          :style="{width:'60%'}"
          placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
          :disabled="disable"
          v-decorator="[
          'evaluate2',
          {rules: [{ required: true, message: '请评价临床试验过程中的沟通、协调、和配合能力!' }]}
        ]"
        />
      </a-form-item>
      <a-form-item class="formItem" label="3.GCP、伦理原则的掌握和运用（例如，预防和识别试验的风险">
        <a-input-number
          :min="1"
          :max="5"
          :step="0.1"
          :style="{width:'60%'}"
          placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
          :disabled="disable"
          v-decorator="[
          'evaluate3',
          {rules: [{ required: true, message: '请评价GCP、伦理原则的掌握和运用!' }]}
        ]"
        />
      </a-form-item>
      <!-- 研究者评价234,机构可以评价全部 -->
      <template v-if="userInfo.id!=3">
        <a-form-item class="formItem" label="4.试验方案的熟悉程度和执行情况（例如，平均单个病例发生方案偏离数量）">
          <a-input-number
            :min="1"
            :max="5"
            :step="0.1"
            :style="{width:'60%'}"
            placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
            :disabled="disable"
            v-decorator="[
          'evaluate4',
          {rules: [{ required: true, message: '请评价试验方案的熟悉程度和执行情况!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item class="formItem" label="5.文档和数据管理（例如，EDC录入和query 解答）">
          <a-input-number
            :min="1"
            :max="5"
            :step="0.1"
            :style="{width:'60%'}"
            placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
            :disabled="disable"
            v-decorator="[
          'evaluate5',
          {rules: [{ required: true, message: '请评价文档和数据管理!' }]}
        ]"
          />
        </a-form-item>
        <a-form-item class="formItem" label="6.考评评语">
          <a-textarea
            :disabled="disable"
            v-decorator="[
          'desc',
          {rules: [{ required: false, message: '请填写考评评语!' }]}
        ]"
            placeholder="详细内容..."
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item>
        <!-- 证书 -->
        <template v-if="certificate!=null&&certificate!=''">
          <div class="title">证书</div>
          <div class="diploma">
            <img :src="certificate" alt :style="{width:'108px',height:'150px'}" />
            <a-button class="diplomaBtn" type="primary" @click="showModal">查看证书</a-button>
          </div>
        </template>
        <!-- 已申诉有申诉记录 -->
        <!-- status==2 已反馈=》3已申诉 -->
        <template v-if="status>=2">
          <div class="title">申诉记录</div>
          <div class="feedback" :style="{padding:'0 30px'}">
            <a-list itemLayout="horizontal" :dataSource="explain_list" v-if="status>=3">
              <div slot="loadMore"></div>
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta :description="item.explain_desc">
                  <span slot="title">{{item.explain_date|parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}----{{item.smo}}</span>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <div v-else>暂无申诉记录</div>
            <!-- smo无权操作 -->
            <div :style="{margin:'30px 0'}">
              <template v-if="userInfo.id!=4&&status>=3">
                <a-button
                  :disabled="status>=4"
                  :style="{marginRight:'40px'}"
                  class="diplomaBtn"
                  @click="()=>rejectExplain()"
                >拒绝申诉</a-button>
                <a-button
                  :disabled="status>=4"
                  :style="{marginRight:'40px'}"
                  class="diplomaBtn"
                  type="primary"
                  @click="()=>isAggreExplain(1)"
                >同意申诉</a-button>
              </template>
              <!--userInfo.id 1管理员，2研究中心，3研究者，4smo -->
              <template v-if="userInfo.id==4||userInfo.id==1">
                <!-- status=>4,5同意申诉，拒绝申诉 -->
                <a-button
                  v-if="status<3"
                  :disabled="status==5||status==4"
                  :style="{marginRight:'40px'}"
                  class="diplomaBtn"
                  type="primary"
                  @click="explain"
                >发起申诉</a-button>
              </template>
            </div>
          </div>
        </template>
        <!--  -->
        <div class="title">评价记录</div>
        <div class="table">
          <a-table :columns="columns" :dataSource="list" rowKey="id" :pagination="false">
            <!-- 时间格式化 -->
            <template
              slot="add_time"
              slot-scope="text"
              type="link"
            >{{text|parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
          </a-table>
        </div>
      </template>
      <a-form-item class="formItem" :style="{testAlign:'center'}">
        <a-row type="flex" justify="center">
          <a-col :span="4" :style="{textAlign:'center'}">
            <a-button @click="goBack">返回</a-button>
          </a-col>
          <a-col :span="4" :style="{textAlign:'center'}" v-if="userInfo.id==1">
            <a-button @click="delItem">删除</a-button>
          </a-col>
          <a-col :span="4" :style="{textAlign:'center'}" v-if="status==1&&userInfo.id!=4&&userInfo.id!=3">
            <a-button @click="feedback">反馈</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <!-- 查看证书弹窗 -->
    <a-modal
      title="证书"
      :visible="visible"
      :footer="null"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <img :src="certificate" alt :style="{width:'100%',height:'auto'}" />
    </a-modal>
    <!-- 申诉理由弹窗 -->
    <a-modal
      title="申诉"
      :visible="explain_visible"
      @ok="handleOk"
      okText="确认"
      cancelText="取消"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <a-form-item label="申诉理由" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
        <a-input v-model="explain_desc" placeholder="请输入申诉理由"></a-input>
      </a-form-item>
    </a-modal>
    <!-- 拒绝申诉理由弹窗 -->
    <a-modal
      title="拒绝申诉"
      :visible="reject_explain_visible"
      @ok="handleRejectOk"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <a-form-item label="拒绝申诉理由" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-input v-model="reject_explain_desc" placeholder="请输入拒绝申诉理由"></a-input>
      </a-form-item>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "添加时间",
    dataIndex: "add_time",
    width: 150,
    scopedSlots: { customRender: "add_time" }
  },
  { title: "评价研究中心", dataIndex: "inst_name",width: 150},
  { title: "科室", dataIndex: "dept_name",width: 150},
  { title: "评价研究者", dataIndex: "user_name",width: 150},
  { title: "描述", dataIndex: "desc" }
];
import {
  get_smo_list,
  get_crc_list,
  get_project_list,
  get_type_list,
  add_evaluate,
  evaluate_desc,
  add_explain,
  is_agree_explain,
  feedback,
  get_role,
  evaluate_del
} from "@/api/evaluate_manage";
export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      disable: false,
      //
      visible: false,
      explain_visible: false,
      reject_explain_visible:false,
      //
      smo_list: [],
      crc_list: [],
      project_list: [],
      type_list: [],
      list: [],
      certificate: "",
      columns,
      form: this.$form.createForm(this),
      //
      status: "",
      userInfo: {},
      // 申诉
      explain_desc: "",
      reject_explain_desc:"",
      explain_list: []
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      add_explain({
        id: this.id,
        desc: this.explain_desc
      }).then(res => {
        if (res.err_no == 200) {
          this.$message.success("发送申诉成功");
          this.status = 3;
          this.explain_desc = "";
          this.explain_visible = false;
          this.self_evaluate_desc();
          return;
        }
        this.$message.error(`发送失败：${res.message}`);
      });
    },
    handleRejectOk(){
      is_agree_explain({
        id: this.id,
        status: 2,
        desc:this.reject_explain_desc
      }).then(res => {
        if (res.err_no == 200) {
          this.$message.success("拒绝申诉成功");
          this.status = 5;
          this.reject_explain_desc = "";
          this.reject_explain_visible = false;
          this.self_evaluate_desc();
          return;
        }
        this.$message.error(`发送失败：${res.message}`);
      }); 
    },
    handleCancel(e) {
      this.visible = false;
      this.explain_visible = false;
      this.explain_desc = "";
      this.reject_explain_visible = false;
      this.reject_explain_desc = ""
    },
    crc_change(value) {
      let item = this.crc_list.find(item => {
        return item.uid === value;
      });
      console.log(item);
      this.form.setFieldsValue({
        smo_id: item.smo_id,
        smo_name: item.smo_name,
        item_id: undefined
      });
      get_project_list({ crc_id: value }).then(res => {
        this.project_list = res.data;
      });
    },
    explain() {
      this.explain_visible = true;
    },
    rejectExplain() {
      this.reject_explain_visible = true;
    },
    feedback() {
      this.$confirm({
        title: "提示：",
        content: `确认反馈？`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return feedback({ id: this.id }).then(res => {
            if (res.err_no == 200) {
              this.$message.success("反馈成功");
              this.status == 2;
              return;
            }
            this.$message.error(`反馈失败${res.message}`);
          });
        },
        onCancel() {}
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          add_evaluate(values).then(res => {
            if (res.err_no == 200) {
              this.$message.success("提交成功");
              this.self_evaluate_desc();
              return;
            }
            this.$message.error(`提交失败:${res.message}`);
          });
        }
      });
    },
    self_evaluate_desc() {
      evaluate_desc({ id: this.id }).then(res => {
        console.log(res);
        this.form.getFieldDecorator("id", {
          initialValue: this.id,
          preserve: true
        });
        this.form.setFieldsValue({
          smo_id: res.data.desc.smo_id,
          smo_name: res.data.desc.smo_name,
          crc_id: res.data.desc.crc_id,
          item_id: res.data.desc.items_id,
          type: res.data.desc.type,
          evaluate1: res.data.desc.evaluate1,
          evaluate2: res.data.desc.evaluate2,
          evaluate3: res.data.desc.evaluate3,
          evaluate4: res.data.desc.evaluate4,
          evaluate5: res.data.desc.evaluate5,
          desc: res.data.desc.desc
        });
        this.status = res.data.desc.status;
        this.explain_list = res.data.desc.explain;
        this.list = res.data.crc_pj;
        this.certificate = res.data.desc.file_address;
        get_crc_list({ smo_id: res.data.desc.smo_id }).then(res => {
          this.crc_list = res.data;
        });
        get_project_list({ crc_id: res.data.desc.crc_id }).then(res => {
          this.project_list = res.data;
        });
      });
    },
    isAggreExplain(option) {
      this.$confirm({
        title: "提示：",
        content: `确认${option == 1 ? "同意" : "拒绝"}申诉？`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return is_agree_explain({
            id: this.id,
            status: option
          }).then(res => {
            if (res.err_no == 200) {
              this.$message.success(`${res.message}`);
              if (option == 1) {
                this.status = 4;
                this.$router.replace({path: `/index/editEvaluation/${this.id}`})
              } else {
                this.status = 5;
              }
              return;
            }
            this.$message.error(`失败：${res.message}`);
          });
        },
        onCancel() {}
      });
    },
    delItem() {
      this.$confirm({
        title: "提示：",
        content: `确认删除该评价？`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return evaluate_del({
            id: this.id
          }).then(res => {
            if (res.err_no == 200) {
              this.$message.success(`${res.message}`);
              return;
            }
            this.$message.error(`失败：${res.message}`);
          });
        },
        onCancel() {
          console.log("取消删除");
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    get_crc_list().then(res => {
      this.crc_list = res.data;
    });
    // get_smo_list().then(res => {
    //   this.smo_list = res.data;
    // });
    get_type_list().then(res => {
      this.type_list = res.data;
    });
    get_role().then(res => {
      this.userInfo = res.data;
    });
    if (this.id) {
      this.disable = true;
      this.self_evaluate_desc();
    }
  },
  watch: {
    id: function(val, oldVal) {
      get_crc_list().then(res => {
        this.crc_list = res.data;
      });
      // get_smo_list().then(res => {
      //   this.smo_list = res.data;
      // });
      get_type_list().then(res => {
        this.type_list = res.data;
      });
      get_role().then(res => {
        this.userInfo = res.data;
      });
      if (this.id) {
        this.disable = true;
        this.self_evaluate_desc();
      }
    }
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
  background: rgba(250, 250, 250, 1);
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

.formItem_select {
  padding-left: 32px;
}

.formItem /deep/ {
  padding-left: 32px;

  label {
    width: 142px;
    font-size: 16px;
    font-family: PingFangSC;
    font-weight: 600;
    color: rgba(37, 37, 37, 1);
    line-height: 58px;
    margin-bottom: 8px;
  }

  .ant-form-item-control-wrapper {
    textarea {
      width: 920px;
      border: 1px solid rgba(156, 207, 255, 1);
      background: rgba(247, 251, 255, 1);
    }
  }
}

.diploma {
  padding-left: 32px;
  padding-top: 24px;
  padding-bottom: 60px;
  display: flex;
  align-items: flex-end;

  img {
    display: block;
    margin-right: 50px;
  }

  .diplomaBtn {
    // align-self bottom
  }
}

.table {
  min-height: 220px;
  padding: 0 32px;
}
</style>