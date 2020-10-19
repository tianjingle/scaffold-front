<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.resourceName" placeholder="资源名称" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getResourceList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="resourceList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="100">
			</el-table-column>
			<!-- <el-table-column type="index" width="100">
			</el-table-column> -->
			<el-table-column prop="id" label="id" width="250" sortable>
			</el-table-column>
			<el-table-column prop="resourceName" label="资源名称" width="250" sortable>
			</el-table-column>
			<el-table-column prop="resourceUrl" label="资源地址" width="250" sortable>
			</el-table-column>
			<el-table-column prop="content" label="内容" width="250" sortable>
			</el-table-column>
			<!-- <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column> -->
			<!-- <el-table-column prop="age" label="年龄" width="100" sortable>
			</el-table-column> -->
			<!-- <el-table-column prop="birth" label="生日" width="120" sortable>
			</el-table-column> -->
			<!-- <el-table-column prop="addr" label="地址" min-width="180" sortable>
			</el-table-column> -->
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
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
				<el-form-item label="资源名称" prop="resourceName">
					<el-input v-model="addForm.resourceName" auto-complete="off" aria-placeholder="资源的名称"></el-input>
				</el-form-item>
        <el-form-item label="资源路径" prop="resourceUrl">
          <el-input v-model="addForm.resourceUrl" auto-complete="off" aria-placeholder="资源地址"></el-input>
        </el-form-item>
        <el-form-item label="资源描述" prop="content" aria-placeholder="资源的描述">
<el-input type="textarea" v-model="addForm.content"></el-input>
        </el-form-item>
				<!-- <el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item> -->
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
  getResources,
  addResource,
  batchRemoveResource,
  removeResource,
  editResource
} from "../../api/ResourceApi";
export default {
  data() {
    return {
      filters: {
        resourceName: ""
      },
      resourceList: [],
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
        resourceName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        resourceUrl: [{ required: true, message: "资源地址", trigger: "blur" }],
        content: [{ required: true, message: "资源描述", trigger: "blur" }]
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      //新增界面数据
      addForm: {
        resourceName: "",
        resourceUrl: "",
        content: ""
      }
    };
  },
  methods: {
    getResourceList: function() {
      var param = {
        limit: 15,
        page: this.page,
        resourceName: this.filters.resourceName,
        resourceUrl: "",
        content: "",
        flag: ""
      };
      getResources(param).then(res => {
        this.resourceList = res.content;
        this.total = res.total;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getResourceList();
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
            this.getResourceList();
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
            editResource(para).then(res => {
              this.editLoading = false;
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getResourceList();
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
            // para.birth =
            //   !para.birth || para.birth == ""
            //     ? ""
            //     : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addResource(para).then(res => {
              this.addLoading = false;
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getResourceList();
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
            this.getResourceList();
          });
        })
        .catch(() => {});
      this.listLoading = false;
    }
  },
  mounted() {
    this.getResourceList();
  }
};
</script>
<style scoped>
</style>