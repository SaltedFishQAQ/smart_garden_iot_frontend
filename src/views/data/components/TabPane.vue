<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column v-loading="loading" label="ID" width="100" type="index" />

    <el-table-column min-width="300px" label="Device">
      <template slot-scope="{row}">
        <span>{{ row.device }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="200px" label="Area">
      <template slot-scope="{row}">
        <span>{{ row.area }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="Value" width="200">
      <template slot-scope="{row}">
        <span v-if="isNumber(row.value)">{{ row.value }}</span>
        <el-tag v-else :type="row.value | statusFilter">
          {{ row.value }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column width="280px" align="center" label="Created At">
      <template slot-scope="scope">
        <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}:{ss}') }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getDataList } from '@/api/data'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        on: 'success',
        off: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    measurement: {
      type: String,
      default: 'gate'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        size: 10,
        measurement: this.measurement
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getDataList(this.listQuery).then(response => {
        this.list = response.list
        this.loading = false
      })
    },
    isNumber(value) {
      return typeof value === 'number'
    }
  }
}
</script>

