<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top:20px;">
      <el-input
        v-model="listQuery.data_type"
        placeholder="请输入类型/key/value"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
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
      <el-table-column width="50">
        <template slot-scope="scope">
          <span>{{scope.$index+(listQuery.page - 1) * listQuery.limit + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="data_type" label="类型"></el-table-column>
      <el-table-column prop="data_key" label="key"></el-table-column>
      <el-table-column prop="data_value" label="value"></el-table-column>
      <el-table-column prop="sorts" label="排序"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
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
      <el-form :model="dict" label-width="80px" label-position="left">
        <el-form-item label="Type">
          <el-input v-model="dict.data_type" placeholder="类型" />
        </el-form-item>
        <el-form-item label="Key">
          <el-input v-model="dict.data_key" placeholder="Key" />
        </el-form-item>
        <el-form-item label="Value">
          <el-input v-model="dict.data_value" placeholder="Value" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="dict.sorts" placeholder="排序" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="dict.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDict">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  dictList,
  addDict,
  updateDict,
  deleteDict
} from "@/api/permission/dict";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { deepClone } from "@/utils";
import { isEmpty, isString, isArray } from "@/utils/validate";
const defaultDict = {
  id: undefined,
  data_type: "",
  data_key: "",
  data_value: "",
  sorts: undefined,
  description: ""
};
export default {
  name: "Dict",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        data_type: ""
      },
      dict: Object.assign({}, defaultDict),
      dialogVisible: false,
      dialogType: "new"
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
        const res = await dictList(this.listQuery);
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
    handleCreate() {
      this.dict = Object.assign({}, defaultDict);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    async handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.dict = deepClone(scope.row);
    },
    async confirmDict() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        await updateDict(this.dict);
      } else {
        await addDict(this.dict);
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
      this.$confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteDict(row.id);
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
    }
  }
};
</script>
