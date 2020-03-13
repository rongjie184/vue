<template>
  <div>
    <a-form :form="form" @submit="handleSubmit" class="ant-advanced-search-form projectAdd">
      <a-row :gutter="24">
        <a-col :span="11">
          <a-form-item class="size ant-form-item-required" label="项目简称:">
            <a-input placeholder="请输入项目简称" v-decorator="['shortname']" />
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item :style="{paddingLeft:'12px'}" label="项目编号:">
            <a-input placeholder="请输入项目编号" v-decorator="['item_number']" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="11">
          <a-form-item class="size ant-form-item-required" label="试验类型:">
            <a-select v-decorator="['test_id']" placeholder="试验类型" allowClear @change="testChange">
              <a-select-option v-for="n in testList" :value="n.code" :key="n.code">{{n.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item class="ant-form-item-required" label="试验分期:">
            <a-select v-decorator="['stage']" placeholder="试验分期" allowClear>
              <a-select-option v-for="n in stageList" :value="n.code" :key="n.code">{{n.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-show="flag" :gutter="24">
        <a-col :span="24" style="margin-left:80px;">
          <a-form-item class="ant-form-item-required" label>
            <a-radio-group v-decorator="['field_id']">
              <a-radio value="1">肿瘤临床试验</a-radio>
              <a-radio value="2">非肿瘤临床试验</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="11">
          <a-form-item class="size ant-form-item-required" label="启动时间:">
            <a-date-picker
              :style="{width:'100%'}"
              placeholder="启动时间"
              v-decorator="['start_time',{
                rules: [{ type: 'object'}],
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item  :style="{paddingLeft:'12px'}" label="试验结束时间:">
            <a-date-picker
              :style="{width:'100%'}"
              placeholder="试验结束时间"
              v-decorator="['end_time',{
                rules: [{ type: 'object'}],
              }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="11">
          <a-form-item class="size ant-form-item-required" label="研究中心:">
            <a-select
              v-decorator="['inst_id']"
              placeholder="研究中心"
              allowClear
              showSearch
              :showArrow="false"
              :filterOption="false"
              @search="handleSearch"
              @change="instChange"
              :notFoundContent="notFoundContent"
            >
              <a-select-option v-for="n in instList" :value="n.id" :key="n.id">{{n.instname}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item class="ant-form-item-required" label="适应症:">
            <a-input placeholder="请输入适应症" v-decorator="['indication']" />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  -->
      <a-row class="dynamic">
        <a-col :span="22">
          <a-form-item
            class="size"
            v-for="(k, index) in form.getFieldValue('keys')"
            :key="k"
            label="研究者:"
          >
            <a-select
              placeholder="研究者"
              v-decorator="[`researcher[${k}].uid`]"
              style="width:30%;margin-right:10px"
              allowClear
              showSearch
              :filterOption="filterOption"
            >
              <a-select-option v-for="n in reList" :value="n.uid" :key="n.uid">{{n.uname}}</a-select-option>
            </a-select>
            <a-button v-if="index === 0" type="primary" @click="add">添加</a-button>
            <a-button
              v-if="form.getFieldValue('keys').length > 1 && index > 0"
              type="primary"
              @click="() => remove(k)"
            >删除</a-button>
            <span style="margin-left:8%;color:#333">
              <b style="padding-right:7%">科室 :</b>
              <a-select
                placeholder="科室"
                v-decorator="[`researcher[${k}].uid`]"
                style="width:37%;"
                disabled
                :filterOption="filterOption"
              >
                <a-select-option v-for="n in reList" :value="n.uid" :key="n.uid">{{n.deptname}}</a-select-option>
              </a-select>
            </span>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- crc姓名 -->
      <a-row class="dynamic">
        <a-col :span="22">
          <a-form-item
            class="size"
            v-for="(k, index) in form.getFieldValue('crc')"
            :key="k"
            label="crc姓名:"
          >
            <a-select
              placeholder="crc姓名"
              v-decorator="[`crc_list_info[${k}].uid`]"
              style="width:30%;margin-right:10px"
              allowClear
              showSearch
              :filterOption="filterOption"
            >
              <a-select-option v-for="n in crcList" :value="n.uid" :key="n.uid">{{n.uname}}</a-select-option>
            </a-select>
            <a-button v-if="index === 0" type="primary" @click="addCrc">添加</a-button>
            <a-button
              v-if="form.getFieldValue('crc').length > 1 && index > 0"
              type="primary"
              @click="() => removeCrc(k)"
            >删除</a-button>
            <span style="margin-left:8%;color:#333">
              <b style="padding-right:8px">授权起止时间 :</b>
              <a-date-picker
                style="width:16.5%"
                placeholder="开始时间"
                v-decorator="[`crc_list_info[${k}].start_time`]"
              />
              <span :style="{ display: 'inline-block', width: '22px', textAlign: 'center' }">-</span>
              <a-date-picker
                style="width:16.8%"
                placeholder="结束时间"
                v-decorator="[`crc_list_info[${k}].end_time`]"
              />
            </span>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item class="size" label="备注:">
            <a-textarea
              v-decorator="['desc']"
              placeholder="详细内容..."
              :autosize="{ minRows: 4, maxRows: 6 }"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row style="text-align:center">
        <a-button @click="back">取消</a-button>
        <a-button style="margin:0 50px" html-type="submit" type="primary">保存</a-button>
      </a-row>
    </a-form>
  </div>
</template>
<script>
let aaa_id = 1,
  crc_id = 1;
import {
  getTestType,
  getTestStage,
  getInstList,
  getreList,
  createItem,
  getCrcList,
  getItemInfo,
  updateItem
} from "@/api/default";
import moment from "moment";
export default {
  data() {
    return {
      notFoundContent: "请输入查询中心",
      flag: false,
      testList: [], //试验类型
      stageList: [], //试验分期
      instList: [], //研究中心
      reList: [], //研究者列表
      crcList: [], //crc列表
      researcher: [{ dept_name: "" }]
    };
  },
  created() {
    this.handleSearch = _.debounce(
      searchStr => this.self_getInstList(searchStr),
      300
    );
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator("keys", { initialValue: [0], preserve: true });
    this.form.getFieldDecorator("crc", { initialValue: [0], preserve: true });
  },
  mounted() {
    this.getList();
  },
  methods: {
    moment,
    getList() {
      getTestType().then(res => (this.testList = res.data)); //试验类型
      getTestStage().then(res => (this.stageList = res.data)); //试验分期
      getInstList().then(res => {this.instList = res.data;}); //研究中心
      getCrcList().then(res => (this.crcList = res.data));
      let info = {};
      if (this.$route.query.id) {
        getItemInfo({ id: this.$route.query.id }).then(res => {
          info = res.data.info;
          this.instChange(info.inst_id);
          if (info.test_id === "1") this.flag = true;
          let keys = [0],
            crc = [0],
            crcList = [];
          // 研究者列表
          if (res.data.researcher_list.length != 0) {
            keys = res.data.researcher_list.map((itme, index) => index);
            aaa_id = res.data.researcher_list.length;
          }
          // crc列表
          if (res.data.crc_list.length != 0) {
            crcList = res.data.crc_list.map((item, index) => {
              if (item.id) {
                let crcItem = {}
                crcItem.uid = item.uid
                if(item.start_time&&item.start_time != 0){crcItem.start_time = moment(item.start_time)}
                if(item.end_time&&item.end_time != 0){crcItem.end_time = moment(item.end_time)}
                return crcItem
              }
            });
            crc = res.data.crc_list.map((item, index) => index);
          }
          // 结束时间不为空才能赋值
          if(info.end_time!=""&&info.end_time){
            this.form.setFieldsValue({end_time: moment(info.start_time)})
          }
          // 
          this.form.setFieldsValue({
            keys: keys,
            crc: crc,
            shortname: info.shortname,
            item_number: info.item_number,
            test_id: info.test_id,
            stage: info.stage,
            field_id: info.field_id,
            indication: info.indication,
            start_time: moment(info.start_time),
            inst_id: info.inst_id,
            desc: info.desc
          });
          this.$nextTick(() => {
            this.form.setFieldsValue({
              researcher: res.data.researcher_list.map(item => {
                let option = {};
                option.uid = item.uid;
                option.deptname = item.deptname;
                return option;
              })
            });
            this.form.setFieldsValue({
              crc_list_info: crcList
            });
          });
        });
      }
    },
    self_getInstList(searchStr) {
      searchStr = _.trim(searchStr);
      if (searchStr == "") {
        this.notFoundContent = "请输入查询中心";
        return;
      }
      getInstList({ search: searchStr }).then(res => {
        this.instList = res.data;
        if (res.data.length === 0) {
          this.notFoundContent = "暂无该中心";
        }
      }); //研究中心
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //研究者
    remove(k) {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      if (keys.length === 1) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      });
    },
    add() {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(++aaa_id);
      form.setFieldsValue({
        keys: nextKeys
      });
    },
    //crc姓名
    removeCrc(k) {
      const { form } = this;
      const crc = form.getFieldValue("crc");
      if (crc.length === 1) {
        return;
      }
      form.setFieldsValue({
        crc: crc.filter(crc => crc !== k)
      });
    },
    addCrc() {
      const { form } = this;
      const crc = form.getFieldValue("crc");
      const nextKeys = crc.concat(++crc_id);
      form.setFieldsValue({
        crc: nextKeys
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.end_time = values.end_time?values.end_time.format("YYYY-MM-DD"):"";
          values.start_time = values.start_time?values.start_time.format("YYYY-MM-DD"):"";
          values.crc_list_info = values.crc_list_info.map(item => {
            let crc_item = {};
            crc_item.uid = item.uid;
            crc_item.start_time = item.start_time
              ? item.start_time.format("YYYY-MM-DD")
              : "";
            crc_item.end_time = item.end_time
              ? item.end_time.format("YYYY-MM-DD")
              : "";
            return crc_item;
          });
          if (this.$route.query.id) {
            values.id = this.$route.query.id;
            updateItem(values).then(res => {
              if (res.err_no === 200) {
                this.$message.success(res.message);
                this.$router.back(-1);
              } else {
                this.$message.warning(res.message);
              }
            });
            return;
          }
          createItem(values).then(res => {
            if (res.err_no === 200) {
              this.$message.success(res.message);
              this.$router.back(-1);
            } else {
              this.$message.warning(res.message);
            }
          });
        }
      });
    },
    //是否显示肿瘤
    testChange(n) {
      if (n === "1") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    //获取研究者
    instChange(n) {
      getreList({ inst_id: n }).then(res => (this.reList = res.data));
    },
    //授权起止时间
    crcChange(n, t) {
      this.item.crc_list_info.map(v => {
        v.start_time = t[0];
        v.end_time = t[1];
      });
    },
    //
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped lang="stylus">
.ant-advanced-search-form {
  padding: 32px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic .ant-form-item {
  display: flex;
}

.ant-form-item-required:before {
  line-height: 3;
}
</style>