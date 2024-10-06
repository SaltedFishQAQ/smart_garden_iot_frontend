<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in measurementList" :key="item" :label="item | labelFilter" :name="item">
        <keep-alive>
          <tab-pane v-if="activeName==item" :measurement="item" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import { getMeasurementList } from '@/api/data'

export default {
  name: 'Data',
  components: { TabPane },
  filters: {
    labelFilter(label) {
      if (label !== 'default') {
        return label
      }

      return 'operation'
    }
  },
  data() {
    return {
      measurementList: [],
      activeName: 'gate'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    this.fetchMeasurementList()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    fetchMeasurementList() {
      getMeasurementList().then(response => {
        this.measurementList = response.list
        if (this.measurementList.length > 0) {
          this.activeName = this.measurementList[0]
        }
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
