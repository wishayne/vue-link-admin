<template>
  <el-container>
    <el-header>
      <div style="margin-top:20px;margin-bottom: 20px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="listQuery.provider" placeholder="组织" />
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
      <p>共生体模式：</p>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        highlight-current-row
        border
        @current-change="handleCurrentChange"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="description"
          label="描述"
        />
        <el-table-column
          property="provider"
          label="组织"
        />
        <el-table-column
          label="包含的服务"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.domain }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table v-if="checked_ssp!=null" :data="filterServiceBySSP()" style="width: 100%;">-->

      <!--</el-table>-->

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
      <p>SSP之间的关系</p>
      <el-table
        :data="dspR"
        style="width: 100%;"
        border
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="from"
          label="head"
        />
        <el-table-column
          label="tail"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.to }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="关系"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.type }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div id="neo4jd3" style="min-height: 400px;" />
    </el-main>
    <el-dialog :visible.sync="isShown">
      <div> {{ bpmn }} </div>
    </el-dialog>
  </el-container>
</template>
<script>
import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request2'
import * as d3 from 'd3'

import { D3Graph } from './d3graph'
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
      rawData: [
        {
          description: 'SSP1',
          domain: '急救,治疗,信息通讯',
          provider: 'ICES'
        },
        {
          description: 'SSP2',
          domain: '急救,治疗',
          provider: 'ICES'
        },
        {
          description: 'SSP3',
          domain: '治疗,信息通讯',
          provider: 'ICES'
        }
      ],
      serviceData: [],
      dspR: [
        {
          from: 'SSP2',
          to: 'SSP1',
          type: '整体局部关系'
        },
        {
          from: 'SSP3',
          to: 'SSP1',
          type: '整体局部关系'
        }
      ],
      checked_ssp: null,
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
      userList: [],
      bpmn: '',
      isShown: false
    }
  },
  created: function() {
    // this.loadCategory()
    //   .then(() => this.getList())
    this.getList()
    this.loadServices()
  },
  mounted: function() {
    const d3Graph = new D3Graph()
    d3Graph.refresh({
      nodes: [
        {
          id: 'SSP1',
          labels: ['共生体'],
          properties: {
            name: 'SSP1',
            provider: 'ICES'
          }
        },
        {
          id: 'SSP2',
          labels: ['共生体'],
          properties: {
            name: 'SSP2',
            provider: 'ICES'
          }
        },
        {
          id: 'SSP3',
          labels: ['共生体'],
          properties: {
            name: 'SSP3',
            provider: 'ICES'
          }
        },
        {
          id: 'AS1',
          labels: ['原子服务'],
          properties: {
            name: '急救',
            provider: 'ICES'
          }
        },
        {
          id: 'AS2',
          labels: ['原子服务'],
          properties: {
            name: '治疗',
            provider: 'ICES'
          }
        },
        {
          id: 'AS3',
          labels: ['原子服务'],
          properties: {
            name: '在线通讯',
            provider: 'ICES'
          }
        }
      ],
      relationships: [
        {
          'id': 'edge01',
          'type': '整体局部关系',
          'startNode': 'SSP2',
          'endNode': 'SSP1',
          'properties': {},
          'source': 'SSP2',
          'target': 'SSP1',
          'linknum': 1
        },
        {
          'id': 'edge02',
          'type': '整体局部关系',
          'startNode': 'SSP3',
          'endNode': 'SSP1',
          'properties': {},
          'source': 'SSP3',
          'target': 'SSP1',
          'linknum': 1
        },
        {
          'id': 'edge03',
          'type': '功能互补',
          'startNode': 'AS1',
          'endNode': 'AS2',
          'properties': {},
          'source': 'AS1',
          'target': 'AS2',
          'linknum': 1
        }
      ]
    })
  },
  methods: {
    async loadServices() {
      const res = await request({
        url: '/service/list',
        method: 'get'
      })
      this.serviceData = res
    },
    filterServiceBySSP() {
      return this.serviceData.filter(s => this.checked_ssp.domain.indexOf(s.feature.name) >= 0)
    },
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
        // const res = await request({
        //   url: '/solution/query',
        //   method: 'get',
        //   params: query
        // })
        this.listLoading = false
        this.list = this.rawData
        this.total = this.rawData.length
        // this.list = res.content
        // this.total = res.totalElements
      } catch (e) {
        this.listLoading = false
      }
    },
    handleSearch() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.checked_ssp = val
    },
    openUrl(url) {
      window.open(url)
    },
    showBPMN(scope) {
      // window.open(`http://10.147.18.103:8080/process/downloadXML/pattern?tasks=${scope.row.tasks}`)
      this.$ajax.get(`http://10.147.18.103:8080/process/downloadXML/pattern?tasks=${scope.row.tasks}`).then(response => {
        this.bpmn = response.data
        this.isShown = true
      })
    }
  }
}
</script>
