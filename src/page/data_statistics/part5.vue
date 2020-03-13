<template>
  <!-- 第一个表 -->
  <div class="itemCont">
    <div class="title">CRC科室分布统计</div>
    <div id="part2">
      <a-form :form="form" @submit="handleSubmit">
        <div class="formItme" :style="{padding:'0 32px',margin:'40px 0'}">
          <a-row :gutter="24">
            <a-col :span="8">
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
      <div class="can">
        <Bar :list="chart5" :option="{color:'#FFAEA2',x_name: '科室'}" />
      </div>
    </div>
  </div>
</template>
<script>
import { get_smo, get_crc_dept_distribution } from "@/api/data_manage";
import Bar from "./bar4";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      smo_list: [],
      chart5: {
        load: false,
        name: [],
        data: []
      }
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
          this.self_get_crc_dept_distribution(values);
        }
      });
    },
    self_get_crc_dept_distribution({ smo_id } = { smo_id: "" }) {
      get_crc_dept_distribution({ smo_id: smo_id }).then(res => {
        this.chart5.load = true;
        this.chart5.name = res.data.map(item => item.dept_name);
        this.chart5.data = res.data.map(item => item.people_num);
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    get_smo().then(res => {
      this.smo_list = res.data;
      this.form.setFieldsValue({ smo_id: this.role.smo_id||this.smo_list[0].id });
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_get_crc_dept_distribution(values);
        }
      });
    });
  },
  components: {
    Bar
  }
};
</script>

<style scoped>
.can{
  width:94%;
  margin-left:3%;
  overflow:hidden;
  overflow-x:scroll;
  border:1px solid #ccc;
  padding-top:30px;
  margin-bottom:20px;
}
</style>