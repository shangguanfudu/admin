<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <el-alert
        show-icon
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>
      <!-- 选择分类 -->
      <p class="choose">
        选择商品分类：
        <el-cascader
          v-model="good_cat"
          :options="classOptions"
          :props="classProps"
        ></el-cascader>
      </p>
      <el-tabs v-model="activeName">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button
            @click="isAddDyShow = true"
            class="addbtn"
            type="primary"
            :disabled="good_cat.length === 0"
            >添加参数</el-button
          >
          <!-- 表格开始 -->
          <el-table
            @expand-change="expand"
            border=""
            :data="dyData"
            stripe
            style="width: 100%"
          >
            <el-table-column label="展开" type="expand" width="50">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-tag
                    v-for="tag in props.row.attr_vals.split(' ')"
                    :key="tag"
                    closable
                    @close="closeTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="attr_id" label="id" width="70">
            </el-table-column>
            <el-table-column prop="attr_name" label="分类名称" width="405">
            </el-table-column>
            <el-table-column label="操作" width="405">
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
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button
            @click="isAddStShow = true"
            class="addbtn"
            type="primary"
            :disabled="good_cat.length === 0"
            >添加属性</el-button
          >
          <!-- 表格开始 -->
          <el-table
            border=""
            :data="staticData"
            stripe
            style="width: 100%"
            @expand-change="expand"
          >
            <el-table-column label="展开" type="expand" width="50">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-tag
                    @close="closeTag(tag)"
                    v-for="tag in props.row.attr_vals.split(' ')"
                    :key="tag"
                    closable
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm()"
                    @blur="handleInputConfirm()"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput()"
                    >+ New Tag</el-button
                  >
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="attr_id" label="id" width="70">
            </el-table-column>
            <el-table-column prop="attr_name" label="分类名称" width="405">
            </el-table-column>
            <el-table-column label="操作" width="405">
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
        </el-tab-pane>
      </el-tabs>
      <!-- 弹出层 添加动态 -->
      <el-dialog title="添加动态参数" :visible.sync="isAddDyShow">
        <el-form
          ref="addDyForm"
          :model="addDyForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="动态参数" prop="attrName">
            <el-input
              v-model="addDyForm.attrName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAddDyShow = false">取 消</el-button>
          <el-button type="primary" @click="addDyConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 添加静态 -->
      <el-dialog title="添加动态参数" :visible.sync="isAddStShow">
        <el-form
          ref="addStForm"
          :model="addStForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="动态参数" prop="attrName">
            <el-input
              v-model="addStForm.attrName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAddStShow = false">取 消</el-button>
          <el-button type="primary" @click="addStConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 编辑属性 -->
      <el-dialog title="修改参数" :visible.sync="isEditShow">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="参数名称" prop="attrName">
            <el-input v-model="currentName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isEditShow = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 删除属性 -->
      <el-dialog title="提示" :visible.sync="isDelShow" width="30%">
        <span
          ><i
            class="el-icon-warning"
            style="color: #e6a23c; font-size: 24px"
          ></i
          >此操作将永久删除该属性,是否继续?</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelShow = false">取 消</el-button>
          <el-button type="primary" @click="delParam">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCat } from '@/api/categories'
