<template>
  <div class="content">
    <a-row type="flex" justify="space-between">
      <a-col :span="8">
        <a-input v-model="param.search" allowClear placeholder="请输入用户名/姓名/登录账号" />
      </a-col>
      <a-col :span="4">
        <a-select placeholder="请选择角色" style="width:100%" allowClear v-model="param.role_id">
          <a-select-option v-for="n in roleList" :value="n.id" :key="n.id">{{n.rolename}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-button @click="searchList" type="primary">搜索</a-button>
      </a-col>
      <a-col style="text-align:right" :span="4">
        <a-button @click="addAccount" type="primary">+添加账户</a-button>
      </a-col>
    </a-row>
    <a-table
      style="margin-top:30px"
      :columns="columns"
      :pagination="{
        showQuickJumper:true,
        total: totalNum,
        current:param.p,
        showTotal: totalNum => `共 ${totalNum} 条`,
        pageSize: 10,
        defaultCurrent: 1,
        onChange:changePage
      }"
      :dataSource="data"
      :scroll="{ x: 800 }"
      :rowKey="record => record.uid"
    >
      <span
        slot="status"
        :class="record.state_name=='启用'?'canUse':'cantUse'"
        slot-scope="text, record"
      >{{record.state_name}}</span>
      <span slot="action" class="operate" slot-scope="record">
        <a v-if="record.state === '-1'" @click.stop="detail(record)">审核</a>
        <a v-if="record.state !== '-1' && record.state !== '-2'" @click.stop="edit(record)">编辑</a>
        <a-divider v-if="record.state === '1' || record.state === '0'" type="vertical" />
        <a
          v-if="record.state === '1' || record.state === '0'"
          @click.stop="ChangeState(record)"
        >{{record.state === '1' ? '停用' : '启用'}}</a>
      </span>
    </a-table>

    <a-modal
      class="modal"
      :title="!isEdit?'添加账户':'修改账户'"
      okText="确认"
      cancelText="取消"
      v-model="visible"
      @ok="handleOk"
      @cancel="cancel"
    >
      <template v-if="!isEdit">
        <a-select style="width:100%" placeholder="请选择角色" v-model="add.role_id" @change="changeUser">
          <a-select-option v-for="n in creatRoleList" :value="n.id" :key="n.id">{{n.rolename}}</a-select-option>
        </a-select>
      </template>
      <template v-else>
        <a-select
          style="width:100%"
          placeholder="请选择角色"
          v-model="add.role_id"
          @change="changeUser"
          disabled
        >
          <a-select-option v-for="n in roleList" :value="n.id" :key="n.id">{{n.rolename}}</a-select-option>
        </a-select>
      </template>
      <!--  -->
      <a-select
        v-if="smo"
        placeholder="请选择SMO"
        v-model="add.smo_id"
        showSearch
        :filterOption="filterOption"
      >
        <a-select-option v-for="n in dataList" :value="n.id" :key="n.id">{{n.name}}</a-select-option>
      </a-select>
      <!--  -->
      <a-select
        v-if="flag"
        placeholder="请选择研究中心"
        v-model="add.instid"
        @change="changeInst"
        showSearch
        :filterOption="filterOption"
      >
        <a-select-option v-for="n in dataList" :value="n.id" :key="n.id">{{n.instname}}</a-select-option>
      </a-select>
      <!--  -->
      <a-select
        v-if="research"
        v-model="add.deptid"
        placeholder="请选择科室"
        showSearch
        :filterOption="filterOption"
      >
        <a-select-option v-for="n in deptList" :value="n.id" :key="n.id">{{n.deptname}}</a-select-option>
      </a-select>
      <!--  -->
      <a-input v-model="add.account" placeholder="请输入登录账号" />
      <a-input v-model="add.uname" placeholder="请输入用户姓名" />
      <a-input v-model="add.passwd" type="password" placeholder="请输入登录密码" />
      <a-input v-model="add.confirm_passwd" type="password" placeholder="请再次输入登录密码" />
    </a-modal>
  </div>
