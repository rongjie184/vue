<template>
  <!-- 第一个表 -->
  <div class="itemCont">
    <div class="title">证书统计</div>
    <div id="part2">
      <a-form :form="form" @submit="handleSubmit">
        <div class="formItme" :style="{padding:'0 32px',margin:'40px 0'}">
          <a-row :gutter="24">
            <a-col :span="5">
              <a-form-item>
                <a-select
                  v-decorator="['year']"
                  placeholder="年度"
                  allowClear
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="item in year_list"
                    :key="item"
                    :value="item"
                  >{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5">
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
        <Bars :list="chart8" :option="{color:'#A7D2AD'}" :colors="['#B6CBDC','#DCB75F']"/>
      </div>
    </div>
  </div>
</template>
<script>
import {
  get_inst,
  get_smo,
  get_years_list,
  get_researcher_list,
  get_certificate
} from "@/api/data_manage";
import Bars from "./bars";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      year_list: [],
      inst_list: [],
      smo_list: [],
      researcher_list: [],
      chart8: {
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
          this.self_get_certificate(values);
        }
      });
    },
    self_get_certificate({ year,inst_id,smo_id } = { year:"",inst_id: "",smo_id:""}) {
      get_certificate({ instid: inst_id,smo_id:smo_id,year:year }).then(res => {
        let item = {name:[],data:[]}
        item.name = res.data.code
        item.data = res.data.data
        this.chart8 = item
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
    let promisa = get_inst().then(res => {
      this.inst_list = res.data;
    });
    let promisb = get_smo().then(res => {
      this.smo_list = res.data;
    });
    let promisc = get_years_list().then(res => {
      this.year_list = res.data;
    });
    Promise.all([promisa,promisb,promisc]).then(()=>{
      this.form.setFieldsValue({ 
        year:this.year_list[0],
        inst_id: this.role.inst_id,
        smo_id:this.smo_list[0].id
      });
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.self_get_certificate(values);
        }
      })
    })
  },
  components: {
    Bars
  }
};
</script>

<style>
</style>