import { getParams, addParams, putEdit, delParam } from '@/api/params'
export default {
  created () {
    this.getCat()
  },
  data () {
    return {
      classProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      classOptions: [],
      good_cat: [],
      activeName: 'first',
      dyData: [],
      staticData: [],
      inputVisible: false,
      inputValue: '',
      isAddDyShow: false,
      isAddStShow: false,
      isEditShow: false,
      isDelShow: false,
      currentName: '',
      currentSel: 'many',
      currentCat: 0,
      currentId: 0,
      currentVals: '',
      editForm: {
        attrName: ''
      },
      addDyForm: {
        attrName: ''
      },
      addStForm: {
        attrName: ''
      },
      rules: {
        attrName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度2 个字符以上', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取分类列表
    async getCat () {
      try {
        const { data: res } = await getCat({})
        // console.log(res)
        this.classOptions = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获得静态参数列表
    async getStatic () {
      try {
        const { data: res } = await getParams(this.good_cat[this.good_cat.length - 1], 'only')
        // console.log(res)
        this.staticData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获得动态参数列表
    async getMany () {
      try {
        const { data: res } = await getParams(this.good_cat[this.good_cat.length - 1], 'many')
        // console.log(res)
        this.dyData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    expand (row) {
      // console.log(row)
      this.currentCat = row.cat_id
      this.currentId = row.attr_id
      this.currentName = row.attr_name
      this.currentSel = row.attr_sel
      this.currentVals = row.attr_vals
    },
    showInput () {
      // console.log(row)

      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加标签
    async handleInputConfirm () {
      // console.log(row)
      const arr = this.currentVals.split(' ')
      arr.push(this.inputValue)
      // console.log(arr)
      this.currentVals = arr.join(' ')
      try {
        await putEdit({
          id: this.currentCat,
          attrId: this.currentId,
          attr_name: this.currentName,
          attr_sel: this.currentSel,
          attr_vals: this.currentVals
        })
        this.$message.success('添加成功')
        this.isEditShow = false
        if (this.currentSel === 'many') {
          this.getMany()
        } else {
          this.getStatic()
        }
      } catch (error) {
        this.$message.error('添加失败')
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 删除标签
    async closeTag (tag) {
      const arr = this.currentVals.split(' ')
      const i = arr.findIndex(item => item === tag)
      arr.splice(i, 1)
      this.currentVals = arr.join(' ')
      try {
        await putEdit({
          id: this.currentCat,
          attrId: this.currentId,
          attr_name: this.currentName,
          attr_sel: this.currentSel,
          attr_vals: this.currentVals
        })
        this.$message.success('删除成功')
        this.isEditShow = false
        if (this.currentSel === 'many') {
          this.getMany()
        } else {
          this.getStatic()
        }
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    editClick (row) {
      this.isEditShow = true
      this.currentName = row.attr_name
      this.currentSel = row.attr_sel
      this.currentCat = row.cat_id
      this.currentId = row.attr_id
    },
    delClick (row) {
      this.isDelShow = true
      this.currentSel = row.attr_sel
      this.currentCat = row.cat_id
      this.currentId = row.attr_id
    },
    // 添加动态
    async addDyConfirm () {
      try {
        await addParams(this.good_cat[this.good_cat.length - 1], this.addDyForm.attrName, 'many')
        // console.log(res)
        this.$message.success('添加成功')
        this.isAddDyShow = false
        this.getMany()
      } catch (error) {
        console.log(error)
      }
    },
    // 添加静态
    async addStConfirm () {
      try {
        await addParams(this.good_cat[this.good_cat.length - 1], this.addStForm.attrName, 'only')
        // console.log(res)
        this.$message.success('添加成功')
        this.isAddStShow = false
        this.getStatic()
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑属性
    async editConfirm () {
      try {
        await putEdit({
          id: this.currentCat,
          attrId: this.currentId,
          attr_name: this.currentName,
          attr_sel: this.currentSel
        })
        this.$message.success('编辑成功')
        this.isEditShow = false
        if (this.currentSel === 'many') {
          this.getMany()
        } else {
          this.getStatic()
        }
      } catch (error) {
        this.$message.error('编辑失败')
      }
    },
    // 删除角色
    async delParam () {
      try {
        await delParam(this.currentCat, this.currentId)
        this.$message.success('删除成功')
        this.isDelShow = false
        if (this.currentSel === 'many') {
          this.getMany()
        } else {
          this.getStatic()
        }
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  },
  computed: {},
  watch: {
    good_cat () {
      this.getStatic()
      this.getMany()
    }
  },
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.choose {
  margin: 15px 0;
}
.addbtn {
  margin-bottom: 15px;
}
.demo-table-expand {
  padding: 20px 50px;
  .el-tag {
    margin-right: 15px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
