<template>
  <div>
    <el-card v-for="(session,index) in tableData" :key="index" class="box-card">
      <el-container>
        <el-header>
          <p>sessionId:{{ session.sessionId }}</p>
          <p>需求发起者:{{ session.creator }}</p>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="14">
              <el-table
                :data="session.statuses"
                style="width: 100%;"
                height="450"
                border
              >
                <el-table-column label="" width="50">
                  <template slot-scope="scope">
                    <span>{{ scope.$index+ 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="服务名称" width="90">
                  <template slot-scope="scope">
                    <span>{{ scope.row.serviceInfo.serviceName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="服务描述" width="90">
                  <template slot-scope="scope">
                    <span>{{ scope.row.serviceInfo.textDescription }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="相关角色" width="90">
                  <template slot-scope="scope">
                    <span>{{ Array.from(new Set(scope.row.serviceInfo.roles.map(role=>role.id.name))).join(',') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="运行状态" width="90">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.serviceStage=='RUNNING'?'运行中':'' }}
                      {{ scope.row.serviceStage=='CREATED'?'未开始':'' }}
                      {{ scope.row.serviceStage=='FINISH'?'已完成':'' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="当前结果" width="90">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.currentValue }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="6">
              <img :src="$http.defaults.baseURL+'process/download/'+session.processId">
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-card>
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
      currentRow: null,
      responseData: {},
      sub_url: ''
    }
  },
  mounted: function() {
    request({
      url: `/process/sessions`,
      method: 'get'
    })
    // this.$http.get('/process/sessions')
    //   .then(response => response.data)
      .then(data => {
        this.tableData = Object.values(data)
      })
  },
  methods: {
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
