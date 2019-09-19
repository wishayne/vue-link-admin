<template>
  <div class="app-container">
    <el-form label-width="120px" label-position="left" style="margin-top:30px;width:550px">
      <el-form-item>
        <el-tree
          ref="tree"
          :data="departments"
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
      <el-form :model="department" label-width="80px" label-position="left">
        <el-form-item label="上级部门">
          <span>{{department.parentName}}</span>
        </el-form-item>
        <el-form-item label="部门名">
          <el-input v-model="department.name" placeholder="部门名" />
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="department.levels" style="width: 140px" class="filter-item">
            <el-option
              v-for="item in levelsOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="department.sorts" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDepartment">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  departments,
  addDpartment,
  updateDpartment,
  deleteDpartment
} from "@/api/permission/department";
import { deepClone } from "@/utils";
import { isEmpty, isString, isArray } from "@/utils/validate";
const defaultDepartment = {
  id: "",
  name: "",
  parentId: "",
  parentName: "",
  levels: "",
  deleted: 0
};
export default {
  name: "Department",
  data() {
    return {
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      department: Object.assign({}, defaultDepartment),
      departments: [],
      dialogVisible: false,
      dialogType: "new",
      levelsOptions: [
        { label: "集团", key: 0 },
        { label: "分公司", key: 1 },
        { label: "部门", key: 2 }
      ]
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const res = await departments();
      this.departments = [{ id: 0, name: "部门树", childrens: res.result }];
    },
    handleCreate(data) {
      this.dialogType = "new";
      this.dialogVisible = true;
      this.department = Object.assign({}, defaultDepartment);
      this.department.parentId = data.id;
      this.department.parentName = data.name;
    },

    async handleEdit(node, data) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.department = deepClone(data);
      const parent = node.parent.data;
      this.department.parentId = parent.id;
      this.department.parentName = parent.name;
    },
    async confirmDepartment() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        await updateDpartment(this.department);
      } else {
        await addDpartment(this.department);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success"
      });
      this.getDepartments();
    },
    handleDelete(data) {
      this.$confirm("确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteDpartment(data.id);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getDepartments();
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