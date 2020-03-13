<template>
  <!-- 第一个表 -->
  <div class="itemCont">
    <div class="title">CRC年度评价的每项平均评分随工作年限的统计图</div>
    <div id="part2">
      <a-form :form="form" @submit="handleSubmit">
        <div class="formItme" :style="{padding:'0 32px',margin:'40px 0'}">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item>
                <a-select
                  v-decorator="['inst_id']"
                  placeholder="请选择研究中心"
                  allowClear
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="item in inst_list"
                    :key="item.id"
                    :value="item.id"
                  >{{item.instname}}</a-select-option>
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
          <Line_chart :list="chart6" />
        </div>
    </div>
  </div>
</template>
<script>
import { get_inst, get_crc_grade } from "@/api/data_manage";
import Line_chart from "./line";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      inst_list: [],
      // line
      chart6: {
        x: [],
        data: []
      },
    };
  },
  computed:{
    ...mapGetters(["role"])
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_get_crc_grade(values);
        }
      });
    },
    self_get_crc_grade({ inst_id } = { inst_id: "" }) {
      get_crc_grade({ instid: inst_id }).then(res => {
        let item = {}
        item.x = res.data.years;
        item.data = res.data.data;
        this.chart6 = item
    });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    get_inst().then(res => {
      this.inst_list = res.data;
    });
    this.form.setFieldsValue({ inst_id: this.role.inst_id });
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.self_get_crc_grade(values);
      }
    });
  },
  components: {
    Line_chart
  }
};
</script>

<style>
</style>