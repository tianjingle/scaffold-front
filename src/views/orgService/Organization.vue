<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="机构名称" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getToolProjectList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="Toolproject" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column prop="id" label="id" width="250" sortable>
			</el-table-column>
			<el-table-column prop="name" label="机构名称" width="250" sortable>
			</el-table-column>
			<el-table-column prop="content" label="组织代码" width="250" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="机构名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织代码">
					<el-input v-model="editForm.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="resourceName">
					<el-input v-model="addForm.name" auto-complete="off" aria-placeholder="名称"></el-input>
				</el-form-item>
        <el-form-item label="代码" prop="resourceUrl">
          <el-input v-model="addForm.content" auto-complete="off" aria-placeholder="描述"></el-input>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
//import NProgress from 'nprogress'
import {
  getToolProjects,
  addToolProject,
  removeToolProject,
  editToolProject
} from "../../api/ProjectApi";
export default {
  data() {
    return {
      filters: {
        name: ""
      },
      Toolproject: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "名称", trigger: "blur" }],
        content: [{ required: true, message: "描述", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: "",
        name: "",
        content: ""
      },
      addFormRules: {
        name: [{ required: true, message: "名称", trigger: "blur" }],
        content: [{ required: true, message: "路径", trigger: "blur" }]
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      //新增界面数据
      addForm: {
        name: "",
        content: ""
      }
    };
  },
  methods: {
    getToolProjectList: function() {
      getToolProjects().then(res => {
        this.Toolproject = res.content;
        this.total = res.total;
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = row.id;
          removeToolProject(para).then(res => {
            this.listLoading = false;
            this.getToolProjectList();
          });
        })
        .catch(() => {});
      this.listLoading = false;
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.loading = false;
      this.addFormVisible = true;
      this.addForm = {
        resourceName: "",
        resourceUrl: "",
        content: "",
        flag: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            editToolProject(para).then(res => {
              this.editLoading = false;
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getToolProjectList();
            });
            this.editLoading = false;
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = Object.assign({}, this.addForm);
            addToolProject(para).then(res => {
              this.addLoading = false;
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getToolProjectList();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getToolProjectList();
  }
};
</script>
<style scoped>
</style>