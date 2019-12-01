<template>
	  <el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="菜单"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  class="el-icon-search" :loading="selLoading" v-on:click="getFormData">查询</el-button>
				</el-form-item>
<!-- 				<el-form-item>
					<el-button type="success" class="el-icon-plus" @click.native="showDialogForm">新增</el-button>
				</el-form-item> -->
				<!-- <el-form-item>
					<el-button type="warning" class="el-icon-edit" v-on:click="editUser">编辑</el-button>
				</el-form-item> -->
<!-- 				<el-form-item>
					<el-button type="danger" class="el-icon-delete" @click="delPermi">删除</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-col>
		<el-table :data="formData" v-loading="listLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" style="width: 100%;">
<!-- 			<el-table-column type="selection" width="55">
			</el-table-column> -->
	    <!-- <el-table-column prop="id" label="id"  sortable>
				</el-table-column> -->
			<el-table-column prop="url" label="地址"  sortable>
			</el-table-column>
			<el-table-column prop="name" label="名称"  sortable>
			</el-table-column>
			<el-table-column prop="type" label="菜单类型"  sortable>
				<template slot-scope="scope">
					<span v-if="scope.row.type =='1'">模块</span>
					<span v-else-if="scope.row.type=='2'">菜单</span>
					<span v-else-if="scope.row.type=='3'">按钮</span>
					<span v-else>菜单类型未定义</span>
				</template>
			</el-table-column>
			<el-table-column prop="lastPermis" label="上级菜单"  sortable>
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
			<!-- <el-table-column
			      fixed="right"
			      label="操作" width="120">
			      <template slot-scope="scope">
			      	<el-button
							  @click.native="delUser(scope.row.id)"
			          type="text"
			          size="small">
			          删除
			        </el-button>
			        <el-button
			          @click.native="editUser(scope.row.id)"
			          type="text"
			          size="small">
			          编辑
			        </el-button>
			      </template>
			  </el-table-column> -->
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
		<el-dialog title="新增菜单" :visible.sync="dialogFormVisible">
		<div style="width:80%;">
	  <el-form :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" :inline="false" label-width="90px" class="demo-ruleForm">
		<el-form-item label="名称"   prop="name">
	    <el-input type="text" placeholder="菜单名称" auto-complete="off" v-model="ruleForm.name"></el-input>
	  </el-form-item>
		<el-form-item label="地址" prop="url">
			<el-input type="text" placeholder="url地址" auto-complete="off" v-model="ruleForm.url"></el-input>
		</el-form-item>
		<el-form-item label="类型" prop="type">
			<el-select v-model="ruleForm.type" @change="typeChange" filterable placeholder="请选择">
				<el-option
					v-for="item in types"
					:key="item.id"
					:label="item.dictValue"
					:value="item.dictCode">
				</el-option>
     </el-select>
		</el-form-item>
		<el-form-item label="父级"  prop="baseType" v-show="farCboshow">
			<el-select v-model="ruleForm.baseType" filterable placeholder="请选择">
				<el-option
					v-for="item in baseTypes"
					:key="item.id"
					:label="item.name"
					:value="item.id">
				</el-option>
		 </el-select>
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
					url: '',
					type: '',
					baseType: ''
				},
				pageSizes: [30, 50, 80, 100],
				startPage: 1,
				pageSize: 30,
				total: 0,
				formData: [],
				total: 0,
				page: 1,
				listLoading: false,
				selLoading: false,
				dialogFormVisible: false,
				formLabelWidth: '120px',
				permiIds: [],
				types: [], // 菜单类型
				farCboshow: false,
				baseTypes: [], // 父级菜单
				// 表单验证
				rules: {
					name: [
						{ required: true, message: '请输入菜单名称'}
					],
					url: [
						{ required: true, message: '请输入地址' }
					],
					type: [
					 { required: true, message: '请选择菜单类型', trigger: 'change' }
				 ],
				  baseType: [
					 { required: true, message: '请选择父级菜单', trigger: 'change' }
				]
				}
			}
		},
		methods: {
			// 查询菜单
			async getFormData () {
				let _this = this
				_this.listLoading = true
				let params = {
					startPage: _this.startPage,
					pageSize: _this.pageSize,
					permsName: _this.filters.keyword
				}
				let data = await http.get('perms/list', params)
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
			// 显示添加菜单窗口
			showDialogForm() {
				this.dialogFormVisible = true
				this.getCboData() // 绑定菜单类型下拉框
			},
			// 新增权限
			async addPermis() {
				let _this = this
				let params = {
           name: _this.ruleForm.name,
					 url: _this.ruleForm.url,
					 type: _this.ruleForm.type,
					 lastId: _this.ruleForm.baseType
				}
				let data = await http.post('perms/add', params)

				if(!data.data) {
					return
				}

				if (data.data.status === 200) {
					this.message(true,data.data.msg,'success')
					 _this.resetForm('ruleForm')
				} else {
          _this.message(true,data.data.msg,'error')
				}
				this.getFormData()
			},
			// 删除用户
			async delPermi () {
				if (this.permiIds.length === 0) {
					 this.message(true,'请选择需要删除的菜单','warning')
					 return
				}
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          this.delPermis()
				}).catch(() => {
					this.message(true,'已取消删除','warning')
				})
			},
			// 删除用户
			async delPermis () {
				let params = {
					ids: this.permiIds
				}
				let data =await http.post('perms/delete', params)

				if(!data.data) {
					return
				}

				if (data.data.status ===200) {
					 this.message(true,data.data.msg,'success')
				} else {
					 this.message(true,data.data.msg,'error')
				}
				this.getFormData()
			},
			// 查询菜单
			async getCboData () {
				let _this = this
				let params = {
					dictTypeCode: 'MENU'
				}
				let data = await http.get('dict/findListByDictTypeCode', params)

				if(!data.data) {
					return
				}

				if (data.data.status === 200) {
           _this.types = data.data.data
				} else {
          _this.message(true,data.data.msg,'error')
					_this.types = []
				}
			},
			typeChange(val) {
				if(val === '1c81b61ca6ca40ac86c8a32413abfa16') {
					this.farCboshow = true
					this.ruleForm.baseType = ''
					this.getBaseCboData('8b0be3af6d3d46e7aa90cf4073931b13')
				} else if (val === '2fd4068ad11b4211bacaa33385b8daae') {
					  this.farCboshow = true
						this.ruleForm.baseType = ''
						this.getBaseCboData('1c81b61ca6ca40ac86c8a32413abfa16')
				} else {
						this.baseTypes = []
						this.ruleForm.baseType = '0'
						this.farCboshow = false
				}
			},
			// 查询菜单
			async getBaseCboData (val) {
				let _this = this
				let params = {
					type: val
				}
				let data = await http.get('perms/findLastPermissionByType', params)

				if(!data.data) {
					return
				}

				if (data.data.status === 200) {
           _this.baseTypes = data.data.data
				} else {
          _this.message(true,data.data.msg,'error')
					_this.baseTypes = []
				}
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
