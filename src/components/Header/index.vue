<template>
  <a-layout-header :style="{backgroundColor:'#2F95F4'}">
    <div class="logo">CRC实名登记和征信系统</div>
    <a-menu
      mode="horizontal"
      :style="{height:'60px', lineHeight: '60px',float:'right',backgroundColor:'transparent',border:'none',overflow:'hidden'}"
    >
      <!-- <a-menu-item key="1" :style="{border:0}">
        <span class="text" @click="backHome" style="cursor:pointer">
          <img class="home" src="@/assets/img/home.png" alt />
          返回首页
        </span>
      </a-menu-item>-->
      <!-- <a-menu-item key="2" :style="{border:0}">
        <span class="text">上次登录时间：{{lastTime |parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
      </a-menu-item>-->
      <a-menu-item key="1" :style="{border:0}">
        <span class="text">
          您好,
          <a-button class="userCount" type="link" @click="toUserInfo">{{userName}}</a-button>!
        </span>
      </a-menu-item>
      <a-menu-item key="2" :style="{border:0}">
        <span class="text">
          <a-button class="userCount" type="link" @click="toUserInfo">公告</a-button>!
        </span>
      </a-menu-item>
      <a-menu-item key="3" :style="{border:0}">
        <a-button class="logout" @click="logOut" type="link">退出</a-button>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { logout } from "@/api/default";
export default {
  name: "Header",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["token", "userName", "lastTime"])
  },
  methods: {
    // backHome() {
    //   this.$router.push({
    //     path: "/index"
    //   });
    // },
    toUserInfo() {
      this.$router.push({
        path: "/index"
      });
    },
    logOut() {
      logout().then(res => {
        this.$router.replace({
          path: "/login"
        });
      });
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.ant-layout-header {
  height: 60px;
  padding: 0;
}

.ant-menu-item .ant-menu-item-selected {
  height: 60px;
}

.logo {
  float: left;
  width: 260px;
  text-align: center;
  font-size: 22px;
  font-family: PingFangSC-Semibold;
  background-color: #1A85E8;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 60px;
}

.userCount, .logout {
  color: #ffffff;
}

.ant-btn {
  padding: 0;
}

.el-header {
  height: 60px !important;
  background-color: #4d72fd;
  color: #fff;
  line-height: 60px;
  font-size: 20px;
  padding: 0 20px;
}

.header_container {
  width: 1180px;
  margin: auto;
}

.a-button--text {
  font-size: 12px;
}

.logout .a-button--text, .text {
  color: #fff;
  font-size: 12px;
  padding-left: 20px;
}

.home {
  width: 18px;
  height: 18px;
  transform: translateY(-10%);
}

img {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  padding-left: 22px;
}

@media (max-width: 1368px) {
  .el-header {
    height: 40px !important;
    line-height: 40px;
  }
}

.a-button--text {
  color: #fff !important;
}
</style>