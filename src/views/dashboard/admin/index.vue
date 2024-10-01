<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import BoxCard from './components/BoxCard'
import { getMeasurementList, getDataList } from '@/api/data'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
    // TransactionTable,
    // BoxCard
  },
  data() {
    return {
      numericalData: ['humidity', 'temperature'],
      lineChartData: {},
      measurementList: [],
      dataSet: {},
      dataType: 'temperature'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.fetchMeasurementList()
    },
    handleSetLineChartData() {
      this.lineChartData = Object.keys(this.dataSet)
        .filter(key => this.measurementList.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.dataSet[key]
          return obj
        }, {})
    },
    fetchMeasurementList() {
      getMeasurementList().then(response => {
        this.measurementList = response.list
        this.fetchDataList()
      })
    },
    fetchDataList() {
      this.dataSet = {}
      const promises = this.measurementList.map(item => {
      // const promises = this.numericalData.map(item => {
        const params = {
          'measurement': item,
          'page': 1,
          'size': 10
        }
        return getDataList(params).then(response => {
          this.$set(this.dataSet, item, response.list)
        })
      })
      Promise.all(promises).then(() => {
        this.handleSetLineChartData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
