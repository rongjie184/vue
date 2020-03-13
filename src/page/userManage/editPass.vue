<template>
  <div :style="{paddingTop:'100px'}">
    <a-row :gutter="24">
      <a-col :span="10" :offset="7">
        <a-form :form="form" style="margin-top:20px">
          <a-form-item
            label="登录账号:"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >{{account}}</a-form-item>
          <a-form-item
            label="原密码:"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="form.old_password" type="password" placeholder="请输入原密码" />
          </a-form-item>
          <a-form-item
            label="登录密码:"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="form.new_password" type="password" placeholder="请输入新密码" />
          </a-form-item>
          <a-form-item
            label="重复密码:"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="form.confirm_password" type="password" placeholder="请再次确认密码" />
          </a-form-item>
          <a-form-item style="text-align:center">
            <a-button @click="back">返回</a-button>
            <a-button @click="save" type="primary">保存</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { editPass, getUserInfo } from "@/api/default";
export default {
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      account: "",
      form: {}
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getUserInfo().then(res => (this.account = res.data.account));
    },
    save() {
      editPass(this.form).then(res => {
        if (res.err_no === 200) {
          this.$message.success(res.message);
          this.$router.push({
            name: "Login"
          });
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    back() {
      this.$router.push({
        path: "/index/userManage"
      });
    }
  }
};
</script>
<style scoped lang="stylus">
.ant-btn {
  margin: 0 15px;
}
</style>