<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="请输入内容" v-model="input" clearable> </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
        input:""
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
</style>
