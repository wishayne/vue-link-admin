<template>
  <el-container>
    <el-header><h1>服务注册</h1></el-header>
    <el-main>
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="服务名称">
          <el-input v-model="addForm.serviceName" autosize prop="serviceName" />
        </el-form-item>
        <el-form-item label="服务类别">
          <el-tree-select
            v-model="addForm.categories"
            :data="treeData"
            node-key="id"
            size="mini"
            :multiple="true"
            :props="treeProps"
          />
        </el-form-item>
        <el-form-item label="提供商">
          <el-select v-model="addForm.provider" placeholder="请选择">
            <el-option
              v-for="item in providerData"
              :key="item.providerId"
              :label="item.name"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="addForm.serviceType" placeholder="请选择">
            <el-option label="API类服务" value="API" />
            <el-option label="UI类服务" value="UI" />
            <el-option label="线下服务" value="OFFLINE" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="addForm.textDescription" type="textarea" autosize placeholder="请输入详细描述" />
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="addForm.version" autosize />
        </el-form-item>
        <el-upload
          ref="upload"
          action="#"
          :on-change="handleFileChange"
          :multiple="false"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">选取接口定义文件</div>
        </el-upload>
        <el-form-item>
          <el-button type="primary" @click="onAdd">添加</el-button>
          <el-button @click="resetAddForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import ElTreeSelect from './ELTreeSelect'
import request from '@/utils/request2'

export default {
  components: {
    ElTreeSelect
  },
  data() {
    return {
      treeData: [{
        '@id': 1,
        'catelogyId': 1,
        'parent': null,
        'children': [{
          '@id': 2,
          'catelogyId': 2,
          'parent': 1,
          'children': [{
            '@id': 3,
            'catelogyId': 3,
            'parent': 2,
            'children': [],
            'catelogyName': '出租车',
            'description': '出租车',
            'removed': false,
            'id': 3
          }],
          'catelogyName': '租车',
          'description': '各类与租车相关的业务',
          'removed': false,
          'id': 2
        }],
        'catelogyName': '交通',
        'description': '交通类服务',
        'removed': false,
        'id': 1
      }],
      treeProps: {
        children: 'children',
        label: 'catelogyName'
      },
      providerData: [
        {
          '@id': 1,
          'providerId': 1,
          'name': 'ICES',
          'location': '哈尔滨工业大学',
          'removed': false,
          'id': 1
        },
        {
          '@id': 2,
          'providerId': 2,
          'name': '阿里巴巴',
          'location': '杭州',
          'removed': false,
          'id': 2
        }
      ],
      addForm: {
        serviceName: '',
        categories: [],
        provider: {
          providerId: 1
        },
        serviceType: 'API',
        textDescription: '',
        version: '',
        deployment: null,
        roles: [],
        apis: []
      },
      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          { regexp: /[a-zA-Z_0-9]{1,8}/, message: '长度在 2 到 8 个字符,由英文字母_和数字组成', trigger: 'blur' }
        ],
        textDescription: [
          { required: true, message: '请输入对该服务的详细描述', trigger: 'change' }
        ]
      }
    }
  },
  created: function() {
    this.loadProviders()
    this.loadCategories()
  },
  methods: {
    async loadProviders() {
      return request({
        url: '/serviceProvider/list',
        method: 'get'
      }).then(data => {
        this.providerData = data
      })
    },
    async loadCategories() {
      return request({
        url: '/serviceCategory/listRoots',
        method: 'get'
      }).then(data => {
        this.treeData = data
      })
    },
    handleFileChange(file, fileList) {
      // console.info(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        // console.info(reader.result)
        const config = JSON.parse(reader.result)
        this.addForm.deployment = config.deployment
        this.addForm.roles = config.roles
        this.addForm.apis = config.apis
      }
      reader.readAsText(file.raw)
    },
    onAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          console.info(this.addForm)
          this.addForm.categories = this.addForm.categories.map(i => {
            return {
              id: i
            }
          })

          if (typeof (this.addForm.provider) === 'number') {
            this.addForm.provider = {
              id: this.addForm.provider
            }
          }

          if (!this.addForm.serviceName.match(/[a-zA-Z_0-9]{1,20}/)) {
            alert('服务名称长度在 2 到 20 个字符,由英文字母_和数字组成')
            return
          }
          if (this.addForm.deployment == null || this.addForm.deployment.deploymentType == null) {
            alert('服务接口定义文件未上传或文件中未定义服务部署内容')
            return
          }
          // TODO 完善表单验证！！！ 并将category、provider 替换成对象
          this.$http.post('/service/create', this.addForm)
            .then(response => response.data)
            .then((data) => {
              console.info(data)
              alert('添加成功！')
              this.resetAddForm()
            })
            .catch(ex => {
              console.error(ex)
              alert('数据传输失败！')
            })
        } else {
          alert('表单验证失败!!')
          return false
        }
      })
    },
    resetAddForm() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>
