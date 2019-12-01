
<template>
	<el-row>
		<!--工具条-->
		<el-col :span="64" class="toolbar" style="padding-bottom: 0px;with:100%;height:100%">
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item>
					<el-input placeholder="字典值" v-model="filters.keyword1"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="el-icon-search" v-on:click="getFormData1">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" class="el-icon-plus" v-on:click="dialogFormVisible1 = true">新增</el-button>
				</el-form-item>
<!-- 				<el-form-item>
					<el-button type="danger" class="el-icon-delete" @click="delAttr">删除</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<el-col>
			<el-table
			v-loading="listLoading" element-loading-text="拼命加载中"
      :data="tableData1"
			@selection-change="handleSelectionChange1">
<!-- 			<el-table-column type="selection" width="55">
			</el-table-column> -->
<!--      <el-table-column
        prop="id"
        label="id">
      </el-table-column> -->
	  <el-table-column
	    prop="dictCode"
	    label="字典代码">
	  </el-table-column>
      <el-table-column
        prop="dictValue"
        label="字典值">
      </el-table-column>
	  <el-table-column
	    prop="dictTypeCode"
	    label="字典类型"
		sortable>
	  </el-table-column>
	  <el-table-column
	    prop="dictDesc"
	    label="字典描述"
		sortable>
	  </el-table-column>
	  <el-table-column
	    prop="dictOrder"
	    label="字典顺序">
	  </el-table-column>
<!-- 			<el-table-column
			      fixed="right"
			      label="操作"
						width="180px"
						align="center">
			      <template slot-scope="scope">
			      	<el-button
							  @click.native="selDetails(scope.row.id)"
			          type="text"
			          size="small">
			          属性明细
			        </el-button>
			      </template>
			  </el-table-column> -->
    </el-table>
		</el-col>

		<el-col>
			<div class="block" style="float: right;margin-right: 10px;margin-top: 10px;">
				<el-pagination
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:current-page="startPage1"
					:page-sizes="pageSizes1"
					:page-size="pageSize1"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total1">
				</el-pagination>
		 </div>
	</el-col>

<!-- 新增属性 -->
	<el-dialog title="新增字典" :visible.sync="dialogFormVisible1">
	<div style="width:60%;margin: 0 auto">
	<el-form ref="attr" :model="attr" :inline="false" label-width="90px" class="demo-ruleForm">
		
	<el-form-item label="字典代码" prop="dictCode2" :rules="[{ required: true, message: '请输入字典代码', trigger: 'blur' }]">
		<el-input  type="text" v-model="attr.dictCode2" placeholder="请输入字典代码" auto-complete="off"></el-input>
	</el-form-item>
	<el-form-item label="字典值" prop="dictValue2" :rules="[{ required: true, message: '请输入字典值', trigger: 'blur' }]">
		<el-input  type="text" v-model="attr.dictValue2" placeholder="请输入字典值" auto-complete="off"></el-input>
	</el-form-item>
	<el-form-item label="字典类型" prop="dictTypeCode2" :rules="[{ required: true, message: '请输入字典类型', trigger: 'blur' }]">
		<el-input  type="text" v-model="attr.dictTypeCode2" placeholder="请输入字典类型" auto-complete="off"></el-input>
	</el-form-item>	
	<el-form-item label="字典描述" prop="dictDesc2">
		<el-input  type="text" v-model="attr.dictDesc2" placeholder="请输入字典描述" auto-complete="off"></el-input>
	</el-form-item>		
	<el-form-item label="字典排序" prop="dictOrder2">
		<el-input  type="text" v-model="attr.dictOrder2" placeholder="请输入字典排序" auto-complete="off"></el-input>
	</el-form-item>		
	
	</el-form>
 </div>
	<div slot="footer" class="dialog-footer">
		<el-button @click="dialogFormVisible1 = false">取 消</el-button>
		<el-button @click="resetForm('attr')">重置</el-button>
		<el-button type="primary" @click="submitForm('attr')">确 定</el-button>
	</div>
</el-dialog>
   <!-- 属性明细 -->
   <el-dialog title="属性明细" :visible.sync="dialogTableVisible1">

		 <el-form ref="detail" :model="detail" :inline="true" label-width="90px" class="demo-ruleForm">
	 	<el-form-item label="属性名称" prop="name" :rules="[
	     { required: true, message: '请输入属性明细名称', trigger: 'blur' }
	   ]">
	 		<el-input type="text" v-model="detail.name" placeholder="请输入属性明细名称" auto-complete="off"></el-input>
	 	</el-form-item>
		<el-form-item>
			<el-button  class="el-icon-arrow-right" type="primary"  @click="submitForm1('detail')">新增</el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="danger" class="el-icon-delete" @click="delDetails()">删除</el-button>
		</el-form-item>
	 	</el-form>

	  <el-table :data="tableData2" @selection-change="handleSelectionChange2">
			<el-table-column type="selection" width="55">
			</el-table-column>
	    <el-table-column property="id" label="id"></el-table-column>
	    <el-table-column property="name" label="属性明细名称"></el-table-column>
	  </el-table>
		<div class="block" style="float: right;margin-right: 10px">
			<el-pagination
				@size-change="handleSizeChange2"
				@current-change="handleCurrentChange2"
				:current-page="startPage2"
				:page-sizes="pageSizes2"
				:page-size="pageSize2"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total2">
			</el-pagination>
	 </div>
	</el-dialog>
	</el-row>


</template>

