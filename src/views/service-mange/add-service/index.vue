<template>
  <div>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column
        property="serviceName"
        label="服务名称"
        width="120"
      />
      <el-table-column
        label="服务类别"
        width="120"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ getCatelogyName(scope.row.serviceCategory) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务提供商"
        width="120"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ getProviderName(scope.row.providerId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="textDescription"
        label="服务描述"
        width="120"
      />
      <el-table-column
        property="version"
        label="服务版本"
        width="120"
      />
      <el-table-column
        label="服务创建时间"
        width="120"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createTimestamp | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <!--<el-button @click="setCurrent(tableData[1])">选中第二行</el-button>-->
      <!--<el-button @click="setCurrent()">取消选择</el-button>-->
      <el-button @click="add">添加新服务</el-button>
      <el-button @click="update">修改选中的服务</el-button>
      <el-button @click="removeData">删除选中的服务</el-button>

      <el-button @click="exectue">测试选中的服务接口</el-button>
    </div>
    <div v-if="whenAdd">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="服务名称">
          <el-input v-model="addForm.serviceName" />
        </el-form-item>
        <el-form-item label="服务类别">
          <el-select v-model="addForm.serviceCategory" placeholder="请选择">
            <el-option
              v-for="item in categoryData"
              :key="item.catelogyId"
              :label="item.catelogyName"
              :value="item.catelogyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务提供商">
          <el-select v-model="addForm.providerId" placeholder="请选择">
            <el-option
              v-for="item in providerData"
              :key="item.providerId"
              :label="item.name"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="addForm.textDescription" type="textarea" autosize placeholder="请输入详细描述" />
        </el-form-item>
        <el-form-item label="git地址">
          <el-input v-model="addForm.gitUrl" />
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="addForm.version" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd">添加</el-button>
          <el-button @click="resetAddForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="whenUpdate">
      <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px">
        <el-form-item label="服务名称">
          <el-input v-model="updateForm.serviceName" />
        </el-form-item>
        <el-form-item label="服务类别">
          <el-select v-model="updateForm.serviceCategory" placeholder="请选择">
            <el-option
              v-for="item in categoryData"
              :key="item.catelogyId"
              :label="item.catelogyName"
              :value="item.catelogyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务提供商">
          <el-select v-model="updateForm.providerId" placeholder="请选择">
            <el-option
              v-for="item in providerData"
              :key="item.providerId"
              :label="item.name"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="updateForm.textDescription" type="textarea" autosize placeholder="请输入详细描述" />
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="updateForm.version" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onUpdate">修改</el-button>
          <el-button @click="resetUpdateForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="currentRow!=null">
      <el-button @click="updateMode=!updateMode">查看/修改 服务接口</el-button>
      <el-form ref="viewForm" :model="apiData" :rules="rules" label-width="80px">
        <el-form-item label="接口类型">
          <!--<el-select v-model="apiData.apiTypeId" placeholder="请选择">-->
          <!--<el-option v-on:change="apiData.apiTypeId=item.id"-->
          <!--v-for="item in [{'label':'API','id':1},{'label':'UI','id':2}]"-->
          <!--:key="item.id"-->
          <!--:label="item.label"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <select v-model="apiData.api_type" placeholder="请选择">
            <option>API</option>
            <option>UI</option>
          </select>
        </el-form-item>
        <el-form-item v-if="updateMode" label="接口定义文件">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请上传指定格式的文件</div>
          </el-upload>
        </el-form-item>
        <div v-if="!updateMode">
          <!--<p>接口输入：{{apiData.hasInput}}</p>-->
          <p>接口输出：{{ apiData.hasOutput }}</p>
          <p>接口模版：{{ templateValue }}</p>
        </div>
        <el-form-item v-if="updateMode">
          <el-button type="primary" @click="onApiModify">添加/修改</el-button>
          <!--<el-button @click="resetonApiModifyForm">取消</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <div v-if="currentRow!=null">
      <div>
        构建状态：<br>
        <div v-for="(step,index) in buildStatus" :key="index">
          <p>当前阶段：{{ step.phase }}</p>
          <div>时间节点：<p v-for="(stage,id) in step.stages" :key="id">{{ stage.name }}:{{ stage.startTime }}:{{ stage.durationMilliseconds }}</p></div>
        </div>
      </div>
      <div>部署状态:<br>
        <p v-for="(deploy,index) in deployStatus" :key="index">
          当前实例数：{{ deploy.replicas }}
          当前版本：{{ deploy.latestVersion }}
        </p>
      </div>

      <button @click="refreshStage()">刷新状态</button>
    </div>

    <div v-if="whenExecute">
      <el-form ref="exectueForm" :model="exectueForm" :rules="rules" label-width="80px">
        <el-form-item v-for="(item, index) in exectueForm" :key="item.key" :index="index" :label="item.key">
          <el-input v-model="exectueForm[index].value" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onExecute">执行</el-button>
        </el-form-item>
      </el-form>
    </div>
    <iframe v-if="whenExecute && isUI" :src="sub_url" width="400px" height="500px" />
    <div v-if="whenExecute">
      {{ executeResult }}
    </div>
  </div>
</template>
<script>
export default {
  components: {

  },
  filters: {
    formatDate: function(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  data() {
    return {
      tableData: [
        {
          serviceId: 1,
          serviceName: 'api-demo',
          serviceCategory: 1,
          providerId: 1,
          textDescription: '这是一个API类服务的Demo',
          version: '0.0.1',
          createTimestamp: 1569192220000
        }, {
          serviceId: 2,
          serviceName: 'ui-demo',
          serviceCategory: 2,
          providerId: 2,
          textDescription: '这是一个UI类服务的Demo',
          version: '0.0.1',
          createTimestamp: 1569192520000
        }],
      categoryData: [
        {
          catelogyId: 1,
          catelogyName: '测试',
          description: '测试类服务'
        }, {
          catelogyId: 2,
          catelogyName: '养老类服务',
          description: '养老类服务'
        }, {
          catelogyId: 3,
          catelogyName: '支付类服务',
          description: '支付类服务'
        }
      ],
      providerData: [
        {
          providerId: 1,
          name: '本地服务',
          location: '哈工大'
        }, {
          providerId: 2,
          name: '阿里',
          location: '杭州'
        }, {
          providerId: 3,
          name: '腾讯',
          location: '深圳'
        }
      ],
      apiData: {},
      currentRow: null,
      whenAdd: false,
      whenUpdate: false,
      whenExecute: false,
      addForm: {

      },
      updateForm: {

      },
      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        textDescription: [
          { required: true, message: '请输入对该服务的详细描述', trigger: 'change' }
        ]
      },
      executeApi: 0,
      executeResult: '',
      isUI: false,
      sub_url: 'www.baidu.com',
      exectueForm: [],
      templateValue: '',
      updateMode: false,
      executeSession: 0,
      buildStatus: '',
      deployStatus: ''
    }
  },
  mounted: function() {
    Promise.all([this.$http.get('/service/list'), this.$http.get('/serviceProvider/list'), this.$http.get('/serviceCategory/list')])
      .then(responses => {
        this.tableData = responses[0].data
        this.providerData = responses[1].data
        this.categoryData = responses[2].data
      })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = this.tableData.indexOf(val)
      if (this.tableData[this.currentRow].serviceId != 0) {
        this.$http.get('/serviceApi/' + this.tableData[this.currentRow].serviceId)
          .then(response => response.data)
          .then(data => {
            console.info('line316', data)
            if (data != null && JSON.stringify(data).length > 2) {
              this.apiData = data
              return data.templateId
            } else {
              this.apiData = {
                'apiId': val.serviceId,
                'serviceId': val.serviceId,
                'apiTypeId': 1,
                'api_type': 'API',
                'hasOutput': 'xsd:int',
                'templateId': 0
              }
              return 0
            }
          }).then(templateId => {
            if (templateId == 0) {
              this.templateValue = '未设置'
            } else {
              this.$http.get('/serviceInvokeTemplate/' + templateId)
                .then(response => response.data)
                .then(data => this.templateValue = data.templateContext)
            }
          })

        // 列出该服务部署的进度：
        this.refreshStage()
      }
    },
    add() {
      this.whenAdd = true
      this.whenUpdate = false
      this.addForm = {
        serviceId: 0,
        serviceName: '',
        serviceCategory: 1,
        providerId: 1,
        textDescription: '',
        version: '0.0.1',
        createTimestamp: new Date().getMilliseconds(),
        gitUrl: ''
      }
    },
    update() {
      if (this.currentRow == null) {
        alert('请先选取其中的一行')
        return
      }
      this.whenAdd = false
      this.whenUpdate = true
      this.updateForm = this.tableData[this.currentRow]
    },
    removeData() {
      if (this.currentRow == null) {
        alert('请先选取其中的一行')
        return
      }
      this.$http.delete(`/service/${this.tableData[this.currentRow].providerId}`)
        .then((isSuccess) => {
          isSuccess ? this.tableData.splice(this.currentRow, 1) : null
        })
        .catch(ex => {
          console.error(ex)
          alert('数据删除失败！')
        })
    },
    onAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.$http.post('/service/create', this.addForm)
            .then(response => response.data)
            .then((data) => {
              this.tableData.push(data)
              this.whenAdd = false
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
      this.whenAdd = false
    },
    onUpdate() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.$http.post(`/service/update/${this.updateForm.providerId}`, this.updateForm)
            .then(response => response.data)
            .then((data) => {
              this.tableData.splice(this.currentRow, 1, data)
              this.whenUpdate = false
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
    resetUpdateForm() {
      this.whenUpdate = false
    },
    getCatelogyName(catelogyId) {
      const index = this.categoryData.findIndex(category => category.catelogyId == catelogyId)
      return this.categoryData[index].catelogyName
    },
    getProviderName(providerId) {
      const index = this.providerData.findIndex(provider => provider.providerId == providerId)
      return this.providerData[index].name
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
      const that = this
      if (file != null) {
        const reader = new FileReader()
        reader.onloadend = () => {
          console.info(reader.result)
          that.apiData.hasOutput = reader.result
        }
        reader.readAsText(file.raw)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onApiModify: function() {
      if (this.apiData.api_type == 'API') {
        this.apiData.apiTypeId = 1
      } else {
        this.apiData.apiTypeId = 2
      }
      this.$http.post('/serviceApi/attach', this.apiData)
        .then(response => response.data)
        .then((data) => {
          this.apiData = (data)
          this.updateMode = false

          const templateId = data.templateId
          if (templateId == 0) {
            this.templateValue = '未设置'
          } else {
            this.$http.get('/serviceInvokeTemplate/' + templateId)
              .then(response => response.data)
              .then(data => this.templateValue = data.templateContext)
          }
        })
        .catch(ex => {
          console.error(ex)
          alert('数据传输失败！')
        })
    },
    exectue() {
      if (this.currentRow == null) {
        alert('请先选取其中的一行')
        return
      }
      this.executeApi = this.tableData[this.currentRow].serviceId
      this.exectueForm = []
      let template = this.templateValue
      const pattern = /\$\{param_.*?\}/
      let group = null
      do {
        group = template.match(pattern)
        if (group != null && group.length > 0) {
          this.exectueForm.push({
            key: group[0].substr(2, group[0].length - 3),
            value: ''
          })
          template = template.replace(group[0], '')
        }
      } while (group != null && group.length > 0)

      this.whenExecute = true
    },
    onExecute() {
      const data = {}
      this.exectueForm.forEach(function(item) {
        data[item.key] = item.value
      })
      this.$http.get(`/serviceApi/test/${this.executeApi}`, { params: data })
        .then((response) => response.data)
        .then(dt => {
          this.executeSession = dt
          // this.executeResult = dt;
          const that = this
          if (this.apiData.apiTypeId == 2) {
            this.isUI = true
            this.sub_url = `http://${this.tableData[this.currentRow].servicePath}/?sessionId=${this.executeSession}`
            this.interval = setInterval(() => {
              if (this.whenExecute) {
                this.$http.get('/serviceApi/test/state/' + this.executeSession)
                  .then((response) => response.data)
                  .then(data => {
                    that.executeResult = data[that.executeApi]
                    if (data[-1] == 1) {
                      if (that.interval != 0) { clearInterval(that.interval) }
                      that.isUI = false
                      that.interval = 0
                    }
                  })
              }
            }, 1000)
          } else {
            that.isUI = false
            if (that.interval) {
              clearInterval(that.interval)
              that.interval = 0
            }
            this.$http.get('/serviceApi/test/state/' + this.executeSession)
              .then((response) => response.data)
              .then(data => {
                that.executeResult = data[that.executeApi]
              })
          }
        })
    },
    refreshStage() {
      this.$http.get('/serviceStatus/Build/' + this.tableData[this.currentRow].serviceName)
        .then(response => response.data)
        .then(data => {
          this.buildStatus = data.map(x => x['status'])
        })
      this.$http.get('/serviceStatus/DeploymentConfig/' + this.tableData[this.currentRow].serviceName).then(response => response.data)
        .then(data => {
          this.deployStatus = data.map(x => x['status'])
        })
    }
  }
}
</script>
