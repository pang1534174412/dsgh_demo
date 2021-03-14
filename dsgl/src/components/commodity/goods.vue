<template>
  <div class="px_quan">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="请输入内容" v-model="input" clearable> </el-input>
      <el-button
        type="info"
        plain
        icon="el-icon-search"
        @click="chaxun"
      ></el-button>
      <el-button type="primary" @click="addtian">添加商品</el-button>
    </div>
    <div>
      <el-table :data="tableData" border height="500">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="(item1,index) in props.row.children"> </el-row>
          </template>
        </el-table-column> -->
        <el-table-column type="index" :index="indexMethod" label="#" fixed>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="680">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_number" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scpoe">
            <el-button
              type="primary"
              @click="handleEdit(scpoe.$index, scpoe.row)"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              @click="removeDelete(scpoe.$index, scpoe.row)"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 6, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <div>
      <el-form
        :label-position="labelPosition"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        v-if="active"
        ref="form"
      >
        <el-form-item label="活动名称" prop="goods_name">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="goods_introduce">
          <el-input v-model="form.goods_introduce"></el-input>
        </el-form-item>
        <el-from-item label="提交图片" prop="pics">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-from-item>
        <el-button @click="active = false">取 消</el-button>
        <el-button type="primary" @click="primose">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import aaa from "./../../components/requert/index";
export default {
  props: {},
  data() {
    return {
      active: false,
      // 上传图片的URL地址
      uploadURL: "http://192.168.1.30:8888/api/private/v1/upload",
      fileList: [],
      pagenum: 1,
      pagesize: 10,
      input: "",
      tableData: [], //所有商品的参数
      labelPosition: "right",
      id: "",
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
      },
      total: null,
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入重量", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getinfo();
  },
  methods: {
    //查询商品
    chaxun() {
      this.tableData = null;
      aaa({
        url: `goods/${this.input}`,
      }).then((res) => {});
    },
    //添加商品
    addtian() {
      this.$router.push("/about/add");
    },
    indexMethod(index) {
      return ++index;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getinfo();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getinfo();
    },
    getinfo() {
      aaa({
        url: "/goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        console.log(res);
        this.total = res.data.total;
        this.tableData = res.data.goods;
      });
    },
    removeDelete(e, res) {
      console.log(e, res);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // let {children} = res.children.id
          aaa({ url: `/goods/${res.goods_id}`, method: "delete" }).then(
            (res) => {
              console.log(res);
              this.getinfo();
            }
          );
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleEdit(e, res) {
      console.log(e, res);
      this.active = true;
      this.id = res.goods_id;
      this.form.goods_name = res.goods_name;
      this.form.goods_price = res.goods_price;
      this.form.goods_number = res.goods_number;
      this.form.goods_weight = res.goods_weight;
    },
    primose() {
      console.log(
        this.form.goods_name,
        this.form.goods_price,
        this.form.goods_number,
        this.form.goods_weight,
        this.form.goods_introduce,
        this.form.pics,
        this.form.attrs,
        this.id
      );
      aaa({
        url: `/goods/${this.id}`,
        method: "put",
        data: {
          goods_name: this.form.goods_name,
          goods_price: this.form.goods_price,
          goods_number: this.form.goods_number,
          goods_weight: this.form.goods_weight,
          goods_introduce: this.form.goods_introduce,
          pics: this.form.pics,
        },
      }).then((res) => {
        console.log(res);
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.px_quan {
  padding: 20px 30px;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-input--suffix,
.el-input__inner {
  width: 400px;
}
.el-button + .el-button {
  margin-left: 20px;
}
.demo-ruleForm {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  background: white;
  border: 2px solid black;
}
</style>
