<template>
  <div id="add-require">
    <h1>新增需求</h1>
    <h2>context</h2>
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-form-item :label="context+':'" v-for="context in allContexts" :key="context">
          <span v-if="selectCon.has(context)">
            <el-select v-model="userCon[context]" placeholder="请选择" style="width:70%">
              <el-option v-for="se in variableSet[context]" :key="se" :value="se" :label="se">
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-input v-model="userCon[context]" placeholder="请输入" size="small" style="width:70%"/>
          </span>
        </el-form-item>
      </el-form>
    </el-card>
    <br>
    <h2>目标树</h2>
    <br>
    <tree-table :data="goalTree" :is-tree="true" @submit="uploadGoalTree" />
    <br>
  </div>
</template>

<script>
import TreeTable from '.././component/TreeTable'
import request from '@/utils/request2'
import { variableSet, allContexts, defaultCon, selectCon } from './context-opt'
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
      }],
      userCon: JSON.parse(JSON.stringify(defaultCon)),
      variableSet: variableSet,
      allContexts:allContexts,
      selectCon:selectCon
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
        data: this.goalTree,
        contexts: this.userCon
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
  .box-card {
    width: 30%;
    margin: auto;
  }

</style>
