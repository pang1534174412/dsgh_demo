<template>
  <div class="px_quan">
    <!-- 提示区域 -->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
    <div>
      <el-steps
        :space="200"
        align-center
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"> </el-step>
        <el-step title="商品参数"> </el-step>
        <el-step title="商品属性"> </el-step>
        <el-step title="商品图片"> </el-step>
        <el-step title="商品内容"> </el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          style="height: 500px"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="ruleForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="ruleForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                v-model="ruleForm.goods_cat"
                @change="handleChange()"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2"
            ><el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import aaa from "./../../components/requert/index";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      // 静态属性列表数据
      onlyTableData: [],
      // 动态参数列表数据
      manyTableData: [],
      // 商品分类列表
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      activeIndex: 0,
      tabPosition: "left",
      ruleForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        attrs: [],
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 上传图片的URL地址
      uploadURL: "http://192.168.1.30:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
    };
  },
  mounted() {
    this.getsuoyou();
  },
  computed: {
    cateId() {
      if (this.ruleForm.goods_cat.length === 3) {
        return this.ruleForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    getsuoyou() {
      aaa({
        url: "/categories",
      }).then((res) => {
        console.log(res);
        this.catelist = res.data;
      });
    },
    //  添加商品
    add() {
      // 执行添加的业务逻辑
      // lodash   cloneDeep(obj)
      const form = _.cloneDeep(this.ruleForm);
      form.goods_cat = form.goods_cat.join(",");
      // 处理动态参数
      this.manyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" "),
        };
        this.ruleForm.attrs.push(newInfo);
      });
      // 处理静态属性
      this.onlyTableData.forEach((item) => {
        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
        this.ruleForm.attrs.push(newInfo);
      });
      form.attrs = this.ruleForm.attrs;
      console.log(form);
      aaa({
        url: "/goods",
        method: "post",
        data: {
          goods_name: form.goods_name,
          goods_price: form.goods_price,
          goods_weight: form.goods_weight,
          goods_number: form.goods_number,
          goods_cat: form.goods_cat,
          pics: form.pics,
          attrs: form.attrs,
          goods_introduce: form.goods_introduce,
        },
      }).then((res) => {
        console.log(res);
        this.$router.push('/about/goods')

      });
    },

    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.ruleForm.pics.findIndex((x) => x.pic === filePath);
      this.ruleForm.pics.splice(i, 1);
      console.log(this.ruleForm);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.ruleForm.pics.push(picInfo);
      console.log(this.ruleForm);
    },
    handleChange() {
      console.log(this.ruleForm.goods_cat);
      if (this.ruleForm.goods_cat.length !== 3) {
        this.ruleForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.ruleForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    tabClicked() {
      if (this.activeIndex === "1") {
        console.log(this.cateId);
        aaa({
          url: `categories/${this.cateId}/attributes`,
          params: { sel: "many" },
        }).then((res) => {
          console.log(res);
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            console.log(item.attr_vals);
          });
          this.manyTableData = res.data;
        });
      } else if (this.activeIndex === "2") {
        aaa({
          url: `categories/${this.cateId}/attributes`,
          params: { sel: "only" },
        }).then((res) => {
          console.log(res);
          this.onlyTableData = res.data;
        });
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.px_quan {
  padding: 20px 10px;
  height: 100%;
}
</style>
