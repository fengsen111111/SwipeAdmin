<template>
  <a-card>
    <a-page-header
      title="用户"
      :sub-title="userType === 1 ? '用户资金详情记录' : '用户积分详情记录'"
      @back="() => this.$router.go(-1)"
    />
    <a-table
      :columns="columns"
      :dataSource="fundingList"
      :loading="loading"
      bordered
      :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record._id.$oid"
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
      <span slot="type" slot-scope="type">
        <template v-if="userType === 1">
          <a-tag :color="type | formDataTypeColor">{{
            type | formDataTypeText
          }}</a-tag>
        </template>
        <template v-else>
          <a-tag :color="type | formDataTypeColor">{{
            type | formDataTypeTextJiFen
          }}</a-tag>
        </template>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { userService } from "@/services";
import {
  formDataTypeText,
  formDataTypeColor,
  formDataTypeTextJiFen,
} from "@/utils/filters";
const columns = [
  {
    title: "创建时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: {
      customRender: "createTime",
    },
  },
  {
    title: "金额",
    dataIndex: "amount",
    align: "center",
    customCell: () => {
      return { style: { color: "red" } };
    },
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
  {
    title: "备注",
    dataIndex: "action",
    align: "center",
  },
];
export default {
  name: "FundingDetails",
  filters: {
    formDataTypeText,
    formDataTypeColor,
    formDataTypeTextJiFen,
  },
  data() {
    return {
      loading: false,
      fundingList: [],
      total: 0,
      pageIndex: 1,

      pageSize: 10,
      columns,
      userType: 1,
    };
  },
  activated() {
    this._getFundingDetails();
    this.userType = Number(this.$route.query.type);
    console.log("==================>userType", this.userType);
  },
  methods: {
    _getFundingDetails() {
      this.loading = true;
      userService
        .getFundingDetails({
          id: +this.$route.query.id,
          page: this.pageIndex,
          limit: this.pageSize,
          type: +this.$route.query.type,
        })
        .then((res) => {
          const { code, data, msg } = res.data;
          this.loading = false;
          if (code !== 200) return this.$message.error(msg);
          this.fundingList = data.list;
          this.total = data.total;
        })
        .catch((err) => {
          this.$message.error(err.message);
          this.loading = false;
        });
    },

    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getFundingDetails();
    },

    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getFundingDetails();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>