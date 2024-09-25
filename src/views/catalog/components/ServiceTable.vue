<template>
  <div class="service-container">
    <div class="table-title">Service</div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="ID" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Name" width="150">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="Description" min-width="100">
        <template slot-scope="{row}">
          {{ row.desc }}
        </template>
      </el-table-column>

      <el-table-column label="Running Status" width="200" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.running | statusFilter">
            {{ row.running == 1 ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getServiceList } from '@/api/catalog'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getServiceList().then(response => {
        this.list = response.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-title {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: bolder;
}
</style>
