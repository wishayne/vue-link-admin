<template>
  <div class="app-container">
    <el-form label-width="120px" label-position="left" style="margin-top:30px;width:450px">
      <el-form-item>
        <el-tree
          ref="tree"
          :data="permissions"
          :props="defaultProps"
          node-key="id"
          class="permission-tree"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="() => handleCreate(data)">添加</el-button>
              <el-button type="text" size="mini" @click="() => handleEdit(node,data)">修改</el-button>
              <el-button type="text" size="mini" @click="() => handleDelete(data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form :model="permission" label-width="80px" label-position="left">
        <el-form-item label="上级权限">
          <span>{{permission.parentName}}</span>
        </el-form-item>
        <el-form-item label="权限名">
          <el-input v-model="permission.name" placeholder="权限名" />
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select v-model="permission.types" style="width: 140px" class="filter-item">
            <el-option
              v-for="item in typesOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="url">
          <el-input v-model="permission.url" placeholder="url" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="permission.sorts" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  permissions,
  addPermission,
  updatePermission,
  deletePermission
} from "@/api/permission";
import { deepClone } from "@/utils";
import { isEmpty, isString, isArray } from "@/utils/validate";
const defaultPermission = {
  id: "",
  name: "",
  parentId: "",
  parentName: "",
  url: "",
  types: "",
  sorts: ""
};
export default {
  name: "Permission",
  data() {
    return {
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      permission: Object.assign({}, defaultPermission),
      permissions: [],
      dialogVisible: false,
      dialogType: "new",
      typesOptions: [{ label: "菜单", key: 0 }, { label: "功能权限", key: 1 }]
    };
  },
  created() {
    this.getPermissions();
  },
  methods: {
    async getPermissions() {
      const res = await permissions();
      this.permissions = [{ id: 0, name: "权限树", childrens: res.result }];
    },
    handleCreate(data) {
      this.dialogType = "new";
      this.dialogVisible = true;
      this.permission = Object.assign({}, defaultPermission);
      this.permission.parentId = data.id;
      this.permission.parentName = data.name;
    },

    async handleEdit(node, data) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.permission = deepClone(data);
      const parent = node.parent.data;
      this.permission.parentId = parent.id;
      this.permission.parentName = parent.name;
    },
    async confirmPermission() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        await updatePermission(this.permission);
      } else {
        await addPermission(this.permission);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success"
      });
      this.getPermissions();
    },
    handleDelete(data) {
      this.$confirm("确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deletePermission(data.id);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getPermissions();
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>