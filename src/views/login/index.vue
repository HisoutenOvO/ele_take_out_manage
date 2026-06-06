<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from 'vue'
import { adminLoginApi, shopLoginApi } from '@/api/login'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref()
const loginForm = ref({ username: '', password: '' })

// 登录类型：admin | shop
const loginType = ref('admin')

// 切换按钮的文字
const loginTypeLabel = computed(() => loginType.value === 'admin' ? '管理员端' : '商家端')

// 登录逻辑
const login = async () => {
  let result
  if (loginType.value === 'admin') {
    result = await adminLoginApi(loginForm.value)
  } else {
    result = await shopLoginApi(loginForm.value)
  }

  if (result.code === 200) {
    ElMessage.success('登录成功')
    localStorage.setItem('token', result.data.token)
    // 存储登录角色
    localStorage.setItem('role', loginType.value)

    if (loginType.value === 'admin') {
      // 管理员跳转到商家管理
      router.push('/shop')
    } else {
      // 商家跳转到店铺信息
      router.push('/shopDetail')
    }
  } else {
    ElMessage.error(result.msg || '登录失败')
  }
}

// 切换登录类型
const toggleLoginType = () => {
  loginType.value = loginType.value === 'admin' ? 'shop' : 'admin'
  loginForm.value = { username: '', password: '' }
  loginFormRef.value?.resetFields()
}

const clear = () => {
  loginForm.value = { username: '', password: '' }
  loginFormRef.value?.resetFields()
}
</script>

<template>
  <div id="container">
    <div class="login-form">
      <!-- 标题 -->
      <p class="title">饿了么外卖管理系统</p>

      <div class="switch-wrapper">
        <span :class="{ active: loginType === 'admin' }">管理员</span>
        <label class="switch">
          <input type="checkbox" :checked="loginType === 'shop'" @change="toggleLoginType" />
          <span class="slider"></span>
        </label>
        <span :class="{ active: loginType === 'shop' }">商家</span>
      </div>

      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="loginForm.username"
              :placeholder="loginType === 'admin' ? '请输入管理员用户名' : '请输入商家名称'"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button class="button" type="primary" @click="login">登 录</el-button>
          <el-button class="button" type="info" @click="clear">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
#container {
  min-height: 100vh;
  background-image: url('public/bg1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  max-width: 420px;
  width: 100%;
  padding: 40px 30px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background-color: white;
}

.title {
  font-size: 24px;
  font-family: '楷体';
  text-align: center;
  margin-bottom: 24px;
  font-weight: bold;
  color: #333;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}

.switch-wrapper span {
  font-size: 14px;
  color: #999;
  transition: color 0.2s;
}

.switch-wrapper span.active {
  color: #333;
  font-weight: 600;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #409eff;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.button {
  margin-top: 24px;
  width: 120px;
}
</style>