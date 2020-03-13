<template>
  <div class="crcList" :style="{padding:'32px'}">
    <a-form :form="form" @submit="handleSubmit">
      <div class="formItme">
        <a-row :gutter="24">
          <a-col :span="6" v-if="role.id!=3">
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
          <a-col :span="6" v-if="role.id!=3">
            <a-form-item>
              <a-select
                v-decorator="['dept_id']"
                placeholder="请选择科室"
                allowClear
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in dept_list"
                  :key="item.id"
                  :value="item.id"
                >{{item.deptname}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input
                v-decorator="['uname']"
                placeholder="请输入crc姓名/手机号"
                allowClear
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-select
                v-decorator="['age']"
                placeholder="年龄"
                allowClear
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in age_list"
                  :key="item.code"
                  :value="item.code"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="6" v-if="role.id!=4">
            <a-form-item>
              <a-select
                v-decorator="['smo_id']"
                placeholder="请选择SMO公司"
                allowClear
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in smo_list"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item>
              <a-checkbox
                v-decorator="[
                  'year_ccie',
                  {
                    valuePropName: 'checked',
                    initialValue: false,
                  }
                ]"
              >年度证书</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item>
              <a-checkbox
                v-decorator="[
                  'finish_ccie',
                  {
                    valuePropName: 'checked',
                    initialValue: false,
                  }
                ]"
              >完成证书</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item>
              <a-button type="primary" html-type="submit">搜索</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="role.id==1||role.id==2">
          <a-col :span="24">
            <a-form-item>
              <a-button :style="{float:'right'}" class="margin_left_30" type="primary" @click="showModal">批量导入</a-button>
              <a-button :style="{float:'right'}" class="margin_left_30" type="primary" @click="self_crc_export" v-if="role.id==1">导出</a-button>
              <a-button :style="{float:'right'}" class="margin_left_30" type="primary" @click="del_crc" v-if="role.id==1">批量删除CRC</a-button>
              <a-button :style="{float:'right'}" type="primary" @click="add_crc">添加CRC</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table 
      :columns="columns"
      :dataSource="list"
      :scroll="{ x: 1340}"
      rowKey="uid"
      :loading="loading"
      :rowSelection="role.id==1?{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}:undefined"
      :pagination="{
        showQuickJumper:true,
        current:page,
        hideOnSinglePage:false,
        pageSize:10,
        total:totlaSize,
        onChange:pageChange,
        showTotal: totalSize => `共 ${totalSize} 条`,
      }"
    >
      <!-- 改的时标题 -->
      <!-- <span slot="customTitle">
        <a-icon type="smile-o" />Name
      </span>-->
      <!-- 时间格式化 -->
      <template slot="work_time" slot-scope="text" type="link">{{text|parseTime('{y}-{m}-{d}')}}</template>
      <!--  -->
      <!-- <template slot="check_time" slot-scope="text" type="link">{{text|parseTime('{y}-{m}-{d}')}}</template> -->
      <!-- 按钮功能 -->
      <template slot="action" slot-scope="text, record, index">
        <a :style="{color:'#1890FF'}" @click.stop="() => to_info(text,record,index)">查看</a>
        <template v-if="role.id!=4&&role.id!=3">
          <span :style="{color:'#E9E9E9'}">|</span>
          <a :style="{color:'#1890FF'}" @click.stop="() => to_edit(text,record,index)">编辑</a>
        </template>
      </template>
    </a-table>
    <!--  -->
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
          <div class="text">1.下载模板，按模板标准输入CRC信息</div>
        </div>
        <div class="rightPart">
          <a-upload
            :style="{textAlign:'center',maxWidth:'100%'}"
            name="file"
            action="/index.php/admin/crc_manage/upload_fj"
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
          <div class="text">2.请将编辑好的模板点击上传</div>
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
  { title: "姓名", dataIndex: "uname", fixed: "left", width: 100 },
  { title: "手机号", dataIndex: "phone", width: 160 },
  {
    title: "从业时间",
    dataIndex: "work_time",
    width: 160,
    scopedSlots: { customRender: "work_time" }
  },
  { title: "性别", dataIndex: "sex", width: 100 },
  { title: "身份证号", dataIndex: "pidnum", width: 200 },
  { title: "年龄", dataIndex: "ages", width: 100 },
  { title: "SMO公司", dataIndex: "smo_name", width: 200 },
  { title: "年度证书数量", dataIndex: "year_ccie", width: 100 },
  { title: "完成证书数量", dataIndex: "finish_ccie", width: 100 },
  {
    title: ''   //此处添加一个空列，让此列去自适应一行宽度
  },
  {
    title: "操作",
    fixed: "right",
    width: 120,
    scopedSlots: { customRender: "action" }
  }
];
import {
  get_years_list,
  get_dept,
  get_researcher_list
} from "@/api/data_manage";
import {
  crc_list,
  del_crc,
  crc_age,
  crc_import,
  crc_export,
  down_template,
} from "@/api/crc_manage";
import { getInstList, getSmo } from '../../api/default';
import { mapGetters } from "vuex";
export default {
  name:"crcList",
  data() {
    return {
      loading:true,
      // 
      visible: false,
      //
      form: this.$form.createForm(this),
      columns,
      selectedRowKeys: [],
      inst_list: [],
      dept_list: [],
      smo_list: [],
      age_list: [],
      list: [],
      // 上传列表
      headers: {
        authorization: "authorization-text"
      },
      file_path: "",
      file_name: "",
      fileList: [],
      // 
      page:1,
      totlaSize:0
    };
  },
  computed:{
    ...mapGetters(["role"])
  },
  methods: {
    pageChange(e){
      this.page = e
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_crc_list(values);
        }
      });
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
    inst_change(value, option) {
      this.form.setFieldsValue({ dept_id: undefined });
      get_dept({ instid: value }).then(res => {
        this.dept_list = res.data;
      });
    },
    handleSubmit(e) {
      if(e){e.preventDefault();}
      this.page = 1
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_crc_list(values);
        }
      });
    },
    self_crc_list(
      { inst_id, dept_id, uname, age, smo_id, year_ccie, finish_ccie } = {
        inst_id: "",
        dept_id: "",
        uname: "",
        age: "",
        smo_id: "",
        year_ccie: "",
        finish_ccie: ""
      }
    ) {
      this.loading = true
      crc_list({
        uname: uname,
        instid: inst_id,
        deptid: dept_id,
        smo_id: smo_id,
        age: age,
        year_ccie: year_ccie ? 1 : 0,
        finish_ccie: finish_ccie ? 1 : 0,
        p:this.page||1
      }).then(res => {
        this.loading = false
        this.list = res.data.list;
        this.totlaSize = res.data.totalRows
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    to_edit(text, item, index) {
      this.$router.push({ path: `/index/crcEdit/${item.uid}` });
    },
    to_info(text, item, index) {
      this.$router.push({ path: `/index/crcInfo/${item.uid}` });
    },
    add_crc(text, item, index) {
      this.$router.push({ path: `/index/crcAdd` });
    },
    del_crc(){
      if(this.role.id!=1){
        this.$message.error('该操作只有管理员可以进行。')
        return
      }
      if(this.selectedRowKeys.length===0){
        this.$message.error('请先选择CRC')
        return
      }
      this.$confirm({
        title: "确定删除选中的CRC?",
        onOk: () => {
          return del_crc({id_arr : this.selectedRowKeys}).then(res=>{
            if(res.err_no==200){
              this.$message.success(res.message);
              this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  this.self_crc_list(values);
                }
              });
            }else{
              this.$message.error(res.message);
            }
          });
        }
      });
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
      down_template().then(res => {
        let a = document.createElement('a')
        a.href ="/" + res.data
        a.click();
      });
    },
    self_crc_export() {
      this.$confirm({
        title: "导出CRC",
        content: "是否确定导出CRC？",
        onOk:()=> {
          return crc_export().then(res => {
            if(res.err_no!=200){
              this.$message.error(`导出失败：${res.message}`)
              console.log('失败')
              return
            }
            let a = document.createElement('a')
            a.href ="/" + res.data
            a.click();
          });
        },
        onCancel() {}
      });
    },
    self_crc_import() {
      if (!this.file_path) {
        this.$message.error("请先上传列表文件");
        return;
      }
      crc_import({ file_path: this.file_path }).then(res => {
        console.log(res);
        if (res.err_no == 200) {
          this.$message.success("导入成功");
          this.handleSubmit()
          this.handleOk()
          return;
        }
        this.$message.error(`失败：${res.message}`);
      });
    },
    addItme() {
      console.log(this.param);
      return;
    }
  },
  mounted() {
    this.self_crc_list();
    getInstList().then(res => {
      this.inst_list = res.data;
    });
    getSmo().then(res => {
      this.smo_list = res.data;
    });
    crc_age().then(res => {
      this.age_list = res.data;
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loading = true;
      vm.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          vm.self_crc_list(values);
        }
      });;
    });
  }
};
</script>
<style lang="stylus" scoped>
.margin_left_30 {
  margin-left: 30px;
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