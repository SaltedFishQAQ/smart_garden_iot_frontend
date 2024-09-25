<template>
  <div class="catalog-container">
    <device-table />
    <service-table />
  </div>
</template>

<script>
import DeviceTable from './components/DeviceTable.vue'
import ServiceTable from './components/ServiceTable.vue'

export default {
  name: 'Catalog',
  components: {
    DeviceTable,
    ServiceTable
  }
}
</script>

<style lang="scss" scoped>
  .catalog-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>
