<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getShopInfo, updateShopInfo } from '@/api/shop'

// 是否处于编辑状态
const isEditing = ref(false)

// 按钮文字
const btnText = ref('修改信息')

// 表单数据
const shopForm = ref({
  id: null,
  name: '',
  image: '',
  rating: 0,
  monthlySales: 0,
  deliveryTime: 30,
  distance: '',
  minPrice: 0,
  deliveryFee: 0,
  campus: 0,
  special: '',
  notice: '',
  status: 1,
  createTime: '',
  updateTime: ''
})

// 备份原始数据，用于取消时恢复
const originalForm = ref({})

// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: '请输入商家名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  minPrice: [
    { required: true, message: '请输入起送价', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格', trigger: 'blur' }
  ],
  deliveryFee: [
    { required: true, message: '请输入配送费', trigger: 'blur' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格', trigger: 'blur' }
  ],
  deliveryTime: [
    { required: true, message: '请输入配送时间', trigger: 'blur' },
    { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' }
  ]
})

const formRef = ref(null)

// 加载商家信息
const loadShopInfo = async () => {
  const result = await getShopInfo()
  if (result.code === 200) {
    shopForm.value = { ...result.data }
    originalForm.value = { ...result.data }  // 备份
  } else {
    ElMessage.error('获取商家信息失败')
  }
}

// 切换到编辑模式
const startEditing = () => {
  originalForm.value = { ...shopForm.value }  // 保存当前数据
  isEditing.value = true
  btnText.value = '保存修改'
}

// 保存修改（先弹确认框）
const handleSave = async () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请正确填写表单')
      return
    }

    ElMessageBox.confirm('确认要修改店铺信息吗？', '提示', {
      confirmButtonText: '确认修改',
      cancelButtonText: '取消',
      type: 'warning'
    })
        .then(async () => {
          const submitData = {
            name: shopForm.value.name,
            image: shopForm.value.image,
            deliveryTime: shopForm.value.deliveryTime,
            distance: shopForm.value.distance,
            minPrice: shopForm.value.minPrice,
            deliveryFee: shopForm.value.deliveryFee,
            campus: shopForm.value.campus,
            special: shopForm.value.special,
            notice: shopForm.value.notice,
            status: shopForm.value.status
          }
          const result = await updateShopInfo(submitData)
          if (result.code === 200) {
            ElMessage.success('修改成功')
            isEditing.value = false
            btnText.value = '修改信息'
            loadShopInfo()  // 重新加载最新数据
          } else {
            ElMessage.error(result.message || '修改失败')
          }
        })
        .catch(() => {
          ElMessage.info('已取消修改')
        })
  })
}

// 取消编辑，恢复原始数据
const cancelEditing = () => {
  shopForm.value = { ...originalForm.value }
  isEditing.value = false
  btnText.value = '修改信息'
}

// 图片上传
const token = ref(localStorage.getItem('adminToken') || '')

const handleAvatarSuccess = (response) => {
  shopForm.value.image = response.data
}

const beforeAvatarUpload = (rawFile) => {
  if (!['image/jpeg', 'image/png'].includes(rawFile.type)) {
    ElMessage.error('只支持 JPG/PNG 图片')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('图片大小不能超过10M')
    return false
  }
  return true
}

onMounted(() => {
  loadShopInfo()
})
</script>

<template>
  <h1>店铺信息管理</h1>

  <div class="container">
    <el-form :model="shopForm" :rules="rules" ref="formRef" label-width="120px" style="max-width: 800px;">
      <!-- 基本信息 -->
      <el-divider content-position="left">基本信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="商家名称" prop="name">
            <el-input v-model="shopForm.name" :disabled="!isEditing" placeholder="请输入商家名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="评分">
            <el-input v-model="shopForm.rating" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月售">
            <el-input v-model="shopForm.monthlySales" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 配送信息 -->
      <el-divider content-position="left">配送信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="起送价" prop="minPrice">
            <el-input v-model.number="shopForm.minPrice" :disabled="!isEditing" placeholder="请输入起送价" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配送费" prop="deliveryFee">
            <el-input v-model.number="shopForm.deliveryFee" :disabled="!isEditing" placeholder="请输入配送费" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="配送时间(分钟)" prop="deliveryTime">
            <el-input v-model.number="shopForm.deliveryTime" :disabled="!isEditing" placeholder="请输入配送时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="距离">
            <el-input v-model="shopForm.distance" :disabled="!isEditing" placeholder="如：1.2km" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 其他信息 -->
      <el-divider content-position="left">其他信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否校园送">
            <el-select v-model="shopForm.campus" :disabled="!isEditing" style="width: 100%">
              <el-option label="不支持" :value="0" />
              <el-option label="支持" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业状态">
            <el-select v-model="shopForm.status" :disabled="!isEditing" style="width: 100%">
              <el-option label="闭店中" :value="0" />
              <el-option label="营业中" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商家特色">
        <el-input v-model="shopForm.special" :disabled="!isEditing" placeholder="如：品质西餐" />
      </el-form-item>

      <el-form-item label="商家公告">
        <el-input v-model="shopForm.notice" :disabled="!isEditing" type="textarea" :rows="3" placeholder="请输入公告内容" />
      </el-form-item>

      <el-form-item label="商家图片">
        <el-upload
            v-if="isEditing"
            class="avatar-uploader"
            action="/api/upload"
            :headers="{ token: token }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="shopForm.image" :src="shopForm.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <img v-else-if="shopForm.image" :src="shopForm.image" class="avatar" />
        <span v-else style="color: #999; font-size: 14px;">暂无图片</span>
      </el-form-item>

      <!-- 只读时间 -->
      <el-divider content-position="left">时间信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-input v-model="shopForm.createTime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间">
            <el-input v-model="shopForm.updateTime" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 按钮区 -->
      <el-form-item>
        <el-button type="primary" @click="startEditing" v-if="!isEditing" size="large" style="width: 200px;">
          {{ btnText }}
        </el-button>
        <template v-else>
          <el-button type="success" @click="handleSave" size="large" style="width: 150px;">
            保存修改
          </el-button>
          <el-button type="info" @click="cancelEditing" size="large" style="width: 150px; margin-left: 20px;">
            取消
          </el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.container {
  margin: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  line-height: 78px;
  border-radius: 10px;
  border: 1px dashed #dcdfe6;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
  object-fit: cover;
  border-radius: 10px;
}
</style>