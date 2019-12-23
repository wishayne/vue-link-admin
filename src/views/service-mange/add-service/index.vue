<template>
  <el-container>
    <el-header><h1>服务注册</h1></el-header>
    <el-main>
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="服务名称">
          <el-input v-model="addForm.serviceName" autosize prop="serviceName" />
        </el-form-item>
        <el-form-item label="Feature">
          <el-select v-model="addForm.feature.feature_id" placeholder="请选择">
            <el-option
              v-for="item in features"
              :key="item.featureId"
              :label="item.name"
              :value="item.featureId"
            />
          </el-select>
        </el-form-item>
        <!--<el-form-item label="所属领域">-->
        <!--<el-tree-select-->
        <!--ref="tree"-->
        <!--v-model="addForm.categories"-->
        <!--:data="treeData"-->
        <!--node-key="id"-->
        <!--size="mini"-->
        <!--:multiple="true"-->
        <!--:props="treeProps"-->
        <!--/>-->
        <!--</el-form-item>-->
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
        <el-form-item label="部署方式">
          <el-radio-group v-model="addForm.deployment.deploymentType">
            <el-radio :label="'GIT_S2I'">GIT</el-radio>
            <el-radio :label="'DOCKER'">Docker</el-radio>
            <el-radio :label="'EXTERNAL'">外部服务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="addForm.deployment.deploymentType=='GIT_S2I'" label="GIT地址">
          <el-input v-model="addForm.deployment.gitUrl" autosize />
        </el-form-item>
        <el-form-item v-if="addForm.deployment.deploymentType=='GIT_S2I'" label="源代码分支">
          <el-input v-model="addForm.deployment.gitBranch" autosize />
        </el-form-item>
        <el-form-item v-if="addForm.deployment.deploymentType=='GIT_S2I'" label="S2I镜像">
          <el-input v-model="addForm.deployment.s2iImage" autosize />
        </el-form-item>
        <el-form-item v-if="addForm.deployment.deploymentType=='GIT_S2I'" label="S2I版本">
          <el-input v-model="addForm.deployment.s2iVersion" autosize />
        </el-form-item>
        <el-form-item v-if="addForm.deployment.deploymentType=='DOCKER'" label="Docker镜像">
          <el-input v-model="addForm.deployment.dockerImage" autosize />
        </el-form-item>
        <el-form-item label="接口类型">
          <el-radio-group v-model="addForm.deployment.protocol">
            <el-radio :label="protocols[0]" :disabled="true">SOAP/WSDL</el-radio>
            <el-radio :label="protocols[1]" :disabled="true">JSON/WADL</el-radio>
            <el-radio :label="protocols[2]">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-upload
          ref="upload"
          action="#"
          :on-change="handleFileChange"
          :multiple="false"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取接口定义文件</el-button>
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

const protocols = ['SOAP', 'JSON', 'default']

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
      categories: new Map(),
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
      features: [],
      protocols: protocols,
      addForm: {
        serviceName: '',
        categories: [],
        provider: {
          providerId: 1
        },
        feature: {
          featureId: 0
        },
        serviceType: 'API',
        textDescription: '',
        version: '',
        deployment: {
          protocol: protocols[2],
          deploymentType: 'GIT_S2I',
          gitUrl: '',
          gitBranch: '',
          s2iImage: '',
          s2iVersion: '',
          dockerImage: ''
        },
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
    this.loadFeatures()
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
    async loadFeatures() {
      return request({
        url: '/serviceFeature/list',
        method: 'get'
      }).then(data => {
        this.features = data
      })
    },
    async loadCategories() {
      return request({
        url: '/serviceCategory/listRoots',
        method: 'get'
      }).then(data => {
        this.treeData = data
        const that = this
        function walk(list) {
          for (let i = 0; i < list.length; i++) {
            that.categories.set(list[i].catelogyId, list[i])
            if (list[i].children != null && list[i].children.length > 0) {
              walk(list[i].children)
            }
          }
        }

        walk(this.treeData)
      })
    },
    handleFileChange(file, fileList) {
      // console.info(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        // console.info(reader.result)
        const config = JSON.parse(reader.result)
        // this.addForm.deployment = config.deployment
        this.addForm.roles = config.roles
        this.addForm.apis = config.apis
      }
      reader.readAsText(file.raw)
    },
    onAdd() {
      function parents(node) {
        if (node == null || node.parent == null) {
          return []
        }
        return [node.parent, ...parents(node.parent)]
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          console.info(this.addForm)
          const categoryMap = new Map()
          this.addForm.categories.forEach(i => {
            categoryMap.set(i, {
              id: {
                categoryId: i
              },
              category: {
                id: i
              },
              fullLink: true
            })
          })
          const halfSet = new Set()
          this.addForm.categories.forEach(i => {
            parents(this.categories.get(i)).forEach(node => halfSet.add(node.id))
          })
          halfSet.forEach(i => {
            if (!categoryMap.has(i)) {
              categoryMap.set(i, {
                id: {
                  categoryId: i
                },
                category: {
                  id: i
                },
                fullLink: false
              })
            }
          })

          this.addForm.categoryMappings = [...categoryMap.values()]
          delete this.addForm.categories
          console.info(this.addForm)

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
