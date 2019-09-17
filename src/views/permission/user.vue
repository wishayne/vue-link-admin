<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top:30px;">
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

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope)" type="text" size="small">编辑</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'" >
      <el-form :model="user" label-width="80px" label-position="left" style="height: 380px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户信息" name="first">
            <el-form-item label="账号">
              <el-input v-model="user.name" placeholder="账号" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="user.password" placeholder="密码" />
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input v-model="user.vserName" placeholder="真实姓名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="user.mobile" placeholder="手机号" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email" placeholder="邮箱" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="user.state" style="width: 140px" class="filter-item">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="部门" name="second">
            <el-form-item >
              <el-tree
                ref="tree"
                :check-strictly="true"
                :data="departments"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                class="permission-tree"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="角色" name="third">角色管理</el-tab-pane>
        </el-tabs>
      </el-form>

      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userList, addUser, updateUser } from "@/api/user";
import { departments } from "@/api/department";
import { roles } from "@/api/role";
import { deepClone } from "@/utils";
import { isEmpty, isString, isArray } from "@/utils/validate";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
const defaultUser = {
  uid: "",
  name: "",
  password: "",
  vserName: "",
  mobile: "",
  state: 0,
  email: "",
  deptid: "",
  deptName: ""
};
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
        limit: 10,
        vserName: "",
        name: "",
        mobile: "",
        deptid: ""
      },
      activeName: 'first',
      user: Object.assign({}, defaultUser),
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      stateOptions: [{ label: "禁用", key: 0 }, { label: "启用", key: 1 }],
      departments: [],
      dialogVisible: false,
      dialogType: "new"
    };
  },
  created() {
    this.getList();
    this.getDepartments();
    this.getRoles();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const res = await userList(this.listQuery);
      this.listLoading = false;
      this.list = res.result.rows;
      this.total = res.result.records;
    },
    handleSearch() {
      this.getList();
    },
    async getDepartments() {
      const res = await departments();
      this.departments = res.result;
    },
    async getRoles() {
      const res = await roles();
      this.roles = res.result;
    },
    handleCreate() {
      this.user = Object.assign({}, defaultUser);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    async handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.user = deepClone(scope.row);
    },
    async confirmUser() {
      const isEdit = this.dialogType === "edit";
      var checkedKeys = this.$refs.tree.getCheckedKeys();
      if (!isEmpty(checkedKeys)) {
        this.user.deptid = checkedKeys.join(",");
      }
      if (isEdit) {
        await updateUser(this.user);
      } else {
        await addUser(this.user);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success"
      });
      this.getList();
    }
  }
};
</script>
