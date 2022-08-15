<template>
  <a-spin :spinning="spinning">
    <a-card>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <div :class="advanced ? null : 'fold'">
            <a-row>
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
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="用户昵称"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    placeholder="请输入"
                    allowClear
                    v-decorator="['nickname']"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item
                  label="注册来源"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="请选择" v-decorator="['reg_type']">
                    <a-select-option
                      :value="item.id"
                      :key="item.id"
                      v-for="item in registerTypeList"
                      >{{ item.name }}</a-select-option
                    >
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
        :dataSource="purchaseList"
        :loading="loading"
        bordered
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id"
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
        <span slot="createTime" slot-scope="time">
          {{ time | formDate }}
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleUpdate(item)">
              <a-icon type="edit"></a-icon>
              编辑
            </a>
            <a-dropdown>
              <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="banUser(item)">
                    {{ item.status === 0 ? "启用" : "禁用" }}
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleFunding(item.id)">资金详情</a>
                </a-menu-item>

                <a-menu-item>
                  <a @click="handleIntegral(item.id)">积分详情</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
            status === 1 ? "启用" : "禁用"
          }}</a-tag>
        </span>
        <span slot="regType" slot-scope="item">
          <a-tag :color="item | formDateUserColor">{{
            item | formDateType
          }}</a-tag>
        </span>
        <span slot="isRecharge" slot-scope="item">
          <a-tag :color="item === 1 ? 'green' : 'red'">{{
            item === 1 ? "是" : "否"
          }}</a-tag>
        </span>
        <span slot="isLogin" slot-scope="item">
          <a-tag :color="item === 1 ? 'green' : 'red'">{{
            item === 1 ? "是" : "否"
          }}</a-tag>
        </span>
        <span slot="isWithdrawal" slot-scope="item">
          <a-tag :color="item === 1 ? 'green' : 'red'">{{
            item === 1 ? "是" : "否"
          }}</a-tag>
        </span>
        <span slot="isBuy" slot-scope="item">
          <a-tag :color="item === 1 ? 'green' : 'red'">{{
            item === 1 ? "是" : "否"
          }}</a-tag>
        </span>
        <template slot="inCode" slot-scope="text">
          <a-space size="small">
            <span>{{ text }}</span>
            <a>
              <a-icon type="copy" v-copy="text" theme="twoTone" />
            </a>
          </a-space>
        </template>
      </a-table>
      <!-- ======================Form======================= -->
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import { registerTypeList } from "@/utils/util";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "注册类型",
    dataIndex: "reg_type",
    align: "center",
  },
  {
    title: "累计购买总额",
    dataIndex: "cl_buy",
    align: "center",
  },
  {
    title: "订单总数",
    dataIndex: "order_total",
    align: "center",
  },
  {
    title: "已支付订单总数",
    dataIndex: "pay_total",
    align: "center",
  },
  {
    title: "未支付订单总数",
    dataIndex: "not_pay_total",
    align: "center",
  },
  {
    title: "关闭订单总数",
    dataIndex: "closed_total",
    align: "center",
  },
  {
    title: "成功参与商品总数",
    dataIndex: "pay_goods_total",
    align: "center",
  },
  {
    title: "中奖商品总数",
    dataIndex: "lucky_dog_toatl",
    align: "center",
  },
];
export default {
  name: "Purchase",
  data() {
    this.registerTypeList = registerTypeList;
    return {
      columns,
      spinning: false,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      purchaseList: [],
      total: 0,

      advanced: false,
    };
  },
  activated() {
    this._getPurchaseList();
  },
  methods: {
    _getPurchaseList() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        userService
          .getPurchaseList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            const { code, data, msg } = res.data;
            this.loading = false;
            if (code !== 200) return this.$message.error(msg);
            this.purchaseList = data.list;
            this.total = data.total;
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },

    handleSearch() {
      this.pageIndex = 1;
      this._getPurchaseList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getPurchaseList();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getPurchaseList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getPurchaseList();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
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
