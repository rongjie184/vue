<template>
  <div class="box">
    <div class="bg">
      <img src="../../assets/img/login.png" alt />
      <div class="right">
        <h2>注册</h2>
        <a-input placeholder="请输入用户姓名" v-model="register.uname"></a-input>
        <a-input placeholder="请输入登录账号" v-model="register.account"></a-input>
        <a-input placeholder="请输入密码" type="password" v-model="register.passwd"></a-input>
        <a-input placeholder="请再次输入密码" type="password" v-model="register.confirm_passwd"></a-input>
        <a-select style="width:70%;margin-top:20px" placeholder="请选择研究中心" @change='instChange' v-model="register.instid">
          <a-select-option v-for="n in instlist" :value="n.id" :key="n.id">{{n.instname}}</a-select-option>
        </a-select>
        <a-select style="width:70%;margin-top:20px" placeholder="请选择研究科室" v-model="register.deptid">
          <a-select-option v-for="n in deptList" :value="n.id" :key="n.id">{{n.deptname}}</a-select-option>
        </a-select>
        <p @click="login" class="pass">使用已有账户登录</p>
        <p>
          <a-button @click="signin" type="primary">注册</a-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { regsiter, login,getInst,getDept} from "@/api/default";
export default {
  name: "register",
  data() {
    return {
      register: {
        uname: "",
        account: "",
        passwd: "",
        confirm_passwd: "",
        instid: undefined, //机构id
        deptid:undefined
      },
      instlist:[],
      deptList:[]
    };
  },
  created() {
    getInst().then(res => {
      this.instlist = res.data;
    });
  },
  methods: {
    ...mapMutations("user", {
      SET_RESIGN: "SET_RESIGN",
      SET_USERNAME: "SET_USERNAME",
      SET_LASTTIME: "SET_LASTTIME"
    }),
    instChange(n){
      getDept({instid:n}).then(res => {
        this.deptList = res.data;
        console.log(res)
      })
    },
    signin() {
      regsiter(this.register).then(res => {
        if (res.err_no == 200) {
          this.$router.push({
            path: `/Login`
          });
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    login() {
      this.$router.push({
        name: "Login"
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.ant-btn {
  height: 40px;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.box {
  width: 100%;
  height: 100%;
  background: #F2F6FC;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-input {
  width: 70%;
  // height: 40px;
  margin-top: 20px;
  padding-left: 10px;
}

.ant-btn-primary {
  width: 70%;
}

.bg {
  width: 1200px;
  height: 630px;
  display: flex;

  img {
    width: 65%;
    height: 100%;
  }

  .right {
    width: 35%;
    height: 100%;
    background: #fff;
    text-align: center;
  }

  .pass {
    width: 100%;
    font-size: 12px;
    color: #1890FF;
    margin: 80px 0 20px 0;
    cursor: pointer;
  }

  h2 {
    font-size: 30px;
    line-height: 42px;
    text-align: center;
    margin: 64px 0 40px 0;
  }
}
</style>
