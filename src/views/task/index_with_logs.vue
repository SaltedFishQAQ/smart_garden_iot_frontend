<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <!-- Add Search Input -->
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Search by device name or ID" 
      class="search-input"
    />

    <!-- Device Table -->
    <el-table
      :key="tableKey"
      v-loading="listLoading; console.log('Table data loading status:', listLoading)"
      :data="filteredDevices"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
          <script>console.log("Row ID rendered:", row.id);</script>
        </template>
      </el-table-column>

      <el-table-column label="Target Device" min-width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.target }}</span>
          <script>console.log("Row Target rendered:", row.target);</script>
        </template>
      </el-table-column>

      <el-table-column label="Duration" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration | convertDuration }}</span>
          <script>console.log("Row Duration rendered:", row.duration);</script>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listLoading: false,
      devices: [], // Assuming your device data is here
      searchQuery: '', // New search query for filtering
    };
  },
  computed: {
    filteredDevices() {
      // Filter devices based on the search query
      return this.devices.filter(device => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          device.id.toString().includes(searchLower) ||
          device.target.toLowerCase().includes(searchLower)
        );
      });
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      // Fetch devices here
      console.log('Fetching device data...');
    },
    handleCreate() {
      console.log('Add button clicked');
    }
  }
};
</script>

<style scoped>
.search-input {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}
</style>
