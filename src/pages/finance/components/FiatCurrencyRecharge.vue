<!--
 * @Author: your name
 * @Date: 2022-03-28 12:18:40
 * @LastEditTime: 2022-05-19 16:48:37
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\components\FiatCurrencyRecharge.vue
 * 法币充值
-->
<template>
  <div>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="用户名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  v-decorator="['username']"
                  placeholder="请输入用户名"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="充值状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select placeholder="状态" v-decorator="['status']">
                  <a-select-option value="1">等待支付</a-select-option>
                  <a-select-option value="2">充值成功</a-select-option>
                  <a-select-option value="3">充值失败</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="订单号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  v-decorator="['order_no']"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <!-- payLists -->

            <a-col :md="8" :sm="24">
              <a-form-item
                label="支付渠道"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select
                  placeholder="请选择到支付渠道"
                  v-decorator="['pay_company']"
                  :filter-option="filterOption"
                  show-search
                >
                  <a-select-option
                    v-for="item in payLists"
                    :key="item.id"
                    :value="item.name"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="到账方式"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select
                  placeholder="请选择到账方式"
                  v-decorator="['arrive_mode']"
                >
                  <a-select-option value="0">未到账</a-select-option>
                  <a-select-option value="1">三方回调</a-select-option>
                  <a-select-option value="2">手动补单</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item
                label="平台订单号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  v-decorator="['pltf_order_id']"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="充值时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-range-picker
                  v-decorator="['time']"
                  style="width: 100%"
                  :ranges="fastDate"
                  show-time
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="注册来源"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
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
            <a-col :md="8" :sm="24">
              <a-form-item
                label="法币"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select
                  placeholder="请选择"
                  v-decorator="['fiat_currency_id']"
                >
                  <a-select-option
                    :value="item.id"
                    :key="item.id"
                    v-for="item in fiatCurrency"
                    >{{ item.short_name }}</a-select-option
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
    <div>
      <advance-table
        :columns="columns"
        :dataSource="rechargeList"
        :loading="loading"
        :bordered="true"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id"
        @a-cardrefresh="handleCardRefresh"
        @clear="onClear"
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
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <template slot="title">
          <a-row type="flex" justify="center">
            <a-col>
              <span class="left-title">充值数量:</span>
              <span class="right-title">{{ total }}</span>
            </a-col>
            <a-col>
              <span class="left-title">充值总额:</span>
              <span class="right-title">{{ totalRecharge.money }}</span>
            </a-col>
            <a-col>
              <span class="left-title">三方服务费总额:</span>
              <span class="right-title">{{ totalRecharge.third_fee }}</span>
            </a-col>
          </a-row>
        </template>
        <!-- 用户信息 -->
        <template slot="userinfo" slot-scope="{ record }">
          <div style="height: 70px">
            <div>
              注册类型：<a-tag
                :color="record.user.reg_type | formDateUserColor"
              >
                {{ record.user.reg_type | formDateType }}
              </a-tag>
            </div>
            <div>昵称：{{ record.user.nickname }}</div>
            <div>用户名：{{ record.user.username }}</div>
          </div>
        </template>
        <!-- 法币信息 -->
        <template slot="currency" slot-scope="{ record }">
          <div>简称：{{ record.currency && record.currency.short_name }}</div>
          <div>
            汇率：{{ record.currency && record.currency.exchange_rate }}
          </div>
        </template>
        <!-- 三方信息 -->
        <template slot="third_fee" slot-scope="{ record }">
          <div>费率：{{ record.third_rate }}</div>
          <div>手续费：{{ record.third_fee }}</div>
        </template>
        <!-- 充值信息 -->
        <template slot="recharge" slot-scope="{ record }">
          <div>USDT金额：{{ record.usdt_money }}</div>
          <div>充值金额：{{ record.money }}</div>
          <div>充值时间：{{ record.time | formDate }}</div>
        </template>
        <!-- 到账信息 -->
        <template slot="arrive" slot-scope="{ record }">
          <div>到账金额：{{ record.arrive_money }}</div>
          <div>
            到账方式：
            <a-tag :color="record.arrive_mode | formateRechargeTypeColor">
              {{ record.arrive_mode | formateRechargeType }}
            </a-tag>
          </div>
          <div>到账时间：{{ record.arrive_time | formDate }}</div>
        </template>
        <!--  -->
        <span slot="status" slot-scope="{ record }">
          <a-tag :color="record.status | formateRechargeStatusColor">{{
            record.status | formateRechargeStatus
          }}</a-tag>
        </span>
        <span slot="regType" slot-scope="{ record }">
          <a-tag :color="record.user.reg_type | formDateUserColor">
            {{ record.user.reg_type | formDateType }}
          </a-tag>
        </span>
        <div slot="actions" slot-scope="{ record }">
          <a-space size="middle">
            <a @click="handleManual(record)" v-if="record.status === 1"
              >手动补单</a
            >
          </a-space>
        </div>
      </advance-table>
    </div>
  </div>
</template>

<script>
import { financeService } from "@/services";
import { registerTypeList } from "@/utils/util";

