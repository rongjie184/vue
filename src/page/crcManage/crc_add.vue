<template>
  <div class="crcInfo">
    <div class="title">人员信息</div>
    <a-form :form="form" @submit="handleSubmit" :style="{padding:'0 30px'}">
      <a-form-item class="formItem">
        <span class="label ant-form-item-required">姓名：</span>
        <a-input
          placeholder="请输入姓名"
          v-decorator="['uname',{
            rules: [{required: true, message: '请输入姓名!' }],
          }]"
          :style="{width:'290px'}"
        />
      </a-form-item>
      <a-form-item class="formItem">
        <span class="label ant-form-item-required">从业开始时间：</span>
        <a-date-picker
          :style="{width:'234px'}"
          placeholder="从业开始时间"
          v-decorator="['work_time',{
            rules: [{ type: 'object', required: true, message: '请选择从业时间!' }],
          }]"
        />
      </a-form-item>
      <a-form-item class="formItem" :style="{textAlign:'left'}">
        <span class="label ant-form-item-required">性别：</span>
        <a-radio-group
          :style="{width:'288px'}"
          v-decorator="['sex',{
          initialValue:'男',
          rules: [{required: true,message: '请选择性别!'}]
        }]"
        >
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem">
        <span class="label ant-form-item-required">手机号：</span>
        <a-input
          :style="{width:'276px'}"
          placeholder="请填写手机号"
          v-decorator="[
          'phone',
          {rules: [{ required: true, message: '请填写手机号!' }]}
        ]"
        />
      </a-form-item>
      <!--  -->
      <a-form-item class="formItem">
        <span class="label ant-form-item-required">身份证号：</span>
        <a-input
          :style="{width:'262px'}"
          placeholder="请填写身份证号"
          v-decorator="[
          'pidnum',
          {rules: [{ required: true, message: '请填写身份证号!' }]}
        ]"
        />
      </a-form-item>
      <!--  -->
      <a-form-item
        :wrapperCol="{span:20}"
        v-for="(k) in form.getFieldValue('keys')"
        :key="k"
        style="margin-bottom:0;"
      >
        <span class="label ant-form-item-required">工作经历：</span>
        <a-form-item :style="{ display: 'inline-block',marginRight:'20px'}">
          <a-select
            :style="{width:'266px'}"
            v-decorator="[`work[${k}].smo_id`,{
            rules:[{required:true, message:'请选择SMO公司'}]
          }]"
            placeholder="请选择SMO公司"
            allowClear
            showSearch
            :filterOption="filterOption"
          >
            <a-select-option v-for="item in smo_list" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :style="{ display: 'inline-block'}">
          <a-date-picker placeholder="入职时间" v-decorator="[`work[${k}].start_time`]" />
        </a-form-item>
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">-</span>
        <a-form-item :style="{ display: 'inline-block',marginRight:'20px'}">
          <a-date-picker placeholder="离职时间" v-decorator="[`work[${k}].end_time`]" />
        </a-form-item>
        <a-button
          v-if="form.getFieldValue('keys').length > 1"
          :disabled="form.getFieldValue('keys').length === 1"
          @click="() => remove(k)"
        >删除</a-button>
      </a-form-item>
      <!--  -->
      <a-form-item>
        <a-button @click="add">
          <a-icon type="plus" />工作经历
        </a-button>
      </a-form-item>
      <!--  -->
      <div class="upload">
        <a-upload
          name="file"
          action="/index.php/admin/crc_manage/upload_fj"
          :headers="headers"
          :beforeUpload="beforeUpload"
          :fileList="fileList"
          @change="handleChange"
        >
          <a-button>
            <a-icon type="upload" />选择附件
          </a-button>
        </a-upload>
      </div>
      <a-form-item>
        <a-button style="margin-right:30px" @click="back">返回</a-button>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from "moment";
