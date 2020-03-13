<template>
  <div :id="id" :style="{width:widht,height:height}"></div>
</template>
<script>
var echarts = require("echarts");
export default {
  props: {
    widht: {
      type: String,
      default: "500px"
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
      type: Array,
      default:()=>[]
    },
    colors:{
      type:Array,
      default:()=>[  
        "#87D8E6",
        "#B7E46C",
        "#FFF48C",
        "#FA8076",
        "#B588BD",
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
      id: "echart" + Math.random()
    };
  },
  methods: {
    setEchart() {
      if (this.list.length == 0) {
        setTimeout(() => {
          this.setEchart();
        }, 300);
        return;
      }
      let option = {
        title:"CRC从业时间人数占比",
        series_name:"从业时间",
      }
      var myChart = echarts.init(document.getElementById(this.id));
      myChart.setOption({
        title: {
          text: option.title,
          // subtext: "副标题",
          x: "center",
          textStyle: { fontWeight: "600", fontSize: "22" },
          height: "80"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.list.map(item=>item.name)
        },
        series: [
          {
            name: option.series_name,
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.list.map(item=>{
              let obj = {}
              obj.value = item.number
              obj.name = item.name
              return obj
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal:{
                  color:(params)=>{
                  //自定义颜色
                  var colorList = this.colors;
                      return colorList[params.dataIndex]
                   }
              }
            }
          }
        ]
      });
    }
  },
  mounted() {
    this.setEchart();
  },
  watch: {
    list: function(val) {
      this.setEchart();
    }
  }
};
</script>
<style>
</style>