<template>
  <div>
    <p>当前登陆的用户：{{ this.$store.getters.userinfo.name }}</p>
    <p>用户拥有的角色：{{ roles }}</p>
    <div v-for="(status,id2) in taskList" :key="id2" class="app-container">
      <div style="margin-top:20px;margin-bottom: 20px">
        <el-row :gutter="10">
          <el-col :span="4">
            所属服务：<b>{{ status.serviceInfo.serviceName }}&nbsp;{{ status.serviceInfo.textDescription }}</b>
          </el-col>
          <el-col :span="4">
            服务类别：<b>{{ status.serviceInfo.categories.map(c=>c.catelogyName).join(',') }}</b>
          </el-col>
          <el-col :span="4">
            服务当前结果：<b>{{ status.currentValue }}</b>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="12">
          <el-table
            :data="filterApi(status.serviceInfo.apis)"
            style="width: 100%;"
            height="450"
            border
          >
            <el-table-column label="" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index+ 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="接口描述" width="120" />
            <el-table-column label="相关角色" width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.roles.map(role=>role.id.name).join(',') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
              <template slot-scope="scope">
                <button v-if="scope.row.apiType=='FINISH'" @click="finishAPI(scope.row,status.sessionId,status.serviceInfo.serviceId)">结束服务</button>
                <button v-if="scope.row.apiType=='VIEW'" @click="viewAPI(scope.row,status.sessionId)">执行该服务</button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <iframe v-if="whenView" :src="sub_url" width="400px" height="500px" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request2'
export default {
  components: {

  },
  data() {
    return {
      tableData: [],
      roles: [],
      taskList: [],
      currentRow: null,
      responseData: {},
      sub_url: '',
      whenView: false,
      ServiceApiType: {
        SYNC_REQUEST: '同步请求', ASYNC_REQUEST: '异步请求', VIEW: '用户界面', FINISH: '结束接口'
      }
    }
  },
  mounted: function() {
    request({
      url: `/process/sessions`,
      method: 'get'
    })
      .then(data => {
        this.tableData = Object.values(data)
      }).then(() => {
        return request({
          url: '/group/list',
          method: 'get'
        })
      })
      .then(data => {
        this.roles = data.filter(dt => dt.users.some(u => u.name == this.$store.getters.userinfo.name)).map(x => x.groupName)
      }).then(() => {
        request({
          url: '/task/list',
          method: 'get'
        }).then(data => {
          let taskList = this.tableData.flatMap(o => o.statuses.map(st => { st.sessionId = o.sessionId; return st }))
          taskList = taskList.filter(s => s.serviceStage == 'RUNNING' && data.some(d => s.activityName == d.name))
          taskList = taskList.filter(s => this.roles.some(r => s.serviceInfo.roles.some(sr => sr.id.name == r)))
          this.taskList = taskList
        })
      })
  },
  methods: {
    filterApi(apis) {
      return apis.filter(api => this.roles.some(r => api.roles.some(sr => sr.id.name == r)))
    },
    finishAPI(api, sessionId, serviceId) {
      let template = api.templateContext
      const pattern = /\$\{sessionId\}/
      let group = null
      do {
        group = template.match(pattern)
        if (group != null && group.length > 0) {
          template = template.replace(group[0], sessionId)
        }
      } while (group != null && group.length > 0)
      request({
        url: template,
        method: 'get'
      }).then(data => {
        return request({
          url: `/process/updateSession/${sessionId}/${serviceId}/FINISH`,
          method: 'get',
          params: {
            value: 'finish'
          }
        })
      })
    },
    viewAPI(api, sessionId) {
      let template = api.templateContext
      const pattern = /\$\{sessionId\}/
      let group = null
      do {
        group = template.match(pattern)
        if (group != null && group.length > 0) {
          template = template.replace(group[0], sessionId)
        }
      } while (group != null && group.length > 0)
      this.sub_url = template
      this.whenView = true
    },
    handleCurrentChange(val) {
      this.currentRow = this.tableData.indexOf(val)
    },
    continueExecute(session) {
      this.$http.get('/task/list')
        .then(response => response.data)
        .then(data => {
          data.filter(task => task.processId == session.processId).forEach(task => {
            session.statuses.filter(status => status.serviceInfo.serviceName == task.name).forEach(status => {
              // let serviceId = status.serviceInfo.serviceId;
              this.sub_url = `http://${status.serviceInfo.servicePath}/?sessionId=${session.sessionId}`
              console.info(this.sub_url)
            })
          })
        })
    }
  }
}
</script>
