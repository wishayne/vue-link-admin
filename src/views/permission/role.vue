<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top:20px;">
      <el-input
        v-model="listQuery.name"
        placeholder="角色名"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
        v-permission="['/rest/role/list']"
      >查找</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
        v-permission="['/rest/role/add']"
      >
        <i class="el-icon-plus" /> 新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="450"
    >
      <el-table-column prop="name" label="角色名"></el-table-column>
      <!-- <el-table-column prop="levels" label="级别"></el-table-column> -->
      <el-table-column prop="data_scope" label="数据权限" :formatter="formatDataScope"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleDataScope(scope.row)"
            v-permission="['/rest/role/saveDataScope']"
          >数据权限</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleEdit(scope)"
            v-permission="['/rest/role/update']"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleDelete(scope)"
            v-permission="['/rest/role/delete']"
          >删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="role.name" placeholder="角色名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="权限许可">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="permissions"
            :props="defaultProps"
             default-expand-all
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="'分配数据权限'" :visible.sync="dataScopeDialogVisible" width="500px">
      <el-form :model="role" label-width="80px">
        <el-form-item label="角色名称">{{role.name}}</el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="role.data_scope">
           
            <el-option
              v-for="item in dataScopes"
              :key="item.data_key"
              :label="item.data_value"
              :value="item.data_key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="role.data_scope == 1">
          <el-tree
            :data="departments"
            show-checkbox
            default-expand-all
            ref="deptTree"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dataScopeDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitDataScope">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js"; // 权限判断指令
import {
  roleList,
  addRole,
  updateRole,
  deleteRole,
  saveDataScope,
  queryDataScope
} from "@/api/permission/role";
import { permissions, permissionsByRole } from "@/api/permission/permission";
import { departments } from "@/api/permission/department";
import { dictInfo } from "@/api/permission/dict";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { deepClone } from "@/utils";
import { isEmpty, isString, isArray } from "@/utils/validate";
const defaultRole = {
  id: undefined,
  name: "",
  description: "",
  permIds: "",
  data_scope: "",
  deptIds: []
};
export default {
  name: "Role",
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
        limit: 10,
        name: ""
      },
      role: Object.assign({}, defaultRole),
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      permissions: [],
      permissionsByRole: [],
      dataScopeDialogVisible: false,
      departments: [],
      dataScopes: []
    };
  },
  created() {
    this.getList();
    this.getPermissions();
    this.getDepartments();
    this.getDataScopes();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      //If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await roleList(this.listQuery);
        this.listLoading = false;
        this.list = res.result.rows;
        this.total = res.result.records;
      } catch (e) {
        this.listLoading = false;
      }
    },
    formatDataScope(row, column) {
      var val = "";
      for (var item of this.dataScopes) {
        if (item.data_key == row.data_scope) {
          val = item.data_value;
          break;
        }
      }
      return val;
    },
    async getPermissions() {
      const res = await permissions();
      this.permissions = res.result;
      // this.permissions = this.generateRoutes(res.data);
    },
    async getPermissionsByRole(roleId) {
      const res = await permissionsByRole(roleId);
      this.permissionsByRole = res.result;
      //this.routes = this.generateRoutes(res.data);
    },
    async getDataScopes() {
      const res = await dictInfo("data_scope");
      this.dataScopes = res.result;
    },
    async getDepartments() {
      const res = await departments();
      this.departments = res.result;
    },
    handleSearch() {
      this.getList();
    },
    handleCreate() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.checkStrictly = true;
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    generateArr(routes) {
      let data = [];
      routes.forEach(route => {
        data.push(route);
        if (route.childrens) {
          const temp = this.generateArr(route.childrens);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      return data;
    },
    async handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.role = deepClone(scope.row);
      const res = await permissionsByRole(this.role.id);
      this.permissionsByRole = res.result;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(
          this.generateArr(this.permissionsByRole)
        );
      });
      //this.$refs.tree.setCheckedNodes(this.generateArr(this.permissionsByRole));
    },
    async confirmRole() {
      const isEdit = this.dialogType === "edit";
      var checkedKeys = this.$refs.tree.getCheckedKeys();
      if (!isEmpty(checkedKeys)) {
        this.role.permIds = checkedKeys.join(",");
      }
      if (isEdit) {
        await updateRole(this.role);
      } else {
        await addRole(this.role);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success"
      });
      this.getList();
    },
    handleDelete({ row }) {
      this.$confirm("确认删除角色?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteRole(row.id);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList();
        })
        .catch(err => {
          console.error(err);
        });
    },
    async setCheckDeptTree(roleId) {
      const res = await queryDataScope(roleId);
      this.$refs.deptTree.setCheckedKeys(res.result);
    },
    handleDataScope(row) {
      this.role=deepClone(row);
      if (this.$refs.deptTree) {
        this.$refs.deptTree.setCheckedKeys([]);
      }
      if (row.data_scope == 1) {
        this.setCheckDeptTree(row.id);
      }
      this.dataScopeDialogVisible = true;
    },
    /** 提交按钮（数据权限） */
    async submitDataScope() {
      if (this.role.id) {
        this.role.deptIds = this.$refs.deptTree
          .getCheckedKeys();
        await saveDataScope(this.role);
        this.dataScopeDialogVisible = false;
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success"
        });
        this.getList();
      }
    }
  }
};
</script>
