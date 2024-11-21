<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="role==1" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Area Name" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Soil Type" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.soil_type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="User" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Description" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">

        <el-form-item label="Area Name">
          <el-input v-model="temp.name" :disabled="temp.id > 0" />
        </el-form-item>

        <el-form-item label="User">
          <el-select v-model="temp.user_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Soil Type">
          <el-select v-model="temp.soil_type" class="filter-item" placeholder="Please select" :disabled="temp.id > 0">
            <el-option v-for="item in soilOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="Description">
          <el-input v-model="temp.desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAreaList, createArea, updateArea } from '@/api/area'
import { getUserList } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getUser } from '@/utils/auth'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    convertDuration(duration) {
      const compareMap = {
        60: 'per minute',
        3600: 'per hour',
        86400: 'per day'
      }
      return compareMap[duration]
    }
  },
  data() {
    return {
      role: 2,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 10
      },
      soilOptions: [
        { key: 'sandy', label: 'sandy' },
        { key: 'clay', label: 'clay' },
        { key: 'loamy', label: 'loamy' },
        { key: 'silty', label: 'silty' },
        { key: 'peaty', label: 'peaty' }
      ],
      userList: [],
      temp: {
        id: undefined,
        name: '',
        user_id: 0,
        soil_type: '',
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const user = JSON.parse(getUser())
      this.role = user.role
      getAreaList().then(response => {
        this.list = response.list
        this.total = this.list.length
      })
      getUserList().then(response => {
        this.userList = response.list
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        user_id: undefined,
        soil_type: '',
        desc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArea(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp['bind_id'] = this.temp['user_id']
          updateArea(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    }
  }
}
</script>
