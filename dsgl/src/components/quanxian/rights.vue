<template>
  <div class="px_quan">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/about/rights' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      class="px_table"
      stripe
      :data="px_userinfo"
      border
      style="width: 100%"
    >
      <el-table-column type="index" :index="indexMethod" label="#">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称"> </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column label="权限管理">
        <template slot-scope="props">
          <el-tag :type="tag(props.row.level)">
            {{ aa(props.row.level) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import aaa from "./../requert/index";
export default {
  props: {},
  data() {
    return {
      px_userinfo: [],
    };
  },
  mounted() {
    aaa("/rights/list").then((res) => {
      console.log(res.data);
      this.px_userinfo = res.data;
    });
  },
  methods: {
    indexMethod(index) {
      return ++index;
    },
    tag(e) {
      console.log(e);
      if (e == "0") {
        return "";
      } else if (e == "1") {
        return "success";
      } else if (e == "2") {
        return "warning";
      }
    },
    aa(e) {
      console.log(e);
      if (e == "0") {
        return "一级";
      } else if (e == "1") {
        return "二级";
      } else if (e == "2") {
        return "三级";
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.px_quan {
  height: 100vh;
  padding: 20px;
}
.px_table {
  margin-top: 20px;
}
</style>