import moment from "moment";
import AdvanceTable from "../../../components/table/advance/AdvanceTable.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
import {
  formateRechargeStatus,
  formateRechargeStatusColor,
  formateRechargeType,
  formateRechargeTypeColor,
} from "@/utils/filters";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "支付渠道",
    dataIndex: "pay_company",
    align: "center",
  },
  {
    title: "订单号",
    dataIndex: "order_no",
    align: "center",
  },
  {
    title: "平台订单号",
    dataIndex: "pltf_order_id",
    align: "center",
  },
  {
    title: "用户信息",
    align: "left",
    dataIndex: "user",
    scopedSlots: { customRender: "userinfo" },
    // height: "100",
  },
  // {
  //   title: "用户昵称",
  //   align: "center",
  //   dataIndex: "nickname",
  // },
  // {
  //   title: "用户名",
  //   dataIndex: "user.username",
  //   align: "center",
  // },
  {
    title: "充值信息",
    dataIndex: "money",
    align: "left",
    scopedSlots: { customRender: "recharge" },
    // sorter: true,
  },
  {
    title: "法币信息",
    align: "left",
    dataIndex: "currency",
    scopedSlots: { customRender: "currency" },
  },
  // {
  //   title: "法币简称",
  //   align: "center",
  //   dataIndex: "currency.short_name",
  // },
  // {
  //   title: "法币汇率",
  //   align: "center",
  //   dataIndex: "currency.exchange_rate",
  // },
  {
    title: "三方信息",
    align: "left",
    scopedSlots: { customRender: "third_fee" },
  },
  // {
  //   title: "三方手续费费率",
  //   dataIndex: "third_rate",
  //   align: "center",
  // },
  // {
  //   title: "三方手续费",
  //   dataIndex: "third_fee",
  //   align: "center",
  // },
  {
    title: "到账信息",
    align: "left",
    dataIndex: "arrive_mode",
    scopedSlots: { customRender: "arrive" },
  },

  // {
  //   title: "充值时间",
  //   dataIndex: "time",
  //   scopedSlots: { customRender: "time" },
  //   align: "center",
  // },

  {
    title: "支付方式",
    dataIndex: "pay_type",
    align: "center",
  },
  // {
  //   title: "注册类型",
  //   dataIndex: "reg_type",
  //   align: "center",
  //   scopedSlots: {
  //     customRender: "regType",
  //   },
  // },
  // {
  //   title: "到账时间",
  //   dataIndex: "arrive_time",
  //   scopedSlots: { customRender: "arrive_time" },
  //   align: "center",
  // },
  // {
  //   title: "到账金额",
  //   dataIndex: "arrive_money",
  //   align: "center",
  // },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
    fixed: "right",
    width: 90,
  },
  {
    title: "操作",
    dataIndex: "",
    scopedSlots: { customRender: "actions" },
    align: "center",
    width: 170,
    fixed: "right",
  },
];
export default {
  name: "FiatCurrencyRecharge",
  components: {
    // StandardTable,
    AdvanceTable,
  },
  filters: {
    formateRechargeStatus,
    formateRechargeStatusColor,
    formateRechargeType,
    formateRechargeTypeColor,
    formDateType,
    formDateUserColor,
  },
  data() {
    this.registerTypeList = registerTypeList;
    return {
      moment,
      advanced: false,
      columns: columns,
      rechargeList: [],
      selectedRows: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      spinning: false,
      loading: false,
      money: 0,
      isVisible: false,
      userData: {},
      paginationType: 1,
      timeNum: 300000,
      orderSort: "",
      fieldSort: "",
      third_fee: "",
      payLists: [],
      fiatCurrency: [],
      totalRecharge: {
        money: "",
        third_fee: "",
      },
    };
  },
  activated() {
    this._getRecharge();
    this._getPay();
    this.getFiatCurrencyList();
  },
  // mounted() {
  //   this._getRecharge();
  //   this._getPay();
  //   this.getFiatCurrencyList();
  // },
  computed: {
    // 计算属性获取websocket推送过来放进vuex中的数据
    countNum() {
      return this.$store.state.socket.fiatRecharge;
    },
  },
  // 监听数据变化 再将获取到的数据放入列表第一位
  watch: {
    countNum: function(newVal) {
      if (newVal) {
        this.rechargeList.unshift(newVal);
      } else {
        throw new Error("监听错误");
      }
    },
  },

  methods: {
    _getPay() {
      financeService
        .getPayList({ account_type: [3], country_id: 0 })
        .then((res) => {
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.payLists = data;
          }
        });
    },
    _getRecharge() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        values.time = this.config.timeFormat(values.time);
        financeService
          .getRechargeList({
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
              this.rechargeList = data?.list;
              this.total = data?.total;
              this.totalRecharge.third_fee = data?.third_fee;
              this.totalRecharge.money = data?.money;
              setTimeout(() => {
                this.$forceUpdate();
              }, 500);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getRecharge();
    },
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._getRecharge();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleMenuClick(item) {
      this.timeNum = item.key;
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getRecharge();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getRecharge();
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onChange(pagination, filters, sorter) {
      let { field, order } = sorter;
      console.log("==================>field,order", field, order);
    },
    onSelectChange(item) {
      this.remarksData = item;
    },
    userDetails(item) {
      this.spinning = true;
      console.log("==================>item", item);
    },
    orderStatus() {},
    handleClose() {
      this.isVisible = false;
    },
    handleManual(item) {
      const that = this;
      console.log("==================>item", item);
      this.$confirm({
        title: "手动补单",
        content: () => (
          <div style="color:red;">你确定要进行手动补单操作吗？？</div>
        ),
        onOk() {
          financeService.manualRecharge({ id: item.id }).then((res) => {
            const { code, msg } = res.data;
            if (code !== 200) {
              that.$message.error(msg);
            } else {
              that.$message.success("手动补单成功");
              that._getRecharge();
            }
          });
        },
        class: "test",
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleCardRefresh() {
      this._getRecharge();
    },
    getFiatCurrencyList() {
      financeService.fiatCurrencyList().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.fiatCurrency = data;
      });
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
