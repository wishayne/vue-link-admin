<template>
  <div class="all-rps">
    <h1 style="text-align: center">
      需求模式维护
    </h1>
    <br>
    <div style="margin:auto;width: 30%">
      <el-input v-model="detail" placeholder="请输入需要搜索的内容">
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>
    <br>
    <el-table
      :data="data"
      style="width: 60%"
      class="mother-table"
      border
      highlight-current-row
      @row-click="rowClick"
    >
      <el-table-column prop="info.name" label="名称" align="center" />
      <el-table-column prop="info.description" label="描述" align="center" />
      <el-table-column prop="info.domain" label="业务领域" align="center" />
      <el-table-column prop="info.timestamp" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ handleTime(scope.row.info.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column prop="info.frequency" label="使用频率" align="center" />
      <el-table-column prop="info.support" label="支持度" align="center" />
      <el-table-column prop="info.fresh" label="新鲜度" align="center">
        <template slot-scope="scope">
          {{ handleTime(scope.row.info.fresh) }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="modifyRpDialog(scope)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <h2 style="text-align: center">
      {{ selectedRP.info.name || '' }}
    </h2>
    <br>
    <el-table :data="tableListData" :row-style="toggleDisplayTr" border stripe class="init_table" size="small">
      <!--            目标树-->
      <el-table-column label="目标" min-width="150" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <p :style="`margin-left: ${scope.row.__level * 15}px;margin-top:0;margin-bottom:0`">
            <i class="permission_toggleFold" :class="toggleFoldingClass(scope.row)" @click="toggleFoldingStatus(scope.row)" />
            {{ scope.row.goal.content }}
          </p>
        </template>
      </el-table-column>
      <!--            显示约束-->
      <el-table-column align="center" min-width="200" label="约束">
        <template slot-scope="scope">
          <el-tag v-for="restrict in scope.row.goal.restricts" :key="restrict.key" size="mini">
            {{ getRestrictString(restrict) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-button
      tyep="success"
      icon="el-icon-refresh"
      circle
      class="rp-miner"
      @click="mineRP"
    />
    <el-button
      type="primary"
      icon="el-icon-plus"
      circle
      class="add-rp"
      @click="$router.push({path:'/requires/add-rp/index'})"
    />

    <el-dialog :visible.sync="showDialog" :fullscreen="true">
      <div v-if="showDialog" style="text-align: center;">
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
        <tree-table :data="requirePattern" :is-tree="false" @submit="modifyRp" />
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { handleTime } from '../all-requires/util'
import { getRestrictString } from '../all-requires/restrict-options'
import TreeTable from '../component/TreeTable'

export default {
  name: 'AllRP',
  components: { TreeTable },
  data() {
    return {
      data: [],
      selectedRP: {
        info: {}
      },
      detail: '',
      foldList: [],
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
      }],
      selectRpId: -1,
      showDialog: false,
      rpMinerDialog: {
        show: false,
        data: []
      }
    }
  },
  computed: {
    tableListData: function() {
      return this.formatConversion([], this.selectedRP.data || [])
    }
  },
  mounted() {
    this.getAllRPs()
  },
  methods: {
    rowClick(row) {
      this.selectedRP = row
    },
    getRestrictString,
    getAllRPs() {
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/get-all-rps`).then(response => {
        this.data = response.data
      })
    },
    toggleFoldingStatus(params) {
      this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
    },
    toggleDisplayTr({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        const item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item) return 'display:none;'
      }
      return ''
    },
    toggleFoldingClass(params) {
      return params.children.length === 0 ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'el-icon-minus' : 'el-icon-plus')
    },
    formatConversion(parent, children, index = 0, family = [], elderIdentity = 'x') {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (children.length > 0) {
        children.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          this.$set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，不包含本身在内
          this.$set(x, '__family', [...family])
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          this.$set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          // 如果仍有子集，则进行递归
          if (x.children.length > 0) {
            this.formatConversion(parent, x.children, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
          }
        })
      }
      return parent
    },
    modifyRpDialog(scope) {
      const rpId = scope.row.info.rpId
      this.selectRPId = rpId
      this.requirePattern = scope.row.data
      this.info.name = scope.row.info.name
      this.info.description = scope.row.info.description
      this.info.domain = scope.row.info.domain
      this.showDialog = true
    },
    search() {
      if (this.detail === '') {
        this.$message({
          message: '搜索内容不可以为空',
          type: 'warning'
        })
        return
      }
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/search-rp?detail=${this.detail}`).then(response => {
        this.data = response.data
        this.selectedRP = { info: {}}
      })
    },
    modifyRp() {
      this.$ajax.post(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/modify-rp?rpId=${this.selectRPId}`, {
        info: this.info,
        data: this.requirePattern }
      ).then(_ => {
        this.showDialog = false
        this.getAllRPs()
      })
    },
    handleTime: handleTime,
    mineRP() {
      this.$ajax.get(`${process.env.VUE_APP_RP_MINER_BASE_URL}/api/rp-miner`).then(res => {
        this.selectedRP = {
          data: res.data,
          info: {
            name: '新挖掘的需求模式'
          }
        }
      })
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .all-rps
    height 100%
    .mother-table
      margin 0 auto !important
      th
        padding 0 !important
        height 30px !important
      td
        padding 0 !important
        height 30px !important
    .permission_toggleFold
      vertical-align middle
      padding-right 5px
      font-size 16px
      cursor pointer
    .permission_placeholder
      content ' '
      display inline-block
      width 24px
      font-size 16px
    .init_table
      width 90% !important
      margin 0 auto !important
      th
        padding 0 !important
        height 30px !important
        line-height 30px !important
        text-align: center !important
      td
        padding 0 !important
        height 30px !important
        line-height 30px !important
    .add-rp
      position fixed
      right 5%
      bottom 10%
    .rp-miner
      position fixed
      right 8%
      bottom 10%
</style>
