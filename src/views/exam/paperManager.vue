
<template>
	<el-row>
		<!--工具条-->
		<el-col :span="64" class="toolbar" style="padding-bottom: 0px;with:100%;height:100%">
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item>
					<el-input placeholder="考试课程名称" v-model="filters.keyword1"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="el-icon-search" v-on:click="getFormData1">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" class="el-icon-plus" v-on:click="showDialogForm">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" class="el-icon-delete" @click="batchDelete">删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col>
			<el-table
			v-loading="listLoading" element-loading-text="拼命加载中"
      :data="tableData1"
			@selection-change="handleSelectionChange1">
			<el-table-column type="selection" width="55">
			</el-table-column>
<!--      <el-table-column
        prop="id"
        label="id">
      </el-table-column> -->
	  <el-table-column
	    prop="examCourse"
	    label="课程名称" sortable>
	  </el-table-column>
	  <el-table-column
	    prop="major"
	    label="专业" sortable>
	  </el-table-column>
	  <el-table-column
	    prop="institute"
	    label="学院" sortable>
	  </el-table-column>
	  <el-table-column
	    prop="examDate"
	    label="考试日期" sortable>
	  </el-table-column>
	  <el-table-column
	    prop="totalTime"
	    label="考试时长(分钟)" sortable>
	  </el-table-column>
	  <el-table-column
	    prop="totalScore"
	    label="考试总分" sortable>
	  </el-table-column>
	  <!-- 查看或随机组卷 -->
		<el-table-column
			  fixed="right"
			  label="操作"
					width="180px"
					align="center">
			  <template slot-scope="scope">
				<el-button v-if="scope.row.totalScore!=0"
					  @click.native="viewPaper(scope.row.id)"
					  type="text"
					  size="small">
				  查看试卷
				</el-button>
				<el-button v-else
					@click.native="randomPaper(scope.row.paperId)"
					type="text"
					size="small">
					随机组卷
				</el-button>
			  </template>
		</el-table-column>	  
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

<!-- 新增班级 -->
	<el-dialog title="新增考试" :visible.sync="dialogFormVisible1">
	<div style="width:60%;margin: 0 auto">
	<el-form ref="attr" :model="attr" :inline="false" label-width="90px" class="demo-ruleForm">
		
	<el-form-item label="学院" prop="instituteId2">
		<el-select v-model="attr.instituteId2" filterable placeholder="请选择" @change="getMajorData">
			<el-option
				v-for="item in institutes"
				:key="item.id"
				:label="item.name"
				:value="item.id">
			</el-option>
	   </el-select>
	</el-form-item>	
	<el-form-item label="专业" prop="majorId2">
		<el-select v-model="attr.majorId2" filterable placeholder="请选择">
			<el-option
				v-for="item in majors"
				:key="item.id"
				:label="item.name"
				:value="item.id">
			</el-option>
	   </el-select>
	</el-form-item>	
	<el-form-item label="考试名称" prop="name2" :rules="[{ required: true, message: '请输入考试名称', trigger: 'blur' }]">
		<el-input  type="text" v-model="attr.name2" placeholder="请输入考试名称" auto-complete="off"></el-input>
	</el-form-item>
	<el-form-item label="考试介绍" prop="desc2">
		<el-input  type="text" v-model="attr.desc2" placeholder="请输入考试介绍" auto-complete="off"></el-input>
	</el-form-item>
	<el-form-item label="考试日期" prop="date2" :rules="[{ required: true, message: '请输入考试日期', trigger: 'blur' }]">
		<el-input  type="date" v-model="attr.date2" placeholder="请输入考试日期" auto-complete="off"></el-input>
	</el-form-item>
	<el-form-item label="考试时长(分钟)" prop="time2" :rules="[{ required: true, message: '请输入考试时长', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-9]\d*$/, message: '考试时长只能是整数', trigger: 'change,blur'}]">
		<el-input  type="number" v-model="attr.time2" placeholder="请输入考试时长" auto-complete="off"></el-input>
	</el-form-item>
	</el-form>
 </div>
	<div slot="footer" class="dialog-footer">
		<el-button @click="dialogFormVisible1 = false">取 消</el-button>
		<el-button @click="resetForm('attr')">重置</el-button>
		<el-button type="primary" @click="submitForm('attr')">确 定</el-button>
	</div>
</el-dialog>

<!-- 随机组卷 -->
	<el-dialog title="随机组卷" :visible.sync="dialogFormVisible2">
	<div style="width:60%;margin: 0 auto">
	<el-form ref="attr" :model="attr" :inline="false" label-width="90px" class="demo-ruleForm">
		<el-form-item label="填空题数量" prop="fillCnt2" :rules="[{ required: true, message: '请输入填空题数量', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-9]\d*$/, message: '填空题数量只能是整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.fillCnt2" placeholder="请输入填空题数量" auto-complete="off"></el-input>
		</el-form-item>
<!-- 		<el-form-item label="填空题分数" prop="fillScore2" :rules="[{ required: true, message: '请输入每题的分数', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-5]$/, message: '每题的分数只能是1-5的整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.fillScore2" placeholder="请输入每题的分数" auto-complete="off"></el-input>
		</el-form-item> -->
		<el-form-item label="判断题数量" prop="judgeCnt2" :rules="[{ required: true, message: '请输入判断题数量', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-9]\d*$/, message: '判断题数量只能是整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.judgeCnt2" placeholder="请输入判断题数量" auto-complete="off"></el-input>
		</el-form-item>
