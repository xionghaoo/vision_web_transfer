<template>
  <div class="login-body">
    <div class="login-div">
      <div class="login-form">
        <div class="login-logo">
          <img :src="brand.brand_icon" alt="" />
        </div>
        <el-form label-position="right" :model="loginData" :rules="rules" ref="ruleForm" class="form-box">
          <el-form-item label="" prop="login_name">
            <el-input placeholder="请输入用户名" v-model="loginData.login_name">
              <i class="form-icon" slot="prefix">
                <img src="../assets/icon/icon_user.png" alt="" />
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入密码" v-model="loginData.password" type="password">
              <i class="form-icon" slot="prefix"> <img src="../assets/icon/icon_psw.png" alt="" /></i>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
            type="primary"
            size="large"
            @click.native="submitLogin"
            class="btn-submit"
            style="background-color: #26abe3; width: 100%"
            :loading="loading"
        >登录</el-button
        >
      </div>
    </div>
    <div class="foot-div"></div>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'
import Config from "@/config";

export default {
  name: 'Login',
  created() {
    window.documentTitle('登录')
  },
  mounted() {
    // let key = this.$route.query.key
    // let value = this.$route.query.value
    // console.log('router params: ', key, value)
  },
  data() {
    return {
      brand: {
        brand_icon: logo,
        brand_name: '幻境',
      },
      loginData: {
        login_name: '',
        password: '',
      },
      rules: {
        login_name: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
      },
      loading: false
    }
  },
  methods: {
    submitLogin() {
      let _this = this
      _this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          _this.login()
        }
      })
    },
    login() {
      let { loginData } = this
      this.$http.post(Config.api.login, {
        username: loginData.login_name,
        password: loginData.password
      }).then((res) => {
        console.log("login data", res.data)
        if (res.data.code === 0) {
          localStorage.setItem("login_h5_token", res.data.data.user_id)
          this.$router.replace({name: "Home"})
        }
      })
    }
    // ...mapActions(['submit', 'setGlobalAuth']),
  },
}
</script>

<style scoped lang="scss">
.login-body {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--Conditional-page-background, #f0f2f5) url(../assets/login_bg.png) no-repeat center center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 360px;
  height: 645px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form-box {
  width: 360px;
}
.login-logo {
  width: 150px;
  height: 46px;
  margin-bottom: 85px;
  img {
    width: 100%;
    height: 100%;
  }
}
.form-icon {
  width: 16px;
  height: 16px;
  margin: 10px 0 0 4px;
  img {
    width: 16px;
    height: 16px;
    margin-top: 12px;
  }
}
.btn-submit {
  margin-top: 26px;
}
</style>
