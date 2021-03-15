<template>
  <div>
<<<<<<< HEAD
    <div class="herad_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 主体内容 -->
    <div class="content">
      <div class="warning_box">
        <i class="el-icon-warning"></i>
        <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning">
        </el-alert>
      </div>
      <div class="classify">
        <div class="block">
          <span class="demonstration">选择商品分类：</span>
          <el-cascader
            v-model="value"
            expandTrigger="hover"
            :options="options"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </div>
      </div>

      <!-- 路由部分 -->
      <div class="sorting_box">
        <el-tabs v-model="activeName" @tab-click="handleClick" >
          <!-- 动态参数 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button class="add" type="primary" @click="addparameter(dialogVisible = true)"
                :disabled="disabled"
                >添加属性</el-button>
            <el-table
              highlight-current-row
              :data="tableData"
              style="width: 100%"
              border
              max-height="400"
            >
              <el-table-column label="" width="60" type="expand">
                <template slot-scope="scope" class="dynamic_a">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item label="">
                     <el-tag>我是没有属性的</el-tag>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#" width="60">
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name" width="580">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top"></el-popover>
                 {{scope.row.attr_name}}
                </template>
                <template>
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item label="">
                      <span>22</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row,updateVisible=true)"
                    type="primary"
                  >
                    <i class="el-icon-edit"></i>
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row,deleteVisible=true)"
                  >
                    <i class="el-icon-delete"></i>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加动态属性弹出框 -->
          <el-dialog
              title="添加动态参数"
              :visible.sync="dialogVisible"
              width="40%"
              :before-close="addparameter">
              <div class="addparameter demo-input-suffix">
                <el-form  label-width="80px">
                  <el-form-item label="动态参数">
                    <el-input v-model="parainput"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button :plain="true" @click="open1" >取 消</el-button>
                <el-button :plain="true" type="primary" @click="cimitparam">确 定</el-button>
              </span>
            </el-dialog>


            <!-- 静态参数 -->
          <el-tab-pane  label="静态参数" name="only" value="静态参数">
            <div class="but">
              <el-button @click="addstatis(staticVisible=true)" type="primary" :disabled="disabled"
                >添加属性</el-button
              >
            </div>
            <div class="dynamic">
              <!-- 有数据 -->
              <el-table
                highlight-current-row
                :data="statics"
                style="width: 100%"
                border
                max-height="400"
              >
                <el-table-column label="" width="60" type="expand">
                  <template slot-scope="scope" class="dynamic_a">
                    <el-form
                      label-position="left"
                      inline
                      class="demo-table-expand"
                    >
                      <el-form-item  label="">
                        <!-- attr_vals -->
                        <el-tag>{{ scope.row.attr_vals==''?'暂无数据呐':scope.row.attr_vals }}</el-tag>
                        <!-- <span>属性标签</span> -->
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#" width="60">
                </el-table-column>
                <el-table-column label="参数名称" prop="attr_name" width="580">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top"></el-popover>
                    {{ scope.row.attr_name }}
                  </template>
                  <template>
                    <el-form
                      label-position="left"
                      inline
                      class="demo-table-expand"
                    >
                      <el-form-item label="">
                        <span>22</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row,updateVisible=true)"
                      type="primary"
                    >
                      <i class="el-icon-edit"></i>
                      编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row,deleteVisible=true)"
                    >
                      <i class="el-icon-delete"></i>
                      删除
                   
                        
                      
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>   
          </el-tab-pane>
            <!-- 添加静态属性弹出框 -->
          <el-dialog
              title="添加静态参数"
              :visible.sync="staticVisible"
              width="40%"
              :before-close="addparameter">
              <div class="addparameter demo-input-suffix">
                <el-form  label-width="80px">
                  <el-form-item label="静态属性">
                    <el-input v-model="parainput"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button :plain="true" @click="open1">取 消</el-button>
                <el-button :plain="true" type="primary" @click="cimitstatic">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改静态属性 -->
             <el-dialog
              title="修改静态参数"
              :visible.sync="updateVisible"
              width="40%"
              :before-close="addparameter">
              <div class="addparameter demo-input-suffix">
                <el-form  label-width="80px">
                  <el-form-item label="静态属性">
                    <el-input v-model="parainput" clearable></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button :plain="true" @click="open1" >取 消</el-button>
                <el-button type="primary" @click="cimitupdate">确 定</el-button>
              </span>
            </el-dialog>

            <!-- 删除静态属性 -->
            <el-dialog
              title="提示"
              :visible.sync="deleteVisible"
              width="30%"
              :before-close="addparameter">
              <i class="el-icon-warning" type="warning"></i>
              <span>此操作将永久删除该属性,是否继续?</span>
              <span slot="footer" class="dialog-footer">
                <el-button :plain="true" @click="open1">取 消</el-button>
                <el-button :plain="true" type="primary" @click="deletecommit">确 定</el-button>
              </span>
            </el-dialog>
            

        </el-tabs>
      </div>
    </div>
=======
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/about/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="请输入内容" v-model="input" clearable> </el-input>
    </div>
