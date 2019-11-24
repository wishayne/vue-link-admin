<template>
  <el-container>
    <el-header>
      <div style="margin-top:20px;margin-bottom: 20px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="listQuery.creator" placeholder="发起者" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="listQuery.description" placeholder="描述" />
          </el-col>
          <el-col :span="2">
            <label style="float: right;position: center;margin-top: 15%;">状态：</label>
          </el-col>
          <el-col :span="4">
            <!--<el-input v-model="listQuery.state" placeholder="状态" />-->
            <el-select v-model="listQuery.state" title="状态" style="width: 140px" class="filter-item">
              <el-option
                v-for="(value,key) in stateMap"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >查找</el-button>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        height="450"
        border
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="description"
          label="方案描述"
          width="120"
        />
        <el-table-column
          label="发起者"
          width="120"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.creator.viewName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="120"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ stateMap[scope.row.state] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="方案创建时间"
          width="120"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.createTimestamp | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="方案启动时间"
          width="120"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.startTimestamp | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="方案完成时间"
          width="120"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.finishTimestamp | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.state=='INITIALIZATION'" type="text" @click="matchSp(scope)">生成服务方案</el-button>
            <el-button v-if="scope.row.state=='EDITING'" type="text" @click="openUrl(scope.row.operationUrl)">修改服务方案</el-button>
            <el-button v-if="scope.row.state=='CREATED'" type="text" @click="execute(scope.row.operationUrl)">启动服务方案</el-button>
            <el-button v-if="scope.row.state=='CREATED'||scope.row.state=='RUNNING'||scope.row.state=='FINISH'" type="text" @click="openUrl(scope.row.operationUrl)">查看服务方案</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-main>
  </el-container>
</template>
<script>
import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request2'
import baseUrl from '../../requires/all-requires/api'
export default {
  components: {
    Pagination
  },
  filters: {
    formatDate: function(value) {
      const date = new Date(value)
      if (date.getTime() < new Date(2000, 1, 1).getTime()) {
        return ''
      }
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        creator: '',
        description: '',
        state: ''
      },
      stateMap: {
        INITIALIZATION: '待生成', EDITING: '编辑中', CREATED: '已生成', RUNNING: '执行中', FINISH: '执行完毕',
        '': '全部'
      },
      userList: []
    }
  },
  created: function() {
    // this.loadCategory()
    //   .then(() => this.getList())
    this.getList()
  },
  methods: {
    loadCategory() {
      return request({
        url: '/user/list',
        method: 'get'
      }).then(data => {
        this.userList = data
      })
    },
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const query = deepClone(this.listQuery)
        query.page -= 1
        const res = await request({
          url: '/solution/query',
          method: 'get',
          params: query
        })
        this.listLoading = false
        this.list = res.content
        this.total = res.totalElements
      } catch (e) {
        this.listLoading = false
      }
    },
    handleSearch() {
      this.getList()
    },
    matchSp(scope) {
      const requireId = scope.row.requireId
      this.loading = true
      this.$ajax.get(`${process.env.VUE_APP_REQUIRE_BASE_URL}/api/match-result?requireId=${requireId}`).then(response => {
        response.data.requireRootName = scope.row.description
        const result = response.data
        this.$ajax.post(`${baseUrl.matchUrl}/api/getrequest`, result).then(response => {
          this.loading = false
          this.getList()
          // this.visible = true
          // this.flowableUrl = response.data.url
          // this.delsubData.file = response.data.savepath.split('/').reverse()[1]
          // this.delsubData.url = response.data.url.split('=').reverse()[0]
        })
        // this.selectRequireId = requireId
      }).catch(_ => {
        this.$message.error('匹配失败')
      })
    },
    openUrl(url) {
      window.open(url)
    },
    execute(url) {
      this.$ajax.get(`${baseUrl.matchUrl}/api/runscheme?inputfile=${url.split('=')[1]}&username=${this.$store.getters.userinfo.name}`).then((response) => {
        this.$message({
          message: '执行成功',
          type: 'success'
        })
      }).catch((respose) => {
        this.$message.error('执行失败')
      })
    }
  }
}
</script>
