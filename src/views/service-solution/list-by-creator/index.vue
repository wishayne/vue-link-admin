<template>
  <div>
    <div v-for="(session,index) in tableData" :key="index">
      <p>sessionId:{{ session.sessionId }}</p>
      <p v-for="(status,id2) in session.statuses" :key="id2">
        &nbsp;&nbsp;<span>服务名称：{{ status.serviceInfo.serviceName }}</span>&nbsp;&nbsp;
        <span>服务描述：{{ status.serviceInfo.textDescription }}</span>&nbsp;&nbsp;
        <span>服务运行状态：{{ status.serviceStage }}</span>&nbsp;&nbsp;
        <span>服务当前结果：{{ status.currentValue }}</span>&nbsp;&nbsp;
        <span>服务当前所指定用户：{{ status.userAssignee }}</span>&nbsp;&nbsp;
      </p>
      <img :src="$http.defaults.baseURL+'process/download/'+session.processId">
      <button @click="continueExecute(session)">继续执行</button>
    </div>

    <iframe :src="sub_url" width="400px" height="500px" />
  </div>
</template>
<script>
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
    this.$http.get('/process/sessions')
      .then(response => response.data)
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
