<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <div class="header">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 表格开始 -->
      <el-table border="" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="order_id" label="#" width="70">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag effect="dark" v-if="scope.row.pay_status === '0'"
              >已支付</el-tag
            >
            <el-tag effect="dark" type="danger" v-else>未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="editClick(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->
    </div>
  </div>
</template>

<script>
import { getOrders } from '@/api/orders'
export default {
  created () {
    this.getOrders()
  },
  data () {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10
    }
  },
  methods: {
    async getOrders () {
      try {
        const { data: res } = await getOrders({
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(res)
        this.tableData = res.data.goods
      } catch (error) {
        console.log(error)
      }
    },
    editClick (row) { }
  },
  computed: {},
  watch: {},
  filters: {
  },
  components: {}
}
</script>

<style scoped lang='less'>
.header {
  margin-bottom: 15px;
  .el-input {
    margin-right: 10px;
    width: 310px;
  }
}
</style>
