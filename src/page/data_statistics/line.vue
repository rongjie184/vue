<template>
  <div :id="id" :style="{width:widht,height:height}"></div>
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
        x: [],
        data: []
      }
    }
  },
  data() {
    return {
      id: "echart" + Math.random(),
      symbol_list: [
        "circle",
        "rect",
        "roundRect",
        "triangle",
        "diamond",
        "pin",
        "arrow",
        "none"
      ],
      color_list: [
        "#F18200",
        "#7669B0",
        "#E7007B",
        "#B6CBDC",
        "#FFAEA2",
        "#A7D2AD",
        "#FFD99A",
        "#AAD6FF"
      ]
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
      let option = {
        title: "CRC人数",
        color: "#AAD6FF",
        x_name: "年龄",
        x_line: "#DCDCDC",
        y_name: "单位：人",
        y_line: "#DCDCDC",
        series_name: "人数"
      };
      for (let key in this.option) {
        option[key] = this.option[key];
      }

      let dataArr = [];
      let legend = ["name"];
      this.list.data.forEach((item, index) => {
        let option = {
          name: item.name,
          data: item.data,
          type: "line",
          symbol: this.symbol_list[index],
          symbolSize: 16,
          lineStyle: {
            normal: {
              color: this.color_list[index],
              width: 3
            }
          },
          itemStyle: {
            normal: {
              color: this.color_list[index]
            }
          }
        };
        dataArr.push(option);
        legend.push(item.name);
      });
      var myChart = echarts.init(document.getElementById(this.id));
      myChart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          orient: "horizontal",
          height: 40,
          data: legend
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.list.x,
          axisLine: {
            lineStyle: {
              color: "#DCDCDC"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 分"
          },
          axisLine: {
            lineStyle: {
              color: "#DCDCDC"
            }
          }
        },
        series: dataArr
      });
    }
  },
  mounted() {
    this.setEchart();
  },
  watch: {
    "list.data": function(val) {
      this.setEchart();
    }
  }
};
</script>
<style>
</style>