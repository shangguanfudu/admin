<template>
  <div class="login-container">
    <div class="formbox">
      <el-form :model="loginForm" ref="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>

        <el-form-item class="item-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/login.js'
export default {
  created () { },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async login () {
      // 二次校验 手动校验
      try {
        await this.$refs.loginForm.validate()
        try {
          const { data: res } = await login(this.loginForm)
          // console.log(res)
          this.$store.commit('SETUSER', res.data)
          this.$router.push('/home')
        } catch (error) {
          this.$message.error('登录失败')
        }
      } catch (error) {
        this.$message.error('登录校验失败')
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
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .formbox {
    padding: 30px 15px;
    width: 450px;
    height: 240px;
    background-color: #fff;
    box-sizing: border-box;
    .item-btn {
      display: flex;
      justify-content: end;
      text-align: center;
    }
  }
}
</style>
