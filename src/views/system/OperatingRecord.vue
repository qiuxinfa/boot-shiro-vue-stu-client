<template>
	  <el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  class="el-icon-search" v-on:click="getFormData">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-col>
		<el-table :data="formData"  v-loading="listLoading" element-loading-text="拼命加载中" style="width: 100%;">
<!-- 			<el-table-column type="selection" width="55">
			</el-table-column> -->
	    <!-- <el-table-column prop="id" label="id"  sortable>
				</el-table-column> -->
			<el-table-column prop="username" label="请求用户"  sortable>
			</el-table-column>
			<el-table-column prop="permName" label="请求url"  sortable>
			</el-table-column>
			<el-table-column prop="remoteAddr" label="ip地址"  sortable>
			</el-table-column>
			<el-table-column prop="method" label="请求方式"  sortable>
			</el-table-column>
<!-- 			<el-table-column :show-overflow-tooltip="true" prop="params" label="参数"  sortable>
			</el-table-column> -->
			<el-table-column prop="createTime" label="时间"  sortable>
				<template slot-scope="scope">
					<span>{{scope.row.createTime, "-", false | dataFormat}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="isSuccess" label="标识"  sortable>
				<template slot-scope="scope">
					<span v-if="scope.row.isSuccess=='1'">请求成功</span>
					<span v-else>请求失败</span>
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
	</el-row>
</template>

<script>
  import http from '../../utils/http'
	export default {
		data() {
			return {
				filters: {
					keyword: ''
				},
				pageSizes: [30, 50, 80, 100],
				startPage: 1,
				pageSize: 30,
				total: 0,
				formData: [],
				total: 0,
				page: 1,
				listLoading: false
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
					searchKeyWord: _this.filters.keyword
				}
				let data = await http.get('sys/operateRecord/list', params)

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
