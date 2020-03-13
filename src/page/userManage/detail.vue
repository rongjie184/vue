<template>
  <div class="content">
    <h1>用户信息</h1>
    <a-form>
      <a-row>
        <a-form-item label="用户姓名:">{{item.uname}}</a-form-item>
        <a-form-item label="登录账号:">{{item.account}}</a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="用户角色:">{{item.rolename}}</a-form-item>
        <a-form-item v-if="item.inst_name" label="研究中心:">{{item.inst_name}}</a-form-item>
        <a-form-item v-if="item.smo_name" label="smo:">{{item.smo_name}}</a-form-item>
      </a-row>
      <a-row>
        <a-form-item  v-if="item.dept_name" label="科室:">{{item.dept_name}}</a-form-item>
      </a-row>
      <a-form-item class="size area" label="驳回原因:">
        <a-input type="textarea" placeholder="请输入驳回原因" v-model="disreason" />
      </a-form-item>
      <a-row>
        <div style="margin:80px auto;">
          <a-button type="primary" @click="editStatus(-2)">驳回</a-button>
          <a-button type="primary" @click="editStatus(1)">通过</a-button>
          <a-button @click="back">返回</a-button>
        </div>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { getUserInfo, editState } from "@/api/default";
export default {
  data() {
    return {
      disreason: undefined,
      item: {},
      roleList: [
        { role_id: "1", rolename: "管理员" },
        { role_id: "2", rolename: "研究中心" },
        { role_id: "3", rolename: "研究者" },
        { role_id: "4", rolename: "SMO" }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getUserInfo({ uid: this.$route.query.id }).then(res => {
        this.item = res.data;
        this.roleList.map(n => {
          if (res.data.role_id === n.role_id) this.item.rolename = n.rolename;
        });
      });
    },
    editStatus(n) {
      let param = {
        uid: this.$route.query.id,
        state: n,
        disreason: this.disreason
      };
      editState(param).then(res => {
        if (res.err_no === 200) {
          this.$message.success(res.message);
          this.$router.back(-1);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
<style lang="stylus" scoped>
.content {
  padding: 30px;
}

h1 {
  border-left: 3px solid #1890FF;
  padding-left: 10px;
  margin-bottom: 20px;
  color: #252525;
  font-weight: 700;
  font-size: 16px;
}

.ant-row {
  display: flex;
}

button {
  margin: 0 10px;
}

.ant-row .ant-form-item {
  width: 40%;
}
</style>