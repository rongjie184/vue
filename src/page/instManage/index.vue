<template>
  <div class="content">
    <a-row type="flex" justify="space-between">
      <a-col :span="8">
        <a-input v-model="param.search" placeholder="请输入研究中心名称" />
      </a-col>
      <a-col :span="3">
        <a-select style="width:100%" placeholder="请选择状态" v-model="param.status">
          <a-select-option v-for="n in stateList" :value="n.id" :key="n.id">{{n.name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-button @click="searchInst" type="primary">搜索</a-button>
      </a-col>
      <a-col :span="4">
        <a-button @click="checkDel" type="primary">批量删除</a-button>
      </a-col>
      <a-col style="text-align:right" :span="4">
        <a-button @click="createData" type="primary">添加研究中心</a-button>
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
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :rowKey="record => record.id"
    >
      <span
        slot="status"
        :class="record.status_name=='启用'?'canUse':'cantUse'"
        slot-scope="text, record"
      >{{record.status_name}}</span>
      <span slot="action" class="operate" slot-scope="record">
        <a @click.stop="edit(record)">修改</a>
        <a-divider type="vertical" />
        <a @click.stop="ChangeState(record)">{{record.status === '1' ? '停用' : '启用'}}</a>
        <a-divider type="vertical" />
        <a @click.stop="del(record)">删除</a>
        <a-divider type="vertical" />
        <a @click.stop="deptmanage(record)">科室管理</a>
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
      <a-input v-model="instname" placeholder="请输入研究中心名称" />
    </a-modal>
  </div>
</template>
<script>
const columns = [
  // { title: "ID", width: 80, dataIndex: "id" },
  { title: "研究中心名称", dataIndex: "instname" },
  { title: "CRC数量", dataIndex: "crc" },
  {
    title: "状态",
    dataIndex: "status_name",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 238,
    scopedSlots: { customRender: "action" }
  }
];
import { instList, instStatus, createInst, delInst } from "@/api/default";
export default {
  name: "instManage",
  data() {
    return {
      columns,
      tit: "新建研究中心",
      totalNum: 1,
      data: [],
      param: {
        search: "",
        status: undefined,
        p: 1
      },
      flag: false,
      instname: "",
      stateList: [
        { id: "0", name: "全部状态" },
        { id: "2", name: "停用" },
        { id: "1", name: "启用" }
      ],
      selectedRowKeys: [],
      id: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    searchInst() {
      this.param.p = 1;
      this.getList();
    },
    getList() {
      instList(this.param).then(res => {
        this.data = res.data.list;
        this.totalNum = res.data.totalRows;
        this.data.map(n => {
          return (n.status_name = n.status === "1" ? "启用" : "停用");
        });
      });
    },
    deptmanage(n) {
      this.$router.push({
        path: "deptManage",
        query: {
          id: n.id
        }
      });
    },
    //确定添加
    handleOk() {
      createInst({ instname: this.instname, id: this.id }).then(res => {
        if (res.err_no === 200) {
          this.flag = false;
          this.$message.success(res.message);
          this.instname = "";
          this.id = "";
          this.getList();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    createData() {
      this.tit = "新建研究中心";
      this.flag = true;
    },
    edit(n) {
      this.tit = "编辑研究中心";
      this.flag = true;
      this.instname = n.instname;
      this.id = n.id;
    },
    cancel() {
      this.instname = "";
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
          return instStatus({ id: n.id, status: status }).then(res => {
            this.$message.success(res.message);
            this.getList();
          });
        }
      });
    },
    //删除公司
    del(n) {
      this.$confirm({
        title: "确定删除研究中心?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return instStatus({ id: n.id, status: -1 }).then(res => {
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
      delInst({ id_arr: JSON.stringify(this.selectedRowKeys) }).then(res => {
        this.$message.success(res.message);
        this.getList();
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList();
    });
  }
};
</script>
<style scoped lang="stylus">
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

.content {
  padding: 30px;
}
</style>