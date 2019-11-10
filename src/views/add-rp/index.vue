<template>
  <div id="add-rp">
    <h1>需求模式</h1>
    <br>
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="info.name" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="功能描述:">
          <el-input v-model="info.description" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="业务领域:">
          <el-input v-model="info.domain" placeholder="请输入" size="small" />
        </el-form-item>
      </el-form>
    </el-card>
    <br>
    <tree-table :data="requirePattern" :is-tree="false" @submit="uploadGoalTree" />
  </div>
</template>

<script>
import TreeTable from '../../components/TreeTable'
export default {
  name: 'AddRP',
  components: {
    TreeTable
  },
  data() {
    return {
      name: '',
      info: {
        name: '',
        description: '',
        domain: ''
      },
      requirePattern: [{
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
      this.axios.post(`${process.env.VUE_APP_BASE_URL}/api/upload-require-pattern`, {
        info: this.info,
        data: this.requirePattern
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
  #rp-name {
    width:40%;
    margin: auto;
  }
  #add-rp {
    text-align: center;
  }
  .box-card {
    width: 60%;
    margin: auto;
  }
</style>
