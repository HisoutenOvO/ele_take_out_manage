<!-- eslint-disable vue/no-reserved-component-names -->
<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminChangePasswordApi, shopChangePasswordApi } from '@/api/login'
const router = useRouter()

// 当前登录角色
const role = ref(localStorage.getItem('role') || 'admin')

// 修改密码弹窗
const passwordDialogVisible = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = ref({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && value === passwordForm.value.oldPassword) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const passwordFormRef = ref(null)

const openPasswordDialog = () => {
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  passwordFormRef.value?.clearValidate()
  passwordDialogVisible.value = true
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  passwordFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请正确填写表单')
      return
    }

    let result
    const role = localStorage.getItem('role')

    if (role === 'admin') {
      result = await adminChangePasswordApi({
        oldPassword: passwordForm.value.oldPassword,
        password: passwordForm.value.newPassword
      })
    } else {
      result = await shopChangePasswordApi({
        oldPassword: passwordForm.value.oldPassword,
        password: passwordForm.value.newPassword
      })
    }

    if (result.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      passwordDialogVisible.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      router.push('/login')
    } else {
      ElMessage.error(result.msg)
    }
  })
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <el-container style="height: 100vh;">
      <!-- 头部区域 -->
      <el-header class="header">
        <span class="title">饿了么外卖管理系统</span>
        <span class="else">
          <a href="javascript:void(0)" @click="openPasswordDialog">修改密码 | </a>
          <a href="javascript:void(0)" @click="handleLogout">退出登录</a>
        </span>
      </el-header>

      <el-container style="flex: 1; overflow: hidden;">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="aside">
          <el-menu class="el-menu" :router="true">
            <!-- 商家端可见 -->
            <template v-if="role === 'shop'">
              <el-menu-item index="/shopDetail">
                <template #title>
                  <el-icon><HomeFilled /></el-icon>店铺信息
                </template>
              </el-menu-item>
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><Shop /></el-icon>店铺管理
                </template>
                <el-menu-item index="/category">分类管理</el-menu-item>
                <el-menu-item index="/dish">菜品管理</el-menu-item>
                <el-menu-item index="/orders">订单管理</el-menu-item>
              </el-sub-menu>
            </template>

            <!-- 管理员端可见 -->
            <template v-if="role === 'admin'">
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><setting /></el-icon>管理员管理
                </template>
                <el-menu-item index="/shop">商家管理</el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-aside>

        <!-- 右侧主体 -->
        <el-main style="overflow-y: auto;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

  <!-- 修改密码弹窗 -->
  <el-dialog v-model="passwordDialogVisible" title="修改密码" width="450px">
    <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.header {
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.else {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
}

.el-menu {
  border-right: none;
}
</style>