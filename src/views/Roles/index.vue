<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <el-button
        type="primary"
        style="margin-bottom: 15px"
        @click="isAddShow = true"
        >添加角色</el-button
      >
      <!-- 表格开始 -->
      <el-table border="" :data="tableData" stripe style="width: 100%">
        <el-table-column label="展开" type="expand" width="50">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row v-for="item in props.row.children" :key="item.id">
                <el-col :span="6" class="left">
                  <div class="class1">
                    <el-tag class="class1">{{ item.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </div>
                </el-col>
                <el-col :span="18" class="right">
                  <div
                    class="wrap"
                    v-for="items in item.children"
                    :key="items.id"
                  >
                    <div class="class2">
                      <el-tag type="success">{{ items.authName }}</el-tag
                      ><i class="el-icon-caret-right"></i>
                    </div>
                    <div class="class3">
                      <el-tag
                        closable
                        @close="delRight(props.row.id, it.id)"
                        v-for="it in items.children"
                        :key="it.id"
                        >{{ it.authName }}</el-tag
                      >
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="id" width="70"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="100">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
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
            <el-button
              size="mini"
              icon="el-icon-setting"
              type="warning"
              @click="setClick(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->
      <!-- 弹出层 添加用户 -->
      <el-dialog title="添加角色" :visible.sync="isAddShow">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAddShow = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 编辑用户 -->
      <el-dialog title="编辑角色" :visible.sync="isEditShow">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="currentName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="currentDesc" autocomplete="off"></el-input>
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
          >此操作将永久删除该角色,是否继续?</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelShow = false">取 消</el-button>
          <el-button type="primary" @click="delRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出层 分配权限 -->
      <el-dialog title="分配权限" :visible.sync="isRightShow" width="60%">
        <el-tree
          ref="tree"
          :data="rightData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultList"
          :props="defaultProps"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isRoleShow = false">取 消</el-button>
          <el-button type="primary" @click="putRight">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoles, addRole, putEdit, delRole, delRight, putRight } from '@/api/roles'
import { getRights } from '@/api/rights'
export default {
  created () {
    this.getRoles()
  },
  data () {
    return {
      isAddShow: false,
      isEditShow: false,
      isDelShow: false,
      isRightShow: false,
      tableData: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      currentId: '',
      currentName: '',
      currentDesc: '',
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      rightData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultList: [],
      checkedList: []
    }
  },
  methods: {
    // 获取角色列表
    async getRoles () {
      try {
        const { data: res } = await getRoles()
        // console.log(res)
        this.tableData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 添加角色
    async addConfirm () {
      try {
        await addRole(this.addForm)
        this.$message.success('添加成功')
        this.isAddShow = false
        this.getRoles()
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
    // 编辑角色
    async editConfirm () {
      try {
        await putEdit(this.currentId, this.currentName, this.currentDesc)
        this.$message.success('编辑成功')
        this.isEditShow = false
        this.getRoles()
      } catch (error) {
        this.$message.error('编辑失败')
      }
    },
    // 删除角色
    async delRole () {
      try {
        await delRole(this.currentId)
        this.$message.success('删除成功')
        this.isDelShow = false
        this.getRoles()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 分配权限
    async putRight () {
      this.getCheckedKeys()
      try {
        await putRight(this.currentId, this.checkedList.join(','))
        this.$message.success('分配成功')
        this.isRightShow = false
        this.getRoles()
      } catch (error) {
        this.$message.error('分配失败')
      }
    },
    // 删除指定角色权限
    async delRight (roleId, rightId) {
      try {
        // console.log(roleId, rightId)
        await delRight(roleId, rightId)

        this.$message.success('删除成功')
        this.getRoles()
      } catch (error) {
        console.log(error)
      }
    },
    editClick (row) {
      this.isEditShow = true
      this.currentId = row.id
      this.currentName = row.roleName
      this.currentDesc = row.roleDesc
    },
    delClick (row) {
      this.isDelShow = true
      this.currentId = row.id
    },
    async setClick (row) {
      this.currentId = row.id
      this.isRightShow = true
      // console.log(row)
      this.defaultList = []
      row.children.forEach(item => {
        item.children.forEach(items => {
          items.children.forEach(val => {
            this.defaultList.push(val.id)
          })
        })
      })
      try {
        const { data: res } = await getRights('tree')
        console.log(res)
        this.rightData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    getCheckedKeys () {
      this.checkedList = this.$refs.tree.getCheckedKeys()
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.el-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  i {
    line-height: 32px;
  }
  .el-tag {
    margin: 8px;
  }
  .left {
    display: flex;
    justify-content: center;
    // align-items: center;
    .class1 {
      display: flex;
      align-items: center;
    }
  }
  .right {
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    .wrap {
      display: flex;
    }
    .class2 {
      display: flex;
      align-items: center;
      margin-right: 50px;
    }
    .class3 {
      display: inline-block;
    }
  }
}
</style>
