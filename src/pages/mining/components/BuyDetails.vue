<!--
 * @Author: your name
 * @Date: 2022-03-02 12:18:54
 * @LastEditTime: 2022-05-25 21:05:21
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\mining\components\BuyDetails.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    title="订单详情"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
    width="1300px"
  >
    <a-card>
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="orderDetailList"
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
        <span slot="dividends" slot-scope="item">
          <a-tag :color="item.is_dividends_paid | dividendsTypeColor">
            {{
              item.is_dividends_paid == 0
                ? "未分红"
                : item.type == 1
                ? "已返本"
                : "已分红"
            }}
          </a-tag>
        </span>
        <span slot="dividend_time" slot-scope="dividend_time">
          {{ dividend_time | formDate }}
        </span>
        <span slot="type" slot-scope="type">
          <a-tag :color="type == 0 ? 'blue' : 'cyan'">
            {{ type == 0 ? "分红记录" : "返本记录" }}
          </a-tag>
        </span>
        <!-- 收益类型 -->
        <template slot="income_type" slot-scope="item" v-if="item.type != 1">
          <a-tag
            :color="item.project.income_type == 1 ? '#A855F7' : '#F97316'"
            >{{ item.project.income_type == 1 ? "按比例" : "按等级" }}</a-tag
          >
          <div v-if="item.project.income_type == 2">
            <div>等级名称：{{ item.configure.level }}</div>
            <div>
              收益方式：{{
                item.configure.model == 1 ? "按比例收益" : "固定收益"
              }}
            </div>
            <div>
              收益：{{
                item.configure.model == 1
                  ? `${item.configure.income}`
                  : item.configure.income
              }}
            </div>
            <div>
              购买区间：{{ item.configure.min }}~{{ item.configure.max }}
            </div>
          </div>
          <div v-else>
            <div>日收益率：{{ item.project.daily_return }}</div>
          </div>
        </template>
      </a-table>
    </a-card>
  </a-modal>
</template>

<script>
import { miningService } from "@/services";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "购买金额",
    align: "center",
    dataIndex: "total_amount",
  },
  {
    title: "分红金额",
    align: "center",
    dataIndex: "dividend_amount",
  },
  // {
  //   title: "分红比例",
  //   align: "center",
  //   dataIndex: "dividend_rate",
  // },
  {
    title: "收益类型",
    align: "center",
    scopedSlots: { customRender: "income_type" },
  },
  {
    title: "是否已分红",
    align: "center",

    scopedSlots: { customRender: "dividends" },
  },
  {
    title: "分红时间",
    align: "center",
    dataIndex: "dividend_time",
    scopedSlots: { customRender: "dividend_time" },
  },
  {
    title: "类型",
    align: "center",
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "用户购买订单号",
    align: "center",
    dataIndex: "order_no",
  },
];
export default {
  name: "BuyDetails",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    dividendsTypeColor(val) {
      switch (Number(val)) {
        case 0:
          return "#EF4444";
        case 1:
          return "#22C55E";
        case 2:
          return "#FFAB4C";
        default:
          break;
      }
    },
  },
  data() {
    return {
      columns: columns,
      loading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      orderDetailList: [],
      buyId: "",
    };
  },
  create() {},
  methods: {
    //   获取订单详情
    getOrderDetail() {
      this.loading = true;
      miningService
        .dividendDetails({
          page: this.pageIndex,
          limit: this.pageSize,
          id: this.buyId,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.orderDetailList = data.list;
          this.total = data.total;
        });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getOrderDetail();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getOrderDetail();
    },
  },
};
</script>

<style></style>
