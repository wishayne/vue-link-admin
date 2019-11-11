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
      <el-table-column prop="info.name" label="名字" align="center" />
      <el-table-column prop="info.description" label="描述" align="center" />
      <el-table-column prop="info.domain" label="业务领域" align="center" />
      <el-table-column prop="info.timestamp" label="创建时间" align="center" />
    </el-table>
    <br>
    <h2 style="text-align: center">
      {{ selectedRP.info.name || '' }}
    </h2>
    <br>
    <el-table :data="tableListData" :row-style="toggleDisplayTr" :span-method="toggleMergeRow" border stripe class="init_table" size="small">
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
          <span v-for="restrict in scope.row.goal.restricts" :key="restrict.key">
            {{ getRestrictString(restrict) }}
          </span>
        </template>
      </el-table-column>
      <!--            操作-->
      <el-table-column align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="还没有实现" placement="right">
            <el-button type="text" @click="modifyRP(scope)">修改</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-button
      type="primary"
      icon="el-icon-plus"
      circle
      class="add-rp"
      @click="$router.push({path:'addRP',query:{userId:$route.query.userId}})"
    />
  </div>

</template>

<script>
export default {
  name: 'AllRP',
  data() {
    return {
      data: [],
      selectedRP: {
        info: {}
      },
      detail: '',
      foldList: []
    }
  },
  computed: {
    tableListData: function() {
      return this.formatConversion([], this.selectedRP.data || [])
    }
  },
  mounted() {
    this.axios.get(`${process.env.VUE_APP_BASE_URL}/api/get-all-rps`).then(response => {
      this.data = response.data
    })
  },
  methods: {
    rowClick(row) {
      this.selectedRP = row
    },
    getRestrictString(r) {
      if (r.valueType === 'region') {
        return ` ${r.key}:${r.minValue}~${r.maxValue}${r.unit}`
      }
      if (r.valueType === 'after') {
        return ` 在${r.value}之后进行`
      }
      if (r.valueType !== '') {
        return ` ${r.key}:${r.value}`
      }
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
    toggleMergeRow({ row, column, rowIndex, columnIndex }) {
      const tableCol = document.getElementsByClassName('init_table')[0].childElementCount
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

      if (columnIndex <= tableCol && columnIndex > tableCol - 1) {
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
    modifyRP(scope) {
      console.log(scope)
      //    TODO 修改
    },
    search() {
      this.axios.get(`${process.env.VUE_APP_BASE_URL}/api/search-rp?detail=${this.detail}`).then(response => {
        this.data = response.data
        this.selectedRP = { info: {}}
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
</style>
