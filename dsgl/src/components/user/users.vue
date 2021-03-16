<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mianbaoxie">
      <el-breadcrumb-item :to="{ path: '/about/home' }"
        >首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索 -->
      <el-input
        placeholder="请输入内容"
        v-model="queryInfo.query"
        class="inputsearch"
        clearable
        @clear="getUserList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchuser"
        >
        </el-button>
      </el-input>
      <el-button type="primary" @click="addDialogVisible = true">
        添加用户
      </el-button>

        <!-- 表格 -->
        <el-table class="form_table" :data="userlist" border stripe       style="width: 100%">
            <el-table-column type="index" prop="date" label="#" width="60"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="mobile" label="电话"> </el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column  label="状态">
                <template slot-scope='scope' >
                    <el-switch v-model="scope.row.mg_state" @change="UserstateChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialogVisible(scope.row.id)"></el-button>
                    </el-tooltip>
                   
                    <!-- 删除按钮 -->
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserbyId(scope.row.id)"></el-button>
                    </el-tooltip>
                   
                    <!-- 分配角色按钮 -->
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
        
                 </template>
            </el-table-column>
          </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
   </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 用户名 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <!-- 密码 -->

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->

        <el-form-item label="邮件" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <!-- 手机 -->

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
        title="分配角色"
        :visible.sync="setRoleVisible"
        width="50%"
        @close="setRoleClose">
        <div class="setrolep">
            <p>当前用户：{{userInfo.username}}</p>
            <p>当前角色：{{userInfo.role_name}}</p>
            <p>分配新角色：
                <el-select v-model="selectRoleId" placeholder="请选择">
                    <el-option
                    v-for="item in roleslist"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </p>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleinfo">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  props: {},

  data() {
    const checkEmail = (rule, value, cb) => {
      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱！"));
      }
    };
    const checkMobile = (rule, value, cb) => {
      let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        cb();
      } else {
        cb(new Error("请输入合法的手机号"));
      }
    };
    return {
       //query  查询参数可以为空
      //pagenum  当前页码不能为空
      //pagesize  每页显示条数不能为空
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },

      userlist: [],
      total: 0,
      //控制 添加用户对话框 显示与隐藏
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名在3~5个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "密码在6~10个字符之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //控制 修改用户对话框 显示与隐藏
      editdialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
       //控制 分配角色对话框 显示与隐藏
            setRoleVisible:false,
            //需要被分配角色的用户信息
            userInfo:{},
            //所有角色的数据列表
            roleslist:[],
            //已选中的角色 id值
            selectRoleId:'',

    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表的请求
    async getUserList() {
    
      const res = await this.$http.get(`/api/users`, {
        params: this.queryInfo,
      });
      //    console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //分页器
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async UserstateChange(userinfo) {
      // console.log(userinfo);
      const res = await this.$http.put(
        `/api/users/${userinfo.id}/state/${userinfo.mg_state}`
      );

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_status;
        return this.$message.error("用户状态更新失败！");
      }
      this.$message.success("用户更新成功！");
    },
    //搜索
    searchuser() {
      this.getUserList();
    },
    //添加用户 关闭或取消时清空输入框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //修改用户 关闭或取消时清空输入框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //添加新用户
    addUser() {
      //预校验  条件不满足时返回false  return
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const res = await this.$http.post(`/api/users`, this.addForm);
        if (res.meta.status != 201) {
          this.$message.error("用户添加失败");
        } else {
          this.$message.success("用户添加成功");
        }
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 修改用户 展示用户信息
    async showDialogVisible(id) {
      this.editdialogVisible = true;
      console.log(id);
      const res = await this.$http.get(`/api/users/` + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
    },
    //修改用户  提交前的预验证
    editUser() {
      //预校验  条件不满足时返回false  return
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const res = await this.$http.put(`/api/users/` + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("用户信息修改失败");
        } else {
          this.$message.success("用户信息修改成功");
        }
        //关闭对话框
        this.editdialogVisible = false;
        //刷新用户列表
        this.getUserList();
      });
    },
    //删除用户
    async removeUserbyId(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => {
        return error;
      });
      //点击确认  返回字符串 confirm
      //点击取消  返回字符串 cancel
      console.log(confirmResult);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const res = await this.$http.delete("/api/users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("用户删除失败");
      }

      this.$message.success("用户信息删除成功");

           
        },
        //分配角色
        async setRole(userInfo){
            this.userInfo = userInfo

            //在展示对话框之前 取得所有的角色列表
            const res = await this.$http.get('/api/roles')
            if(res.meta.status !== 200){
               return this.$message.error('获取角色列表失败！')
            }
            console.log(res);
            this.roleslist = res.data;
            this.setRoleVisible = true
            
        },
        //点击确认按钮  提交保存分配好的角色
        async saveRoleinfo(){
            if(!this.selectRoleId){
                return this.$message.error('请选择要分配的角色！')
            }
           const res = await this.$http.put(`api/users/${this.userInfo.id}/role`,{rid:this.selectRoleId})

           if(res.meta.status !== 200){
               return this.$message.error('更新角色失败！')
           }
           this.$message.success('更新角色成功！')
           this.getUserList()
           this.setRoleVisible = false
        },
        //监听分配角色 对话框的关闭事件
        setRoleClose(){
            this.selectRoleId = ''
            this.userInfo = {}
                  
                //刷新用户列表
            this.getUserList();
        }

       
        
    }
}
    
 
</script>

<style scoped lang="less">
.mianbaoxie {
  margin: 20px 20px;
}
.box-card {
  width: 1128px;
  margin-left: 20px;
  .inputsearch {
    width: 347px;
    margin-right: 20px;
  }
  .form_table {
    margin: 20px 0;
  }
}
.setrolep p{
    margin-bottom: 20px;
}
</style>
