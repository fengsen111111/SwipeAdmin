<!--
 * @Author: your name
 * @Date: 2022-04-27 17:47:57
 * @LastEditTime: 2022-05-23 12:55:48
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\BetnumRecord.vue
-->
<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="7" :sm="24">
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
          <a-col :md="7" :sm="24">
            <a-form-item
              label="类型"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select v-decorator="['type']" placeholder="请选择类型">
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in typelist"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <a-form-item>
              <span style="float: right">
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset"
                  >重置</a-button
                >
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="BetnumRecordList"
        bordered
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
        <template slot="userinfo" slot-scope="item">
          <div>用户ID：{{ item.user_id }}</div>
          <div>用户名：{{ item.username }}</div>
        </template>
        <template slot="betnum" slot-scope="item">
          <div>变动前打码量：{{ item.before_betnum }}</div>
          <div>变动打码量：{{ item.betnum }}</div>
          <div>变动后打码量：{{ item.after_betnum }}</div>
        </template>
        <template slot="time" slot-scope="create_time">
          <div>{{ create_time | formDate }}</div>
        </template>
        <template slot="withdrawal" slot-scope="item">
          <div>变动前取款所需：{{ item.before_withdrawal_limit }}</div>
          <div>变动取款所需：{{ item.withdrawal_limit }}</div>
          <div>变动后取款所需：{{ item.after_withdrawal_limit }}</div>
        </template>
        <template slot="type" slot-scope="type">
          <a-tag :color="type | typeColor">
            {{ type | typeText }}
          </a-tag>
        </template>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import { financeService } from "@/services";
import { typelist } from "@/utils/util";
const columns = [
  {
    title: "用户信息",
    // dataIndex: "username",
    scopedSlots: { customRender: "userinfo" },
    align: "left",
  },
  {
    title: "打码量",
    scopedSlots: { customRender: "betnum" },
    align: "left",
  },
  {
    title: "变动时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: { customRender: "time" },
  },
  {
    title: "取款所需",
    align: "left",
    scopedSlots: { customRender: "withdrawal" },
  },
  {
    title: "余额",
    align: "center",
    dataIndex: "balance",
    customCell: () => {
      return { style: { color: "red" } };
    },
  },
  {
    title: "备注",
    align: "center",
    dataIndex: "remark",
  },
  {
    title: "类型",
    align: "center",
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
  },
];
export default {
  name: "BetnumRecord",
  data() {
    return {
      typelist,
      spinning: false,
      columns: columns,
      loading: false,
      BetnumRecordList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
    };
  },
  filters: {
    typeColor(val) {
      switch (Number(val)) {
        case 1:
          return "#142F43";
        case 2:
          return "#22C55E";
        case 3:
          return "#FFAB4C";
        case 4:
          return "#FF5F7E";
        case 5:
          return "#f5d0fe";
        case 6:
          return "#78350f";
        case 7:
          return "#EF4444";
        default:
          break;
      }
    },
    typeText(val) {
      switch (Number(val)) {
        case 1:
          return "充值";
        case 2:
          return "上分";
        case 3:
          return "投注彩票";
        case 4:
          return "投注涨跌";
        case 5:
          return "购买矿机";
        case 6:
          return "提现";
        case 7:
          return "提款失败退回";
        default:
          break;
      }
    },
  },
  activated() {
    this.getBetnumRecordList();
  },
  methods: {
    // 重置
    handleReset() {
      this.pageIndex = 1;
      this.$refs.searchRef.form.resetFields();
      this.getBetnumRecordList();
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this.getBetnumRecordList();
    },
    // 获取列表
    getBetnumRecordList() {
      this.loading = true;
      this.form.validateFields().then((values) => {
        financeService
          .betnumRecord({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.BetnumRecordList = data.list;
            this.total = data.total;
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
          })
          .finally(() => (this.loading = false));
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getBetnumRecordList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getBetnumRecordList();
    },
  },
};
</script>

<style></style>