<!-- 		<el-form-item label="判断题分数" prop="judgeScore2" :rules="[{ required: true, message: '请输入每题的分数', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-5]$/, message: '每题的分数只能是1-5的整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.judgeScore2" placeholder="请输入每题的分数" auto-complete="off"></el-input>
		</el-form-item> -->
		<el-form-item label="单选题数量" prop="singleCnt2" :rules="[{ required: true, message: '请输入单选题数量', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-9]\d*$/, message: '单选题数量只能是整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.singleCnt2" placeholder="请输入单选题数量" auto-complete="off"></el-input>
		</el-form-item>
<!-- 		<el-form-item label="单选题分数" prop="singleScore2" :rules="[{ required: true, message: '请输入每题的分数', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-5]$/, message: '每题的分数只能是1-5的整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.singleScore2" placeholder="请输入每题的分数" auto-complete="off"></el-input>
		</el-form-item> -->
<!-- 		<el-form-item label="多选题数量" prop="multipleCnt2" :rules="[{ required: true, message: '请输入多选题数量', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-9]\d*$/, message: '多选题数量只能是整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.multipleCnt2" placeholder="请输入多选题数量" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="多选题分数" prop="multipleScore2" :rules="[{ required: true, message: '请输入每题的分数', trigger: 'blur' },{validator: 'regexp', pattern: /^[1-5]$/, message: '每题的分数只能是1-5的整数', trigger: 'change,blur'}]">
			<el-input  type="number" v-model="attr.multipleScore2" placeholder="请输入每题的分数" auto-complete="off"></el-input>
		</el-form-item> -->
	</el-form>
 </div>
	<div slot="footer" class="dialog-footer">
		<el-button @click="dialogFormVisible2 = false">取 消</el-button>
		<el-button @click="resetForm('attr')">重置</el-button>
		<el-button type="primary" @click="startPaper()">开始组卷</el-button>
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
				majorId2: '',
				instituteId2: '',
				desc2: '',
				date2: '',
				time2: '',
				fillCnt2: '',
				judgeCnt2: '',
				singleCnt2: '',
				multipleCnt2: 0,
				fillScore2: '',
				judgeScore2: '',
				singleScore2: '',
				multipleScore2: 0,
				paperId2: ''
			},
			institutes:[],    //学院列表
			majors:[],       //专业列表
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
				name: _this.filters.keyword1
			}
			let data = await http.get('exam/list', params)

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
			this.getInstituteData()
		},
		// 查询学院列表
		async getInstituteData () {
				let _this = this
				let data = await http.get('institute/findAllInstitute')
				if(!data.data) {
					return
				}
				if (data.data.status === 200) {
				   _this.institutes = data.data.data
				 } else {
				  _this.message(true,data.data.msg,'error')
				  _this.institutes = []
				}
			},
			
		//获取专业列表
		async getMajorData (){
			let _this = this
			let param = {
				instituteId: _this.attr.instituteId2
			}
			let data = await http.get('major/findAllMajor',param);
			if(!data.data) {
				return
			}
			if (data.data.status === 200) {
			   _this.majors = data.data.data
			 } else {
			  _this.message(true,data.data.msg,'error')
			  _this.majors = []
			}			
		},
		//查看试卷详情
		viewPaper(id){
			alert("查看试卷详情，尚未开发！")
		},
		//随机组卷
		randomPaper(paperId){
			this.dialogFormVisible2 = true
			this.attr.paperId2=paperId
		},
		//开始组卷
		async startPaper(){
			let _this = this
			let params = {
				paperId: _this.attr.paperId2,
				fillCnt: _this.attr.fillCnt2,
				fillScore: _this.attr.fillScore2,
				judgeCnt: _this.attr.judgeCnt2,
				judgeScore: _this.attr.judgeScore2,
				singleCnt: _this.attr.singleCnt2,
				singleScore: _this.attr.singleScore2,
				multipleCnt: _this.attr.multipleCnt2,
				multipleScore: _this.attr.multipleScore2
			}
			let data = await http.post("paper/add", params)

			if(!data.data) {
				return
			}

			if (data.data.status === 200) {
				  _this.resetForm('attr')
				  _this.dialogFormVisible2=false
          _this.message(true,data.data.msg,'success')
					_this.getFormData1()
			} else {
         _this.message(true,data.data.msg,'error')
			}			
		},
		// 添加属性表单提交
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.addInstitute()
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
		async addInstitute() {
			let _this = this
			let params = {
				examCourse: _this.attr.name2,
				examDesc: _this.attr.desc2,
				examDate: _this.attr.date2,
				totalTime: _this.attr.time2,
				major: _this.attr.majorId2,
				institute: _this.attr.instituteId2
			}
			let data = await http.post("exam/add", params)

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
		// 批量删除
		batchDelete () {
			if (this.attrIds.length === 0) {
				 this.message(true,'请选择需要删除的数据','error')
				 return
			}
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'error'
			}).then(() => {
                this.doDelete()
			}).catch(() => {
				this.message(true,'已取消删除','error')
			})
		},
		// 执行删除操作
		async doDelete () {
			let params = {
				ids: this.attrIds
			}
			let data =await http.post('exam/delete', params)
			if(!data.data) {
				return
			}
			if (data.data.status === 200) {
				 this.message(true,data.data.msg,'success')
			} else {
				 this.message(true,data.data.msg,'error')
			}
			this.getFormData1()
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
