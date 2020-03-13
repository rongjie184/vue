<template>
  <div class="content">
    <a-form :form="form" @submit="searchProject">
      <a-row :gutter="24">
        <a-col :span="role.id!=3?4:8">
          <a-form-item>
            <a-input v-decorator="['search']" allowClear placeholder="请输入搜索内容" />
          </a-form-item>
        </a-col>
        <template v-if="role.id!=3">
          <a-col :span="4">
            <a-form-item>
              <a-select
                v-decorator="['inst_id']"
                placeholder="请选择研究中心"
                allowClear
                showSearch
                :filterOption="filterOption"
                @change="inst_change"
              >
                <a-select-option
                  v-for="item in inst_list"
                  :key="item.id"
                  :value="item.id"
                >{{item.instname}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-select
                v-decorator="['dept_id']"
                placeholder="请选择科室"
                allowClear
                showSearch
                :filterOption="filterOption"
                @change="dept_change"
              >
                <a-select-option
                  v-for="item in dept_list"
                  :key="item.id"
                  :value="item.id"
                >{{item.deptname}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-select
                v-decorator="['add_uid']"
                placeholder="请选择研究者"
                allowClear
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in researcher_list"
                  :key="item.uid"
                  :value="item.uid"
                >{{item.uname}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
        <a-col :span="role.id!=3?4:8">
          <a-form-item>
            <a-select style="width:100%" placeholder="试验类型" allowClear v-decorator="['test_id']">
              <a-select-option v-for="n in testList" :value="n.code" :key="n.code">{{n.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="role.id!=3?4:8">
          <a-form-item>
            <a-select style="width:100%" placeholder="试验分期" allowClear v-decorator="['stage']">
              <a-select-option v-for="n in stageList" :value="n.code" :key="n.code">{{n.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item>
            <span style="display;flex">
              启动时间:
              <a-range-picker
                style="width:75%"
                :placeholder="['开始时间', '结束时间']"
                v-decorator="['range_time_picker']"
                @change="tChange"
              />
            </span>
          </a-form-item>
        </a-col>
        <a-col :span="3">
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-col>
        <template v-if="role.id==1||role.id==2">
          <a-col style="text-align:right" :span="6" :offset="7">
            <a-button :style="{marginRight:'30px'}" type="primary" @click="showModal">批量导入</a-button>
            <a-button type="primary" @click="add">添加项目</a-button>
          </a-col>
        </template>
      </a-row>
    </a-form>
    <a-table
      style="margin-top:30px"
      :columns="columns"
      :loading="loading"
      :pagination="{
        total: totalNum,
        showTotal: totalNum => `共 ${totalNum} 条`,
        pageSize: 10,
        current:page,
        defaultCurrent: 1,
        showQuickJumper:true,
        onChange: changePage
      }"
      :dataSource="data"
      :scroll="{ x: 1300 }"
      :rowKey="record => record.id"
    >
      <span slot="action" class="operate" slot-scope="record">
        <template>
          <a @click.stop="detail(record)">详情</a>
        </template>
        <template v-if="role.id!=3&&role.id!=4">
          <a-divider type="vertical" />
          <a @click.stop="edit(record)">修改</a>
        </template>
        <template v-if="role.id!=3&&role.id!=4">
          <a-divider type="vertical" />
          <a @click.stop="del(record)">删除</a>
        </template>
      </span>
    </a-table>
    <a-modal
      title="批量导入"
      :visible="visible"
      @ok="handleOk"
      :footer="null"
      :confirmLoading="false"
      @cancel="handleCancel"
    >
      <div class="part">
        <div class="leftPart" @click="downloadTemplate">
          <img
            src="@/assets/img/download.png"
            alt="下载模版"
            :style="{width:'56px',height:'56px',border:'1px solid #ddd;',display:'block'}"
          />
          <div class="title">下载模版</div>
          <div class="text">1.下载模板</div>
          <div class="text">2.按模板标准输入各项信息</div>
          <div class="text">3.研究中心、研究者、科室、CRC、SMO内容必须为本平台数据库中已有内容</div>
          <div class="text">4.除CRC 科室 研究者外其他为必填项</div>
          
        </div>
        <div class="rightPart">
          <a-upload
            :style="{textAlign:'center',maxWidth:'100%'}"
            name="file"
            action="/index.php/admin/crc_manage/crc_import_upload"
            :headers="headers"
            @change="handleChange"
            :beforeUpload="beforeUpload"
            :fileList="fileList"
          >
            <img
              src="@/assets/img/upload.png"
              alt="上传文件"
              :style="{width:'56px',height:'56px',border:'1px solid #ddd;',display:'block'}"
            />
            <div class="title">上传文件</div>
          </a-upload>
          <div class="text">1.请将编辑好的模板点击上传</div>
        </div>
      </div>
      <div class="button" :style="{textAlign:'center',height:'80px',paddingTop:'40px'}">
        <a-button type="primary" @click="self_crc_import">开始导入</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  { title: "项目简称", dataIndex: "shortname" ,width: 200},
  { title: "研究中心", dataIndex: "inst_name" ,width: 200},
  { title: "科室", dataIndex: "dept" ,width: 140},
  { title: "研究者", dataIndex: "pi" ,width: 160},
  { title: "试验类型", dataIndex: "test_name" ,width: 140},
  { title: "试验分期", dataIndex: "stage_name" ,width: 140},
  { title: "启动时间", dataIndex: "start_time" ,width: 160},
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 160,
    scopedSlots: { customRender: "action" }
  }
];
import {
  getTestType,
  getTestStage,
  getInstList,
  itemList,
  delItem
} from "@/api/default";
import { get_dept, get_researcher_list } from "@/api/data_manage";
import { down_project_template, project_import } from "@/api/project_manage";
import { mapGetters } from "vuex";
export default {
  name: "projectManage",
  data() {
    return {
      columns,
      data: [],

      page: 1,
      totalNum: 1,
      loading: true,

      form: this.$form.createForm(this),
      testList: [],
      stageList: [],
      inst_list: [],
      dept_list: [],
      researcher_list: [],
      // 批量导入
      visible:false,
      headers: {
        authorization: "authorization-text"
      },
      file_path: "",
      file_name: "",
      fileList: [],

    };
  },
  computed: {
    ...mapGetters(["role"])
  },
  methods: {
    //列表
    getList(
      { search, inst_id, dept_id, add_uid, stage, test_id, date } = {
        search: undefined,
        inst_id: undefined,
        dept_id: undefined,
        add_uid: undefined,
        stage: undefined,
        test_id: undefined,
        data: undefined
      }
    ) {
      this.loading = true;
      itemList({
        search: search,
        inst_id: inst_id,
        dept_id: dept_id,
        add_uid: add_uid,
        stage: stage,
        test_id: test_id,
        date: date,
        p: this.page || 1
      }).then(res => {
        this.loading = false;
        this.data = res.data.list;
        this.totalNum = res.data.totalRows;
      });
    },
    // 搜索
    searchProject() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.page = 1;
          this.getList(values);
        }
      });
    },
    //分页
    changePage(n) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.page = n;
          this.getList(values);
        }
      });
    },
    // 时间
    tChange(n, t) {
      this.form.setFieldsValue({ date: t });
    },
    //
    del(n) {
      this.$confirm({
        title: "确定删除项目?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return delItem({ id: n.id }).then(res => {
            if (res.err_no == 200) {
              this.$message.success(res.message);
              this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  this.getList(values);
                }
              });
              return;
            }
            this.$message.error(res.message);
          });
        }
      });
    },

    add() {
      this.$router.push({
        path: "addProject"
      });
    },

    detail(n) {
      this.$router.push({
        path: "itemDetail",
        query: {
          id: n.id
        }
      });
    },

    edit(n) {
      this.$router.push({
        path: "addProject",
        query: {
          id: n.id
        }
      });
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    handleCancel(e) {
      this.visible = false;
    },
    beforeUpload(file) {
      this.fileList = [file];
    },
    handleChange(info) {
      if (info.file.status == "removed") {
        this.file_path = "";
        this.file_name = "";
        this.fileList = []
        return
      }
      if (info.file.status !== "uploading") {
        if (info.file.response) {
          this.file_path = info.file.response.data.file_path;
          this.file_name = info.file.response.data.file_name;
        }
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.fileList[0].name}上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.fileList[0].name}上传失败`);
      }
    },
    downloadTemplate() {
      down_project_template().then(res => {
        let a = document.createElement('a')
        a.href ="/" + res.data
        a.click();
      });
    },
    self_crc_import() {
      if (!this.file_path) {
        this.$message.error("请先上传列表文件");
        return;
      }
      // /index.php/admin/item/item_import
      project_import({ file_path: this.file_path }).then(res => {
        console.log(res);
        if (res.err_no == 200) {
          this.$message.success("导入成功");
          this.searchProject()
          this.handleOk()
          return;
        }
        this.$message.error(`失败：${res.message}`);
      });
    },
    // 
    inst_change(value, option) {
      get_dept({ instid: value }).then(res => {
        this.dept_list = res.data;
        this.researcher_list = [];
        this.form.setFieldsValue({ dept_id: undefined, add_uid: undefined });
      });
    },

    dept_change(value) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          get_researcher_list({ instid: values.inst_id, deptid: value }).then(
            res => {
              this.researcher_list = res.data;
              this.form.setFieldsValue({ add_uid: undefined });
            }
          );
        }
      });
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  created() {
    this.form.getFieldDecorator("date", {
      initialValue: undefined,
      preserve: true
    });
    getTestType().then(res => (this.testList = res.data)); //试验类型
    getTestStage().then(res => (this.stageList = res.data));
    getInstList().then(res => (this.inst_list = res.data)); //研究中心
    this.getList();
  },
  mounted() {
    // this.form.setFieldsValue({ inst_id: 957, dept_id: 25, add_uid: 52 });
    // this.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     this.page = 1;
    //     this.getList(values);
    //   }
    // });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          vm.getList(values);
        }
      });
    });
  }
};
</script>
<style lang="stylus" scoped>
.content {
  padding: 30px;
}
.part /deep/ {
  display: flex;

  .leftPart, .rightPart {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30px;
  }

  .title {
    color: #1890FF;
    line-height: 44px;
  }

  .text {
    font-size: 14px;
    line-height: 34px;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(188, 188, 188, 1);
  }
}
</style>