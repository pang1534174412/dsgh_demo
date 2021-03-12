<template>
  <div class="aa">
    <div class="home_top">
      <div class="box1">
        <span>电商后台管理系统</span>
      </div>
      <div class="box2">
        <button @click="logout" type="info">退出</button>
      </div>
    </div>
    <div class="home_center">
      <div class="home_left">
        <div class="home_left_top">
          <!-- <img src="../assets/logo.png" alt="" /> -->
        </div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :unique-opened="true"
        >
          <el-submenu
            :index="item.id + '-1' + ''"
            v-for="item in list"
            :key="item.id"
          >
            <template slot="title">
              <i :class="ictu[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :route="{ path: '/about/' + ite.path }"
                :index="ite.id + '-6' + ''"
                v-for="ite in item.children"
                :key="ite.id"
                tag="el-menu-item"
              >
                <i class="el-icon-user-solid"> </i>
                {{ ite.authName }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>

      <div class="home_right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: "",
      ictu: {
        125: "el-icon-user-solid",
        103: "el-icon-s-platform",
        101: "el-icon-s-cooperation",
        102: "el-icon-s-order",
        145: "el-icon-phone",
      },
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created() {
    this.axios.get("/api/menus").then((res) => {
      this.list = res.data;
    });
  },
};
</script>

<style lang="less">
.aa {
  height: 100%;
}
* {
  padding: 0;
  margin: 0;
}
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

.home_top {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 60px;
  background: #373d41;
  display: flex;
  justify-content: space-between;
  .box1 {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-left: 10px;
    color: #ccc;
  }
  .box2 {
    width: 100px;
    display: flex;
    align-items: center;
    button {
      padding: 10px 20px;
    }
  }
}
.home_center {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .home_left {
    position: fixed;
    z-index: 99;
    height: 100vh;
    margin-top: 60px;
    background: #333744;
    width: 200px; 
  }
  .home_right {
    box-sizing: border-box;
    margin-top: 60px;
    padding-left: 200px;
    flex: 1;
  }
}
</style>