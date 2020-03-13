<template>
  <div :class="[{ reseacher: userInfo.id ==1 }, 'content']">
    <p class="head" v-html="title">{{title}}</p>
    <a-form :form="form" @submit="handleSubmit">
      <div class="title">1.公司概况{{isRequire?"1":"2"}}</div>
      <a-form-item class="formItem">
        <span>（1）请提供贵公司SMO开始从业年限</span>
        <a-input
          :style="{width:'75px',margin:'0 4px'}"
          size="small"
          :disabled="disable"
          placeholder="年限"
          v-decorator="[
          'work_experience',
          {rules: [{ required: isRequire, message: '请输入年限!' }]}
        ]"
        ></a-input>年
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem">
        <span>（2）请提供贵公司超过2年CRC从业经验的CRC比例</span>
        <a-input
          :disabled="disable"
          :style="{width:'75px',margin:'0 4px'}"
          size="small"
          placeholder="百分比"
          v-decorator="[
          'two_proportion',
          {rules: [{ required: isRequire, message: '请输入百分比!' }]}
        ]"
        ></a-input>%
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem">
        <span>（3）请提供贵公司近5年承接试验的分类及数量</span>
        <a-table :columns="columns" :dataSource="data" bordered :pagination="false" :style="{width:'80%'}">
          <template slot="operation" slot-scope="text">
            <div>
              <a-form-item class="formItem">
                <a-input
                  :disabled="disable"
                  placeholder="请填写数量/项"
                  v-decorator="[
                    `${text}`,
                    {rules: [{ required: isRequire, message: '请输入数量/项!' }]}
                  ]"
                />
              </a-form-item>
            </div>
          </template>
        </a-table>
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem">
        <div class="titleDesc">（4）请提供接受药监管理部门现场核查的次数及结果</div>
        <a-table :columns="columns2" :dataSource="data2" bordered :pagination="false" :style="{width:'80%'}">
          <template slot="operation1" slot-scope="text">
            <div>
              <a-form-item class="formItem">
                <a-input
                  :disabled="disable"
                  placeholder="请填写项目数量"
                  v-decorator="[
                    `${text}`,
                    {rules: [{ required: isRequire, message: '请输入项目数量!' }]}
                  ]"
                />
              </a-form-item>
            </div>
          </template>
          <template slot="operation2" slot-scope="text">
            <div>
              <a-form-item class="formItem">
                <a-input
                  :disabled="disable"
                  placeholder="请填写通过数量"
                  :style="{width:'120px',marginRight:'10px'}"
                  v-decorator="[
                    `${text}`,
                    {rules: [{ required: isRequire, message: '请填写通过数量!' }]}
                  ]"
                />
                <span>项通过</span>
              </a-form-item>
            </div>
          </template>
          <template slot="operation3" slot-scope="text">
            <div>
              <a-form-item class="formItem">
                <a-input
                  :disabled="disable"
                  :style="{width:'120px',marginRight:'10px'}"
                  placeholder="请填未通过写数量"
                  v-decorator="[
                    `${text}`,
                    {rules: [{ required: isRequire, message: '请填未通过写数量!' }]}
                  ]"
                />
                <span>项未通过</span>
              </a-form-item>
            </div>
          </template>
        </a-table>
      </a-form-item>
      <!-- 2 -->
      <div class="title">2.贵公司是否在北京地区有办公室？</div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
              'is_office',
              {initialValue:1,rules: [{ required: isRequire, message: '请选择!' }]
            }]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="formItem">
          <span>拥有工位的比例</span>
          <a-input
            :disabled="disable"
            :style="{width:'75px',margin:'0 4px'}"
            size="small"
            placeholder="百分比"
            v-decorator="[
          'office_num',
          {rules: [{ required: isRequire, message: '请输入年限!' }]}
        ]"
          ></a-input>%
        </a-form-item>
      </div>
      <!-- <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'office_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="详细说明…"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>-->
      <!-- 3 -->
      <div class="title">
        3.贵公司是否定期向员工提供关于数据隐私和信息安全的培训？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_train',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'train_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请提供培训频率和内容；若无，请描述如何确保员工了解相关义务"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 4 -->
      <div class="title">
        4.贵公司是否有对违法乱纪行为的预防和处理措施？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_prevent',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'prevent_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请提供相关制度"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 5 -->
      <div class="title">5.贵公司聘用CRC的基本要求？</div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'claim_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="详细说明…"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 6 -->
      <div class="title">
        6.贵公司是否建立完善的培训体系？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_train_system',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'train_system_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请提供培训内容和培训周期。包括但不限于入职培训、带教培训"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 7 -->
      <div class="title">
        7.贵公司是否建立了CRC工作报告与质量调查机制，及时了解CRC的工作情况？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_made',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'made_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请详细说明；若否，请说明原因"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 8 -->
      <div class="title">
        8.贵公司是否建立了CAPA体系，并能够不断改进和提高工作质量？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_capa',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'capa_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请详细说明；若否，请说明原因"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 9 -->
      <div class="title">
        9.贵公司是否建立CRC的分级认定标准？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_level',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'level_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请提供相关制度简介"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <!-- 10 -->
      <div class="title">
        10.贵公司是否定期开展CRC考核？
      </div>
      <div class="flex">
        <a-form-item class="formItem" :style="{marginRight:'20px'}">
          <a-radio-group
            :disabled="disable"
            v-decorator="[
        'is_check',
        {initialValue:1,rules: [{ required: isRequire, message: '请选择评价类型!' }]}]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item class="formItem">
        <a-textarea
          :disabled="disable"
          v-decorator="[
          'check_dis',
          {rules: [{ required: isRequire, message: '请输入详细说明!' }]}
        ]"
          placeholder="若是，请提供相关制度简介"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item
        v-if="!disable"
        class="formItem"
        :style="{display:'flex',justifyContent:'center',marginTop:'20px'}"
      >
        <a-button v-if="this.status!=1" :style="{marginRight:'100px'}" @click="save">保存</a-button>
        <a-button type="primary" html-type="submit">保存并提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
