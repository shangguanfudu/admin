<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }"
        >商品列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-view">
      <el-alert
        title="添加商品信息"
        center
        :closable="false"
        type="info"
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-tabs
        tab-position="left"
        style="height: 100vh"
        @tab-click="onTabClick"
      >
        <!-- 基本信息 -->
        <el-tab-pane name="0" label="基本信息">
          <el-form
            label-position="top"
            label-width="80px"
            :model="form"
            :rules="rules"
          >
            <el-form-item label="商品名称" prop="goodName">
              <el-input v-model="form.goodName"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodPrice">
              <el-input v-model="form.goodPrice"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goodWeight">
              <el-input v-model="form.goodWeight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goodNumber">
              <el-input v-model="form.goodNumber"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goodClass">
              <el-cascader
                v-model="form.goodClass"
                :options="classOptions"
                :props="classProps"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品参数 -->
        <el-tab-pane name="1" label="商品参数">
          <el-form v-for="obj in manyList" :key="obj.attr_id">
            <el-form-item :label="obj.attr_name">
              <el-checkbox-group v-model="manyVals">
                <el-checkbox
                  border
                  v-for="(item, ind) in obj.attr_vals.split(' ')"
                  :key="ind"
                  :label="item"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品属性 -->
        <el-tab-pane name="2" label="商品属性">
          <el-form v-for="obj in staticList" :key="obj.attr_id">
            <el-form-item :label="obj.attr_name">
              <el-input v-model="obj.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品图片 -->
        <el-tab-pane name="3" label="商品图片">
          <el-upload
            @on-change="upload"
            class="upload-demo"
            action="http://liufusong.top:8899/api/private/v1/upload/"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <!-- 商品内容 -->
        <el-tab-pane name="4" label="商品内容">
          <!-- 富文本编辑器 -->
          <my-editor @text-event="intro"></my-editor>
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { addGood, upload } from '@/api/goods'
import { getCat } from '@/api/categories'
import { getParams } from '@/api/params'
import MyEditor from '@/components/MyEditor.vue'
export default {
  created () {
    this.getCat()
  },
  data () {
    return {
      active: 0,
      classOptions: [],
      classProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      form: {
        goodName: '',
        goodPrice: 0,
        goodWeight: 0,
        goodNumber: 0,
        goodClass: []
      },
      ruleForm: {
        // ...省略其他
        articleBody: ''
      },
      rules: {
        goodName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        goodPrice: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        goodWeight: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        goodNumber: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' }
        ],
        goodClass: [
          { required: true, message: '商品分类不能为空', trigger: 'blur' }
        ]
      },
      manyList: [],
      staticList: [],
      manyVals: [],
      staticVals: [],
      fileList: [],
      goods_introduce: ''
    }
  },
  methods: {
    onTabClick (val) {
      // console.log(val.paneName)
      this.active = Number(val.paneName)
      if (this.active === 2) {
        this.getStatic()
      } else if (this.active === 1) {
        this.getMany()
        const arr = []
        this.manyList.forEach(item => {
          arr.push(...item.attr_vals.split(' '))
        })
        const newArr = new Set(arr)
        this.manyVals.push(...newArr)
      } else if (this.active === 3) {
        const arr = []
        this.staticList.forEach(item => {
          arr.push(...item.attr_vals.split(' '))
        })
        const newArr = new Set(arr)
        this.staticVals.push(...newArr)
      }
    },
    // 提交
    async addGood () {
      try {
        await addGood({
          goods_name: this.form.goodName,
          goods_cat: this.form.goodClass.join(','),
          goods_price: this.form.goodPrice,
          goods_number: this.form.goodNumber,
          goods_weight: this.form.goodWeight,
          goods_introduce: this.goods_introduce,
          attrs: [...this.manyVals, ...this.staticVals]
        })
        this.$message.success('添加成功')
        this.$router.push({ name: 'goods' })
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
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
        const { data: res } = await getParams(this.form.goodClass[this.form.goodClass.length - 1], 'only')
        // console.log(res)
        this.staticList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获得动态参数列表
    async getMany () {
      try {
        const { data: res } = await getParams(this.form.goodClass[this.form.goodClass.length - 1], 'many')
        // console.log(res)
        this.manyList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    upload () {
      console.log(123)
    },
    intro (str) {
      this.goods_introduce = str
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { MyEditor }
}
</script>

<style scoped lang='less'>
.el-steps {
  margin: 15px 0 15px 75px;
  justify-content: center;
}
::v-deep .ql-editor {
  // 样式穿透
  min-height: 180px !important;
}
</style>
