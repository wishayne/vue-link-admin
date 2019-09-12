<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="账号"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.vserName"
        placeholder="真实姓名"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.deptid"
        placeholder="部门"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >查找</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="450"
    >
      <el-table-column prop="name" label="账号" width="120"></el-table-column>
      <el-table-column prop="vserName" label="真实姓名" width="90"></el-table-column>
      <el-table-column prop="mobile" label="手机" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="state" label="状态" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色" width="150"></el-table-column>
      <el-table-column prop="companyName" label="公司" width="120"></el-table-column>
      <el-table-column prop="deptName" label="部门" width="120"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
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
  </div>
</template>
<script>
import { userList } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "User",
  components: { Pagination },
  data() {
    return {
      searchOptions: [
        { label: "登录名", key: "name" },
        { label: "真实姓名", key: "vserName" },
        { label: "手机号", key: "mobile" }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        vserName: "",
        name: "",
        mobile: "",
        deptid: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const res = await userList(this.listQuery);
      this.listLoading = false;
      this.list = res.result.rows;
      this.total = res.result.records;
    },
    handleSearch() {this.getList()},
    handleCreate() {}
  }
};
</script>