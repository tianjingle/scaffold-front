<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.artifactId" placeholder="资源名称" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProjectList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="projectList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!-- <el-table-column type="selection" width="100">
			</el-table-column> -->
			<el-table-column prop="id" label="id" width="80" sortable></el-table-column>
            <el-table-column prop="artifactId" label="项目名称" width="300" sortable>
            </el-table-column>
      <el-table-column prop="gitUrl" label="Gitea" width="300" sortable>
          <template scope="scope">
            <el-button type="primary" size="samll" @click="jump(scope.row.gitUrl)">gitea</el-button>
          </template>
        </el-table-column>
      <el-table-column prop="jenkinsUrl" label="Jenkins" width="300" sortable>
          <template scope="scope">
            <el-button type="warning" size="samll" @click="jump(scope.row.jenkinsUrl)">Jenkins</el-button>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" sortable></el-table-column>

			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="资源名称" prop="resourceName">
					<el-input v-model="editForm.resourceName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="资源地址">
					<el-input v-model="editForm.resourceUrl"></el-input>
				</el-form-item>
				<el-form-item label="资源描述">
					<el-input type="textarea" v-model="editForm.content"></el-input>
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
                <el-form-item label="artifactId" prop="artifactId" aria-placeholder="artifactId包名">
                    <el-input  v-model="addForm.artifactId"></el-input>
                </el-form-item>
                <el-form-item label="groupId" prop="groupId" aria-placeholder="groupId项目名称">
                    <el-input  v-model="addForm.groupId"></el-input>
                </el-form-item>
                <el-form-item label="version" prop="version" aria-placeholder="版本号">
                  <el-input v-model="addForm.version"></el-input>
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
  getProjects,
  addMyProject,
  batchRemoveResource,
  removeResource,
  editResource
} from "../../api/myProjectApi";
export default {
  data() {
    return {
      filters: {
        artifactId: ""
      },
      projectList: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        resourceName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        resourceUrl: [{ required: true, message: "资源地址", trigger: "blur" }],
        content: [{ required: true, message: "资源描述", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: "",
        resourceName: "",
        resourceUrl: "",
        content: ""
      },
      addFormRules: {
        artifactId: [{ required: true, message: "项目包名不能为空", trigger: "blur" }],
        groupId: [{ required: true, message: "项目名称不能为空", trigger: "blur" }],
        version: [{ required: true, message: "项目版本号不能为空", trigger: "blur" }],
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      //新增界面数据
      addForm: {
        artifactId: "",
        groupId: "net.cnki",
        version: "1.0.0-SNAPSHOT",
      }
    };
  },
  methods: {
    getProjectList: function() {
      var param = {
        limit: 10,
        page: this.page,
        artifactId: this.filters.artifactId,
        resourceUrl: "",
        content: "",
        flag: ""
      };
      getProjects(param).then(res => {
        this.projectList = res.content;
        this.total = res.total;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getProjectList();
    },
    jump:function(row){
      window.open(row);
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = row.id;
          removeResource(para).then(res => {
            this.listLoading = false;
            this.getProjectList();
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
        artifactId: "",
        groupId: "net.cnki",
        version: "1.0.0-SNAPSHOT",
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            editResource(para).then(res => {
              this.editLoading = false;
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getProjectList();
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
            addMyProject(para).then(res => {
              this.addLoading = false;
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getProjectList();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { resourceIds: ids };
          batchRemoveResource(para).then(res => {
            this.listLoading = false;
            this.getProjectList();
          });
        })
        .catch(() => {});
      this.listLoading = false;
    }
  },
  mounted() {
    this.getProjectList();
  }
};
</script>
<style scoped>
</style>