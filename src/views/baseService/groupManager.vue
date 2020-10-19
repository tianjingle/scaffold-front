<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input type="text" v-model="filters.name" placeholder="姓名" @keyup.enter.native="changeName($event)" style="width:300px"></el-input>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="dialogShow">新增</el-button>
        </el-form-item>
			</el-form>
		</el-col>

    
		<!--列表-->
			<el-table :data="users" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
				<!-- <el-table-column type="index" width="60"></el-table-column> -->
        <el-table-column prop="id" label="id" width="60" sortable>	</el-table-column>
				<el-table-column prop="userName" label="账户" width="250" sortable>	</el-table-column>
				<el-table-column prop="loginId" label="用户名称" width="250" sortable></el-table-column>
				<el-table-column prop="userPassword" label="用户密码" width="250" sortable></el-table-column>
				<el-table-column prop="userEmil" label="用户邮箱" width="250" sortable></el-table-column>
				<el-table-column prop="roId" label="用户权限" width="180" sortable :formatter="formatRole"></el-table-column>
        <el-table-column prop="orgId" label="所属团队" width="180" sortable :formatter="formatOrg"></el-table-column>
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;"></el-pagination>
		</el-col>


		<!--新增界面-->
		<el-dialog title="新增" v-model="adddialogShow" :close-on-click-modal="false">
			<el-form :model="addUserForm" label-width="80px" :rules="addFormRules" ref="addUserForm">
				<el-form-item label="账户" prop="userName">
					<el-input v-model="addUserForm.userName" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="用户名称" prop="loginId">
            <el-input v-model="addUserForm.loginId" ></el-input>
				</el-form-item>
        <el-form-item label="密码" prop="loginId">
            <el-input v-model="addUserForm.userPassword" ></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="userEmil">
					<el-input v-model="addUserForm.userEmil"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="adddialogShow = false">取消</el-button>
				<el-button type="primary" v-on:click="addUser" :loading="loading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editUserForm" label-width="80px" :rules="editFormRules" ref="editUserForm">
				<el-form-item label="账户" prop="userName">
					<el-panel v-model="editUserForm.userName" auto-complete="on"></el-panel>
				</el-form-item>
				<el-form-item label="名称" prop="loginId">
            <el-input v-model="editUserForm.loginId" ></el-input>
				</el-form-item>
        <el-form-item label="密码" prop="loginId">
            <el-input v-model="editUserForm.userPassword" ></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="userEmil">
					<el-input v-model="editUserForm.userEmil"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import {
  getUserList,
  addUsers,
  batchRemoveUser,
  userDelete,
  editUser,
  getRolesAll
} from "../../api/UserApi";

import {
  getToolProjects
  } from "../../api/ProjectApi";
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      filters: {
        name: "",
        roId: ""
      },
      total: 0,
      page: 1,
      sels: [], //列表选中列
      loading: false,
      users: [],
      adddialogShow: false,
      addFormRules: {
        userName: [{ required: true, message: "请输入账户", trigger: "blur" }],
        loginId: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        userPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ],
        userEmil: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" }
        ]
      },
      editFormRules: {
        userName: [{ required: true, message: "请输入账户", trigger: "blur" }],
        loginId: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        userPassword: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
        userEmil: [{ required: true, message: "请输入用户邮箱", trigger: "blur" }]
              },
      roleIds: [],
      orgs:[],
      roleId: "",
      addUserForm: {
        id: "",
        userName: "",
        loginId: "",
        userPassword: "",
        userEmil: "",
        roId: "",
        orgId:"",
        orgName:""
      },
      editFormVisible: false,
      editUserForm: {
        id: "",
        userName: "",
        loginId: "",
        userPassword: "",
        userEmil: "",
        roId: "",
        orgId:"",
        orgName:""
      }
    };
  },
  methods: {
    changeName: function(e) {
      var that = this;
      that.filters.name = e.target.value;
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //获取用户列表
    getUser: function() {
      this.loading = true;
      var params = {
        limit: 15,
        page: this.page,
        userName: this.filters.name,
        loginId: "",
        userEmil: "",
        roId: this.filters.roleId
      };
      getUserList(params).then(data => {
        this.total = data.total;
        this.users = data.content;
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUser();
    },
    dialogShow: function() {
      this.adddialogShow = true;
    },
    addUser: function() {
      this.roleId = "";
      this.getRoles();
      for (var i = 0; i < this.orgs.length; i++) {
        if (this.orgs[i].value == this.addUserForm.orgId) {
          this.addUserForm.orgName=this.orgs[i].content;
        }
      }
      var params = this.addUserForm;
      addUsers(params).then(data => {
        this.loading = false;
        this.getUser();
      });
      this.adddialogShow = false;
    },
    batchRemove: function() {
      console.log(this.sels);
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let para = { userIds: ids };
          batchRemoveUser(para).then(res => {
            this.loading = false;
            this.getUser();
          });
        })
        .catch(() => {});
      this.loading = false;
    }, //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          userDelete(row.id).then(res => {
            this.loading = false;
            this.getUser();
          });
        })
        .catch(() => {});
      this.loading = false;
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editUserForm = Object.assign({}, row);
    },
    //编辑
    editSubmit: function() {
      this.getOrgs();
      for (var i = 0; i < this.orgs.length; i++) {
        if (this.orgs[i].value == this.editUserForm.orgId) {
          this.editUserForm.orgName=this.orgs[i].content;
        }
      }
      this.$refs.editUserForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.loading = true;
            let para = Object.assign({}, this.editUserForm);
            editUser(para).then(res => {
              this.loading = false;
              this.$refs["editUserForm"].resetFields();
              this.editFormVisible = false;
              this.getUser();
            });
          });
        }
      });
    },
    getRoles: function() {
      getRolesAll().then(res => {
        this.roleIds = [];
        var temp = res.content;
        for (var i = 0; i < temp.length; i++) {
          this.roleIds.push({
            value: temp[i].id,
            label: temp[i].roleName
          });
        }
      });
    },
    getOrgs:function(){
        var params = {
        name: "-1"
        };
        getToolProjects(params).then(res=>{
          this.orgs=[];
          var temp=res.content;
          for(var i=0;i<temp.length;i++){
            this.orgs.push({
              value:temp[i].id,
              label:temp[i].name,
              content:temp[i].content
            });
          }
        });
    },
    formatRole: function(index, row) {
      for (var i = 0; i < this.roleIds.length; i++) {
        if (this.roleIds[i].value == index.roId) {
          return this.roleIds[i].label;
        }
      }
    },
    formatOrg:function(index,row){
      for (var i = 0; i < this.orgs.length; i++) {
        if (this.orgs[i].value == index.orgId) {
          return this.orgs[i].label;
        }
      }
    }
  },
  mounted() {
    this.getUser();
    this.getRoles();
    this.getOrgs();
  }
};
</script>

<style scoped>
</style>