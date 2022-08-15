<!--
 * @Author: Fuyi002 2669702453@qq.com
 * @Date: 2022-02-23 14:43:15
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @LastEditTime: 2022-06-09 14:47:56
 * @FilePath: \lottery-admin\src\pages\statistics\MemberList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="日期"
              :labelCol="{ span: 3 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-range-picker
                v-decorator="['date_at']"
                style="width: 100%"
                :ranges="fastDate"
                show-time
              />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
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
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="TOP"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select placeholder="请选择" v-decorator="['top']">
                <a-select-option key="1" :value="10">10</a-select-option>
                <a-select-option key="2" :value="30">30</a-select-option>
                <a-select-option key="3" :value="50">50</a-select-option>
                <a-select-option key="4" :value="100">100</a-select-option>
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
        bordered
        :data-source="memberList"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.user_id"
        :pagination="false"
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            {{ index + 1 }}
          </div>
        </template>
        <!-- 用户信息 -->
        <template slot="userinfo" slot-scope="item">
          <div>
            注册类型：<a-tag
              :color="item.user_info.reg_type | formDateUserColor"
            >
              {{ item.user_info.reg_type | formDateType }}
            </a-tag>
          </div>
          <div>昵称：{{ item.user_info.nickname }}</div>
          <div>用户名：{{ item.user_info.username }}</div>
          <!-- <div>用户提现打码限制：{{ item.withdrawal_limit }}</div> -->
          <!-- <div>注册时间：{{ item.create_time | formDate }}</div> -->
        </template>

        <!-- 上级推荐人信息 -->
        <template slot="superior_user" slot-scope="item">
          <div>上级推荐人ID：{{ item && item.id }}</div>
          <div>上级推荐人昵称：{{ item && item.nickname }}</div>
          <div>上级推荐人用户名：{{ item && item.username }}</div>
        </template>

        <!-- 员工代理信息 -->
        <template slot="agentinfo" slot-scope="item">
          <div>代理昵称：{{ item.user_info.agent_nickname }}</div>
          <div>代理用户名：{{ item.user_info.agent_username }}</div>
        </template>
        <!--  -->
        <template slot="betnum" slot-scope="item">
          <div>当前打码量:{{ item.user_info.wcl_betting }}</div>
          <div>提现打码量:{{ item.user_info.withdrawal_limit }}</div> </template
        ><!-- 用户累计 -->
        <template slot="grandTotal" slot-scope="item">
          <div>用户累计充值金额：{{ item.user_info.cl_recharge }}</div>
          <div>用户累计提现金额：{{ item.user_info.cl_withdrawal }}</div>
          <div>购买总额：{{ item.user_info.cl_buy }}</div>
        </template>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import { statisticsService } from "@/services";
import { registerTypeList } from "@/utils/util";
import { formDateType, formDateUserColor } from "@/utils/filters";
const columns = [
  {
    title: "#",
    align: "center",
    scopedSlots: { customRender: "index" },
  },
  {
    title: "用户信息",
    align: "left",
    scopedSlots: { customRender: "userinfo" },
  },
  {
    title: "上级推荐人信息",
    align: "left",
    dataIndex: "user_info.relation.superior_user",
    scopedSlots: { customRender: "superior_user" },
  },
  {
    title: "员工代理信息",
    align: "left",
    scopedSlots: { customRender: "agentinfo" },
  },
  {
    title: "余额",
    dataIndex: "user_info.balance",
    align: "center",
    customCell: () => {
      return { style: { color: "red" } };
    },
  },
  {
    title: "打码量",
    align: "left",
    // dataIndex: "wcl_betting",
    scopedSlots: { customRender: "betnum" },
  },
  {
    title: "用户累计",
    align: "left",
    scopedSlots: { customRender: "grandTotal" },
  },
  {
    title: "总盈亏",
    align: "center",
    dataIndex: "total_profit_sum",
  },
  {
    title: "交易盈亏",
    align: "center",
    dataIndex: "lottery_profit_sum",
  },
  {
    title: "涨跌盈亏",
    align: "center",
    dataIndex: "risefall_profit_sum",
  },
  {
    title: "挖矿盈利",
    align: "center",
    dataIndex: "mill_profit_sum",
  },
];
export default {
  name: "Member",
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      registerTypeList,
      columns,
      loading: false,
      spinning: false,
      memberList: [],
    };
  },
  created() {
    this._getMemberList();
  },
  methods: {
    _getMemberList() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.date_at = this.config.timeFormat(values.date_at);
        statisticsService
          .getMemberList({ ...values })
          .then((res) => {
            this.loading = false;
            // console.log("==================>res", res);
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.memberList = data;
            console.log("==================>data", data);
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
            // this.spinning = false;
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getMemberList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getMemberList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