<script>
import http from '../../utils/http'
export default {
	data() {
		return {
			filters: {
				keyword1: '',
				keyword2: ''
			},
			attr: {
				dictCode2: '',
				dictValue2: '',
				dictTypeCode2: '',
				dictDesc2: '',
				dictOrder2: ''
			},
			detail: {
				name: ''
			},
			listLoading: false, // 加载等待
			pageSizes1: [30, 50, 80, 100],
			pageSizes2: [5, 10],
			startPage1: 1,
			startPage2: 1,
			pageSize1: 30,
			pageSize2: 5,
			total1: 0,
			total2: 0,
			tableData1: [],
			tableData2: [],
			total1: 0,
			total2: 0,
			page1: 1,
			page2: 1,
			dialogTableVisible1: false,
			dialogFormVisible1: false,
			dialogFormVisible2: false,
			innerVisible: false,
			attrIds: [], // 属性ids集合
			detailIds: [], // 属性明细ids
			attrId: ''
		}
	},
	methods: {
		// 查询属性
		async getFormData1 () {
			let _this = this
			_this.listLoading = true
			let params = {
				startPage: _this.startPage1,
				pageSize: _this.pageSize1,
				dictValue: _this.filters.keyword1
			}
			let data = await http.get('dict/list', params)

			if(!data.data) {
				_this.listLoading = false
				return
			}

			if (data.data.status === 200) {
				 _this.tableData1 = data.data.data
				 _this.total1 = data.data.total
			} else {
				_this.message(true,data.data.msg,'error')
				_this.formData1 = []
			}
			_this.listLoading = false
		},
		// 添加属性表单提交
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.addAttr()
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
		// 新增属性
		async addAttr() {
			let _this = this
			let params = {
				dictCode: _this.attr.dictCode2,
				dictValue: _this.attr.dictValue2,
				dictTypeCode: _this.attr.dictTypeCode2,
				dictDesc: _this.attr.dictDesc2,
				dictOrder: _this.attr.dictOrder2
			}
			let data = await http.post("dict/add", params)

			if(!data.data) {
				return
			}

			if (data.data.status === 200) {
				  _this.resetForm('attr')
				  _this.dialogFormVisible1=false
          _this.message(true,data.data.msg,'success')
					_this.getFormData1()
			} else {
         _this.message(true,data.data.msg,'error')
			}
		},
		// 删除属性提示
		async delAttr () {
			if (this.attrIds.length === 0) {
				 this.message(true,'请选择需要删除的属性','warning')
				 return
			}
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.delAttrs()
			}).catch(() => {
				this.message(true,'已取消删除','warning')
			})
		},
		// 删除属性
		async delAttrs() {
      let _this = this
			let params = {
				ids: _this.attrIds
			}
			let data =await http.post('SysApi/v1/delAttributes', params)

			if(!data.data) {
				return
			}

			if (data.data.status === 200) {
				 _this.message(true,data.data.msg,'success')
			} else {
				 _this.message(true,data.data.msg,'error')
			}
			_this.getFormData1()
		},
		// 获取选中集
		handleSelectionChange1(val) {
			this.attrIds = []
			if (val) {
			 val.forEach(row => {
				 this.attrIds.push(row.id)
			 });
		 }
		},
		// 每页大小改变时触发
		handleSizeChange1 (val) {
			this.pageSize1 = val
			this.getFormData1()
		},
		// 当前页码改变时触发
		handleCurrentChange1 (val) {
			this.startPage1 = val
			this.getFormData1()
		},

		// 属性明细表单提交
		submitForm1(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.addDetail()
				} else {
					console.log('error submit!!');
					return false
				}
			})
		},
		// 添加属性明细
		async addDetail() {
			 let _this = this
			 let params = {
				 id: _this.attrId,
				 name: _this.detail.name
			 }
			 let data = await http.post('SysApi/v1/addAttributeDetail', params)

			 if(!data.data) {
			 	return
			 }

			 if (data.data.status === 200) {
 				  _this.resetForm('detail')
           _this.message(true,data.data.msg,'success')
 					_this.selDetails(this.attrId)
 			} else {
          _this.message(true,data.data.msg,'error')
 			}
		},
		// 查询属性明细
		async selDetails(id) {
			let _this = this
			_this.dialogTableVisible1 = true
			_this.attrId = id
			let params = {
				id: id,
				pageSize: _this.pageSize2,
				startPage: _this.startPage2
			}
			let data = await http.get('SysApi/v1/findAttributesDetailByPage', params)

			if(!data.data) {
				return
			}

			if (data.data.status === 200) {
				 _this.tableData2 = data.data.data
				 _this.total2 = data.data.total
			} else {
				_this.message(true,data.data.msg,'error')
				_this.formData2 = []
			}
		},
		// 删除属性明细
		async delDetails() {
      let _this = this
			if (_this.detailIds.length === 0) {
				 this.message(true,'请选择需要删除的属性明细','warning')
				 return
			}

			let params = {
				ids: _this.detailIds
			}
			let data =await http.post('SysApi/v1/delAttributeDetails', params)

			if(!data.data) {
				return
			}

			if (data.data.status === 200) {
				 _this.message(true,data.data.msg,'success')
			} else {
				 _this.message(true,data.data.msg,'error')
			}
			_this.selDetails(this.attrId)
		},
		// 获取选中集
		handleSelectionChange2(val) {
			this.detailIds = []
			if (val) {
			 val.forEach(row => {
				 this.detailIds.push(row.id)
			 });
		 }
		},
		// 每页大小改变时触发
		handleSizeChange2 (val) {
			this.pageSize2 = val
			this.selDetails(this.attrId)
		},
		// 当前页码改变时触发
		handleCurrentChange2 (val) {
			this.startPage2 = val
			this.selDetails(this.attrId)
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
		this.getFormData1()
	}
}
</script>
