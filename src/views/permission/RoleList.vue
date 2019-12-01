<template>
	  <el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  class="el-icon-search" :loading="selLoading" v-on:click="getFormData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" class="el-icon-plus" v-on:click="dialogFormVisible = true">新增</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="warning" class="el-icon-edit" v-on:click="editUser">编辑</el-button>
				</el-form-item> -->
<!-- 				<el-form-item>
					<el-button type="danger" class="el-icon-delete" @click="delRole">删除</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-col>
		<el-table :data="formData" v-loading="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
	    <!-- <el-table-column prop="id" label="id"  sortable>
				</el-table-column> -->
			<el-table-column prop="name" label="名称"  sortable>
			</el-table-column>
			<el-table-column prop="roleDesc" label="描述"  sortable>
			</el-table-column>
			<!-- <el-table-column prop="createTime" label="创建时间"  sortable>
				<template scope="scope">
          <span v-if="scope.row.createTime != null">{{moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
        </template>
			</el-table-column>
			<el-table-column prop="lastLoginTime" label="上次登录时间"  sortable>
				<template scope="scope">
          <span v-if="scope.row.lastLoginTime != null">{{moment(scope.row.lastLoginTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
        </template>
			</el-table-column>
			<el-table-column prop="state" label="状态"  sortable>
			</el-table-column> -->
			<el-table-column
			      fixed="right"
			      label="操作" width="120">
			      <template slot-scope="scope">
			        <el-button
			          @click.native="roleEdit(scope.row.id)"
			          type="text"
			          size="small">
			          权限设置
			        </el-button>
			      </template>
			  </el-table-column>
		</el-table>
		</el-col>
		<el-col>
			<div class="block" style="float: right;margin-right: 10px;margin-top: 10px;">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="startPage"
					:page-sizes="pageSizes"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
     </div>
	</el-col>
	<el-col :span="2">
		<el-dialog title="新增角色" :visible.sync="dialogFormVisible">
		<div style="width:80%;margin: 0 auto">
	  <el-form :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" :inline="false" label-width="90px" class="demo-ruleForm">
		<el-form-item label="名称"   prop="name">
	    <el-input type="text" placeholder="角色名称" auto-complete="off" v-model="ruleForm.name"></el-input>
	  </el-form-item>
		<el-form-item label="描述" prop="roleDesc">
			<el-input type="text" placeholder="角色描述" auto-complete="off" v-model="ruleForm.roleDesc"></el-input>
		</el-form-item>
	  </el-form>
	 </div>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button @click="resetForm('ruleForm')">重置</el-button>
	    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
	  </div>
	</el-dialog>
	</el-col>
	<el-col :span="2">
		<el-dialog title="权限设置" :visible.sync="dialogFormVisible1">
   <div style="width:80%;margin: 0 auto">
		 <el-tree
		   v-loading="treeLoading"
		   :data="treeData"
		   show-checkbox
		   default-expand-all
		   node-key="id"
		   ref="tree"
		   highlight-current
		   :props="treeDefaultProps">
		 </el-tree>
	 </div>
	 </div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible1 = false">取 消</el-button>
			<el-button @click="resetRolePermis()">重置</el-button>
			<el-button type="primary" @click="saveRolePermis()">确 定</el-button>
		</div>
	</el-dialog>
	</el-col>
	</el-row>
</template>

<script>
  import http from '../../utils/http'
	import md5 from 'js-md5'
  let Base64 = require('js-base64').Base64
	export default {
		data() {
			return {
				filters: {
					keyword: ''
				},
				ruleForm: {
					name: '',
					roleDesc: ''
				},
				pageSizes: [30, 50, 80, 100],
				startPage: 1,
				pageSize: 30,
				total: 0,
				formData: [],
				total: 0,
				page: 1,
				listLoading: false, // 加载等待
				treeLoading: false,
				selLoading: false,
				dialogFormVisible: false, // 新增页面
				permiIds: [], // 菜单ids
				dialogFormVisible1: false, // 树形菜单
				treeData: [], // 树形菜单
				roleId: '', // 角色id
				treeDefaultProps: { // 格式化
					children: 'children',
					label: 'name'
				},
				// 表单验证
				rules: {
					name: [
						{ required: true, message: '请输入角色名称'},
			      { min: 2, max: 10, message: '长度在 2 到 10 个字符'}
					],
					roleDesc: [
						{ required: true, message: '请输入角色描述'},
			      { min: 4, max: 60, message: '长度在 4 到 60个字符'}
					]
				}
			}
		},
		methods: {
			// 查询角色列表
			async getFormData () {
				let _this = this
				_this.listLoading = true
				let params = {
					startPage: _this.startPage,
					pageSize: _this.pageSize,
					roleName: _this.filters.keyword
				}
				let data = await http.get('role/list', params)

				if(!data.data) {
					_this.listLoading = false
					return
				}

				if (data.data.status === 200) {
           _this.formData = data.data.data
					 _this.total = data.data.total
				} else {
          _this.message(true,data.data.msg,'error')
					_this.formData = []
				}
				_this.listLoading = false
			},
			// 表单提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.addPermis()
					} else {
						console.log('error submit!!');
						return false
					}
				})
			},
			// 重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			async addPermis() {
				let _this = this
				let params = {
           name: _this.ruleForm.name,
					 roleDesc: _this.ruleForm.roleDesc
				}
				let data = await http.post('role/add', params)

				if(!data.data) {
					return
				}

				if (data.data.status === 200) {
					this.message(true,data.data.msg,'success')
					 _this.resetForm('ruleForm')
					 _this.dialogFormVisible = false
				} else {
           _this.message(true,data.data.msg,'error')
				}
				this.getFormData()
			},
			// 删除用户
			async delRole () {
				if (this.permiIds.length === 0) {
					 this.message(true,'请选择需要删除的用户','warning')
					 return
				}
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          this.delRoles()
				}).catch(() => {
					this.message(true,'已取消删除','warning')
				})
			},
			// 删除角色
			async delRoles () {
				let params = {
					ids: this.permiIds
				}
				let data =await http.post('role/delete', params)

				if(!data.data) {
					return
				}

				if (data.data.status === 200) {
					 this.message(true,data.data.msg,'success')
				} else {
					 this.message(true,data.data.msg,'error')
				}
				this.getFormData()
			},
			// 角色权限设置
			async roleEdit(val) {
				this.roleId = val
				this.dialogFormVisible1 = true
				this.treeLoading = true
				let data = await http.get('perms/findBasePermission')
				if(!data.data) {
					return
				}
				if (data.data.status === 200) {
					 this.treeData = data.data.data
					 let params = {
						 roleId: val
					 }
					 let pidData = await http.get('role/findRolesPermisByRole', params)

					 if(!pidData.data) {
	 					return
	 				 }

					 if (pidData.data.status === 200) {
              this.$refs.tree.setCheckedKeys(pidData.data.data);
					 }
				} else {
					 this.treeData = []
				}
				this.treeLoading = false
			},
			// 保存角色权限设置
			async saveRolePermis() {
				var permiIds = this.$refs.tree.getCheckedKeys()
        let params = {
					roleId: this.roleId,
					permsIds: permiIds
				}
				let data = await http.post('role/perms', params)
				if (data.data.status === 200) {
					this.dialogFormVisible1 = false
          this.message(true,data.data.msg,'success')
				} else {
          this.message(true,data.data.msg,'error')
				}
			},
			// 重置
			resetRolePermis() {
				this.$refs.tree.setCheckedKeys([]);
			},
			// 获取选中集
			handleSelectionChange(val) {
			  this.permiIds = []
				if (val) {
				 val.forEach(row => {
					 this.permiIds.push(row.id)
				 });
			 }
			},
			// 每页大小改变时触发
      handleSizeChange (val) {
        this.pageSize = val
        this.getFormData()
      },
      // 当前页码改变时触发
      handleCurrentChange (val) {
        this.startPage = val
        this.getFormData()
      },
			/**
			 * ifshow: true/false msg: message  type: error/warning/success
			 */
			message(ifshow,msg,type) {
				this.$message({
					showClose: ifshow,
					message: msg,
					type: type
				})
			}
		},
		mounted() {
			this.getFormData()
		}
	}

</script>

<style scoped>

</style>
