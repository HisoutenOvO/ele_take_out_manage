<!-- eslint-disable vue/no-reserved-component-names -->
<script setup lang="js">
</script>

<template>
  <div class="layout">
    <el-container>
      <!--        头部区域-->
      <el-header class="header">
        <span class="title">饿了么外卖管理系统</span>
        <span class="else">
          <a href="">
            修改密码 |
          </a>
          <a href="">
            退出登录
          </a>
        </span>
      </el-header>

      <el-container>
        <!--          侧边栏-->
        <el-aside width="200px" class="aside">
          <el-menu class="el-menu" :router="true">
            <el-menu-item index="/shopDetail" >
              <template #title >
                <el-icon><HomeFilled /></el-icon>店铺信息
              </template>
            </el-menu-item>
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Shop/></el-icon>店铺管理
              </template>
              <el-menu-item index="/category">分类管理</el-menu-item>
              <el-menu-item index="/dish">菜品管理</el-menu-item>
              <el-menu-item index="/orders">订单管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><setting/></el-icon>管理员管理
              </template>
              <el-menu-item index="/shop">商家管理</el-menu-item>
            </el-sub-menu>
          </el-menu>


        </el-aside>
        <!--          右侧主体-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

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

.else{
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
.el-menu {
  border-right: none;
}
</style>