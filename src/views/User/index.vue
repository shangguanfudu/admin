<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <div class="header">
        <el-input placeholder="请输入内容" v-model="input">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeQuery"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="isAddShow = true">添加用户</el-button>
      </div>
      <!-- 表格开始 -->
      <el-table border="" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="#" width="70"> </el-table-column>
        <el-table-column prop="username" label="姓名" >
        </el-table-column>
        <el-table-column prop="mobile" label="电话" >
        </el-table-column>
        <el-table-column prop="role_name" label="角色" >
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="putState(scope.row.id, scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="
                editClick(
                  scope.row.id,
                  scope.row.username,
                  scope.row.email,
                  scope.row.mobile
                )
              "
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-setting"
              type="warning"
              @click="setClick(scope.row)"
            ></el-button>
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
      <!-- 弹出层 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="isAddShow">
        <el-form
          ref="addForm"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAddShow = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 编辑用户 -->
      <el-dialog title="编辑用户" :visible.sync="isEditShow">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="currentName"
              disabled
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="currentEmail" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="currentMobile" autocomplete="off"></el-input>
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
          >此操作将永久删除该用户,是否继续?</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelShow = false">取 消</el-button>
          <el-button type="primary" @click="delUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出层 分配角色 -->
      <el-dialog title="分配角色" :visible.sync="isRoleShow" width="60%">
        <p>当前的用户：{{ currentName }}</p>
        <p class="style-p">当前的角色：{{ currentRole }}</p>
        <p>
          分配的新角色：<el-select v-model="newRole" placeholder="请选择">
            <el-option
              v-for="(item, ind) in roleOptions"
              :key="ind"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isRoleShow = false">取 消</el-button>
          <el-button type="primary" @click="putRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUsers, addUser, putState, putEdit, delUser, putRole } from '@/api/users'
import { getRoles } from '@/api/roles'
export default {
  name: 'User',
  created () {
    this.getUsers()
  },
  data () {
    return {
      isAddShow: false,
      isEditShow: false,
      isDelShow: false,
      isRoleShow: false,
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      total: 1,
      query: '',
      input: '',
      currentId: 0,
      currentName: '',
      currentEmail: '',
      currentMobile: '',
      currentRole: '',
      newRole: '',
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: this.currentName,
        email: this.currentEmail,
        mobile: this.currentMobile
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        email: [{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确邮箱', trigger: 'blur' }],
        mobile: [{ pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }]
      },
      roleOptions: []
    }
  },
  methods: {
    // 获取用户列表
    async getUsers () {
      try {
        const { data: res } = await getUsers({ pagenum: this.pagenum, pagesize: this.pagesize, query: this.query })
        // console.log(res)
        this.total = res.data.total
        this.tableData = res.data.users
      } catch (error) {
        console.log(error)
      }
    },
    // 添加用户
    async addConfirm () {
      this.$refs.addForm.validate()
      try {
        await addUser(this.form)
        this.$message.success('添加成功')
        this.isAddShow = false
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
    // 修改用户状态
    async putState (id, state) {
      // console.log(id, state)
      try {
        await putState(id, state)
        this.$message.success('修改成功')
      } catch (error) {
        this.$message.error('修改失败')
      }
    },
    // 编辑用户资料
    async editConfirm () {
      this.$refs.editForm.validate()
      try {
        await putEdit(this.currentId, this.currentEmail, this.currentMobile)
        this.$message.success('编辑成功')
        this.isEditShow = false
        this.getUsers()
      } catch (error) {
        this.$message.error('编辑失败')
      }
    },
    // 删除用户
    async delUser () {
      try {
        await delUser(this.currentId)
        this.$message.success('删除成功')
        this.isDelShow = false
        this.getUsers()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 分配角色
    async putRole () {
      const i = this.roleOptions.findIndex(item => item.value === this.newRole)
      const roleId = this.roleOptions[i].id
      try {
        const { data: res } = await putRole(this.currentId, roleId)
        console.log(res)
        this.$message.success('分配成功')
        this.isRoleShow = false
        this.getUsers()
      } catch (error) {
        this.$message.error('分配失败')
      }
    },
    // 编辑按钮点击事件
    editClick (id, username, email, mobile) {
      this.isEditShow = true
      this.currentId = id
      this.currentName = username
      this.currentEmail = email
      this.currentMobile = mobile
    },
    // 删除按钮点击事件
    handleDelete (row) {
      this.isDelShow = true
      this.currentId = row.id
    },
    // 设置按钮点击事件
    async setClick (row) {
      this.isRoleShow = true
      this.currentId = row.id
      this.currentName = row.username
      this.currentRole = this.newRole = row.role_name
      try {
        const { data: res } = await getRoles()
        // console.log(res)
        this.roleOptions = res.data
        this.roleOptions.forEach(item => {
          item.label = item.value = item.roleName
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 每页条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUsers()
    },
    // 当前页数
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUsers()
    },
    // 按内容查询
    changeQuery () {
      this.query = this.input
      if (Number(this.query)) {
        Number(this.query)
        this.getUsers()
      } else {
        this.getUsers()
      }
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
.style-p {
  margin: 10px 0;
}
</style>
