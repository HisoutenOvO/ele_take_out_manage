<script setup lang="js">
import {ref,onMounted} from 'vue'
import {ElMessage} from "element-plus";
import { CategoryQueryPageApi,CategoryAddApi,QueryByIdApi,CategoryUpdateApi,CategoryDeleteApi } from '@/api/category.js'

const categoryList = ref([])
const category = ref({
  name:'',
  emoji:''
})
const searchCategory = ref({
  name: "",
});
const categoryListQuery = async() =>{
  const result = await CategoryQueryPageApi(
      searchCategory.value.name,
      page.value,
      pageSize.value
  )
  if(result.code){
    categoryList.value = result.data.records
    total.value = result.data.total
  }
}

const add = () =>{
  dialogFormVisible.value = true
  formTitle.value = '新增分类'
  category.value = {
    id: null,
    name: '',
    emoji: ''
  }
}

const edit = async(id) =>{
  const result = await QueryByIdApi(id)
  if(result.code){
    dialogFormVisible.value = true
    formTitle.value = '修改分类'
    category.value = result.data
  }else{
    ElMessage.error("请求失败")
  }
}

const formTitle = ref('新增分类')

onMounted(()=>{
  categoryListQuery()
})

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const size = ref('default')
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val) => {
  pageSize.value = val;
  categoryListQuery();
}
const handleCurrentChange = (val) => {
  page.value = val;
  categoryListQuery();
}
const dialogFormVisible = ref(false)
const categoryFormRef = ref()

const save = async() =>{
  let result
  if(category.value.id){
    result = await CategoryUpdateApi(category.value.id,category.value)
  }else {
    result = await CategoryAddApi(category.value)
  }
  if(result.code){
    ElMessage.success("保存成功!")
    dialogFormVisible.value = false;
    await categoryListQuery();
  }else{
    ElMessage.error(result.msg)
  }
}

const deleteCategoryId = ref()
const dialogVisible = ref(false)
const delById = (id) =>{
  deleteCategoryId.value = id
  dialogVisible.value = true
}
const deleteCategory = async() =>{
  const result = await CategoryDeleteApi(deleteCategoryId.value)
  if(result.code){
    ElMessage.success("删除成功!")
    dialogVisible.value = false
    await categoryListQuery()
  }else{
    ElMessage.error(result.msg)
    dialogVisible.value = false
  }
}
const clear = () => {
  searchCategory.value = { name: "" };
  categoryListQuery();
};
</script>

<template>
  <div class="container">
    <h1>分类管理</h1>
  </div>
  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchCategory">
      <el-form-item label="类名关键字：">
        <el-input v-model="searchCategory.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="categoryListQuery">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-button type="primary" class="container" @click="add">+ 新增分类</el-button>
  <el-table :data="categoryList" border style="width: 100%">
    <el-table-column type="index" label="序号" width="80" align="center" :index="(page - 1) * pageSize + 1"/>
    <el-table-column prop="name" label="分类名称" width="180" align="center" />
    <el-table-column prop="emoji" label="分类图标" width="150" align="center" />
    <el-table-column prop="createTime" label="创建时间" align="center" width="250" />
    <el-table-column prop="updateTime" label="更新时间" align="center" width="250" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="delById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="container"></div>
  <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="category" ref="categoryFormRef">
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="category.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分类图标:" prop="name">
        <el-input v-model="category.emoji" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false" type="danger" >取消</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
      v-model="dialogVisible"
      title="注意"
      width="500"
  >
    <span>确认删除该分类吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">不删了</el-button>
        <el-button type="primary" @click="deleteCategory">
          确认删除
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 20px 0px;
}
</style>