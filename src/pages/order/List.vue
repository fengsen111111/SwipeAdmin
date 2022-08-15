<template>
  <a-card>
    <!-- 搜索 -->
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <!-- 用户名 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="用户名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['username']"
                  allowClear
                  placeholder="请输入用户名"
                />
              </a-form-item>
            </a-col>
            <!-- 员工代理手机号 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="员工代理手机号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['agent_phone']"
                  allowClear
                  placeholder="请输入员工代理手机号"
                />
              </a-form-item>
            </a-col>
            <!-- 员工代理昵称 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="员工代理昵称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['agent_nickname']"
                  allowClear
                  placeholder="请输入员工代理昵称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 二排 -->
          <a-row v-show="advanced">
            <!-- 状态 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="状态" v-decorator="['order_status']">
                  <a-select-option value="1"> 待发货</a-select-option>
                  <a-select-option value="2"> 已发货</a-select-option>
                  <a-select-option value="3"> 已完成</a-select-option>
                  <a-select-option value="4"> 已失效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset"
            >重置</a-button
          >
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :data-source="orderList"
      :rowKey="(record) => record.id"
      :scroll="{ x: 'max-content' }"
      bordered
      :loading="loading"
      :pagination="{
        current: pageIndex,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
      <!-- 操作 -->
      <template slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleDetails(item)"> 详情</a>

          <a-dropdown v-if="item.status !== 3">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              操作 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <!-- 返本 -->
              <a-menu-item v-if="item.is_return_original_all !== 1">
                <a-popconfirm
                  :title="`你确定需要返本吗?`"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleOneClickReturnOfOrder(item)"
                >
                  <a>返本</a>
                </a-popconfirm>
              </a-menu-item>
              <!-- 返佣 -->
              <a-menu-item v-if="item.is_return_commission_all !== 1">
                <a-popconfirm
                  :title="`你确定需要返佣吗?`"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleOneClickRebateForOrders(item)"
                >
                  <a>返佣</a>
                </a-popconfirm>
              </a-menu-item>
              <!-- 确认收货 -->
              <a-menu-item>
                <a-popconfirm
                  :title="`是否确定收货?`"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleOneClickToConfirmReceipt(item)"
                >
                  <a>确定收货</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!--  -->
        </a-space>
      </template>
      <!-- 是否返本 -->
      <template slot="is_return_original_all" slot-scope="item">
        <div>
          <a-tag :color="item === 1 ? 'green' : 'red'"
            >{{ item === 1 ? "是" : "否" }}
          </a-tag>
        </div>
      </template>
      <!-- 是否返佣 -->
      <template slot="is_return_commission_all" slot-scope="item">
        <div>
          <a-tag :color="item === 1 ? 'green' : 'red'"
            >{{ item === 1 ? "是" : "否" }}
          </a-tag>
        </div>
      </template>
      <!-- 状态 -->
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 1" color="red">待发货</a-tag>
        <a-tag v-else-if="type === 2" color="Cyan">已发货</a-tag>
        <a-tag v-else-if="type === 3" color="green">已完成</a-tag>
        <a-tag v-else-if="type === 4" color="Black">已失效</a-tag>
      </span>
      <!-- 时间 -->
      <span slot="create_time" slot-scope="create_time">
        {{ create_time | formDate }}
      </span>
      <!-- 图片 -->
      <div
        slot="img"
        slot-scope="item"
        style="display: flex; justify-content: center"
      >
        <div style="width: 40px; height: 40px">
          <img
            style="width: 100%; height: 100%"
            alt=""
            srcset=""
            :src="baseUrl + '/' + item"
          />
        </div>
      </div>
    </a-table>
    <!-- 订单详情 -->
    <order-list-form
      ref="orderListRrf"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @updateGoods="_getOrderDetails"
      v-if="openVisible"
      
    />
   
  </a-card>
</template>

<script>
import { orderService } from "@/services";
import OrderListForm from "./components/OrderListForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "订单号",
    dataIndex: "order_no",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "员工代理手机号",
    dataIndex: "agent_phone",
    align: "center",
  },
  {
    title: "员工代理昵称",
    dataIndex: "agent_nickname",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "是否全部返本",
    dataIndex: "is_return_original_all",
    align: "center",
    scopedSlots: { customRender: "is_return_original_all" },
  },
  {
    title: "是否全部返佣",
    dataIndex: "is_return_commission_all",
    align: "center",
    scopedSlots: { customRender: "is_return_commission_all" },
  },
  {
    title: "佣金",
    dataIndex: "commission",
    align: "center",
  },
  {
    title: "订单总金额",
    dataIndex: "total_price",
    align: "center",
  },

  {
    title: "支付时间",
    dataIndex: "pay_time",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "派单时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },

  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "照片",
    dataIndex: "avatar",
    align: "center",
    scopedSlots: { customRender: "img" },
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  components: { OrderListForm },
  name: "List",
  data() {
    return {
      columns,
      orderList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      confirmLoading: false,
      visible: false,
      modules: [],
      selectedRowKeys: [],
      baseUrl: "",
      advanced: false,
      form: this.$form.createForm(this),
      openVisible:true,
    };
  },
  created() {
    this._getOrderList();
  },
  methods: {
    // 订单列表
    _getOrderList() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        orderService
          .getOrderList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;

            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.orderList = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 订单详情
    _getOrderDetails(id) {
      orderService
        .getOrderDetails({
          id: id,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.modules = data.list.goods;
            this.modules.id = id;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 详情
    handleDetails(item) {
      this.openVisible = true
      let that = this;
      this.loading = true
      that._getOrderDetails(item.id);
      setTimeout(function() {
        
        that.loading = false
        that.visible = true;
      },1000);
    },
    // 取消
    handleCancel() {
      this.visible = false
      this.openVisible = false;
    },

    //订单一键返本
    handleOneClickReturnOfOrder(item) {
      orderService
        .oneClickReturnOfOrder({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("一键返本成功");
            this._getOrderList();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //订单一键返佣
    handleOneClickRebateForOrders(item) {
      orderService
        .oneClickRebateForOrders({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("一键返佣成功");
            this._getOrderList();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //订单一键确认收货
    handleOneClickToConfirmReceipt(item) {
      orderService
        .oneClickToConfirmReceipt({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("一键确认收货成功");
            this._getOrderList();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 搜索框展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this._getOrderList();
    },
    // 重置
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getOrderList();
    },
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getOrderList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getOrderList();
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
