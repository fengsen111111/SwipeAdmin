<template>
  <a-card>
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="闪兑" sub-title="闪兑记录列表"
      @back="() => $router.go(-1)" />
    <a-table :columns="columns" :row-key="(record) => record._id" :data-source="flashRecordList" bordered
      :scroll="{ x: 'max-content' }" :pagination="{
        current: pageIndex,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }">
      <span slot="createTime" slot-scope="time">
        {{ time | formDate }}
      </span>
      <div slot="reg_type" slot-scope="item">
        <a-tag :color="item | formDateUserColor">
          {{ item | formDateType }}
        </a-tag>
      </div>
    </a-table>
  </a-card>
</template>

<script>
import { userWalletFlashCashRecord } from "@/services/user";
import { formDateType, formDateUserColor } from "@/utils/filters";
const columns = [
  {
    title: "用户名",
    align: "center",
    dataIndex: "username",
  },
  {
    title: "注册类型",
    align: "center",
    dataIndex: "reg_type",
    scopedSlots: {
      customRender: "reg_type",
    },
  },

  {
    title: "卖出币名称",
    align: "center",
    dataIndex: "source_symbol",
  },

  {
    title: "买入币名称",
    align: "center",
    dataIndex: "from_symbol",
  },

  {
    title: "买入数量",
    align: "center",
    dataIndex: "convert_number",
  },
  {
    title: "卖出数量",
    align: "center",
    dataIndex: "sel_number",
  },
  {
    title: "币价",
    align: "center",
    dataIndex: "currency_price",
  },
  {
    title: "操作前",
    align: "center",
    dataIndex: "before",
  },
  {
    title: "操作后",
    align: "center",
    dataIndex: "after",
  },
  {
    title: "记录时间",
    align: "center",
    dataIndex: "created_at",
    scopedSlots: {
      customRender: "createTime",
    },
  },
];
export default {
  name: "FlashExchangeRecord",
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    return {
      columns,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      flashRecordList: [],
    };
  },
  activated() {
    if (this.$route.query.id) {
      this._userWalletFlashCashRecord();
    } else {
      this.$message.error("查无此用户");
    }
  },
  methods: {
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._userWalletFlashCashRecord();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._userWalletFlashCashRecord();
    },
    _userWalletFlashCashRecord() {
      userWalletFlashCashRecord({
        user_id: this.$route.query.id,
        page: this.pageIndex,
        limit: this.pageSize,
      }).then((res) => {
        const { msg, data, code } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.flashRecordList = data.list;
        this.total = data.total;
        console.log("==================>data", data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
