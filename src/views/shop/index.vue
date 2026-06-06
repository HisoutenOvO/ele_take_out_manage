<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  queryPageApi,
  addApi,
  queryByIdApi,
  updateApi,
  deleteApi,
} from "@/api/shop";

//  搜索条件
const searchShop = ref({
  name: "",
});

//  表格数据
const shopList = ref([]); // 表格绑定的数据（修复1：变量名对应）
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);

//  查询列表
const search = async () => {
  const result = await queryPageApi(
      searchShop.value.name,  // keyword
      currentPage.value,
      pageSize.value
  );
  if (result.code === 200) {
    shopList.value = result.data.records;  // 修复2：取 records，不是 rows
    total.value = result.data.total;
  }
};

const clear = () => {
  searchShop.value = { name: "" };
  search();
};

//  分页
const handleSizeChange = () => search();
const handleCurrentChange = () => search();

//  新增/修改表单数据
const shop = ref({
  id: null,
  name: "",
  password: "",
  image: "",
  distance: "",
  minPrice: null,
  deliveryFee: null,
  campus: 0,
  special: "",
  notice: "",
  deliveryTime: 30,
  status: 0,
  rating: 0,
  monthlySales: 0,
});

//  对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref("");

//  表单校验规则
const rules = ref({
  name: [
    { required: true, message: "请输入商家名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在2到50个字符", trigger: "blur" },
  ],
  minPrice: [{ required: true, message: "请输入起送费", trigger: "blur" }],
  deliveryFee: [{ required: true, message: "请输入配送费", trigger: "blur" }],
  status: [{ required: true, message: "请选择营业状态", trigger: "change" }],
});

const shopFormRef = ref();

//  新增
const addShop = () => {
  dialogVisible.value = true;
  dialogTitle.value = "新增商家";
  shop.value = {
    id: null,
    name: "",
    password: "",
    image: "",
    distance: "",
    minPrice: null,
    deliveryFee: null,
    campus: 0,
    special: "",
    notice: "",
    deliveryTime: 30,
    status: 1,
    rating: 0,
    monthlySales: 0,
  };
  shopFormRef.value?.resetFields();
};

//  保存
const save = async () => {
  if (!shopFormRef.value) return;
  shopFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请正确填写表单");
      return;
    }
    let result;
    const submitData = { ...shop.value };
    if (submitData.id) {
      result = await updateApi(submitData.id, submitData);
    } else {
      delete submitData.id;
      result = await addApi(submitData);
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

//  修改回显
const edit = async (id) => {
  const result = await queryByIdApi(id);
  if (result.code === 200) {
    dialogVisible.value = true;
    dialogTitle.value = "修改商家";
    shop.value = { ...result.data }; // 回显数据
    shopFormRef.value?.resetFields();
  } else {
    ElMessage.error("获取商家信息失败");
  }
};

//  删除
const deleteById = async (id) => {
  ElMessageBox.confirm("确认删除该商家吗？", "注意", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(async () => {
        const result = await deleteApi(id);
        if (result.code === 200) {
          ElMessage.success("删除成功");
          search();
        } else {
          ElMessage.error(result.msg);
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
    ElMessage.warning("请选择要删除的商家");
    return;
  }
  ElMessageBox.confirm("确认删除选中的商家吗？", "注意", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(async () => {
        const result = await deleteApi(selectIds.value);
        if (result.code === 200) {
          ElMessage.success("删除成功");
          search();
        } else {
          ElMessage.error(result.msg);
        }
      })
      .catch(() => {
        ElMessage.info("已取消删除");
      });
};

//图片上传
const token = ref("");
const getToken = () => {
  token.value = localStorage.getItem("adminToken") || "";
};

const handleAvatarSuccess = (response) => {
  shop.value.image = response.data;
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
});
</script>

<template>
  <h1>商家管理</h1>

  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchShop">
      <el-form-item label="店名关键字：">
        <el-input v-model="searchShop.name" placeholder="请输入商家名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="addShop">+ 新增商家</el-button>
    <el-button type="danger" @click="deleteByIds">- 批量删除</el-button>

    <!-- 商家列表 -->
    <el-table
        :data="shopList"
        border
        style="width: 100%"
        class="container"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="name" label="商家名称" width="120" align="center" />
      <el-table-column label="商店图片" width="140" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="60px" alt="商家图片 " />
        </template>
      </el-table-column>
      <el-table-column prop="rating" label="评分" width="70" align="center" />
      <el-table-column prop="monthlySales" label="月售" width="80" align="center" />
      <el-table-column prop="minPrice" label="起送费" width="80" align="center" />
      <el-table-column prop="deliveryFee" label="配送费" width="80" align="center" />
      <el-table-column label="校园送" width="80" align="center">
        <template #default="scope">
          <span v-if="scope.row.campus === 1">支持</span>
          <span v-else>不支持</span>
        </template>
      </el-table-column>
      <el-table-column prop="special" label="特色" width="120" align="center" />
      <el-table-column label="营业状态" width="100" align="center">
        <template #default="scope">
          <span v-if="scope.row.status === 1">营业中</span>
          <span v-else>闭店中</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="140" align="center" />
      <el-table-column label="操作"  align="center">
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
    <el-form :model="shop" label-width="100px" :rules="rules" ref="shopFormRef">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商家名称" prop="name">
            <el-input v-model="shop.name" placeholder="请输入商家名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="shop.password" placeholder="请输入商家登录密码" show-password />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="起送费" prop="minPrice">
            <el-input v-model.number="shop.minPrice" placeholder="请输入起送费" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配送费" prop="deliveryFee">
            <el-input v-model.number="shop.deliveryFee" placeholder="请输入配送费" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="评分" prop="rating">
            <el-input v-model.number="shop.rating" placeholder="请输入评分" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月售" prop="monthlySales">
            <el-input v-model.number="shop.monthlySales" placeholder="请输入月售" />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否校园送">
            <el-select v-model="shop.campus" style="width: 100%">
              <el-option label="支持" :value="1" />
              <el-option label="不支持" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业状态" prop="status">
            <el-select v-model="shop.status" style="width: 100%">
              <el-option label="闭店中" :value="0" />
              <el-option label="营业中" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商家特色">
        <el-input v-model="shop.special" placeholder="如：品质西餐" />
      </el-form-item>

      <el-form-item label="商家公告">
        <el-input v-model="shop.notice" type="textarea" placeholder="请输入公告内容" />
      </el-form-item>

      <el-form-item label="商家图片" prop="image">
        <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="{ token: token }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="shop.image" :src="shop.image" class="avatar" />
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