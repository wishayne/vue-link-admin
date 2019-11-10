<template>
  <div id="add-require">
    <h1>目标树</h1>
    <br>
    <tree-table :data="goalTree" :is-tree="true" @submit="uploadGoalTree" />
    <br>
  </div>
</template>

<script>
import TreeTable from '../../../components/TreeTable/index'
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
  methods: {
    uploadGoalTree() {
      this.axios.post(`${process.env.VUE_APP_BASE_URL}/api/upload-goal-tree`, {
        user: this.$route.query.userId,
        data: this.goalTree
      }).then((response) => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
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
