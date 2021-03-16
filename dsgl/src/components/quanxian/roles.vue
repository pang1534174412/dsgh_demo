<template>
  <div class="px_qun">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/about' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="px_qun_1">
      <el-button type="primary" @click="px_add">添加角色</el-button>
      <div>
        <el-table :data="px_userinfo" border>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-for="(item1, index) in props.row.children" :key="index">
                <el-col :span="5">
                  <el-tag
                    closable
                    @close="removeRightById(props.row, item1.id)"
                    >{{ item1.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    v-for="(item2, index2) in item1.children"
                    :key="index2"
                  >
                    <el-col :span="6" class="px_ss">
                      <div>
                        <el-tag
                          closable
                          type="success"
                          @close="removeRightById(props.row, item2.id)"
                          >{{ item2.authName }}</el-tag
                        >
                        <i class="el-icon-caret-right"></i>
                      </div>
                    </el-col>
                    <el-col :span="18" class="px_ss">
                      <el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeRightById(props.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" :index="indexMethod" label="#">
          </el-table-column>
          <el-table-column label="角色名称" prop="roleName"> </el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
              >
                <i class="el-icon-edit"></i>
                编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="removeDelete(scope.$index, scope.row)"
              >
                <i class="el-icon-delete"></i>删除</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="handleUpdate(scope.$index, scope.row)"
              >
                <i class="el-icon-setting"></i>分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="tree" v-if="active">
      <p>分配权限</p>
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <el-button @click="active = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </div>
    <div>
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
        class="fromjia"
        ref="formLabelAlign"
        :rules="rules"
        v-if="active2"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="region">
          <el-input v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-button @click="active2 = false">取 消</el-button>
        <el-button type="primary" @click="renwu">确 定</el-button>
      </el-form>
    </div>
    <div>
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
        class="fromjia"
        ref="formLabelAlign"
        :rules="rules"
        v-if="active3"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="region">
          <el-input v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-button @click="active3 = false">取 消</el-button>
        <el-button type="primary" @click="px_addd">确 定</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import aaa from "./../requert/index";

export default {
  props: {},
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        region: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      px_userinfo: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      active: false,
      active2: false,
      active3: false,
      isaid: null, //当前即将被分配权限的id分配
      // 所有权限的数据
      rightslist: [],
      // 默认选中的节点Id值数组
      defKeys: [],
      //编辑人物的角色id
      id: null,
    };
  },
  mounted() {
    this.px_zidong();
  },
  methods: {
    px_zidong() {
      aaa({
        url: "/roles",
      }).then((res) => {
        this.px_userinfo = res.data;
        // console.log(this.px_userinfo);
      });
    },
    //添加狠角色
    px_add() {
      this.active3 = true;
    },
    px_addd() {
      aaa({
        url: "/roles",
        data: {
          roleName: this.formLabelAlign.name,
          roleDesc: this.formLabelAlign.region,
        },
        method: "post",
      }).then((res) => {
        console.log(res);
        this.px_zidong();
        this.active3 = false;
      });
    },
    indexMethod(index) {
      return ++index;
    },
    //删除角色
    removeDelete(e, res) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // let {children} = res.children.id
          aaa({ url: `/roles/${res.id}`, method: "delete" }).then((res) => {
            console.log(res);
            this.px_zidong();
          });
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
      console.log(e);
      console.log(res.id);
    },
    // 删除角色个别权限
    removeRightById(e, res) {
      // 弹框提示用户是否要删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          aaa({
            url: `roles/${e.id}/rights/${res}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            this.px_zidong();
          });
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
      console.log(e, res);
      console.log(e.id, res); // e.id 是总的父元素的值 res:是你点击删除的值
    },
    //分配权限
    handleUpdate(e, res) {

      this.isaid = res.id;
      aaa({
        url: "/rights/tree",
      }).then((res) => {

        this.rightslist = res.data;
      });
      this.active = true;
      // 递归获取三级节点的Id
      this.getLeafKeys(res, this.defKeys);
    },
    getLeafKeys(res, e) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!res.children) {
        return e.push(res.id);
      }
      res.children.forEach((item) => this.getLeafKeys(item, e));
    },

    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");
      console.log(idStr);
      aaa({
        url: `roles/${this.isaid}/rights`,
        data: {
          rids: idStr,
        },
        method: "post",
      }).then((rew) => {
        console.log(rew);
        this.px_zidong();
        this.active = false;
      });
    },
    //编辑角色名称
    handleEdit(e, res) {
      this.id = res.id;
      this.active2 = true;
      this.res = res;
      this.formLabelAlign.name = res.roleName;
      this.formLabelAlign.region = res.roleDesc;
    },

    renwu() {
      aaa({
        url: `/roles/${this.id}`,
        data: {
          roleName: this.formLabelAlign.name,
          roleDesc: this.formLabelAlign.region,
        },
        method: "put",
      }).then((res) => {
        console.log(res);
        this.px_zidong();
        (this.formLabelAlign.name = ""), (this.formLabelAlign.region = "");
      });
      this.active2 = false;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.fromjia {
  width: 600px;
  padding: 50px 0;
  background: white;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  .el-input__inner {
    width: 90% !important;
  }
}
.tree {
  width: 500px;
  height: 600px;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 40px;
  background: white;
  overflow: auto;
  z-index: 9999;
  p {
    margin-bottom: 35px;
  }
}

.el-table_2_column_6 {
  width: 40px !important;
}
.px_qun {
  padding: 20px;
}
.px_qun_1 {
  padding: 20px;
  background: white;
  margin-top: 20px;
}
el-button {
  padding: 5px 8px;
}
.px_ss {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin: 5px 5px 5px 0;
}
</style>
