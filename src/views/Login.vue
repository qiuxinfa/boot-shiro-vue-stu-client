<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" plain :loading="loginLoading" style="width:100%;" @click.native.prevent="login">登录</el-button>
      <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
  import http from '../utils/http'
  import md5 from 'js-md5'
  export default {
    data() {
      return {
        loginLoading: false,
        ruleForm2: {
          account: 'admin',
          checkPass: 'a123456a'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      async login() {
        var _this = this
        _this.loginLoading = true
        let params = {
          name:_this.ruleForm2.account,
          pass:md5(_this.ruleForm2.checkPass)
        }
        let data = await http.post('user/login', params)
        if(data.status === -404) {
          _this.message(true,data.msg,'error')
          _this.loginLoading = false
          return
        }
        if(data.data.status === 200) {
          _this.message(true,data.data.msg,'success')
          sessionStorage.setItem('user', JSON.stringify(data.data.data))
          _this.$router.push({ path: '/user/list' })
        } else {
           _this.message(true,data.data.msg,'error')
        }
        _this.loginLoading = false
      },
      handleSubmit2(ev) {
        var _this = this;
        _this.$router.push({ path: '/user/list' });
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
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
