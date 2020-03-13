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
      <!--  -->
      <a-form-item
        class="formItem_select"
        label="SMO公司"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 6 }"
      >
        <a-input v-show="false" disabled v-decorator="['smo_id']" placeholder="请选择SMO公司"></a-input>
        <a-input disabled v-decorator="['smo_name']" placeholder="请选择SMO公司"></a-input>
      </a-form-item>
      <!--  -->
      <a-form-item
        class="formItem_select"
        label="项目简称"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 6 }"
      >
        <a-select
          :disabled="disable"
          v-decorator="[
          'item_id',
          {rules: [{ required: true, message: '请选择SMO公司!' }]}
        ]"
          placeholder="请选择项目简称"
          showSearch
          :filterOption="filterOption"
        >
          <a-select-option
            v-for="item in project_list"
            :key="item.id"
            :value="item.id"
          >{{item.shortname}}</a-select-option>
        </a-select>
      </a-form-item>
      <!--  -->
      <div class="title">评价内容</div>
      <!--  -->
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
      <!--  -->
      <!-- 输入评分 -->
      <a-form-item class="formItem" label="1.工作态度和责任心（研究者填写）">
        <a-input
          :min="1"
          :max="5"
          :step="0.1"
          :style="{width:'60%'}"
          placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
          :disabled="disable"
          v-decorator="[
          'evaluate1',
          {rules: [{ required: isRequire, message: '请评价工作态度和责任心!(必须为0到5.0之间的数字，精确到小数点后1位)',pattern:'((^([0-4]{1})(\\.(\\d){1})$)|(^([5]{1})(\\.[0]{1})$))'}]}
        ]"
        />
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem" label="2.临床试验过程中的沟通、协调、和配合能力（研究者填写）">
        <a-input
          :min="1"
          :max="5"
          :step="0.1"
          :style="{width:'60%'}"
          placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
          :disabled="disable"
          v-decorator="[
          'evaluate2',
          {rules: [{ required: isRequire, message: '请评价临床试验过程中的沟通、协调、和配合能力!(必须为0到5.0之间的数字，精确到小数点后1位)',pattern:'((^([0-4]{1})(\\.(\\d){1})$)|(^([5]{1})(\\.[0]{1})$))' }]}
        ]"
        />
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem" label="3.GCP、伦理原则的掌握和运用（例如，预防和识别试验的风险）（研究者填写）">
        <a-input
          :min="1"
          :max="5"
          :step="0.1"
          :style="{width:'60%'}"
          placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
          :disabled="disable"
          v-decorator="[
          'evaluate3',
          {rules: [{ required: isRequire, message: '请评价GCP、伦理原则的掌握和运用!(必须为0到5.0之间的数字，精确到小数点后1位)',pattern:'((^([0-4]{1})(\\.(\\d){1})$)|(^([5]{1})(\\.[0]{1})$))' }]}
        ]"
        />
      </a-form-item>
      <!--  -->
      <!-- 研究者评价234,机构可以评价全部 -->
      <template v-if="userInfo.id!=3">
        <a-form-item class="formItem" label="4.试验方案的熟悉程度和执行情况（例如，平均单个病例发生方案偏离数量）（研究机构填写）">
          <a-input
            :min="1"
            :max="5"
            :step="0.1"
            :style="{width:'60%'}"
            placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
            :disabled="disable"
            v-decorator="[
          'evaluate4',
          {rules: [{ required: true, message: '请评价试验方案的熟悉程度和执行情况!(必须为0到5.0之间的数字，精确到小数点后1位)',pattern:'((^([0-4]{1})(\\.(\\d){1})$)|(^([5]{1})(\\.[0]{1})$))' }]}
        ]"
          />
        </a-form-item>
        <!--  -->
        <a-form-item class="formItem" label="5.文档和数据管理（例如，EDC录入和query 解答）（研究机构填写）">
          <a-input
            :min="1"
            :max="5"
            :step="0.1"
            :style="{width:'60%'}"
            placeholder="请输入0到5.0之间的数字，精确到小数点后1位"
            :disabled="disable"
            v-decorator="[
          'evaluate5',
          {rules: [{ required: true, message: '请评价文档和数据管理!(必须为0到5.0之间的数字，精确到小数点后1位)',pattern:'((^([0-4]{1})(\\.(\\d){1})$)|(^([5]{1})(\\.[0]{1})$))' }]}
        ]"
          />
        </a-form-item>
        <!--  -->
        <a-form-item class="formItem" label="6.考评评语（研究机构填写）">
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
      </template>
      <!-- 提交 按钮 -->
      <a-form-item class="formItem" :style="{testAlign:'center'}">
        <a-row type="flex" justify="center">
          <a-col :span="4" :style="{textAlign:'center'}">
            <a-button @click="goBack">返回</a-button>
          </a-col>
          <!--  -->
          <a-col :span="4" :style="{textAlign:'center'}" v-if="id">
            <a-button type="primary" @click="share">转发</a-button>
          </a-col>
          <!--  -->
          <a-col :span="4" :style="{textAlign:'center'}">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <a-modal
      title="问卷链接"
      :visible="visible"
      :footer="null"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <a-input-search disabled :value="copyUrl" size="large">
        <a-button
          slot="enterButton"
          v-clipboard:copy="copyUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制</a-button>
      </a-input-search>
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
      copyUrl: window.location.origin+"/crcMobile/index.html",
      //
      isRequire: false
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleCancel(e) {
      this.visible = false;
    },
    onCopy(e) {
      this.$message.success("复制成功！");
      this.visible = false;
    },
    onError(e) {
      this.$message.error(`复制失败：${e}`);
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
    feedback() {
      this.$confirm({
        title: "提示：",
        content: `确认反馈？`,
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
      if (e) e.preventDefault();
      this.$nextTick(() => {
        this.form.validateFieldsAndScroll({ force: true }, (err, values) => {
          if (!err) {
            console.log("Received values of form: ", values);
            add_evaluate(values).then(res => {
              if (res.err_no == 200) {
                this.$message.success("提交成功");
                if (!this.id) {
                  this.$router.replace({
                    path: `/index/editEvaluation/${res.data}`
                  });
                }else{
                  if(values.type==1){
                    this.$message.success("您已修改结题评价分值，提交后完成证书需重新生成");
                  }
                  this.$router.go(-1)
                }
                return;
              }
              this.$message.error(`提交失败:${res.message}`);
            });
          }
        });
      });
    },
    share() {
      this.showModal();
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
        onOk: () => {
          return is_agree_explain({
            id: this.id,
            status: option
          }).then(res => {
            if (res.err_no == 200) {
              this.$message.success(`${res.message}`);
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
      if (res.data.id == 3) this.isRequire = true;
    });
    if (this.id) {
      this.copyUrl = `${this.copyUrl}?id=${this.id}`;
      console.log(this.copyUrl);
      this.self_evaluate_desc();
    }
  },
  watch: {
    id: function(val) {
      console.log("new id:", val);
      if (val) {
        this.copyUrl = `${this.copyUrl}?id=${val}`;
        this.self_evaluate_desc();
      } else {
        this.form = this.$form.createForm(this);
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