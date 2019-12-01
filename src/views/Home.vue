<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="iconfont icon-shensuoanniu"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="userImg" /> 欢迎您,{{nickName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item @click.native="personalCenter">个人中心</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<transition name="el-fade-in">
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo el-menu-vertical-demo-main" style="width: 100%" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					 <template v-for="(item,index) in userPerms" v-if="item.children.length > 0">
						 <el-submenu :index="index+''">
							 <template slot="title"><!--<i :class="item.iconCls"></i>-->{{item.name}}</template>
							 <el-menu-item v-for="child in item.children" :index="child.url" :key="child.url" v-if="true">{{child.name}}</el-menu-item>
						 </el-submenu>
						 <el-menu-item v-if="item.url!='/' && item.children.length>0" :index="item.children[0].url">{{item.children[0].name}}</el-menu-item>
					 </template>
					 <!--<i :class="item.iconCls"></i>-->
					<!-- <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template> -->
				</el-menu>
			 </transition>
				<!--导航菜单-折叠后-->
				<el-collapse-transition>
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in userPerms" v-if="item.children.length > 0"  class="el-submenu item">
						<template v-if="true">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><!--<i :class="item.iconCls"></i>--></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children"  :key="child.url" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.url?'is-active':''" @click="$router.push(child.url)">{{child.name}}</li>
							</ul>
						</template>
						<!-- <template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].url?'is-active':''" @click="$router.push(item.children[0].url)"><i :class="item.iconCls"></i></div>
							</li>
						</template> -->
					</li>
				</ul>
				</el-collapse-transition>
				<!-- <el-collapse-transition>
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
				</el-collapse-transition> -->
			</aside>
            <section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						 <transition name="el-zoom-in-top" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		<el-col>
    <el-dialog
		title="编辑个人信息"
		:visible.sync="dialogVisible"
		width="25%">
    <div>
			<el-form :inline="true" :model="userform"  ref="userform" :rules="rules" label-width="100px" style="margin: 0 auto;">
				<el-form-item label="头像" prop="photoUrl">
			    <el-upload
			    name="pic"
			    class="avatar-uploader"
			    :action="uploadService + 'user/uploadHander'"
			    :show-file-list="false"
			    :on-success="handleAvatarSuccess"
			    :before-upload="beforeAvatarUpload">
			  <img v-if="userform.photoUrl" :src="userform.photoUrl" class="avatar">
			  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			  </el-upload>
			  </el-form-item>
				<el-form-item label="昵称"   prop="name">
					<el-input type="text" placeholder="用户昵称" auto-complete="off" v-model="userform.name"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input type="text" placeholder="用户邮箱" auto-complete="off" v-model="userform.email"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">取 消</el-button>
			<el-button @click="resetForm('userform')">重置</el-button>
	    <el-button type="primary" @click="submitForm('userform')">确 定</el-button>
	  </div>
		</el-dialog>
		</el-col>
	</el-row>
</template>

<script>
  import http from '../utils/http'
	export default {
		data() {
			return {
				user: JSON.parse(sessionStorage.getItem('user')),
				userPerms: JSON.parse(sessionStorage.getItem('user')).userPerms,
				sysName: 'boot-shiro-vue-stu',
				collapsed: false,
				nickName: '', // 昵称
				userImg: '', // 用户头像
				uploadImg: '', // 上传的头像
				dialogVisible: false,
				userform: {
					photoUrl: '',
					name: '',
					email: '',
				},
				// 表单验证
				rules: {
					photoUrl: [
						{ required: true, message: '请选择头像'}
					],
					name: [
						{ required: true, message: '请输入用户昵称'},
						{ min: 2, max: 10, message: '长度在 5 到 12 个字符'}
					],
					email: [
						{ required: true, message: '请输入邮箱地址' },
						{ type: 'email', message: '请输入正确的邮箱地址' }
					]
				}
			}
		},
		methods: {
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {
          return 'login'
				})
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			// 表单提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log('submit');
						this.editUserInfo()
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
			// 个人中心信息
			personalCenter() {
				let _this = this
				_this.dialogVisible = true
				var user =  _this.user
				if(user) {
					_this.userform.photoUrl = _this.imgService + user.photoUrl,
					_this.userform.name = user.username,
					_this.userform.email = user.email
				}
			},
			// 编辑个人信息
			async editUserInfo() {
				let _this = this
        let params = {
					 id: _this.user.id,
				   username: _this.userform.name,
					 email: _this.userform.email,
					 photoUrl: _this.uploadImg == ''?_this.user.userImg:_this.uploadImg
				}
				let data = await http.post('user/update', params)
				if(data.data.status === 200) {
           _this.message(true,data.data.msg,'success')
					 _this.dialogVisible = false
				} else {
           _this.message(true,data.data.msg,'error')
				}
			},
			handleAvatarSuccess(res, file) {
				this.uploadImg = res
				this.userform.photoUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {

				const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG && !isPNG) {
					this.$message.error('上传头像图片只能是 JPG、PNG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return (isJPG || isPNG) && isLt2M;
			},
			initUserInfo() {
				let _this = this
				var usr= _this.user
				if (usr) {
					this.nickName = usr.username
					this.userImg = _this.imgService + usr.photoUrl
				} else {
					_this.$router.push('/login');
				}
			},
			/**
			 * ifshow: true/false msg: message  type: error/error/success
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
      this.initUserInfo()
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			// margin-top: 2px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 50px;
						height: 50px;
						border-radius: 30px;
						margin: 5px 5px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 100%;
				}
				.el-menu-vertical-demo-main{
					width: 100%!important; // 剔除内联样式的width: 64px  (width: 64px--->这是一个bug)
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}

.avatar-uploader .el-upload {
	 border: 1px dashed #d9d9d9;
	 border-radius: 6px;
	 cursor: pointer;
	 position: relative;
	 overflow: hidden;
 }
 .avatar-uploader .el-upload:hover {
	 border-color: #409EFF;
 }
 .avatar-uploader-icon {
	 font-size: 28px;
	 color: #8c939d;
	 width: 178px;
	 height: 178px;
	 line-height: 178px;
	 text-align: center;
 }
 .avatar {
	 width: 178px;
	 height: 178px;
	 display: block;
 }
</style>
