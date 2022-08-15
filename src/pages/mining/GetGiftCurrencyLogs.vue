<template>
  <a-card>
    <a-page-header
      title="购买记录列表"
      sub-title="赠送平台币记录"
      @back="() => this.$router.go(-1)"
    />

    <a-table
      :columns="columns"
      :dataSource="GiftCurrencyList"
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
      <template slot="created_at" slot-scope="created_at">
        <div>{{ created_at | formDate }}</div>
      </template>
      <template slot="updated_at" slot-scope="updated_at">
        <div>{{ updated_at | formDate }}</div>
      </template>
      <template slot="type" slot-scope="item">
        <!-- <div>{{ item.type }}</div> -->
        <a-tag :color="item.type | typeColor">{{ item.type | typeText }}</a-tag>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { miningService } from "@/services";
const columns = [
  {
    title: "操作类型",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "申购或追加金额",
    align: "center",
    dataIndex: "amount",
  },
  {
    title: "申购或追加比例",
    align: "center",
    dataIndex: "rate",
  },
  {
    title: "操作币数量",
    align: "center",
    dataIndex: "gift_number",
  },
  {
    title: "操作前锁定数量",
    align: "center",
    dataIndex: "locked_before",
  },
  {
    title: "操作后锁定数量",
    align: "center",
    dataIndex: "locked_after",
  },
  {
    title: "操作前可用数量",
    align: "center",
    dataIndex: "wallet_before",
  },
  {
    title: "操作后可用数量",
    align: "center",
    dataIndex: "wallet_after",
  },
  {
    title: "记录时间",
    align: "center",
    dataIndex: "created_at",
    scopedSlots: { customRender: "created_at" },
  },
];
export default {
  name: "GetGiftCurrencyLogs",
  filters: {
    typeText(val) {
      switch (Number(val)) {
        case 1:
          return "申购";
        case 2:
          return "追加";
        case 3:
          return "解锁";
        default:
          break;
      }
    },
    typeColor(val) {
      switch (Number(val)) {
        case 1:
          return "#DB2777";
        case 2:
          return "#2563EB";
        case 3:
          return "#059669";
        default:
          break;
      }
    },
  },
  data() {
    return {
      columns,
      GiftCurrencyList: [],
      id: "",
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this._getGiftCurrencyLogs();
  },
  methods: {
    // 获取列表函数
    _getGiftCurrencyLogs() {
      this.loading = true;
      miningService
        .getGiftList({
          id: this.id,
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          this.loading = false;
          if (code !== 200) return this.$message.error(msg);
          this.GiftCurrencyList = data.list;
          this.total = data.total;
        })
        .catch((err) => {
          this.$message.error(err.message);
          this.loading = false;
        });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getGiftCurrencyLogs();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getGiftCurrencyLogs();
    },
  },
};
</script>

<style></style>
