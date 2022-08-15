<template>
  <a-card>
    <!-- 抬头 -->
    <a-page-header title="佣金详情" @back="() => this.$router.go(-1)" />
    <a-table :columns="columns" :dataSource="commissionList" :loading="loading" bordered :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record.id" :pagination="{
        current: pageIndex,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }">
      <!-- 时间 -->
      <span slot="createTime" slot-scope="time">
        {{ time | formDate }}
      </span>
      <!-- 类型 -->
      <span slot="type" slot-scope="type">
        <template>
          <a-tag :color="type | formDataTypeColor">{{
              type | formDataTypeText
          }}</a-tag>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>

import { userService } from "@/services";
import { formDataTypeColor } from "@/utils/filters";
const columns = [
  {
    title: "创建时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: { customRender: "createTime" },
  },
  {
    title: "金额",
    dataIndex: "amount",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "type",
    align: "center",
    scopedSlots: {
      customRender: "type",
    },
  },
  {
    title: "操作前余额",
    dataIndex: "before",
    align: "center",
  },
  {
    title: "操作后余额",
    dataIndex: "after",
    align: "center",
  },
  // {
  //   title: "修改时间",
  //   dataIndex: "update_time",
  //   align: "center",
  //   scopedSlots: { customRender: "createTime" },
  // },
  // {
  //   title: "删除时间",
  //   dataIndex: "delete_time",
  //   align: "center",
  //   scopedSlots: { customRender: "createTime" },
  // },
  {
    title: "备注",
    dataIndex: "action",
    align: "center",
  },
]
export default {
  name: "CommissionDetails",
  filters: {
    formDataTypeText(val) {
      switch (val) {
        case 1:
          return "后台上分";
        case 2:
          return "后台下分";
        case 3:
          return "后台赠送礼金";
        case 4:
          return "支付保证金";
        case 5:
          return "法币充值金额";
        case 6:
          return "法币提现金额";
        case 7:
          return "余额支付";
        case 8:
          return "赠送礼金";
        case 9:
          return "USDT充值金额";
        case 10:
          return "USDT提现金额";
        case 11:
          return "USDT提现金额驳回";
        case 12:
          return "法币提现金额驳回";
        default:
          return;
      }
    },
    formDataTypeColor,
  },
  data() {
    return {
      columns,
      commissionList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    };
  },
  activated() {
    this._getCommissionList();
  },
  methods: {
    // 列表
    _getCommissionList() {
      this.loading = true;
      userService
        .getCommissionList({
          id: this.$route.query.id,
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          console.log("数据", res.data);
          this.loading = false;
          const { code, data, msg } = res.data;
          if (code !== 200) {
            return this.$message.error(msg);
          } else {
            this.commissionList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
          this.loading = false;
        });

    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getCommissionList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getCommissionList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
