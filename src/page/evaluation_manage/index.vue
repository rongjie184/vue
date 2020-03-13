<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <div class="formItme" :style="{padding:'0 32px',margin:'20px 0'}">
        <a-row :gutter="24">
          <a-col :span="5">
            <a-form-item>
              <a-input placeholder="项目简称" v-decorator="['search']" />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item>
              <a-select
                v-decorator="['type']"
                placeholder="请选择评价类型"
                allowClear
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in type_list"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item>
              <a-select
                v-decorator="['crc_id']"
                placeholder="请选择CRC"
                allowClear
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in crc_list"
                  :key="item.uid"
                  :value="item.uid"
                >{{item.uname}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item>
              <a-button type="primary" html-type="submit">搜索</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="3" v-if="userInfo.id!=4">
            <a-button type="primary" @click="del_evaluate" v-if="role.id==1">批量删除评价</a-button>
          </a-col>
          <a-col :span="3" v-if="userInfo.id!=4">
            <a-button :style="{float:'right'}" type="primary" @click="addEvaluation">添加评价</a-button>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <div class="tableItem">
      <div :style="{padding:'0 32px'}">
        <a-table
          :loading="loading"
          :columns="columns"
          :dataSource="list"
          :rowSelection="role.id==1?{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}:undefined"
          :scroll="{ x: 2180}"
          rowKey="id"
          :pagination="{
            showQuickJumper:true,
            current:page,
            hideOnSinglePage:false,
            pageSize:10,
            total:totalSize,
            showTotal: totalSize => `共 ${totalSize} 条`,
            onChange:changePage
          }"
        >
          <!-- 时间格式化 -->
          <template
            slot="add_time"
            slot-scope="text"
            type="link"
          >{{text|parseTime('{y}-{m}-{d} {h}:{i}')}}</template>
          <!-- 状态 -->
          <template slot="e_type" slot-scope="text" type="link">
            <span v-if="text=='已申诉'" :style="{color:'#f5222d'}">{{text}}</span>
            <span v-else-if="text=='待反馈'" :style="{color:'#f5222d'}">{{text}}</span>
            <span v-else>{{text}}</span>
          </template>
          <!-- 证书 -->
          <template slot="certification" slot-scope="text, record, index">
            <template v-if="record.file_address!=''&&record.file_address!=null">
              <a type="link"
                @click.stop="() => showImg(text,record,index)"
              >查看</a>
            </template>
            <template v-else-if="record.type==1&&role.id!=4&&role.id!=3&&record.is_finish==1">
              <a type="link"
                @click.stop="() => creatCertific(text,record,index)"
              >生成证书</a>
            </template>
          </template>
          <!-- 按钮功能 -->
          <!-- status 0待评价 1待反馈 2已反馈 3已申诉 4同意申诉 5拒绝申诉-->
          <template slot="action" slot-scope="text, record, index">
            <template v-if="userInfo.id!=4">
              <!--待申诉 管理员可申诉 -->
              <template v-if="userInfo.id==1&&record.status==2">
                <a type="link" @click.stop="() => show(text,record,index)">申诉</a>
                <a-divider type="vertical" />
              </template>
              <!-- 待评价时 三人均可评价 -->
              <template v-if="record.status==0">
                <a :style="{color:'#52c41a'}"  type="link" @click.stop="() => edit(text,record,index)">评价</a>
                <a-divider type="vertical" />
              </template>
              <!-- 待反馈 管理员&机构可以反馈-->
              <template v-if="record.status==1&&userInfo.id!=3&&userInfo.id!=4">
                <a type="link" @click="() => feedback(text,record,index)" >反馈</a>
                <a-divider  type="vertical" />
              </template>
              <!-- 反馈之前才可以修改 三人均可修改 -->
              <template v-if="record.status==1||record.status==4">
                <a type="link" @click.stop="() => edit(text,record,index)">修改</a>
                <a-divider  type="vertical" />
              </template>
            </template>
            <!-- smo -->
            <template v-if="userInfo.id==4">
              <a v-if="record.status==2" type="link" @click.stop="() => show(text,record,index)">申诉</a>
              <a-divider v-if="record.status==2" type="vertical" />
            </template>
            <!--  -->
            <a type="link" @click="() => show(text,record,index)">详情</a>
          </template>
        </a-table>
      </div>
    </div>
    <!--  -->
    <a-modal
      title="证书"
      :visible="visible"
      :footer="null"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <img :src="certificate" alt :style="{width:'100%',height:'auto'}" />
    </a-modal>
    <!-- <div class="title">SMO公司列表状态以及对应操作</div> -->
    <!-- <div class="title">管理员列表状态以及对应操作</div> -->
  </div>
