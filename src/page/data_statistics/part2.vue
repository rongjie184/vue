<template>
  <!-- 第一个表 -->
  <div class="itemCont">
    <div class="title">不同年龄段CRC人数分布统计</div>
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
            <a-col :span="5">
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
                <a-button type="primary" html-type="submit">搜索</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <div class="chart">
        <Bar :list="chart1" />
      </div>
    </div>
  </div>
</template>
<script>
import {
  get_inst,
  get_dept,
  get_researcher_list,
  get_smo,
  get_crc_num
} from "@/api/data_manage";
import Bar from "./bar";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      inst_list: [],
      dept_list: [],
      researcher_list: [],
      smo_list: [],
      chart1: {
        load: false,
        name: [],
        data: []
      }
    };
  },
  computed: {
    ...mapGetters(["role"])
  },
  methods: {
    inst_change(value, option) {
      console.log(value);
      console.log(option);
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
          console.log(values);
          this.self_get_crc_num(values);
        }
      });
    },
    self_get_crc_num(param) {
      get_crc_num(param).then(res => {
        this.chart1.load = true;
        this.chart1.name = res.data.map(item => item.name);
        this.chart1.data = res.data.map(item => item.number);
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
    get_smo().then(res => {
      this.smo_list = res.data;
    });
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
        this.self_get_crc_num(values);
      }
    });
  },
  components: {
    Bar
  }
};
</script>

<style>
</style>