<template>
  <div class="all-requires">
    <iframe src="http://flowable-linan.192.168.42.159.nip.io/flowable-explorer/" style="display: none" />
    <h1 style="text-align: center">
      需求维护
    </h1>
    <br>
    <div style="margin:auto;width: 30%">
      <el-input v-model="detail">
        <el-select slot="prepend" v-model="searchOption" placeholder="请选择" value="1">
          <el-option label="未生成方案" value="1" />
          <el-option label="已生成方案" value="2" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>
    <br>
    <el-table
      id="table"
      v-loading="loading"
      :data="tableListData"
      :row-style="toggleDisplayTr"
      :span-method="toggleMergeRow"
      border
      class="init_table"
      size="small"
    >
      <!--            目标树-->
      <el-table-column label="目标" min-width="150" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <p :style="`margin-left: ${scope.row.__level * 15}px;margin-top:0;margin-bottom:0`">
            <i class="permission_toggleFold" :class="toggleFoldingClass(scope.row)" @click="toggleFoldingStatus(scope.row)" />
            {{ scope.row.goal.content }}
            <span v-if="typeof scope.row.rpInfo !== 'undefined' && scope.row.showRpResult">
              <el-tag size="mini" :color="calcColor(scope.row.rpInfo.name)" effect="dark">{{ scope.row.rpInfo.name }}</el-tag>
            </span>
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
      <el-table-column align="center" label="提出时间">
        <template slot-scope="scope">
          <span v-if="scope.row.__level === 0">{{ handleTime(scope.row.requireInfo.timestamp) }}</span>
        </template>
      </el-table-column>
      <!--      需求处理状态-->
      <el-table-column align="center" min-width="50" label="需求处理状态">
        <template slot-scope="scope">
          <span v-if="scope.row.__level === 0">{{ getAdminState(scope.row.state, scope.row.requireInfo.state) }}</span>
        </template>
      </el-table-column>
      <!--            用户关注状态-->
      <el-table-column align="center" min-width="50" label="用户关注状态">
        <template slot-scope="scope">
          <span v-if="scope.row.__level === 0">{{ getUserState(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <!--            操作-->
      <el-table-column align="center" min-width="100" label="操作">
        <template slot-scope="scope">
          <span v-if="scope.row.requireInfo.state === 0">
            <el-button v-if="scope.row.__level === 0" type="text" @click="matchRp(scope)">匹配需求模式</el-button>
            <el-tooltip class="item" effect="dark" content="还没有实现" placement="right">
              <el-button type="text" @click="modifyRequire(scope.row)">修改</el-button>
            </el-tooltip>
          </span>
          <span v-else-if="scope.row.requireInfo.state === 1">
            <el-button v-if="scope.row.__level === 0" type="text" @click="matchSp(scope)">生成服务方案</el-button>
            <span v-if="scope.row.__level === 0 ">
              <el-button v-if="scope.row.showRpResult" type="text" @click="hiddenMatchRp(scope)">隐藏匹配方案</el-button>
              <el-button v-else type="text" @click="showMatchRp(scope)">查看匹配方案</el-button>
            </span>
          </span>
          <span v-else>
            <el-button type="text" @click="openUrl(scope.row.requireInfo.serviceSchemeUrl)">查看方案</el-button>
            <el-button type="text" @click="execute(scope.row)">执行</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-require">
      <el-row>
        <!--        <el-button type="success" icon="el-icon-upload2" circle @click="newServiceScheme" />-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
          @click="$router.push({path:'/requires/add-require/index'})"
        />
      </el-row>

    </div>
    <el-dialog :visible.sync="updateRequire.visible" :fullscreen="true">
      <div v-if="updateRequire.visible" style="text-align: center;">
        <tree-table :data="updateRequire.new" :is-tree="true" @submit="update" />
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="visible"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <iframe :src="flowableUrl" width="100%" :height="iframeHeight" />
    </el-dialog>
  </div>
</template>

<script>
import baseUrl from './api'
import { getAdminState, getRestrictString, getUserState } from './restrict-options'
import { handleTime, rpRequireMap, ergodicGoals, calcColor } from './util'
import qs from 'qs'
import require from '@/utils/request2'
import TreeTable from '../component/TreeTable'
import jiff from 'jiff'

const mergeCol = new Set(['提出时间', '需求处理状态', '用户关注状态', '操作'])
export default {
  name: 'AllRequires',
  components: { TreeTable },
  data() {
    return {
      data: [],
      foldList: [],
      visible: false,
      detail: '',
      searchOption: '',
      flowableUrl: '',
      delsubData: { file: '', url: '' },
      selectRequire: { requireId: -1, id: -1 },
      loading: false,
      updateRequire: { visible: false, old: [], new: [] }
    }
  },
  computed: {
    tableListData: function() {
      return this.formatConversion([], this.data)
    },
    iframeHeight: function() {
      return screen.availHeight * 0.85 + 'px'
    },
    username() {
      return this.$store.getters.userinfo.name
    }
  },
  mounted() {
    this.getAllRequire()
  },
  methods: {
    getRestrictString,
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
    toggleMergeRow({ row, column, rowIndex, columnIndex }) {
      const foldList = this.foldList
      function childrenNum(goal) {
        let num = 1
        if (foldList.includes(goal.__identity)) {
          return num
        }
        for (let i = 0; i < goal.children.length; i++) {
          num += childrenNum(goal.children[i])
        }
        return num
      }

      if (mergeCol.has(column.label)) {
        if (row.__level === 0) {
          const num = childrenNum(row)
          return {
            rowspan: num,
            colspan: 1
          }
        } else {
          return [0, 0]
        }
      }
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
    getAllRequire() {
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/get-all-requests?userId=${this.username}`).then(response => {
        this.data = response.data
      }).then(() => {
        this.data.forEach(item => {
          require.get(`/solution/listByRequire/${item.requireInfo.requireId}`).then(res => {
            this.$set(item, 'state', res[0].state)
            this.$set(item, 'id', res[0].id)
          })
        })
      }).catch(_ => {
        this.$message.error('没有需求录入')
      })
    },
    matchRp(scope) {
      const requireId = scope.row.goal.requireId
      this.loading = true
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/matching?requireId=${requireId}`).then(response => {
        this.loading = false
        this.$message({
          message: '匹配成功',
          type: 'success'
        })
        this.getAllRequire()
      }).catch(response => {
        this.$message.error('匹配失败')
      })
    },
    matchSp(scope) {
      const requireId = scope.row.goal.requireId
      this.loading = true
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/match-result?requireId=${requireId}`).then(response => {
        response.data.requireRootName = scope.row.goal.content
        const result = response.data
        this.$ajax.post(`${baseUrl.matchUrl}/api/getrequest`, result).then(response => {
          this.loading = false
          this.visible = true
          this.flowableUrl = response.data.url
          this.delsubData.file = response.data.savepath.split('/').reverse()[1]
          this.delsubData.url = response.data.url.split('=').reverse()[0]
        })
        this.selectRequire.requireId = requireId
        this.selectRequire.id = scope.row.id
      }).catch(_ => {
        this.$message.error('匹配失败')
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        this.loading = true
        this.visible = false
        // TODO 异常处理
        this.$ajax.get(`${baseUrl.matchUrl}/api/delsub?inputfile=${this.delsubData.url}&url=${this.delsubData.url}`).then(res => {
          this.loading = false
          if (res.data.msg !== 'success') {
            this.$message.error('服务方案生成失败' + res.data.msg)
            return
          }
          // 更改状态
          this.$ajax.post(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/modify-state`, qs.stringify({
            requireId: this.selectRequire.requireId,
            url: this.flowableUrl
          }), { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
          ).then(() => {
            require.get(`/solution/toEditing/${this.selectRequire.id}`).then(_ => {
              console.log(_)
            })
            require.get(`/solution/toCreated/${this.selectRequire.id}?url=${this.flowableUrl}`).then(_ => {
              console.log(_)
            })
          }).then(res => {
            this.getAllRequire()
          }).catch((res) => {
          })
        })
        done()
      }).catch(_ => {
        this.$message.error('发生错误')
      })
    },
    search() {
      if (this.detail === '') {
        this.$message({
          message: '搜索内容不可以为空',
          type: 'warning'
        })
        return
      }
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/search-goal?detail=${this.detail}&userId=${this.$store.getters.userinfo.name}&option=${this.searchOption}`)
        .then(response => {
          this.data = response.data
        })
    },
    openUrl(url) {
      window.open(url)
    },
    execute(require) {
      const url = require.requireInfo.serviceSchemeUrl
      const id = require.id
      this.$ajax.get(`${baseUrl.matchUrl}/api/runscheme?inputfile=${url.split('=')[1]}&id=${id}`).then((response) => {
        this.$message({
          message: '开始执行',
          type: 'success'
        })
      }).catch((respose) => {
        this.$message.error('执行失败')
      })
    },
    showMatchRp(scope) {
      const requireId = scope.row.goal.requireId
      scope.row.showRpResult = true
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/match-result?requireId=${requireId}`).then(response => {
        const map = rpRequireMap(response.data)
        ergodicGoals(this.data, (item) => {
          if (typeof map[item.goal.goalId] !== 'undefined') {
            this.$set(item, 'showRpResult', true)
            this.$set(item, 'rpInfo', map[item.goal.goalId])
          }
        })
      }).catch(_ => {
        this.$message.error('出现错误')
      })
    },
    hiddenMatchRp(scope) {
      ergodicGoals([scope.row], (item) => {
        item.showRpResult = false
      })
    },
    update(t) {
      const a = jiff.diff(this.updateRequire.old[0], this.updateRequire.new[0])
      this.updateRequire.new.forEach(item => {
        delete item.requireInfo
        delete item.id
        delete item.state
      })
      this.$ajax.post(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/modify-require?requireId=${this.selectRequire.requireId}`,
        this.updateRequire.new).then(_ => {
        this.updateRequire.visible = false
        this.getAllRequire()
      })
    },
    modifyRequire(require) {
      const requireId = require.requireInfo.requireId
      // console.log(requireId)
      this.updateRequire.old = [require]
      this.updateRequire.new = JSON.parse(JSON.stringify([require]))
      this.updateRequire.visible = true
      this.selectRequire.requireId = require.requireInfo.requireId
    },
    handleTime,
    calcColor,
    getUserState,
    getAdminState
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' >
  .all-requires
    .search-input
      text-align center
      width 30%
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
        line-height 30px !importantz
    .add-require
      position fixed
      right 5%
      bottom 10%
    .el-select .el-input
      width: 130px

</style>