</template>
<script>
const columns = [
  { title: "姓名", dataIndex: "crc_name", fixed: "left", width: 100 },
  { title: "所属的SMO", dataIndex: "smo", width: 200 },
  { title: "项目简称", dataIndex: "shortname", width: 200 },
  { title: "科室", dataIndex: "dept", width: 160 },
  { title: "研究者", dataIndex: "pi", width: 160 },
  { title: "试验类型", dataIndex: "test_name", width: 100 },
  { title: "试验分期", dataIndex: "test_stage", width: 100 },
  { title: "评价类型", dataIndex: "type_name", width: 100 },
  {
    title: "评价时间",
    dataIndex: "add_time",
    width: 200,
    scopedSlots: { customRender: "add_time" }
  },
  { title: "评价研究者", dataIndex: "username", width: 200 },
  { title: "评价机构办公室", dataIndex: "institution", width: 200 },
  {
    title: "状态",
    dataIndex: "e_type",
    width: 140,
    scopedSlots: { customRender: "e_type" }
  },
  {
    title: "证书",
    // fixed: "right",
    width: 120,
    scopedSlots: { customRender: "certification" }
  },
  // {
  //   title: "添加时间",
  //   dataIndex: "add_time",
  //   width: 150,
  //   scopedSlots: { customRender: "add_time" }
  // },
  {
    title: "操作",
    fixed: "right",
    width: 200,
    scopedSlots: { customRender: "action" }
  }
];
import {
  crc_list,
  get_type_list,
  evaluate_list,
  get_role,
  del_evaluate,
  feedback
} from "@/api/evaluate_manage";
import { create_finish_certificate } from "@/api/crc_manage";
import { mapGetters } from "vuex";
export default {
  name: "evaluation",
  data() {
    return {
      loading: true,
      // 删除评价列表
      selectedRowKeys: [],
      // 证书弹窗
      visible: false,
      certificate: "",
      //
      page: 1,
      totalSize: 0,
      //
      form: this.$form.createForm(this),
      columns,
      list: [],
      crc_list: [],
      type_list: [],
      userInfo: {} //id=1=>管理员||2=>研究机构||4=>SMO
    };
  },
  computed: {
    ...mapGetters(["role"])
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    del_evaluate() {
      if (this.role.id != 1) {
        this.$message.error("该操作只有管理员可以进行。");
        return;
      }
      if (this.selectedRowKeys.length === 0) {
        this.$message.error("请先选择评价");
        return;
      }
      this.$confirm({
        title: "确定删除选中的评价?",
        onOk: () => {
          return del_evaluate({ id_arr: this.selectedRowKeys }).then(res => {
            if (res.err_no == 200) {
              this.$message.success(res.message);
              this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  this.self_evaluate_list(values);
                }
              });
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    handleCancel(e) {
      this.visible = false;
      this.certificate = "";
    },
    handleSubmit(e) {
      if (e) e.preventDefault();
      this.page = 1;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_evaluate_list(values);
        }
      });
    },
    changePage(n) {
      this.page = n;
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_evaluate_list(values);
        }
      });
    },
    self_evaluate_list(
      { search, type, crc_id } = {
        search: "",
        type: "",
        crc_id: ""
      }
    ) {
      this.loading = true;
      evaluate_list({
        search: search,
        type: type,
        crc_id: crc_id,
        p: this.page||1
      }).then(res => {
        this.loading = false;
        this.list = res.data.list;
        this.totalSize = res.data.totalRows;
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    show(text, item, index) {
      this.$router.push({ path: `/index/showEvaluation/${item.id}` });
    },
    edit(text, item, index) {
      this.$router.push({ path: `/index/editEvaluation/${item.id}` });
    },
    showImg(text, item, index) {
      this.certificate = item.file_address;
      this.visible = true;
    },
    creatCertific(text, item, index){
      this.$confirm({
        title: "提示?",
        content: "确定生成完成证书？",
        onOk:()=>{
          return create_finish_certificate({ id: item.id }).then(res => {
            if (res.err_no == 200) {
              this.$message.success("生成成功");
              item.file_address = res.data;
              item.is_finish = 0
              item.is_zhengshu = 1
              return;
            }
            this.$message.error(`生成失败：${res.message}`);
          })
        },
        onCancel:()=>{}
      });
    },
    feedback(text, item, index) {
      this.$confirm({
        title: "提示：",
        content: `确认反馈？`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return feedback({ id: item.id }).then(res => {
            if (res.err_no == 200) {
              this.$message.success("反馈成功");
              this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  this.self_evaluate_list(values);
                }
              });
              return;
            }
            this.$message.error(`反馈失败${res.message}`);
          });
        },
        onCancel() {}
      });
    },
    addEvaluation() {
      this.$router.push({ path: "/index/addEvaluation" });
    }
  },
  mounted() {
    this.self_evaluate_list();
    get_role().then(res => {
      this.userInfo = res.data;
    });
    crc_list().then(res => {
      this.crc_list = res.data;
    });
    get_type_list().then(res => {
      this.type_list = res.data;
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loading = true;
      vm.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          vm.self_evaluate_list(values);
        }
      });
    });
  }
};
</script>
<style lang="stylus" scoped>
.title {
  margin: 16px 0;
  height: 54px;
  line-height: 54px;
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 500;
  color: #5a5a5a;
  padding-left: 45px;
  position: relative;
  background: #ffffff;

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

.ant-form-item /deep/ {
  margin-bottom: 0;
}

.ant-row {
  overflow: hidden;
}

a {
  color: #1890ff;
}
</style>