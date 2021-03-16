<template>
    <div>
       <!-- 面包屑 -->
       <el-breadcrumb separator-class="el-icon-arrow-right" class="mianbaoxie">
            <el-breadcrumb-item :to="{ path: '/About' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

         <el-card class="box-card">
             <!-- 添加分类 -->
             <el-row class="but">
                 <el-col>
                     <el-button type="primary" @click="showAddCate">添加分类</el-button>
                 </el-col>
             </el-row>
             
             <!-- 表格 -->
            <tree-table :data="catelist" :columns="columns"  :selection-type="false" :expand-type="false" :show-row-hover="false" show-index index-text="#" border class="tree-table">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type='success' v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type='warning' v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页器 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5,7]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
         </el-card>
         <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCatelogVisible"
            width="50%" @close = "addCateClosed">

            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options指定数据源 -->
                    <!-- props数据配置选项 -->
                     <el-cascader
                        v-model="selectedkeys"
                        :options="parentCateList"
                        expandTrigger = 'hover'
                        :props="cateprops"
                        @change="parentCateChange"
                        clearable
                        show-all-levels
                        change-on-select
                        >
                    </el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatelogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户的对话框 -->
        <el-dialog
            title="修改分类"
            :visible.sync="editCateVisible"
            width="30%">
            
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                <el-form-item label="分类名称" >
                    <el-input v-model="editForm.cat_name" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCateinfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // 查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类的列表
            catelist:[],
            //总数据条数
            total:0,
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    prop:'cat_deleted',
                    type:'template',
                    template:'isok'
                },
                {
                    label:'排序',
                    type:'template',
                    template:'order'
                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
                }
            ],
            //控制分类对话框的显示与隐藏
            addCatelogVisible:false,
            //添加分类的表单数据对象
            addCateForm:{
                //将要添加分类的名称
                cat_name:'',
                //父级分类的id
                cat_pid:0,
                //当前分类的等级默认一级分类
                cat_level:0
            },
            //添加分类表单数据的验证规则对象
            addCateFormRules:{
                cat_name:[
                        {
                        required:true,
                        message:'请输入分类名称',
                        trigger:'blur'
                    }
                ]
            },
            //父级分类的列表
            parentCateList:[],
            //级联选择器的配置对象
            cateprops:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //选中的父级分类 id数组
            selectedkeys:[],
            //控制编辑分类的显示与隐藏
            editCateVisible:false,
            //查询到的分类商品 数据对象
            editForm:{},
            editFormRules:{}
      
            
        };
    },
    created(){
        this.getCatelist()
    },
    methods: {
        //获取商品分类数据
        async getCatelist(){
           const res = await this.$http.get('/api/categories',{params:this.queryInfo})

           if(res.meta.status !== 200){
             return  this.$message.error('获取商品分类数据失败！')
           }
        //    console.log(res.data.result);
        //    把数据列表赋值 给 getCatelist
           this.catelist = res.data.result
        //    为总数据条数赋值
           this.total = res.data.total
        },
        //监听 pagesize 变化
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCatelist();
        },
        //监听 pagenum 变化
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCatelist();
        },
        //展示添加商品分类的 对话框
        showAddCate(){
            //先获取父级商品分类列表
            this.getParentCateList();
            //再展示对话框
            this.addCatelogVisible = true
        },
        //获取父级分类列表数据
        async getParentCateList(){
           const res = await this.$http.get('/api/categories/',{params: {type:2}})
            if(res.meta.status !== 200){
                return this.$message.error('获取父级分类列表数据失败')
            }
            console.log(res.data);
            this.parentCateList = res.data
        },
        //选择项发生变化 触发这个函数
        parentCateChange(){
            console.log(this.selectedkeys.length);
            if(this.selectedkeys.length > 0){
                this.addCateForm.cat_pid = this.selectedkeys[
                    this.selectedkeys.length -1
                ]
                this.addCateForm.cat_level = this.selectedkeys.length
                return
            }else{
                 this.addCateForm.cat_pid = 0
                 this.addCateForm.cat_level = 0
            }

        },
        //点击按钮添加新的分类
        addCate(){
          console.log(this.addCateForm); 
          this.$refs.addCateFormRef.validate(async valid =>{
              if(!valid) return
              const res = await this.$http.post('api/categories',this.addCateForm)

              if(res.meta.status !== 201){
                  return this.$message.error('添加分类失败！')
              }
              this.$message.success('添加分类成功！')
              this.getCatelist()
              this.addCatelogVisible = false;
          }) 
           
        },
        //监听对话框的关闭事件 清空表单数据
        addCateClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedkeys = [];
            this.addCateForm.cat_level = 0;
            this.addCateForm.cat_pid = 0;
        },
        //展示编辑分类的对话框
        async editCate(id){
            this.editCateVisible = true;
            console.log(id);
           const res = await this.$http.get('/api/categories/'+id)
            if(res.meta.status !== 200){
                return this.$message.info('获取分类数据失败')
            }
           
            // console.log(res.data);
            this.editForm = res.data;
        },
        //修改分类名 并提交
       async editCateinfo(){
            //  console.log(this.addCateForm.cat_name);
            const res = await this.$http.put('/api/categories/'+this.editForm.cat_id,{cat_name:this.editForm.cat_name}) 
            // console.log(res);
            if(res.meta.status !== 200){
               return this.$message.error("分类名称修改失败！")
            }
            //关闭对话框
            this.editCateVisible = false;
            //刷新数据列表
            this.getCatelist();
            //提示修改成功
            this.$message.success("分类名称修改成功！");
        },
        async removeCateById(id){
            console.log(id);
            const Result = await this.$confirm('此操作将永久删除此分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
           
            }).catch((error)=>{
                return error
            }) 
             //点击确认  返回字符串 confirm
            //点击取消  返回字符串 cancel
            console.log(Result);

            if(Result !== 'confirm'){
               return this.$message.info('已取消删除')
            }

             const res = await this.$http.delete('/api/categories/'+ id)
            if(res.meta.status !== 200){
                  return this.$message.error('此分类删除失败')
            }

            this.$message.success('此分类删除成功')
            
             //刷新用户列表
            this.getCatelist();
        }

    },
    
    components: {

    },
};
</script>

<style scoped lang="less">
.mianbaoxie{
    margin: 20px 20px;
}
.box-card{
    width: 1128px;
    margin-left: 20px;
}
.but{
    margin-bottom: 20px;
}
.tree-table{
    margin-bottom: 20px;
}
 .el-cascader{
    width: 100%;
 }
</style>
