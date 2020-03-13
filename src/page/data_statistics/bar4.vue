<template>
  <div :id="id" :style="{width:widht,height:height}"></div>
</template>
<script>
var echarts = require("echarts");
export default {
  props: {
    widht: {
      type: String,
      default: "1400px"
    },
    height: {
      type: String,
      default: "500px"
    },
    option: {
      type: Object,
      default: () => {}
    },
    //
    list: {
      type: Object,
      default: {
        load:false,
        data: ()=>[0],
        name: ()=>['']
      }
    }
  },
  data() {
    return {
      id: "echart" + Math.random()
    };
  },
  methods: {
    setEchart() {
      if (!this.list.load) {
        setTimeout(() => {
          this.setEchart();
        }, 300);
        return;
      }
      let num = this.list.data.reduce(function(prev, curr, idx, arr) {
        return prev + curr;
      });
      let option = {
        title: "CRC人数",
        color: "#AAD6FF",
        x_name: "年龄",
        x_line: "#DCDCDC",
        x_show:true,
        y_name: "单位：人",
        y_line: "#DCDCDC",
        series_name: "人数"
      };
      for (let key in this.option) {
        option[key] = this.option[key];
      }
      var myChart = echarts.init(document.getElementById(this.id));
      myChart.setOption({
        title: {
          text: option.title,
          textAlign: "center",
          left: "50%",
          padding: 0,
          textStyle: { fontWeight: "600", fontSize: "22" },
          height: "80"
        },
        tooltip: {},
        grid:{
          bottom:'35%' 
        },
        xAxis: {
          name: option.x_name,
          axisLine: {
            lineStyle: {
              color: option.x_line
            }
          },
          data: this.list.name,
          axisLabel: {
              interval: 0,
              rotate:"45"
            // formatter:function(value)  
            // {  
            //     return value.split("").join("\n");  
            // },  
          }
        },
        yAxis: {
          name: option.y_name,
          max: this.list.data.reduce(function(prev, curr, idx, arr) {
            return (prev-0) + (curr-0);
          }),
          axisLine: {
            lineStyle: {
              color: option.y_line
            }
          }
        },
        legend: {
          data: ["bar", "bar2", "bar3", "bar4"],
          align: "left",
          left: 10
        },
        series: [
          {
            name: option.series_name,
            label: {
              show: true,
              position: "top",
              color: option.color,
              fontSize: "14",
              align: "center",
              width: "100%"
            },
            type: "bar",
            itemStyle: {
              normal: { color: option.color }
            },
            barWidth: "28",
            data: this.list.data
          }
        ]
      });
    }
  },
  mounted() {
    this.setEchart();
  },
  watch: {
    'list.data': function(val) {
      this.setEchart();
    }
  }
};
</script>
<style>
</style>