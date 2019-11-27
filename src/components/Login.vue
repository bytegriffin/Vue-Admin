<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo"/>
      </div>
      <el-form label-width="0px" :model="loginForm" :rules="loginFormRules" ref="loginFormRef"  class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconuser"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont iconpassword"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登 录</el-button>
          <el-button type="info" @click="resetLoginForm">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度要在2到20个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度要在2到20个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () { // 重置表单
      this.$refs.loginFormRef.resetFields()
    },
    login () { // 表单的预验证：验证表单中的所有项是否已输入正确
      // 以下为控台请求 如果有后台可以用下列代码
      // this.$refs.loginFormRef.validate(async valid => {
      //   if (!valid) return
      //   // 由于要调用res下data下的属性，所以需要把data声明出来，'login'是后台的login地址不是本项目的login地址
      //   const { data: res } = await this.$http.post('login', this.loginForm)
      //   if (res.meta.status !== 200) return this.$message.error('登录失败')
      //   this.$message.success('登录成功')
      //   // 保存服务端发来的token
      //   window.sessionStorage.setItem('token', res.data.token)
      //   // 跳转页面
      //   this.$router.push('/home')
      // })
      // 以下为静态请求
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4e6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