</template>
<script>
const columns = [
  { title: "ID", width: 80, dataIndex: "uid" },
  { title: "用户角色", dataIndex: "rolename" },
  { title: "姓名", dataIndex: "uname" },
  { title: "所属研究中心／SMO公司", dataIndex: "inst_name" },
  { title: "登录账号", dataIndex: "account" },
  {
    title: "状态",
    dataIndex: "state_name",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 120,
    scopedSlots: { customRender: "action" }
  }
];
import {
  getUserList,
  getRoleList,
  addUser,
  getInst,
  getDept,
  getSmo,
  editState,
  editUser,
  getUserInfo,
  user_role
} from "@/api/default";
export default {
  name: "userManage",
  data() {
    return {
      columns,
      text: "停用",
      roleList: [], //筛选用
      creatRoleList: [], //创建角色用
      param: {
        search: "",
        role_id: undefined,
        p: 1
      },
      totalNum: 1, //列表总条数
      data: [],
      isEdit: false,
      add: {
        role_id: undefined,
        deptid: undefined,
        smo_id: undefined,
        instid: undefined,
        account: "",
        uname: "",
        passwd: "",
        confirm_passwd: ""
      },
      dataList: [],
      deptList: [], //科室列表
      visible: false, //添加账户弹框

      flag: false,
      research: false,
      smo: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //停启用
    ChangeState(n) {
      let status = n.state_name === "启用" ? "0" : "1";
      this.$confirm({
        title: "确定更改状态?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return editState({ uid: n.uid, state: status }).then(res => {
            this.$message.success(res.message);
            this.getList();
          });
        }
      });
    },
    //用户列表
    getList() {
      getUserList(this.param).then(res => {
        this.data = res.data.list;
        this.totalNum = res.data.totalRows;
      });
    },
    //分页
    changePage(n) {
      this.param.p = n;
      this.getList();
    },
    // 搜索
    searchList() {
      this.param.p = 1;
      this.getList();
    },
    //
    addAccount() {
      this.isEdit = false;
      this.visible = true;
    },
    //
    handleOk() {
      if (this.add.uid) {
        editUser(this.add).then(res => {
          if (res.err_no === 200) {
            this.visible = false;
            this.$message.success(res.message);
            this.getList();
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        addUser(this.add).then(res => {
          if (res.err_no === 200) {
            this.visible = false;
            this.$message.success(res.message);
            this.getList();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    //
    cancel() {
      this.visible = false;
    },
    //
    detail(n) {
      this.$router.push({
        path: "userDetail",
        query: {
          id: n.uid
        }
      });
    },
    //
    edit(n) {
      this.isEdit = true;
      this.visible = true;
      this.add.uid = n.uid;
      getUserInfo({ uid: n.uid }).then(res => {
        this.add = res.data;
        this.add.passwd = "";

        if (this.add.smo_id) {
          this.smo = true;
          getSmo().then(res => (this.dataList = res.data));
        } else {
          this.smo = false;
          this.add.smo_id = undefined;
        }

        if (this.add.instid) {
          this.flag = true;
          getInst().then(res => (this.dataList = res.data));
        } else {
          this.add.instid = undefined;
          this.flag = false;
        }

        if (this.add.deptid) {
          this.research = true;
          getDept({ instid: n.instid }).then(res => (this.deptList = res.data));
        } else {
          this.research = false;
          this.add.deptid = undefined;
        }
      });
    },
    changeUser(n) {
      if (n === "3") {
        this.research = true;
      } else {
        this.research = false;
      }

      if (n === "3" || n === "2") {
        this.flag = true;
        getInst().then(res => (this.dataList = res.data));
      } else {
        this.flag = false;
      }

      if (n === "4") {
        this.smo = true;
        getSmo().then(res => (this.dataList = res.data));
      } else {
        this.smo = false;
      }
    },
    changeInst(v) {
      getDept({ instid: v }).then(res => (this.deptList = res.data));
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  watch: {
    visible: function(val) {
      if (!val) {
        this.research = false;
        this.flag = false;
        this.smo = false;
        this.add = {
          role_id: undefined,
          deptid: undefined,
          smo_id: undefined,
          instid: undefined,
          account: "",
          uname: "",
          passwd: "",
          confirm_passwd: ""
        };
      }
    }
  },
  mounted() {
    getRoleList().then(res => {
      this.roleList = res.data;
    });
    user_role().then(res => {
      this.creatRoleList = res.data;
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList();
    });
  }
};
</script>
<style lang="stylus" scoped>
.content {
  padding: 30px;
}

.modal .ant-select {
  margin-top: 20px;
  width: 100%;
  // color:#BCBCBC;
}

.canUse /deep/ {
  position: relative;
  padding-left: 14px;
}

.canUse::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  height: 6px;
  width: 6px;
  background: #52C41A;
  border-radius: 50%;
  transform: translateY(-50%);
}

.cantUse /deep/ {
  position: relative;
  padding-left: 14px;
}

.cantUse::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  height: 6px;
  width: 6px;
  background: #F5222D;
  border-radius: 50%;
  transform: translateY(-50%);
}
</style>