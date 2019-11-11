<template>
  <div>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column
        property="catelogyName"
        label="类别名称"
        width="120"
      />
      <el-table-column
        property="description"
        label="详细描述"
        width="120"
      />
    </el-table>
    <div style="margin-top: 20px">
      <!--<el-button @click="setCurrent(tableData[1])">选中第二行</el-button>-->
      <!--<el-button @click="setCurrent()">取消选择</el-button>-->
      <el-button @click="add">添加新类别</el-button>
      <el-button @click="update">修改选中的类别</el-button>
      <el-button @click="removeData">删除选中的类别</el-button>
    </div>
    <div v-if="whenAdd">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="addForm.catelogyName" />
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="addForm.description" type="textarea" autosize placeholder="请输入详细描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd">添加</el-button>
          <el-button @click="resetAddForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="whenUpdate">
      <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="updateForm.catelogyName" />
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="updateForm.description" type="textarea" autosize placeholder="请输入详细描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onUpdate">修改</el-button>
          <el-button @click="resetUpdateForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import '../../plugins/element.js'
export default {
  components: {

  },
  data() {
    return {
      tableData: [{
        catelogyId: 1,
        catelogyName: '测试',
        description: '测试类服务'
      }, {
        catelogyId: 2,
        catelogyName: '养老类服务',
        description: '养老类服务'
      }, {
        catelogyId: 3,
        catelogyName: '支付类服务',
        description: '支付类服务'
      }],
      currentRow: null,
      whenAdd: false,
      whenUpdate: false,
      addForm: {
        catelogyId: 0,
        catelogyName: '',
        description: ''
      },
      updateForm: {
        catelogyId: 0,
        catelogyName: '',
        description: ''
      },
      rules: {
        catelogyName: [
          { required: true, message: '请输入类别名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入对该类别的详细描述', trigger: 'change' }
        ]
      }
    }
  },
  mounted: function() {
    this.$http.get('/serviceCategory/list')
      .then(response => response.data)
      .then(data => {
        this.tableData = data
      })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = this.tableData.indexOf(val)
    },
    add() {
      this.whenAdd = true
      this.whenUpdate = false
      this.addForm = {
        catelogyId: 0,
        catelogyName: '',
        description: ''
      }
    },
    update() {
      if (this.currentRow == null) {
        alert('请先选取其中的一行')
        return
      }
      this.whenAdd = false
      this.whenUpdate = true
      this.updateForm = this.tableData[this.currentRow]
    },
    removeData() {
      if (this.currentRow == null) {
        alert('请先选取其中的一行')
        return
      }
      this.$http.delete(`/serviceCategory/${this.tableData[this.currentRow].providerId}`)
        .then((isSuccess) => {
          isSuccess ? this.tableData.splice(this.currentRow, 1) : null
        })
        .catch(ex => {
          console.error(ex)
          alert('数据删除失败！')
        })
      // console.info("before ",this.currentRow,this.tableData);
      // this.tableData.splice(this.currentRow,1);
      // console.info("after",this.tableData)
    },
    onAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$http.post('/serviceCategory/create', this.addForm)
            .then(response => response.data)
            .then((data) => {
              this.tableData.push(data)
              this.whenAdd = false
            })
            .catch(ex => {
              console.error(ex)
              alert('数据传输失败！')
            })
          // this.tableData.push(this.addForm);
          // this.whenAdd = false;
        } else {
          alert('表单验证失败!!')
          return false
        }
      })
    },
    resetAddForm() {
      this.whenAdd = false
    },
    onUpdate() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.$http.post(`/serviceCategory/update/${this.updateForm.providerId}`, this.updateForm)
            .then(response => response.data)
            .then((data) => {
              this.tableData.splice(this.currentRow, 1, data)
              this.whenUpdate = false
            })
            .catch(ex => {
              console.error(ex)
              alert('数据传输失败！')
            })
        } else {
          alert('表单验证失败!!')
          return false
        }
      })
    },
    resetUpdateForm() {
      this.whenUpdate = false
    }
  }
}
</script>