const data = [
  {
    key: "1",
    name: "药物临床试验",
    tel: "肿瘤临床试验",
    phone: "国际临床试验",
    address: "zlgj_num"
  },
  {
    key: "2",
    name: "药物临床试验",
    tel: "肿瘤临床试验",
    phone: "国内临床试验",
    address: "zlgn_num"
  },
  {
    key: "3",
    name: "药物临床试验",
    tel: "非肿瘤临床试验",
    phone: "国际临床试验",
    address: "fglgj_num"
  },
  {
    key: "4",
    name: "药物临床试验",
    tel: "非肿瘤临床试验",
    phone: "国内临床试验",
    address: "fglgn_num"
  },
  {
    key: "5",
    name: "药物临床试验",
    tel: "I 期临床试验",
    phone: "国际临床试验",
    address: "yqgj_num"
  },
  {
    key: "6",
    name: "药物临床试验",
    tel: "I 期临床试验",
    phone: "国内临床试验",
    address: "yqgn_num"
  },
  {
    key: "7",
    name: "药物临床试验",
    tel: "II 期临床试验",
    phone: "国际临床试验",
    address: "eqgj_num"
  },
  {
    key: "8",
    name: "药物临床试验",
    tel: "II 期临床试验",
    phone: "国内临床试验",
    address: "eqgn_num"
  },
  {
    key: "9",
    name: "药物临床试验",
    tel: "III 期临床试验",
    phone: "国际临床试验",
    address: "sqgj_num"
  },
  {
    key: "10",
    name: "药物临床试验",
    tel: "III 期临床试验",
    phone: "国内临床试验",
    address: "sqgn_num"
  },
  {
    key: "11",
    name: "药物临床试验",
    tel: "IT及上市后研究",
    phone: "",
    address: "it_num"
  },
  {
    key: "12",
    name: "医疗器械临床试验",
    tel: "",
    phone: "",
    address: "qx_num"
  },
  {
    key: "13",
    name: "体外诊断试剂临床试验",
    tel: "",
    phone: "",
    address: "tw_num"
  }
];
const data2 = [
  {
    key: "1",
    name: "国家药监局",
    item1: "sfda_num",
    item2: "sfda_p_num",
    item3: "sfda_np_num"
  },
  {
    key: "2",
    name: "FDA、EMA、PMDA",
    item1: "fda_num",
    item2: "fda_p_num",
    item3: "fda_np_num"
  }
];
const columns2 = [
  {
    title: "现场核查",
    dataIndex: "name"
  },
  {
    title: "项目数量",
    dataIndex: "item1",
    scopedSlots: { customRender: "operation1" }
  },
  {
    title: "结果",
    colSpan: 2,
    dataIndex: "item2",
    scopedSlots: { customRender: "operation2" }
  },
  {
    title: "结果",
    colSpan: 0,
    dataIndex: "item3",
    scopedSlots: { customRender: "operation3" }
  }
];
import {
  getTitle,
  getNotice,
  postAnswer,
  getAnswue,
  editAnswer
} from "@/api/default";
import { get_role } from "../../api/evaluate_manage";
export default {
  inject: ["reload"],
  name: "qsqAdd",
  props: {
    id: {
      type: String,
      default: ""
    },
    edit_id: {
      type: String,
      default: ""
    }
  },
  data() {
    const columns = [
      {
        title: "",
        dataIndex: "name",
        width: 160,
        customRender: (text, row, index) => {
          if (index === 0) {
            return {
              children: text,
              attrs: {
                rowSpan: 11
              }
            };
          }
          if (index < 11) {
            return {
              children: text,
              attrs: {
                rowSpan: 0
              }
            };
          }
          return {
            children: text,
            attrs: {
              colSpan: 3
            }
          };
        }
      },
      {
        title: "",
        dataIndex: "tel",
        width: 200,
        customRender: (value, row, index) => {
          const obj = {
            children: value,
            attrs: {}
          };
          if (index % 2 === 0) {
            obj.attrs.rowSpan = 2;
          }
          // These two are merged into above cell
          if (index % 2 === 1) {
            obj.attrs.rowSpan = 0;
          }
          if (index === 10) {
            obj.attrs.rowSpan = 1;
            obj.attrs.colSpan = 2;
          }
          if (index > 11) {
            obj.attrs.rowSpan = 1;
            obj.attrs.colSpan = 0;
          }
          return obj;
        }
      },
      {
        title: "",
        dataIndex: "phone",
        width: 200,
        customRender: (value, row, index) => {
          const obj = {
            children: value,
            attrs: {}
          };
          if (index >= 10) {
            obj.attrs.rowSpan = 1;
            obj.attrs.colSpan = 0;
          }
          return obj;
        }
      },
      {
        title: "数量/项",
        dataIndex: "address",
        scopedSlots: { customRender: "operation" }
      }
    ];
    //
    return {
      disable: false,
      isRequire: false,
      status: "",
      userInfo: {},
      data,
      data2,
      columns,
      columns2,
      title: ""
    };
  },
  methods: {
    save(e) {
      e.preventDefault();
      this.isRequire = false;
      this.$nextTick(() => {
        this.form.validateFieldsAndScroll({ force: true }, (err, values) => {
          if (!err) {
            let option = JSON.parse(JSON.stringify(values));
            option.status = 0;
            if (this.edit_id) {
              editAnswer(option).then(res => {
                if (res.err_no == 200) {
                  this.$message.success(`${res.message}`);
                  if(option.status == 1){
                    this.$router.replace({path:'/index/psqManage'})
                  }
                  return;
                }
                this.$message.error(`失败：${res.message}`);
              });
              return;
            }
            postAnswer(option).then(res => {
              if (res.err_no == 200) {
                this.$message.success(`${res.message}`);
                if(option.status == 1){
                    this.$router.replace({path:'/index/psqManage'})
                  }
                //this.$router.replace({path:'/index/psqManage'})
                return;
              }
              this.$message.error(`失败：${res.message}`);
            });
          }
        });
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.isRequire = true;
      this.$nextTick(() => {
        this.form.validateFieldsAndScroll({ force: true }, (err, values) => {
          if (!err) {
            let option = JSON.parse(JSON.stringify(values));
            option.status = 1;
            if (option.id) {
              editAnswer(option).then(res => {
                if (res.err_no == 200) {
                  this.$message.success(`${res.message}`);
                  this.$router.replace({path:'/index/psqManage'})
                  return;
                }
                this.$message.error(`失败：${res.message}`);
              });
              return;
            }
            postAnswer(option).then(res => {
              if (res.err_no == 200) {
                this.$message.success(`${res.message}`);
                this.$router.replace({path:'/index/psqManage'})
                return;
              }
              this.$message.error(`失败：${res.message}`);
            });
          }
        });
      });
    }
  },
  created() {
    this.form = this.$form.createForm(this);
  },
  mounted() {
    console.log(this.id, this.edit_id);
    get_role().then(res => {
      this.userInfo = res.data;
    });
    getNotice().then(res => {
      this.title = res.data.desc;
    });
    if (this.id != "" || this.edit_id != "") {
      if (!!this.id) {
        this.disable = true;
      }
    }
    getAnswue({ id: this.id || this.edit_id }).then(res => {
      if(!res.data.id)return
      console.log(res);
      this.form.getFieldDecorator("id", {
        initialValue: res.data.id,
        preserve: true
      });
      this.form.getFieldDecorator("smo_id", {
        initialValue: res.data.smo_id,
        preserve: true
      });
      this.form.getFieldDecorator("uid", {
        initialValue: res.data.uid,
        preserve: true
      });
      this.form.getFieldDecorator("status", {
        initialValue: res.data.status,
        preserve: true
      });
      this.status = res.data.status;
      this.form.getFieldDecorator("edit_time", {
        initialValue: res.data.edit_time,
        preserve: true
      });
      this.form.getFieldDecorator("add_time", {
        initialValue: res.data.add_time,
        preserve: true
      });
      this.form.getFieldDecorator("submit_time", {
        initialValue: res.data.submit_time,
        preserve: true
      });
      this.$nextTick(() => {
        // 循环内数据元素需要在节点挂载好之后才能设置，否则报错
        this.form.setFieldsValue(res.data);
      });
    });
  },
  watch:{
    edit_id:function(val){
      this.reload()
    },
    id:function(val){
      this.reload()
    }
  }
};
</script>
<style scoped lang="stylus">
.flex {
  display: flex;
}

.head {
  line-height: 32px;
  color: #666666;
}

.title {
  font-size: 16px;
  font-family: PingFangSC;
  font-weight: 600;
  color: rgba(37, 37, 37, 1);
  line-height: 50px;
  margin-bottom: 10px;
}

.formItem {
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}

form .ant-input /deep/ {
  background: rgba(247, 251, 255, 1);
}

// 换色
.content.reseacher form .ant-input /deep/ {
  color: rgb(0, 0, 0);
}

.formItem.ant-row.ant-form-item /deep/ {
  margin-bottom: 0;
}
</style>