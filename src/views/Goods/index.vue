<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <div class="header">
        <el-input placeholder="请输入内容" v-model="query">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeQuery"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="$router.push({name:'addgood'})">添加商品</el-button>
      </div>
      <!-- 表格开始 -->
      <el-table fit border :data="tableData" stripe style="width: 100%">
        <el-table-column prop="goods_id" label="#" width="80">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="79">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="79">
        </el-table-column>
        <el-table-column label="创建时间" width="110">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="189">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="editClick(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 弹出层 编辑商品 -->
      <el-dialog title="编辑商品" :visible.sync="isEditShow">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="currentName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格（元）" prop="goodsPrice">
            <el-input v-model="currentPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goodsNumber">
            <el-input v-model="currentNumber" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goodsWeight">
            <el-input v-model="currentWeight" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isEditShow = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 删除商品 -->
      <el-dialog title="提示" :visible.sync="isDelShow" width="30%">
        <span
          ><i
            class="el-icon-warning"
            style="color: #e6a23c; font-size: 24px"
          ></i
          >此操作将永久删除该商品,是否继续?</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelShow = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getGoods, putEdit, delGood } from '@/api/goods'
export default {
  created () {
    this.getGoods()
  },
  data () {
    return {
      query: '',
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      currentId: 0,
      currentName: '',
      currentPrice: 0,
      currentNumber: 0,
      currentWeight: 0,
      isEditShow: false,
      isDelShow: false,
      editForm: {
        goodsName: '',
        goodsPrice: 0,
        goodsNumber: 0,
        goodsWeight: 0
      },
      rules: {
        goodsName: [
          { required: true, message: '商品名不能为空', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        goodsNumber: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' }
        ],
        goodsWeight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表
    async getGoods () {
      try {
        const { data: res } = await getGoods({
          pagenum: this.pagenum, pagesize: this.pagesize, query: this.query
        })
        // console.log(res)
        this.total = res.data.total
        this.tableData = res.data.goods
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑商品资料
    async editConfirm () {
      this.$refs.editForm.validate()
      try {
        const res = await putEdit(this.currentId, this.currentName, this.currentPrice, this.currentNumber, this.currentWeight)
        console.log(res)
        this.$message.success('编辑成功')
        this.isEditShow = false
        this.getGoods()
      } catch (error) {
        this.$message.error('编辑失败')
      }
    },
    // 删除商品
    async delConfirm () {
      try {
        await delGood(this.currentId)
        this.$message.success('删除成功')
        this.isDelShow = false
        this.getGoods()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 查询
    changeQuery () {
      this.getGoods()
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.pagesize = val
      this.getGoods()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoods()
    },
    editClick (row) {
      this.isEditShow = true
      this.currentId = row.goods_id
      this.currentName = row.goods_name
      this.currentPrice = row.goods_price
      this.currentNumber = row.goods_number
      this.currentWeight = row.goods_weight
    },
    handleDelete (row) {
      this.isDelShow = true
      this.currentId = row.goods_id
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.header {
  display: flex;
  margin-bottom: 15px;
  .el-input {
    margin-right: 10px;
    width: 218px;
  }
}
.block {
  margin-top: 15px;
}
</style>
