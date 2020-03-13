<template>
  <!-- 第一个表 -->
  <div class="itemCont">
    <div class="title">CRC从业时间人数统计</div>
    <div id="part2">
      <a-form :form="form" @submit="handleSubmit">
        <div class="formItme" :style="{padding:'0 32px',margin:'40px 0'}">
          <a-row :gutter="24">
            <a-col :span="5">
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
            <a-col :span="5">
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
            <a-col :span="5">
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
            <a-col :span="3">
              <a-form-item>
                <a-button type="primary" html-type="submit">搜索</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <div class="chart" :style="{display:'flex',overflowX:'scroll'}">
        <div class="chart">
          <Bar
            :list="chart2"
            :option="{
                color:'#FFD99A',
                x_name:''
              }"
          />
        </div>
        <div class="chart">
          <Pie :list="chart3" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  get_inst,
  get_dept,
  get_researcher_list,
  get_workyears,
  get_workyears_percentage
} from "@/api/data_manage";
import Bar from "./bar";
import Pie from "./pie";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      inst_list: [],
      dept_list: [],
      researcher_list: [],
      chart2: {
        load: false,
        name: [],
        data: []
      },
      // pie
      chart3: []
    };
  },
  computed: {
    ...mapGetters(["role"])
  },
  methods: {
    inst_change(value, option) {
      this.form.setFieldsValue({ dept_id: undefined });
      get_dept({ instid: value }).then(res => {
        this.dept_list = res.data;
      });
    },
    dept_change(value) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          get_researcher_list({ instid: values.inst_id, deptid: value }).then(
            res => {
              (this.researcher_list = res.data),
                this.form.setFieldsValue({ add_uid: undefined });
            }
          );
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_workyears(values);
        }
      });
    },
    self_workyears(param) {
      get_workyears(param).then(res => {
        this.chart2.load = true;
        this.chart2.name = res.data.map(item => item.name);
        this.chart2.data = res.data.map(item => item.number);
      });
      get_workyears_percentage(param).then(res => {
        this.chart3 = res.data;
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
  mounted() {
    get_inst().then(res => {
      this.inst_list = res.data;
    });
    this.form.setFieldsValue({ inst_id: this.role.inst_id });
    get_dept({ instid: this.role.inst_id })
      .then(res => {
        this.dept_list = res.data;
      })
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.self_workyears(values);
      }
    });
  },
  components: {
    Bar,
    Pie
  }
};
</script>

<style>
</style>