<template>
  <div id="add-require">
    <h1>新增需求</h1>
    <br>
    <tree-table :data="goalTree" :is-tree="true" @submit="uploadGoalTree" />
    <br>
  </div>
</template>

<script>
import TreeTable from '.././component/TreeTable'
import request from '@/utils/request2'
export default {
  name: 'AddRequire',
  components: {
    TreeTable
  },
  data() {
    return {
      goalTree: [{
        id: 0,
        goal: {
          content: 'goal',
          restricts: []
        },
        children: []
      }]
    }
  },
  computed: {
    username() {
      return this.$store.getters.userinfo.name
    }
  },
  methods: {
    uploadGoalTree() {
      this.$ajax.post(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/upload-goal-tree`, {
        user: this.username,
        data: this.goalTree
      }).then((response) => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        return response.data
      }).then(res => {
        request.get(`/solution/create?creator=${this.username}&requireId=${res}&description=${this.goalTree[0].goal.content}`)
      }).catch((respose) => {
        this.$message.error('提交失败')
      })
    }
  }
}
</script>

<style scoped>
  #add-require {
    text-align: center;
  }

</style>
