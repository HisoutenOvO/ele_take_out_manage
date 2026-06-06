<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import { Delete, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OrderQueryPageApi, OrderDetailApi, OrderDeleteApi } from '@/api/orders'

// 表格数据
const orderList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)

// 查询列表
const search = async () => {
  const result = await OrderQueryPageApi(
      null,
      currentPage.value,
      pageSize.value
  )
  if (result.code === 200) {
    orderList.value = result.data.records
    total.value = result.data.total
  }
}

const handleSizeChange = () => search()
const handleCurrentChange = () => search()

// 删除订单
const deleteById = async (id) => {
  ElMessageBox.confirm('确认删除该订单吗？', '注意', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(async () => {
        const result = await OrderDeleteApi([id])
        if (result.code === 200) {
          ElMessage.success('删除成功')
          search()
        } else {
          ElMessage.error(result.msg || '删除失败')
        }
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
}

// 查看详情
const dialogVisible = ref(false)
const orderDetail = ref({})

const viewDetail = async (orderId) => {
  const result = await OrderDetailApi(orderId)
  if (result.code === 200) {
    orderDetail.value = result.data
    dialogVisible.value = true
  } else {
    ElMessage.error('获取订单详情失败')
  }
}

// 支付方式转换
const getPayMethodText = (method) => {
  if (method === 1 || method === '1') return '支付宝'
  if (method === 2 || method === '2') return '微信'
  return '未知'
}

onMounted(() => {
  search()
})
</script>

<template>
  <h1>订单管理</h1>

  <div class="container">
    <el-table :data="orderList" border style="width: 100%" class="container">
      <el-table-column prop="id" label="订单ID" width="80" align="center" />
      <el-table-column prop="number" label="订单号" width="240" align="center" />
      <el-table-column prop="username" label="客户名称" width="150" align="center" />
      <el-table-column prop="phone" label="联系电话" width="180" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价" width="100" align="center" />
      <el-table-column prop="actualPayment" label="实付金额" width="110" align="center" />
      <el-table-column prop="createTime" label="下单时间" width="220" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="viewDetail(scope.row.id)">
            <el-icon><View /></el-icon>详情
          </el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="container"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20, 25]"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <!-- 订单详情弹窗 -->
  <el-dialog v-model="dialogVisible" title="订单详情" width="700px">
    <div class="order-detail" v-if="orderDetail.id">
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="订单号">{{ orderDetail.number }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <span v-if="orderDetail.status === '已支付'" type="success">已支付</span>
          <span v-else-if="orderDetail.status === '待支付'" type="warning">待支付</span>
          <span v-else type="info">{{ orderDetail.status }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ orderDetail.nickname }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">
          <template #default="scope">
            <span v-if="orderDetail.payMethod === 1">支付宝</span>
            <span v-else>微信</span>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="配送费">¥{{ orderDetail.deliveryFee }}</el-descriptions-item>
        <el-descriptions-item label="打包费">¥{{ orderDetail.packingFee }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">¥{{ orderDetail.actualPayment }}</el-descriptions-item>
      </el-descriptions>

      <el-card class="address-card" shadow="never" v-if="orderDetail.address">
        <template #header><span>收货地址</span></template>
        <div class="address-content">
          <p>【{{ orderDetail.address.tag }}】{{ orderDetail.address.detail }}</p>
          <p>联系人：{{ orderDetail.address.name }}  {{ orderDetail.address.phone }}</p>
        </div>
      </el-card>

      <el-table :data="orderDetail.dishList" border style="width: 100%; margin-top: 20px">
        <el-table-column label="菜品图片" width="180" align="center">
          <template #default="scope">
            <img :src="scope.row.image" height="50px" alt="菜品" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品名称" width="180" align="center" />
        <el-table-column prop="number" label="数量" width="80" align="center" />
        <el-table-column prop="amount" label="单价" width="80" align="center">
          <template #default="scope">¥{{ scope.row.amount }}</template>
        </el-table-column>
        <el-table-column label="小计"  align="center">
          <template #default="scope">¥{{ (scope.row.amount * scope.row.number).toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else style="text-align: center; padding: 40px; color: #999;">暂无订单详情</div>
    <template #footer/>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 20px 0px;
}
.order-detail {
  padding: 10px;
}
.address-card {
  margin-top: 20px;
}
.address-content p {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}
</style>