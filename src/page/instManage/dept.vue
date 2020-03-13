<template>
  <div class="content">
    <a-row type="flex" justify="space-between">
      <a-col :span="8">
        <a-input v-model="param.search" placeholder="请输入科室名称" />
      </a-col>
      <a-col :span="3">
        <a-select style="width:100%" placeholder="请选择状态" v-model="param.status">
          <a-select-option v-for="n in stateList" :value="n.id" :key="n.id">{{n.name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-button @click="searchList" type="primary">搜索</a-button>
      </a-col>
      <a-col :span="4">
        <a-button @click="checkDel" type="primary">批量删除</a-button>
      </a-col>
      <a-col style="text-align:right" :span="4">
        <a-button @click="flag = true" type="primary">+新建科室</a-button>
      </a-col>
    </a-row>
    <a-table
      style="margin-top:30px"
      :columns="columns"
      :pagination="{
        total: totalNum,
        current: param.p,
        showTotal: totalNum => `共 ${totalNum} 条`,
        pageSize: 10,
        defaultCurrent: 1,
        showQuickJumper:true,
        onChange: this.changePage
      }"
      :dataSource="data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :rowKey="record => record.id"
    >
      <span slot="action" class="operate" slot-scope="record">
        <a @click.stop="edit(record)">修改</a>
        <a-divider type="vertical" />
        <a @click.stop="ChangeState(record)">{{record.status === '1' ? '停用' : '启用'}}</a>
        <a-divider type="vertical" />
        <a @click.stop="del(record)">删除</a>
      </span>
    </a-table>
    <a-modal
      class="modal"
      :title="tit"
      okText="确认"
      cancelText="取消"
      v-model="flag"
      @ok="handleOk"
      @cancel="cancel"
    >
      <a-input v-model="deptname" placeholder="请输入科室名称" />
    </a-modal>
  </div>
</template>
<script>
const columns = [
  // { title: "ID", width: 80, dataIndex: "id" },
  { title: "科室名称", dataIndex: "deptname" },
  { title: "CRC数量", dataIndex: "crc" },
  { title: "状态", dataIndex: "status_name" },
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 160,
    scopedSlots: { customRender: "action" }
  }
];
import { deptList, deptStatus, createDept, delDept } from "@/api/default";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      columns,
      tit: "新建科室",
      data: [],
      param: {
        search: "",
        status: undefined,
        inst_id: this.$route.query.id,
        p: 1
      },
      flag: false,
      deptname: "",
      stateList: [
        { id: "0", name: "全部状态" },
        { id: "2", name: "停用" },
        { id: "1", name: "启用" }
      ],
      selectedRowKeys: [],
      id: ""
    };
  },
  computed:{
    ...mapGetters(["role"])
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    }
  },
  created() {
    this.getList();
  },
  methods: {
    searchList(){
      this.param.p = 1
      this.getList()
    },
    getList() {
      if(!this.param.inst_id){
        this.param.inst_id = this.role.inst_id
      }
      deptList(this.param).then(res => {
        if (res.err_no == 200) {
          this.data = res.data.list;
          this.totalNum = res.data.totalRows
          this.data.map(n => {
            return (n.status_name = n.status === "1" ? "启用" : "停用");
          });
          return;
        }
        this.$message.error(`${res.message}`);
      });
    },
    //确定添加
    handleOk() {
      createDept({
        deptname: this.deptname,
        id: this.id,
        inst_id: this.$route.query.id||this.role.inst_id
      }).then(res => {
        if (res.err_no === 200) {
          this.flag = false;
          this.$message.success(res.message);
          this.deptname = "";
          this.id = "";
          this.getList();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    createData() {
      this.tit = "新建科室";
      this.flag = true;
    },
    edit(n) {
      this.tit = "编辑科室";
      this.flag = true;
      this.deptname = n.deptname;
      this.id = n.id;
    },
    cancel() {
      this.deptname = "";
      this.id = "";
    },
    //分页
    changePage(n) {
      this.param.p = n;
      this.getList();
    },
    //更改状态
    ChangeState(n) {
      let status = n.status_name === "启用" ? "0" : "1";
      this.$confirm({
        title: "确定更改状态?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return deptStatus({ id: n.id, status: status }).then(res => {
            this.$message.success(res.message);
            this.getList();
          });
        }
      });
    },
    //删除公司
    del(n) {
      this.$confirm({
        title: "确定删除此科室?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return deptStatus({ id: n.id, status: -1 }).then(res => {
            this.$message.success(res.message);
            this.getList();
          });
        }
      });
    },
    //选择框
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //批量删除
    checkDel() {
      if (this.selectedRowKeys.length < 1) {
        this.$message.warning("请先选择要删除的研究中心!");
        return;
      }
      delDept({ id_arr: JSON.stringify(this.selectedRowKeys) }).then(res => {
        this.$message.success(res.message);
        this.getList();
      });
    }
  }
};
</script>
<style scoped lang="stylus">
.content {
  padding: 30px;
}
</style>