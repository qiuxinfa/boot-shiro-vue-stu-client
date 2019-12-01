
<template>
	<el-row>
		<!--工具条-->
		<el-col :span="64" class="toolbar" style="padding-bottom: 0px;with:100%;height:100%">
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item>
					<el-input placeholder="课程名称" v-model="filters.keyword1"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="el-icon-search" v-on:click="getFormData1">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" class="el-icon-plus" v-on:click="selectCourse">选课</el-button>
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
	    prop="name"
	    label="课程名称" sortable>
	  </el-table-column>
      <el-table-column
        prop="courseTypeName"
        label="课程类型" sortable>
      </el-table-column>
	  <el-table-column
	    prop="credit"
	    label="学分" sortable>
	  </el-table-column>
	  <el-table-column
	    prop="teachersName"
	    label="任课老师" sortable>
	  </el-table-column>
	  <el-table-column prop="score" label="得分" sortable>
		<template slot-scope="scope">
			<span v-if="scope.row.status=='1'">{{scope.row.score}}</span>
			<span v-else>未出成绩</span>
		</template>
	  </el-table-column>
<!-- 	  <el-table-column prop="score" label="课程状态" sortable>
		<template slot-scope="scope">
			<span v-if="scope.row.status=='1'">{{scope.row.score}}</span>
			<span v-else>未出成绩</span>
		</template>
	  </el-table-column>	 -->  
	  <!-- 还在选课期间就可以退订，暂时未做 -->
<!-- 			<el-table-column
			      fixed="right"
			      label="操作"
						width="180px"
						align="center">
			      <template slot-scope="scope">
			      	<el-button v-if="scope.row.status=='0'"
							  @click.native="deleteMyCourse(scope.row.id)"
			          type="text"
			          size="small">
			          退课
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
<!-- 	<el-dialog title="选课" :visible.sync="dialogFormVisible1">
	<div style="width:60%;margin: 0 auto">
	<el-form ref="attr" :model="attr" :inline="false" label-width="90px" class="demo-ruleForm">
	<el-form-item label="课程类型" prop="courseType2" :rules="[{ required: true, message: '请选择课程类型', trigger: 'change,blur' }]">
		<el-select v-model="attr.courseType2" filterable placeholder="请选择">
			<el-option
				v-for="item in courseTypes"
				:key="item.dictCode"
				:label="item.dictValue"
				:value="item.dictCode">
			</el-option>
	    </el-select>
	</el-form-item>		
	<el-form-item label="课程名称" prop="name2" :rules="[{ required: true, message: '请输入课程名称', trigger: 'blur' }]">
		<el-input  type="text" v-model="attr.name2" placeholder="请输入课程名称" auto-complete="off"></el-input>
	</el-form-item>
	<el-form-item label="学分" prop="credit2" :rules="[{ required: true, message: '请输入学分', trigger: 'blur' },{validator: 'regexp', pattern: /^([1-9]|10)$/, message: '学分只能是1-10之间的整数', trigger: 'change,blur'}]">
		<el-input  type="number" v-model="attr.credit2" placeholder="请输入学分" auto-complete="off"></el-input>
	</el-form-item>	
	<el-form-item label="任课老师" prop="teacherIds" :rules="[{ required: true, message: '至少选择一名任课老师', trigger: 'change,blur' }]">
		<el-select v-model="attr.teacherIds" multiple filterable placeholder="请选择任课老师">
			<el-option
				v-for="item in teachers"
				:key="item.id"
				:label="item.name"
				:value="item.id">
			</el-option>
	    </el-select>
	</el-form-item>		
	</el-form>
 </div>
	<div slot="footer" class="dialog-footer">
		<el-button @click="dialogFormVisible1 = false">取 消</el-button>
		<el-button @click="resetForm('attr')">重置</el-button>
		<el-button type="primary" @click="submitForm('attr')">确 定</el-button>
	</div>
