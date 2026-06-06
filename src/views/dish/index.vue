<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  DishQueryPageApi,
  DishAddApi,
  QueryByIdApi,
  DishUpdateApi,
  DishDeleteApi,
} from "@/api/dish";
import {GetCategoryName} from "@/api/category"
// 搜索条件
const searchDish = ref({
  name: "",
  categoryName: "",
});

// 表格数据
const dishList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);

// 查询列表
const search = async () => {
  const result = await DishQueryPageApi(
      searchDish.value.categoryName,
      searchDish.value.name,
      currentPage.value,
      pageSize.value
  );
  console.log(dish)
  if (result.code === 200) {
    dishList.value = result.data.records;
    total.value = result.data.total;
  }
};

const clear = () => {
  searchDish.value = { name: "", categoryName: "" };
  search();
};

// 分页
const handleSizeChange = () => search();
const handleCurrentChange = () => search();

// 新增/修改表单数据
const dish = ref({
  id: null,
  name: "",
  categoryId: "",
  price: 0,
  image: "",
  description: "",
  ingredients: "",
  serving: "",
  monthlySales: 0,
});

// 对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref("");

// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: "请输入菜品名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在2到50个字符", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "请选择所属分类", trigger: "change" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" },
    { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入有效的价格", trigger: "blur" }],
  monthlySales: [
    { required: true, message: "请输入月售", trigger: "blur" },
    { pattern: /^\d+$/, message: "请输入有效的整数", trigger: "blur" }
  ]
});

const dishFormRef = ref();

// 新增
const addDish = () => {
  dialogVisible.value = true;
  dialogTitle.value = "新增菜品";
  dish.value = {
    id: null,
    name: "",
    categoryId: "",
    price: 0,
    image: "",
    description: "",
    ingredients: "",
    serving: "",
    monthlySales: 0,
  };
  dishFormRef.value?.clearValidate();
};

// 保存
const save = async () => {
  if (!dishFormRef.value) return;
  dishFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请正确填写表单");
      return;
    }
    let result;
    const submitData = { ...dish.value };
    if (submitData.id) {
      result = await DishUpdateApi(submitData.id, submitData);
    } else {
      delete submitData.id;
      result = await DishAddApi(submitData);
    }
    if (result.code === 200) {
      ElMessage.success("保存成功");
      dialogVisible.value = false;
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};

// 修改回显
const edit = async (id) => {
  const result = await QueryByIdApi(id);
  if (result.code === 200) {
    dialogVisible.value = true;
    dialogTitle.value = "修改菜品";
    dish.value = { ...result.data };
    dishFormRef.value?.clearValidate();
  } else {
    ElMessage.error("获取菜品信息失败");
  }
};

// 删除
const deleteById = async (id) => {
  ElMessageBox.confirm("确认删除该菜品吗？", "注意", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(async () => {
        const result = await DishDeleteApi([id]);
        if (result.code === 200) {
          ElMessage.success("删除成功");
          search();
        } else {
          ElMessage.error(result.msg || "删除失败");
        }
      })
      .catch(() => {
        ElMessage.info("已取消删除");
      });
};

// 批量删除
const selectIds = ref([]);
const handleSelectionChange = (selectionList) => {
  selectIds.value = selectionList.map((item) => item.id);
};

const deleteByIds = async () => {
  if (!selectIds.value.length) {
    ElMessage.warning("请选择要删除的菜品");
    return;
  }
  ElMessageBox.confirm("确认删除选中的菜品吗？", "注意", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(async () => {
        for (const id of selectIds.value) {
          await DishDeleteApi(id);
        }
        ElMessage.success("删除成功");
        search();
      })
      .catch(() => {
        ElMessage.info("已取消删除");
      });
};
// 新增分类选项
const categoryOptions = ref([])

// 加载分类列表
const loadCategories = async () => {
  const res = await GetCategoryName()
  if (res.code === 200) {
    categoryOptions.value = res.data
  }
}

// 图片上传
const token = ref("");
const getToken = () => {
  token.value = localStorage.getItem("adminToken") || "";
};

const handleAvatarSuccess = (response) => {
  dish.value.image = response.data;
};

const beforeAvatarUpload = (rawFile) => {
  if (!["image/jpeg", "image/png"].includes(rawFile.type)) {
    ElMessage.error("只支持 JPG/PNG 图片");
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error("图片大小不能超过10M");
    return false;
  }
  return true;
};

onMounted(() => {
  getToken();
  search();
  loadCategories()
});
</script>

<template>
  <h1>菜品管理</h1>


  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchDish">
      <el-form-item label="菜品名称">
        <el-input v-model="searchDish.name" placeholder="请输入菜品名称" />
      </el-form-item>
      <el-form-item label="所属分类">
        <el-input v-model="searchDish.categoryName" placeholder="分类名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="addDish">+ 新增菜品</el-button>
    <el-button type="danger" @click="deleteByIds">- 批量删除</el-button>

    <!-- 菜品列表 -->
    <el-table
        :data="dishList"
        border
        style="width: 100%"
        class="container"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="name" label="菜品名称" width="140" align="center" />
      <el-table-column label="菜品图片" width="120" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="60px" alt="菜品图片" />
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="所属分类" width="150" align="center" />
      <el-table-column prop="price" label="价格" width="80" align="center" />
      <el-table-column prop="description" label="描述" width="240" align="center" />
      <el-table-column prop="monthlySales" label="月售" width="80" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
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

  <!-- 新增/修改对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
    <el-form :model="dish" label-width="100px" :rules="rules" ref="dishFormRef">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜品名称" prop="name">
            <el-input v-model="dish.name" placeholder="请输入菜品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="dish.categoryId" placeholder="请选择分类" style="width: 100%">
              <el-option
                  v-for="cat in categoryOptions"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="dish.price" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月售" prop="monthlySales">
            <el-input v-model.number="dish.monthlySales" placeholder="月售数量" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="描述">
        <el-input v-model="dish.description" placeholder="请输入菜品描述" />
      </el-form-item>

      <el-form-item label="原料">
        <el-input v-model="dish.ingredients" placeholder="请输入原料信息" />
      </el-form-item>

      <el-form-item label="份量">
        <el-input v-model="dish.serving" placeholder="如：约500g/份" />
      </el-form-item>

      <el-form-item label="菜品图片">
        <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="{ token: token }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="dish.image" :src="dish.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 20px 0px;
}
.avatar {
  height: 78px;
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
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  line-height: 78px;
  border-radius: 10px;
  border: 1px dashed #dcdfe6;
}
</style>