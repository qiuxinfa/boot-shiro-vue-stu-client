
// 我的试卷页面
<template>
  <div id="myExam">
    <div class="title">我的试卷</div>
    <div class="wrapper">
      <ul class="top">
        <li class="order">试卷列表</li>
        <li class="search-li"><div class="icon"><input type="text" placeholder="试卷名称" class="search" v-model="filters.keyword"><i class="el-icon-search"></i></div></li>
        <li><el-button type="primary" @click="search()">搜索试卷</el-button></li>
      </ul>
      <ul class="paper" v-loading="listLoading">
        <li class="item" v-for="(item,index) in tableData" :key="index">
          <h4 @click="toExamMsg(item.id,item.paperId)">{{item.examCourse}}</h4>
          <p class="name">{{item.examCourse}}-{{item.examDesc}}</p>
          <div class="info">
            <i class="el-icon-loading"></i><span>{{item.examDate}}</span>
            <i class="iconfont icon-icon-time"></i><span v-if="item.totalTime != null">限时{{item.totalTime}}分钟</span>
            <i class="iconfont icon-fenshu"></i><span>满分{{item.totalScore}}分</span>
          </div>
        </li>
      </ul>
      <div class="pagination">
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
    </div>
  </div>
</template>

<script>
import http from '../../utils/http'
export default {
	data() {
		return {
			filters: {
				keyword: ''
			},
			listLoading: false, // 加载等待
			pageSizes: [6, 10, 20, 40],
			startPage: 1,
			pageSize: 6,
			total: 0,
			tableData: [],
			total: 0
			// dialogTableVisible1: false,
			// dialogFormVisible1: false,
			// dialogFormVisible2: false,
			// innerVisible: false
		}
	},
	methods: {
		// 查询试卷列表
		async getFormData () {
			let _this = this
			_this.listLoading = true
			let params = {
				startPage: _this.startPage,
				pageSize: _this.pageSize,
				name: _this.filters.keyword
			}
			let data = await http.get('exam/list', params)

			if(!data.data) {
				_this.listLoading = false
				return
			}

			if (data.data.status === 200) {
				 _this.tableData = data.data.data
				 _this.total = data.data.total
			} else {
				_this.message(true,data.data.msg,'error')
				_this.formData = []
			}
			_this.listLoading = false
		},
		//根据关键字搜索试卷
		search(){
			this.getFormData()
		},
		
		//跳转到试卷详情页
		toExamMsg(examId,paperId) {
		  this.$router.push({path: '/examDetail', query: {examId: examId,paperId:paperId}})
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
		// 新增
		async add() {
			let _this = this
			let params = {
				name: _this.attr.name2,
				instituteNumber: _this.attr.instituteNumber2 
			}
			let data = await http.post("institute/add", params)

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
				 this.message(true,'请选择需要删除的学院','warning')
				 return
			}
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
			let data =await http.post('institute/delete', params)

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
		handleSelectionChange(val) {
			this.attrIds = []
			if (val) {
			 val.forEach(row => {
				 this.attrIds.push(row.id)
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
<style lang="scss" scoped>
.pagination {
  padding: 20px 0px 30px 0px;
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.paper {
  h4 {
    cursor: pointer;
  }
}
.paper .item a {
  color: #000;
}
.wrapper .top .order {
  cursor: pointer;
}
.wrapper .top .order:hover {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.wrapper .top .order:visited {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
.paper .item {
  width: 380px;
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
  transform: scale(1.03);
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper .item .name {
  font-size: 14px;
  color: #88949b;
}
.paper * {
  margin: 20px 0;
}
.wrapper .paper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.top .el-icon-search {
  position: absolute;
  right: 10px;
  top: 10px;
}
.top .icon {
  position: relative;
}
.wrapper .top {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
#myExam .search-li {
  margin-left: auto;
}
.top .search-li {
  margin-left: auto;
}
.top li {
  display: flex;
  align-items: center;
}
.top .search {
  margin-left: auto;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.top .search:hover {
  color: #0195ff;
  border-color: #0195ff;
}
.wrapper .top {
  display: flex;
}
.wrapper .top li {
  margin: 20px;
}
#myExam {
  width: 980px;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
#myExam .wrapper {
  background-color: #fff;
}
</style>
