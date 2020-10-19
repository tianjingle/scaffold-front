<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.roleName" placeholder="菜单名称" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoleList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roleList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="100">
			</el-table-column>
			<!-- <el-table-column type="index" width="100">
			</el-table-column> -->
			<el-table-column prop="id" label="id" width="250" sortable>
			</el-table-column>
			<el-table-column prop="roleName" label="菜单名称" width="250" sortable>
			</el-table-column>
			<el-table-column prop="content" label="描述" width="250" sortable>
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="handleRoleEdit(scope.$index, scope.row)">配置</el-button>
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


<el-dialog title="资源关联" v-model="roleMenuVisble" :close-on-click-modal="false"  custom-class="customWidth">
  <el-transfer v-model="value" :titles="['可选资源', '已选资源']" :data="data" width="100%"></el-transfer>
  	<div slot="footer" class="dialog-footer">
				<el-button @click.native="roleMenuVisble = false">取消</el-button>
				<el-button type="primary" @click.native="relationShipSubmit" :loading="editLoading">提交</el-button>
			</div>
</el-dialog>


		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="editForm.roleName" auto-complete="off" aria-placeholder="资源的名称"></el-input>
				</el-form-item>
        <el-form-item label="菜单描述" prop="resourceUrl">
          <el-input v-model="editForm.content" auto-complete="off" aria-placeholder="资源地址"></el-input>
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
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName" auto-complete="off" aria-placeholder=""></el-input>
				</el-form-item>
        <el-form-item label="菜单描述" prop="content">
          <el-input v-model="addForm.content" auto-complete="off" aria-placeholder=""></el-input>
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
import {
  getRole,
  addRole,
  batchRemoveRole,
  removeRole,
  editRole,
  getRoleMenus,
  roleMenuAdd
} from "../../api/RoleApi";
export default {
  data() {
    return {
      filters: {
        roleName: ""
      },
      roleList: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        id: [{ required: true, message: "数据异常", trigger: "blur" }],
        roleName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        content: [{ required: true, message: "描述", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: "",
        roleName: "",
        content: ""
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        content: [{ required: true, message: "描述", trigger: "blur" }]
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      //新增界面数据
      addForm: {
        roleName: "",
        content: ""
      },
      data: [],
      value: [],
      roleMenuVisble: false,
      roleId: ""
    };
  },
  methods: {
    getRoleList: function() {
      var param = {
        limit: 15,
        page: this.page,
        roleName: this.filters.roleName,
        content: "",
        flag: ""
      };
      getRole(param).then(res => {
        this.roleList = res.content;
        this.total = res.total;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRoleList();
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = row.id;
          removeRole(para).then(res => {
            this.listLoading = false;
            this.getRoleList();
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
            editRole(para).then(res => {
              this.editLoading = false;
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getRoleList();
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
            addRole(para).then(res => {
              this.addLoading = false;
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getRoleList();
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
          let para = { ids: ids };
          batchRemoveRole(para).then(res => {
            this.listLoading = false;
            this.getRoleList();
          });
        })
        .catch(() => {});
      this.listLoading = false;
    },
    handleRoleEdit: function(index, row) {
      this.roleId = row.id;
      this.roleMenuVisble = true;
      this.data = [];
      this.value = [];
      getRoleMenus(row.id).then(res => {
        var temp = res.content;
        for (var i = 0; i < temp.length; i++) {
          this.data.push({
            key: temp[i].id,
            label: temp[i].menuName
          });
        }
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].flag == "Y") {
            this.value.push(temp[i].id);
          }
        }
      });
    },
    relationShipSubmit: function() {
      let param = [];
      for (var i = 0; i < this.value.length; i++) {
        param.push({
          roleId: this.roleId,
          menuId: this.value[i]
        });
      }
      roleMenuAdd(this.roleId, param);
      this.roleMenuVisble = false;
    }
  },
  mounted() {
    this.getRoleList();
  }
};
</script>
<style scoped>
.el-dialog--small {
  width: 50%;
}
</style>