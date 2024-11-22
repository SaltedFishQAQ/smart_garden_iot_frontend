<template>
  <div class="device-container">
    <div class="table-title">Device</div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom: 24px;">
      <el-table-column label="ID" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Name" min-width="100">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="Area" min-width="100">
        <template slot-scope="{row}">
          {{ row.area_name }}
        </template>
      </el-table-column>

      <el-table-column label="Certification" width="200" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.auth_status | statusFilter">
            {{ row.auth_status == 1 ? 'Certified' : 'Not certified' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Running Status" width="200" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.running_status | statusFilter">
            {{ row.running_status == 1 ? 'Running': 'Stopping' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="400">
        <template slot-scope="{row}">
          <el-button
            v-if="row.auth_status == 0"
            type="primary"
            size="small"
            @click="setAuthStatus(row)"
          >
            Approve
          </el-button>
          <el-button
            v-else
            type="warning"
            size="small"
            @click="setAuthStatus(row)"
          >
            Cancel approval
          </el-button>

          <el-button
            v-if="row.running_status == 0"
            type="primary"
            size="small"
            @click="setRunningStatus(row)"
          >
            Start Running
          </el-button>
          <el-button
            v-else
            type="warning"
            size="small"
            @click="setRunningStatus(row)"
          >
            Stop running
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDeviceList } from '@/api/catalog'
import { running, approve } from '@/api/device'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
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
      getDeviceList().then(response => {
        this.list = response.list
      })
    },
    setAuthStatus(row) {
      this.list.forEach(item => {
        if (item.id !== row.id) {
          return
        }
        const targetStatus = item.auth_status === 1 ? 0 : 1
        const data = {
          'name': row.name,
          'status': targetStatus
        }
        approve(data).then(() => {
          item.auth_status = targetStatus
        }).catch(message => {
          console.log(message)
        })
      })
    },
    setRunningStatus(row) {
      this.list.forEach(item => {
        if (item.id !== row.id) {
          return
        }
        const targetStatus = item.running_status === 1 ? 0 : 1
        const data = {
          'name': row.name,
          'status': targetStatus
        }
        running(data).then(() => {
          item.running_status = targetStatus
        })
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