import { add_crc, edit_crc, crc_edit_info } from "@/api/crc_manage";
import { getSmo } from '../../api/default';
export default {
  inject: ["reload"],
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      headers: {
        authorization: "authorization-text"
      },
      file_path: "", //证书返回值
      file_name: "", //证书返回值
      fileList: [],
      smo_list: []
    };
  },
  methods: {
    moment,
    remove(k) {
      const { form } = this;
      console.log(form);
      const keys = form.getFieldValue("keys");
      if (keys.length === 1) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      });
    },
    add() {
      const { form } = this;
      let keys = form.getFieldValue("keys");
      let nextKeys = keys.concat(keys.slice(-1)-0+1);
      form.setFieldsValue({
        keys: nextKeys
      });
    },
    beforeUpload(file) {
      this.fileList = [file];
    },
    handleChange(info) {
      if (info.file.status == "removed") {
        this.$message.error("附件只可以更换不可以删除");
      }
      if (info.file.status !== "uploading") {
        if (info.file.response) {
          this.file_path = info.file.response.data.file_path;
          this.file_name = info.file.response.data.file_name;
        }
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.fileList[0].name}上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.fileList[0].name}上传失败`);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let option = {};
          option.work_time = values.work_time.format("YYYY-MM-DD");
          //删除列表项目时列表的key
          option.work = values.work.map(item => {
            let work_item = {};
            work_item.smo_id = item.smo_id;
            work_item.start_time = item.start_time
              ? item.start_time.format("YYYY-MM-DD")
              : "";
            work_item.end_time = item.end_time
              ? item.end_time.format("YYYY-MM-DD")
              : "";
            return work_item;
          });
          option.uname = values.uname;
          option.sex = values.sex;
          option.phone = values.phone;
          option.pidnum = values.pidnum;
          option.file_path = this.file_path;
          option.file_name = this.file_name;
          if (this.id) {
            option.uid = this.id;
            edit_crc(option).then(res => {
              if (res.err_no == 200) {
                this.$message.success("修改成功");
                this.$router.go(-1)
                return;
              }
              this.$message.error(`修改失败：${res.message}`);
            });
            return;
          }
          add_crc(option).then(res => {
            if (res.err_no == 200) {
              this.$message.success("添加成功");
              this.$router.replace({
                path:'/index/crcList'
              })
              return;
            }
            this.$message.error(`添加失败：${res.message}`);
          });
        }
      });
    },
    self_crcInfo(){
      crc_edit_info({ uid: this.id }).then(res => {
        let work = [],
          keys = [0];
        //设置循环长度
        if (res.data.work.length != 0) {
          work = res.data.work.map((item, index) => {
            if (item.id) {
              let obj  = {}
              obj.smo_id = item.smo_id
              if(item.start_time!=0){obj.start_time = moment(item.start_time)}
              if(item.end_time!=0){obj.end_time = moment(item.end_time)}
              return obj
            }
          });
          keys = res.data.work.map((item, index) => index);
        }
        //
        if (res.data.file_name) {
          this.file_name = res.data.file_name;
          this.file_path = res.data.file_path;
          this.fileList[0] = {
            uid: "-1",
            name: res.data.file_name
          };
        }
        //
        this.form.setFieldsValue({
          uname: res.data.uname,
          sex: res.data.sex,
          phone: res.data.phone,
          pidnum: res.data.pidnum,
          keys: keys,
          work_time: moment(res.data.work_time)
        });
        this.$nextTick(() => {
          // 循环内数据元素需要在节点挂载好之后才能设置，否则报错
          this.form.setFieldsValue({
            work: work
          });
        });
      });
    },
    back() {
      this.$router.back(-1);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  watch:{
    "id":function(val){
      if(!val){
        this.reload()
      }else{
        this.self_crcInfo()
      }
    }
  },
  created() {
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator("keys", { initialValue: [0], preserve: true });
  },
  mounted() {
    getSmo().then(res => {
      this.smo_list = res.data;
    });
    if (this.id) {
      this.self_crcInfo()
    }
  },
};
</script>
<style lang="stylus" scoped>
.crcInfo {
  position: relative;
}

.formItem {
  display: flex;
  text-align: right;
  padding-right: 3.4%;
}

.upload {
  margin-bottom: 20px;
}

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
</style>