>>>>>>> fa773fd6554c7c58b5af56b18717cdff74b46fb9
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {},
  data() {
    return {
<<<<<<< HEAD
     
      value: [],
      /**级联选择框 */
      options: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //
      activeIndex: "1",
      //标签页
      activeName: "many",
      //表格内容
      tableData: [],//动态
      statics:[],//静态
      //按钮状态
      disabled: true,
      active: false,
      // 动态参数弹出框
      dialogVisible: false,
      parainput:"",
      classify_id:null,//分类id
      attr_id:null,//属性id
      //静态参数弹出框
      staticVisible:false,
      //修改属性弹出框
      updateVisible:false,
      //查询商品数性
        attr_name:"",//新属性的名字
      //删除弹出框
      deleteVisible:false,
      attr_sel:"",//动静态
      

    };
  },
  mounted() {
    axios({
      url: "/api/categories",
      params: {
        type: "",
        pagenum: 1,
        pagesize: 10,
      },
    }).then((res) => {
      console.log(res.data);
      this.options = res.data.result;
    });
  },

  methods: {
    //取消
    open1(){
      this.deleteVisible=false;//删除
      this.dialogVisible=false;//添加动态参数
      this.updateVisible = false;//修改静态属性
      this.staticVisible = false;//添加静态属性
      this.$message('已取消');
    },

    //商品分类change
    handleChange(v) {
      console.log(v);
      this.classify_id = v[2];
      this.disabled = false;
      console.log(this.classify_id);
      this.getattibute();
      this.getstatis();
      
    },
     //获取动态属性
    getattibute(){
      axios({
        url: `/api/categories/${this.classify_id}/attributes`,
        params: {
          sel: "many",
        },
      }).then((res) => {
        console.log(res.data);
        this.tableData = res.data;
      });
    },
   
    
    //动态参数弹出框
    addparameter(){},
    //动态参数提交
    cimitparam(){
      console.log(this.parainput);
      axios({
        url:`/api/categories/${this.classify_id}/attributes`,
        method:'post',
        data:{
          attr_name:this.parainput,
          attr_sel:'many',  
        }
      }).then(res=>{
        console.log(res.data);
        this.dynamiclist=res.data;
        console.log(this.dynamiclist);
        this.getattibute();//重新调用 获取属性
        this.dialogVisible=false;
         this.$message({
          message: '已成功添加动态属性',
          type: 'success'
        });
        this.parainput="";
      })
    },

 
  

    // 动静参数
    handleSelect(key, keyPath) {},
    handleClick(tab, event) {
      console.log(tab, event);
         //获取静态
      if(tab.label=="静态参数"){
       this.getstatis();
      }else{
        this.getattibute();
      }
    },

     //获取静态属性
    getstatis(){
      axios({
        url: `/api/categories/${this.classify_id}/attributes`,
        params: {
          sel: "only",
        },
      }).then((res) => {
        console.log(res.data);
        this.statics = res.data;
       
      });
    },
    //静态按钮弹出
    addstatis(){},
    //静态提交
    cimitstatic(){
      console.log(this.parainput);
      axios({
        url:`/api/categories/${this.classify_id}/attributes`,
        method:'post',
        data:{
          attr_name:this.parainput,
          attr_sel:'only',  
        }
      }).then(res=>{
        console.log(res.data);
        this.dynamiclist=res.data;
        console.log(this.dynamiclist);
        this.getstatis();//重新调用 获取属性
        this.staticVisible=false;
        this.parainput="";
         this.$message({
          message: '已成功添加静态属性',
          type: 'success'
        });
        return
      })
    
    },
 
    //修改
    handleEdit(index, row) {
      console.log(index, row);
      this.attr_id=row.attr_id;
      this.attr_sel=row.attr_sel;
      //  **查询商品 */ 
      // axios({
      //   url:`/api/categories/${this.classify_id}/attributes/${this.attr_id}/`
      // }).then(res=>{
      //   console.log(res);
        
      // })
 },
       //提交修改
    cimitupdate(){
        axios({
          url:`/api/categories/${this.classify_id}/attributes/${this.attr_id}/`,
          method:"put",
          data:{
            attr_name:this.parainput,
            attr_sel:this.attr_sel
          }
        }).then(res=>{
          console.log(res);
          this. getstatis();
          this.getattibute();
          this.parainput="";
        })

       this.updateVisible=false
    },
    //删除请求
    deletecommit(){
      console.log(this.classify_id);
      axios({
        url:`/api/categories/${this.classify_id}/attributes/${this.attr_id}`,
        method:'delete'
      }).then(res=>{
        console.log(res)
        this.deleteVisible=false;
        this. getstatis();
        this.getattibute();
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      })
    },

    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.attr_id=row.attr_id;
      
    },
  },
=======
      input: "",
    };
  },
  methods: {},
>>>>>>> fa773fd6554c7c58b5af56b18717cdff74b46fb9
  components: {},
};
</script>

<style scoped lang="less">
<<<<<<< HEAD
.herad_title {
  height: 20px;
  display: flex;
  align-items: center;
  margin: 15px 0 0 20px;
}
.content {
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  .warning_box {
    position: relative;
    i {
      position: absolute;
     
      top: 50%;
      color: #e6a23c;
      z-index: 5;
      transform: translateY(-50%);
    }
    .el-alert {
      border-radius: 5px;
    }
  }
  /**商品分类 */
  .classify {
    margin-top: 15px;
  }
  .sorting_box {
    .but {
      margin-bottom: 20px;
      button {
        font-size: 14px;
        height: 40px;
      }
    }
  }
  //表单
  .dynamic {
  }
  //添加动态参数
 .add{
   margin-bottom: 20px;
 }
 .el-icon-warning{
   font-size: 24px;
   color: #e6a23c;
   margin-right: 10px;
 }

}
=======
>>>>>>> fa773fd6554c7c58b5af56b18717cdff74b46fb9
</style>
