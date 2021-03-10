<template>
  <div class="ligon">
    <div>
      <img src="./../assets/logo.png" alt="" />
    </div>

    <el-form
      class="home"
      :label-position="labelPosition"
      :model="formLabelAlign"
      :rules="rules"
      ref="formLabelAlign"
    >
      <el-form-item prop="name">
        <el-input
          v-model="formLabelAlign.name"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>

      <el-form-item prop="pad">
        <el-input
          v-model="formLabelAlign.pad"
          prefix-icon="el-icon-lock"
          show-password
        ></el-input>
      </el-form-item>

      <el-button
        type="primary"
        plain
        class="btn"
        @click="submitForm('formLabelAlign')"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      labelPosition: "left",
      formLabelAlign: {
        name: "admin",
        region: "",
        type: "",
        pad: "123456",
      },

      rules: {
        name: [
          { required: true, message: "请输入你的用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pad: [
          { required: true, message: "请输入你的密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //axios
          this.axios
            .post("/api/login", {
              username: this.formLabelAlign.name,
              password: this.formLabelAlign.pad,
            })
            .then((res) => {
              if (res.meta.msg == "密码错误") {
                this.$message({
                  message: "密码错误",
                  duration: 1000,
                  type: "error",
                });
              } else {
                this.$message({
                  message: "恭喜你，登陆成功",
                  duration: 1000,
                  type: "success",
                  onClose: () => {
                    console.log(res);
                    sessionStorage.setItem("token", res.data.token);
                    this.$router.push("/about");
                  },
                });
              }
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.ligon > div {
  position: absolute;
  top: 27%;
  left: 50%;
  transform: translate(-50%);
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
}
.ligon > div > img {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.ligon {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  .home {
    width: 40%;
    padding: 30px;
    background-color: white;
    border-radius: 10px;
  }
  .btn {
    width: 100%;
  }
}
</style>