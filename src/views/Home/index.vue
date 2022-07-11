<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header>
      <div class="title">
        <img
          src="http://liufusong.top/hm-admin/img/heima.b5a855ee.png"
          alt=""
        />
        <span>杭州天马后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边 -->
      <el-aside width="200px" :style="{ width: isCollapse ? '43px' : '200px' }">
        <el-button
          icon="el-icon-s-fold"
          class="collapse"
          :style="{ width: isCollapse ? '43px' : '200px' }"
          @click="isCollapse = !isCollapse"
        ></el-button>
        <el-menu
          :collapse="isCollapse"
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          background-color="#373d41"
          text-color="#fff"
          unique-opened
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              用户管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="$router.push({ name: 'user' })"
                ><i class="el-icon-menu"></i>用户列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-cooperation"></i>权限管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="$router.push({ name: 'roles' })"
                ><i class="el-icon-menu"></i>角色列表</el-menu-item
              >

              <el-menu-item
                index="2-2"
                @click="$router.push({ name: 'rights' })"
                ><i class="el-icon-menu"></i>权限列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template #title> <i class="el-icon-s-goods"></i>商品管理</template>
            <el-menu-item-group>
              <el-menu-item index="3-1" @click="$router.push({ name: 'goods' })"
                ><i class="el-icon-menu"></i>商品列表</el-menu-item
              >

              <el-menu-item
                index="3-2"
                @click="$router.push({ name: 'params' })"
                ><i class="el-icon-menu"></i>分类参数</el-menu-item
              >

              <el-menu-item
                index="3-3"
                @click="$router.push({ name: 'categories' })"
                ><i class="el-icon-menu"></i>商品分类</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template #title> <i class="el-icon-s-claim"></i>订单管理</template>
            <el-menu-item-group>
              <el-menu-item
                index="4-1"
                @click="$router.push({ name: 'orders' })"
                ><i class="el-icon-menu"></i>订单列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template #title> <i class="el-icon-s-data"></i>数据统计</template>
            <el-menu-item-group>
              <el-menu-item
                index="5-1"
                @click="$router.push({ name: 'report' })"
                ><i class="el-icon-menu"></i>数据报表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <div class="header"></div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () { },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    logout () {
      this.$store.commit('SETUSER', {})
      this.$router.push('/login')
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.container {
  height: 100vh;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    .title {
      display: flex;
      align-items: center;
      img {
        width: 56px;
        height: 60px;
      }
      span {
        color: #fff;
        font-size: 22px;
        margin-left: 10px;
      }
    }
    .el-button {
      width: 70px;
      height: 40px;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
    }
  }
  .el-aside {
    background-color: #373d41;
    .el-menu {
      border-right: none;
      .el-icon-menu {
        margin-right: 10px;
        color: #909399;
      }
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
/deep/ .main-view {
  margin: 15px 0;
  padding: 20px;
  height: 100vh;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: auto;
  color: #303133;
  transition: 0.3s;
}
.collapse {
  width: 200px;
  text-align: center;
}
</style>
