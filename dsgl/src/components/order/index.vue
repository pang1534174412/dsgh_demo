<template>
  <div>
    <!-- 面包屑 -->
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/about' }"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="counnt_box">
      <!-- 搜索框 -->
      <div style="margin-bottom: 15px; width: 330px">
        <el-input
          placeholder="请输入内容"
          v-model="input3"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 主体内容 -->
      <el-table :data="tableData" border style="width: 100%" max-height="570">
        <el-table-column label="#" width="80" type="index" :index="indexMethod">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" width="220" prop="order_number">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.order_number }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="订单价格" width="120">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.order_price }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="是否付款" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medum">{{
                  scope.row.pay_status == 0 ? "未付款" : "已付款"
                }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="140">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.is_send }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="160">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div slot="reference" class="name-wrapper">
                {{ changetime(scope.row.create_time) }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="380">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="amend(scope.$index, scope.row, (amendVisible = true))"
            ></el-button>
            <el-button
              icon="el-icon-location-outline"
              size="mini"
              type="success"
              @click="
                logistics(scope.$index, scope.row, (dialogVisible = true))
              "
            >
            </el-button>

            <el-button
              type="warning"
              size="mini"
              @click="
                handleDelete(scope.$index, scope.row, (detailsVisible = true))
              "
              >订单详情
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="
                modifyorder(scope.$index, scope.row, (modiVisible = true))
              "
              >修改订单状态
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器 -->
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="users.pagenum"
          :page-sizes="[1, 5, 10]"
          :page-size="users.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 物流进度 -->
      <el-dialog
        title="物流进度"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>查无结果</span>
        <div class="querytime">{{ querytime }}</div>
      </el-dialog>

      <!-- 修改地址 -->
      <el-dialog
        title="修改地址"
        :visible.sync="amendVisible"
        width="35%"
        :before-close="handleClose"
      >
        <div class="address">
          <div class="address_left">
            <div class="block">
              <span class="must">*</span>
              <span>省市区/县</span>
              <el-cascader
                :options="cityOptions"
                change-on-select
                expandTrigger="hover"
              >
              </el-cascader>
            </div>
          </div>
          <div class="address_right">
            <span class="must">*</span>
            <span>详细地址</span>
            <el-input placeholder="请输入内容"></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button :plain="true" @click="open1">取 消</el-button>
          <el-button type="primary" @click="amendVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 订单详情 -->
      <el-dialog
        title="订单详情"
        :visible.sync="detailsVisible"
        width="35%"
        :before-close="handleClose"
      >
        <div class="details">
          <div class="details_timer">
            下单时间：{{ changetime(details.create_time) }}
          </div>
          <div class="">类型：{{ details.order_fapiao_title }}</div>
          <div class="details_number">订单编号：{{ details.order_number }}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailsVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改订单 -->

      <el-dialog
        title="修改订单："
        :visible.sync="modiVisible"
        width="42%"
        :before-close="handleClose"
      >
        <div class="updata">
          <div class="goods_id">订单ID：{{ modelgoods.order_id }}</div>
          <div class="goods_number">
            订单编号：{{ modelgoods.order_number }}
          </div>
          <div class="modigoodsbox">
            <div class="delivergoods">
              订单是否发货：
              <el-select
                v-model="value"
                @change="getconfirm"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="goods_pay">
              <el-form label-width="70px">
                <el-form-item label="支付方式">
                  <el-radio-group v-model="radio">
                    <el-radio :label="0" @change="getpay">未支付</el-radio>
                    <el-radio :label="1" @change="getpay">支付宝</el-radio>
                    <el-radio :label="2" @change="getpay">微信</el-radio>
                    <el-radio :label="3" @change="getpay">银行卡</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
            <div class="payprice">
              <div class="payprice_left">
                订单价格：{{ modelgoods.order_price }}
              </div>
              <div>订单数量：1</div>
            </div>

            <div class="goods_status">
              <el-form label-width="70px">
                <el-form-item label="支付状态">
                  <el-radio-group v-model="modification.status_pay">
                    <el-radio :label="0" @change="getpay_status"
                      >未支付</el-radio
                    >
                    <el-radio :label="1" @change="getpay_status"
                      >已付款</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button :plain="true" @click="open1">取 消</el-button>
          <el-button :plain="true" type="primary" @click="goods_commit"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import cityOptions from "cityOptions"
import cityOptions from "../../../public/js/city_data2017_element.js";
export default {
  name: "order",
  props: {},
  data() {
    return {
      input3: "", //头部input输入框
      tableData: [],
      currentPage: 1, //当前第几页的数据
      pageSizes: 10, //每页的条数
      users: {
        pagenum: 1, //当前的页数
        pagesize: 10,
      },
      timers: [], //时间
      index: [],
      total: 0,
      dialogVisible: false, //物流进度
      getlogistics: {}, //物流数据
      amendVisible: false, //修改地址
      details: {}, //订单详情
      detailsVisible: false,
      cityOptions: cityOptions, //城市数据

      //修改订单状态
      modiVisible: false, //点击确定取消时隐藏
      modelgoods: {}, //商品
      modification: {
        id: "",
        is_send: "", //是否发货
        order_pay: "", //支付方式
        order_price: "",
        status_pay: Number, //支付状态
        order_number: 1,
      },
      options: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ],
      /**支付选项 */
      radio: Number,
      value: "",
      /**取消 */
    };
  },
  mounted() {
    this.getlist();
  },
  computed: {
    /**列表 */
    changelist() {
      //  return this.tableData.slice((this.currentPage-1)*this.pageSizes,this.currentPage*this.pageSizes)||[];
    },
    querytime() {
      let date = new Date();
      let year = date.getFullYear();
      let mounth = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let timer =
        year +
        "-" +
        mounth +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return timer;
    },
  },
  methods: {
    /**取消 */
    open1() {
      this.$message({
        showClose: true,
        message: "操作取消",
      });
      this.modiVisible = false;
      this.amendVisible = false;
    },
    /**时间转换 */
    changetime(v) {
      // console.log(v);
      let data = new Date(v * 1000);
      let year = data.getFullYear();
      let mounth = data.getMonth() + 1;
      let day = data.getDate();
      let hours = data.getHours();
      let minutes = data.getMinutes();
      let seconds = data.getSeconds();
      let timer =
        year +
        "-" +
        mounth +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return timer;
    },

    /**数据获取 */
    getlist() {
      axios({
        url: "/api/orders",
        params: this.users,
      }).then((res) => {
        /**获取的列表数据 */
        console.log(res.data);
        this.tableData = res.data.goods;
        this.total = res.data.total;
      });
    },
    /**省市区 */
    amend() {},
    /** 物流进度*/
    logistics(v, row) {
      //logistics
      console.log(v, row);
      // axios({
      //   url:"/api/kuaidi/:1106975712662",
      //   method:"get",
      //   params:{

      //   }
      // }).then(res=>{
      //   console.log(res.data);
      // })
    },
    handleClose(done) {
      done();
    },
    /**修改订单状态 */
    modifyorder(index, v) {
      console.log(v);
      this.modelgoods = v;
      console.log();
    },
    /**是 否选择 */
    getconfirm() {
      console.log(Number(this.value));
      this.modification.is_send = this.value;
    },
    /**支付选择 */
    getpay() {
      console.log(this.radio);
    },
    /**支付状态 */
    getpay_status() {
      console.log(this.modification.status_pay);
    },
    /**订单详情 */
    handleDelete(index, row) {
      console.log(index, row);
      this.details = row;
    },
    /**订单请求发送 */
    goods_commit() {
      axios({
        url: `/api/orders/${this.modelgoods.order_id}`,
        method: "put",
        data: {
          is_send: this.value,
          order_pay: this.radio,
          order_price: this.modelgoods.order_price,
          order_number: this.order_number,
          pay_status: this.modification.status_pay,
        },
      }).then((res) => {
        console.log(res);
        // this.modelgoods.pay_status=this.modification.status_pay;
        this.getlist();
        // if(this.value==1){
        //   this.modelgoods.is_send="是"
        // }else{
        //   this.modelgoods.is_send="否"
        // }
        this.modification.is_send = ""; //是否发货
        (this.modification.order_pay = ""), //支付方式
          (this.modification.status_pay = Number), //支付状态
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
        this.modiVisible = false;
      });
    },
    /**监听pagesize事件 */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.users.pagesize = val;
      this.getlist();
    },
    /**当前页码值发生改变 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.users.pagenum = val;
      console.log(this.users.pagenum);
      this.getlist();
    },
    indexMethod(index) {
      return index * 2;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.querytime {
  margin-top: 20px;
}
.el-form-item {
  margin-bottom: 0px;
}
.must {
  color: rgb(243, 56, 56);
}
.title {
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.counnt_box {
  padding: 0 0 0 18px;
  // margin-top: 5px;
  .details {
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    .details_timer {
      margin: 10px 0 10px 0;
    }
    .details_number {
      margin: 10px 0 10px 0;
    }
  }

  .address {
    /**地址 */
    .address_left {
      .block {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .el-cascader {
          width: 75%;
        }
      }
    }
    .address_right {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .el-input {
        width: 75%;
      }
    }
  }
  .updata {
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: 10px;

    .goods_id {
      margin-bottom: 10px;
    }
    .goods_number {
      margin-bottom: 10px;
    }
    .modigoodsbox {
      // .delivergoods{}
      // .goods_pay{}
      .payprice {
        .payprice_left {
          margin: 5px 0 10px 0;
        }
      }
      // .goods_status{

      // }
    }
  }
}
</style>
