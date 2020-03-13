<template>
  <div class="box">
    <div class="bg">
      <img src="../../assets/img/login.png" alt />
      <div class="right">
        <h2>欢迎登录</h2>
        <a-input placeholder="请输入账号" v-model="username">
          <a-icon style="color:#ccc" slot="prefix" type="user" />
        </a-input>
        <a-input placeholder="请输入密码" type="password" v-model="password">
          <a-icon style="color:#ccc" slot="prefix" type="lock" />
        </a-input>
        <p class="pass">
          <a @click="register">注册账号</a>
          <!-- <span @click="forget">忘记密码</span> -->
        </p>
        <p>
          <a-button @click="signin" type="primary">登录</a-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { login, checkCode, sendCode, updatePass } from "@/api/default";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapMutations("user", {
      SET_RESIGN: "SET_RESIGN",
      SET_USERNAME: "SET_USERNAME",
      SET_LASTTIME: "SET_LASTTIME"
    }),
    signin() {
      this.SET_RESIGN(false);
      let type = "info";
      login({ username: this.username, password: this.password }).then(res => {
        if (res.err_no == 200) {
          this.SET_USERNAME(res.data.uname);
          this.SET_LASTTIME(res.data.last_login_time);
          this.$router.push({
            path: `/index`
          });
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // forget() {
    //   this.$router.push({
    //     name: "register"
    //   });
    // },
    register() {
      this.$router.push({
        name: "register"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.ant-input{
  height 40px;
  line-height 40px
}
*{
  padding:0;
  margin:0;
  box-sizing border-box;
}

.box {
  width: 100%;
  height: 100%;
  background: #F2F6FC;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-input-affix-wrapper{
  width:70%;
  margin-top:24px;
  height 40px;
}
.ant-btn-primary{
  width:70%;
  height 40px
}

.bg {
  width: 1200px;
  height: 630px;
  display: flex;

  img {
    width: 65%;
    heiZght: 100%;
  }

  .right {
    width: 35%;
    height: 100%;
    background: #fff;
    text-align: center;
  }
  .pass{
    width:70%;
    text-align:right;
    margin:24px 0 114px 15%;
    font-size:12px;
    span{
      float right;
      padding:0;
      color:#1890FF;
      cursor pointer
    }
  }
  h2{
    font-size 30px;
    line-height 42px;
    text-align:center;
    margin:64px 0 90px 0;
  }
}
</style>
