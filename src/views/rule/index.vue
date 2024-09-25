<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Measurement" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.entity }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Source Device" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.src }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Condition" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row | convertCondition }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Target Device" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dst }}</span>
        </template>
      </el-table-column>

      <el-table-column label="operation" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.opt }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Description" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="running status" width="160px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.is_deleted | statusFilter">
            {{ row.is_deleted === 0 ? 'running' : 'stop' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" :type="row.is_deleted === 0 ? 'danger' : 'success'" @click="handleRunning(row)">
            {{ row.is_deleted === 0 ? 'stop' : 'running' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Measurement">
          <el-input v-model="temp.entity" />
        </el-form-item>

        <el-form-item label="Source Device">
          <el-select v-model="temp.src" class="filter-item" placeholder="Please select">
            <el-option v-for="item in deviceList" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="Compare">
          <el-select v-model="temp.compare" class="filter-item" placeholder="Please select">
            <el-option v-for="item in compareOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="Value">
          <el-input v-model="temp.value" />
        </el-form-item>

        <el-form-item label="Target Device">
          <el-select v-model="temp.dst" class="filter-item" placeholder="Please select">
            <el-option v-for="item in deviceList" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="Operation">
          <el-select v-model="temp.opt" class="filter-item" placeholder="Please select">
            <el-option v-for="item in optOptions" :key="item.key" :label="item.label" :value="item.key" />
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
import { getRuleList, updateRule, createRule, running } from '@/api/rule'
import { getDeviceList } from '@/api/catalog'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        // 1: 'info'
        1: 'danger'
      }
      return statusMap[status]
    },
    convertCondition(row) {
      const compareMap = {
        eq: '= ',
        ne: '!= ',
        gt: '> ',
        gte: '>= ',
        lt: '< ',
        lte: '<= '
      }
      return compareMap[row.compare] + row.value
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 10
      },
      statusOptions: ['published', 'draft', 'deleted'],
      compareOptions: [
        { key: 'eq', label: '=' },
        { key: 'ne', label: '!=' },
        { key: 'gt', label: '>' },
        { key: 'gte', label: '>=' },
        { key: 'lt', label: '<' },
        { key: 'lte', label: '<=' }
      ],
      optOptions: [
        { key: 'on', label: 'turn on' },
        { key: 'off', label: 'turn off' }
      ],
      deviceList: [],
      temp: {
        id: undefined,
        entity: '',
        src: '',
        field: 'value',
        compare: '',
        value: undefined,
        dst: '',
        opt: '',
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
      getRuleList(this.listQuery).then(response => {
        this.list = response.list
        this.total = this.list.length
      })
      getDeviceList().then(response => {
        this.deviceList = response.list
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
        entity: '',
        src: '',
        field: 'value',
        compare: '',
        value: undefined,
        dst: '',
        opt: '',
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
          createRule(this.temp).then(() => {
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
          updateRule(this.temp).then(() => {
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
    },
    handleRunning(row) {
      const data = {
        'id': row.id,
        'status': row.is_deleted
      }
      running(data).then(() => {
        row.is_deleted = row.is_deleted === 1 ? 0 : 1
      }).catch(message => {
        console.log(message)
      })
    }
  }
}
</script>
