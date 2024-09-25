<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      colorList: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        // TODO: limit into 5
        const k = Object.keys(val)
        const seriesData = []
        k.forEach((key, index) => {
          seriesData.push({
            name: key, itemStyle: {
              normal: {
                color: this.colorList[index],
                lineStyle: {
                  color: this.colorList[index],
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: val[key].map(item => item.value),
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          })
        })

        this.setOptions(k, seriesData)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(dataType, seriesData) {
      this.chart.setOption({
        xAxis: {
          data: ['-55min', '-50min', '-45min', '-40min', '-35min', '-30min', '-25min', '-20min', '-15min', '-10min', '-5min', '0'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: dataType
        },
        series: seriesData
      })
    }
  }
}
</script>
