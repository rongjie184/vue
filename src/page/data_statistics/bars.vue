<template>
  <div :style="{height:height}">
    <template v-if="rePrint">
      <div :id="id" :style="{width:widht,height:height}"></div>
    </template>
  </div>
</template>
<script>
var echarts = require("echarts");
export default {
  props: {
    widht: {
      type: String,
      default: "600px"
    },
    height: {
      type: String,
      default: "400px"
    },
    option: {
      type: Object,
      default: () => {}
    },
    //
    list: {
      type: Object,
      default: {
        data: [],
        name: []
      }
    },
    // 
    colors:{
      type:Array,
      default:()=>[  
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
        "#4BABDE",
        "#FFDE76",
        "#E43C59",
        "#37A2DA"
      ]
    }
  },
  data() {
    return {
      rePrint: true,
      id: "echart" + Math.random()
    };
  },
  methods: {
    setEchart() {
      if (this.list.data.length == 0) {
        setTimeout(() => {
          this.setEchart();
        }, 300);
        return;
      }
      this.list.data = this.list.data.map(item => {
        item = item.map(item2 => {
          item2 = item2 === null ? 0 : item2;
          return item2;
        });
        return item;
      });
      var myChart = echarts.init(document.getElementById(this.id));
      let option = {
        x_name: "",
        x_line: "#DCDCDC",
        y_name: "单位：个",
        y_line: "#DCDCDC",
      };
      for (let key in this.option) {
        option[key] = this.option[key];
      }
      myChart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: this.list.name,
          source: this.list.data
        },
        xAxis: { 
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#DCDCDC"
            }
          },  
        },
        yAxis: {
          name:option.y_name,
          max: function(value) {
            return value.max>=5?value.max:5;
          },
          axisLine: {
            lineStyle: {
              color: "#DCDCDC"
            }
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: (() => {
          let arr = [];
          for (let i = 0; i < this.list.name.length - 1; i++) {
            arr.push({
              type: "bar",
              itemStyle:{
                color:this.colors[i]
              },
              label:{
                normal: {
                    show: true,
                    position: 'top'
                }
              },
            });
          }
          return arr;
        })()
      });
    }
  },
  mounted() {
    this.setEchart();
  },
  watch: {
    list: function(val) {
      this.rePrint = false;
      this.$nextTick(() => {
        this.rePrint = true;
        this.$nextTick(() => {
          this.setEchart();
        });
      });
    }
  }
};
</script>
<style>
</style>