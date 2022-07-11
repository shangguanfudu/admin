<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <el-button class="addbtn" @click="addClick" type="primary"
        >添加分类</el-button
      >
      <!-- 表格开始 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              :style="{ color: scope.row.cat_deleted ? '#ccc' : 'green' }"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="editClick(scope.row)"
            >
              编辑</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delClick(scope.row)"
            >
              删除</el-button
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
          :page-sizes="[4, 8, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 弹出层 编辑分类名 -->
      <el-dialog title="编辑分类" :visible.sync="isEditShow">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="catName">
            <el-input v-model="currentName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isEditShow = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 删除用户 -->
      <el-dialog title="提示" :visible.sync="isDelShow" width="30%">
        <span
          ><i
            class="el-icon-warning"
            style="color: #e6a23c; font-size: 24px"
          ></i
          >此操作将永久删除该分类,是否继续?</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelShow = false">取 消</el-button>
          <el-button type="primary" @click="delCat">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出层 添加用户 -->
      <el-dialog title="添加分类" :visible.sync="isAddShow">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="catName">
            <el-input v-model="addForm.catName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="addForm.pid"
              :options="catOptions"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                checkStrictly: true,
              }"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAddShow = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCat, putEdit, delCat, addCat } from '@/api/categories'
export default {
  created () {
    this.getCats()
  },
  data () {
    return {
      total: 0,
      pagenum: 1,
      pagesize: 4,
      tableData: [],
      currentName: '',
      isEditShow: false,
      isDelShow: false,
      isAddShow: false,
      editForm: {
        catName: ''
      },
      addForm: {
        catName: '',
        pid: []
      },
      rules: {
        catName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      catOptions: []
    }
  },
  methods: {
    async getCats () {
      try {
        const { data: res } = await getCat({
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        // console.log(res)
        this.tableData = res.data.result
        this.total = res.data.total
      } catch (error) {
        console.log(error)
      }
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.pagesize = val
      this.getCats()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCats()
    },
    editClick (row) {
      this.isEditShow = true
      this.currentId = row.cat_id
      this.currentName = row.cat_name
    },
    delClick (row) {
      this.isDelShow = true
      this.currentId = row.cat_id
    },
    // 编辑分类
    async editConfirm () {
      try {
        await putEdit(this.currentId, this.currentName)
        this.$message.success('编辑成功')
        this.isEditShow = false
        this.getCats()
      } catch (error) {
        this.$message.error('编辑失败')
      }
    },
    // 删除分类
    async delCat () {
      try {
        await delCat(this.currentId)
        this.$message.success('删除成功')
        this.isDelShow = false
        this.getCats()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 添加分类
    async addConfirm () {
      try {
        await addCat({
          cat_name: this.addForm.catName,
          cat_pid: this.addForm.pid[this.addForm.pid.length - 1] || 0,
          cat_level: this.addForm.pid.length - 1
        })
        this.$message.success('添加成功')
        this.isAddShow = false
        this.getCats()
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
    async addClick () {
      this.isAddShow = true
      try {
        const { data: res } = await getCat({})
        console.log(res)
        this.catOptions = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {},
  watch: {
  },
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.addbtn {
  margin-bottom: 15px;
}
</style>