</el-dialog> -->
   <!-- 属性明细 -->
  <el-dialog title="选课" :visible.sync="dialogTableVisible1">

		 <el-form :inline="true" label-width="90px" class="demo-ruleForm">
<!-- 			<el-form-item label="属性名称" prop="name" :rules="[{ required: true, message: '请输入属性明细名称', trigger: 'blur' }]">
				<el-input type="text" v-model="detail.name" placeholder="请输入属性明细名称" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button  class="el-icon-arrow-right" type="primary"  @click="submitForm1('detail')">新增</el-button>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" class="el-icon-plus" @click="addToMyCourse()">选择课程</el-button>
			</el-form-item>
	 	</el-form>

	  <el-table :data="tableData2" @selection-change="handleSelectionChange2">
			<el-table-column type="selection" width="55">
			</el-table-column>
	    <el-table-column property="id" label="id" v-if="false"></el-table-column>
		<el-table-column property="teacherId" label="teacherId" v-if="false"></el-table-column>
	    <el-table-column property="name" label="课程名称"></el-table-column>
		<el-table-column property="courseTypeName" label="课程类型"></el-table-column>
		<el-table-column property="teachersName" label="任课老师"></el-table-column>
		<el-table-column property="credit" label="学分"></el-table-column>
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
				keyword1: ''
			},
			attr: {
				name2: '',
				courseType2: '',
				credit2: '',
				teacherIds:[]
			},
			courseTypes:[],     //课程类型列表
			teachers:[],       //任课老师列表
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
				pageSize: _this.pageSize1
			}
			let data = await http.get('course/mycourse', params)

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
		// 显示添加用户窗口
		showDialogForm() {
			this.dialogFormVisible1 = true
			this.getCourseType()
			this.getAllTeacher ()
		},
		// 查询课程类型列表
		async getCourseType () {
				let _this = this
				let param = {
					dictTypeCode:'COURSE_TYPE'
				}
				let data = await http.get('dict/findListByDictTypeCode',param)
				if(!data.data) {
					return
				}
				if (data.data.status === 200) {
				   _this.courseTypes = data.data.data
				 } else {
				  _this.message(true,data.data.msg,'error')
				  _this.courseTypes = []
				}
			},
		// 查询老师列表
		async getAllTeacher () {
				let _this = this
				let data = await http.get('teacher/findAllTeacher')
				if(!data.data) {
					return
				}
				if (data.data.status === 200) {
				   _this.teachers = data.data.data
				 } else {
				  _this.message(true,data.data.msg,'error')
				  _this.teachers = []
				}
			},
						
		// 添加属性表单提交
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.addCourse()
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
		async addCourse() {
			let _this = this
			let params = {
				name: _this.attr.name2,
				courseType: _this.attr.courseType2,
				credit: _this.attr.credit2,
				teacherIds: _this.attr.teacherIds
			}
			let data = await http.post("course/add", params)

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
		//选课
		async selectCourse(){
			let _this = this
			_this.dialogTableVisible1 = true
			let params = {
				pageSize: _this.pageSize2,
				startPage: _this.startPage2
			}
			let data = await http.get('course/choice', params)

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
		//添加到我的课程
		async addToMyCourse(){
            let _this = this
			if (_this.detailIds.length === 0) {
				 this.message(true,'请选择需要删除的属性明细','warning')
				 return
			}

			let params = {
				ids: _this.detailIds
			}
			debugger
			let data =await http.post('course/student', params)

			if(!data.data) {
				return
			}

			if (data.data.status === 200) {
				_this.dialogTableVisible1 = false
				 _this.message(true,data.data.msg,'success')
				 _this.getFormData1()
			} else {
				 _this.message(true,data.data.msg,'error')
			}
			// _this.selDetails(this.attrId)			
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
			this.selectCourse()
		},
		// 当前页码改变时触发
		handleCurrentChange2 (val) {
			this.startPage2 = val
			this.selectCourse()
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
