<template>
  <div class="content">
    <a-row>
      <a-col :span="12">
        <a-input-search
          v-model="param.search"
          placeholder="请输入SMO公司名称"
          @search="searchList"
          enterButton="搜索"
        />
      </a-col>
    </a-row>
    <!-- 表格 -->
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
        onChange: changePage
      }"
      :dataSource="data"
      :scroll="{ x: 800 }"
      :rowKey="record => record.id"
    >
      <span slot="action" class="operate" slot-scope="record">
        <a @click.stop="detail(record)">查看</a>
        <template v-if="role.id==1||role.id==4">
        <a-divider v-if="record.is_show_edit === 1 ? false : true" type="vertical" />
        <a v-if="record.is_show_edit === 1 ? false : true" @click.stop="edit(record)">修改</a>
        </template>
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  { title: "ID", width: 80, dataIndex: "id" },
  { title: "SMO公司名称", dataIndex: "smo_name" },
  { title: "提交人", dataIndex: "uname" },
  { title: "提交时间", dataIndex: "submit_time" },
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 120,
    scopedSlots: { customRender: "action" }
  }
];
import { questionList, getTitle } from "@/api/default";
import { mapGetters } from 'vuex';
export default {
  name: "psqManage",
  data() {
    return {
      columns,
      totalNum:1,
      data: [],
      param: {
        search: "",
        p: 1
      },
    };
  },
  computed:{
    ...mapGetters(["role"])
  },
  methods: {
    getList() {
      questionList(this.param).then(res => {
        this.data = res.data.list;
        this.totalNum = res.data.totalRows;
      });
    },
    searchList(){
      this.param.p = 1
      this.getList()
    },
    changePage(n) {
      this.param.p = n;
      this.getList();
    },
    detail(n) {
      this.$router.push({
        path: `/index/psqShow/${n.id}`
      });
    },
    edit(n) {
      this.$router.push({
        path: `/index/psqEdit/${n.id}`
      });
    }
  },
  created() {
    this.getList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList();
    });
  }
};
</script>
<style scoped lang="stylus">
.content {
  padding: 30px;
}
</style>