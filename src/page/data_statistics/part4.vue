<template>
  <!-- 第一个表 -->
  <div class="itemCont">
    <div class="title">SMO的CRC人数统计</div>
    <div id="part2">
      <a-form :form="form" @submit="handleSubmit">
        <div class="formItme" :style="{padding:'0 24px',margin:'20px 0 8px 0'}">
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
        <Bar4 :list="chart4" :option="{color:'#A7D2AD',x_name: 'SMO',x_show:false}" />
      </div>
    </div>
  </div>
</template>
<script>
import { get_smo, get_smocrc_people_num } from "@/api/data_manage";
import Bar4 from "./bar4";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      smo_list: [],
      chart4: {
        load: false,
        name: [],
        data: []
      }
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_get_smocrc_people_num(values);
        }
      });
    },
    self_get_smocrc_people_num({ smo_id } = { smo_id: "" }) {
      get_smocrc_people_num({ smo_id: smo_id }).then(res => {
        this.chart4.load = true;
        this.chart4.name = res.data.map(item => item.name);
        this.chart4.data = res.data.map(item => item.people_num);
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    this.self_get_smocrc_people_num();
    get_smo().then(res => {
      this.smo_list = res.data;
    });
  },
  components: {
    Bar4
  }
};
</script>

<style scoped lang="stylus">
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