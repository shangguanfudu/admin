<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <!-- 表格开始 -->
      <el-table border="" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="id" width="70"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >等级二</el-tag
            >
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->
    </div>
  </div>
</template>

<script>
import { getRights } from '@/api/rights'
export default {
  async created () {
    try {
      const { data: res } = await getRights('list')
      console.log(res)
      this.tableData = res.data
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
</style>
