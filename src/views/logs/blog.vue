<template>
  <div class="app-container">
    <div class style="margin-top:20px;">
      <el-form :inline="true">
        <el-form-item style="margin-bottom: 12px;">
          <el-date-picker
            v-model="listQuery.starttime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始日期"
          ></el-date-picker>
          <br />
          <span style="color:#909399">(备注:时间范围小于1天)</span>
        </el-form-item>
        <el-form-item>--</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.endtime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.loginuser"
            placeholder="账号"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
            v-permission="['/rest/logs/blog/list']"
          >查找</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="450"
    >
      <el-table-column width="50">
        <template slot-scope="scope">
          <span>{{scope.$index+(listQuery.page - 1) * listQuery.limit + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cratetime" label="请求时间" :formatter="formatDateTime"></el-table-column>
      <el-table-column prop="loginuser" label="账号"></el-table-column>
      <el-table-column prop="vsername" label="用户"></el-table-column>
      <el-table-column prop="ip" label="ip"></el-table-column>
      <el-table-column prop="title" label="操作"></el-table-column>
      <el-table-column prop="url" label="url"></el-table-column>
      <el-table-column prop="duration" label="耗时(ms)"></el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { blogList } from "@/api/logs/blog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getDateTime, formatDateTime } from "@/utils";
const nowDateTime=getDateTime();
export default {
  name: "Blog",
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        starttime: nowDateTime,
        endtime: nowDateTime,
        loginuser: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
       //If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await blogList(this.listQuery);
        this.listLoading = false;
        this.list = res.result.rows;
        this.total = res.result.records;
      } catch (e) {
        this.listLoading = false;
      }
    },
    handleSearch() {
      this.getList();
    },
    formatDateTime(row, column) {
      return formatDateTime(row.cratetime);
    }
  }
};
</script>
