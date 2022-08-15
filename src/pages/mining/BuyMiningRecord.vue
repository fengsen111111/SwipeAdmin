<!--
 * @Author: your name
 * @Date: 2022-03-01 19:10:13
 * @LastEditTime: 2022-06-20 15:18:34
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\mining\BuyMiningRecord.vue
-->
<template>
  <a-card>
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="6" :sm="24">
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
        <a-col :md="6" :sm="24">
          <a-form-item
            label="用户昵称"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['nickname']"
              allowClear
              placeholder="请输入用户昵称"
            />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item
            label="订单号"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['order_no']"
              allowClear
              placeholder="请输入订单号"
            />
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
      :data-source="buyRecordList"
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
      <!-- 用户信息 -->
      <template slot="userinfo" slot-scope="item">
        <div>
          注册类型：<a-tag :color="item.reg_type | formDateUserColor">
            {{ item.reg_type | formDateType }}
          </a-tag>
        </div>
        <div>昵称：{{ item.nickname }}</div>
        <div>用户名：{{ item.username }}</div>
      </template>
      <!-- 员工代理信息 -->
      <template slot="agentinfo" slot-scope="item">
        <div>代理昵称：{{ item.agent_nickname }}</div>
        <div>代理用户名：{{ item.agent_username }}</div>
      </template>
      <!-- 收益类型 -->
      <template slot="income_type" slot-scope="item">
        <a-tag :color="item.income_type == 1 ? '#A855F7' : '#F97316'">{{
          item.income_type == 1 ? "按比例" : "按等级"
        }}</a-tag>
        <div v-if="item.income_type == 2">
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
          <div>购买区间：{{ item.configure.min }}~{{ item.configure.max }}</div>
        </div>
        <div v-else>
          <div>日收益率：{{ item.project.daily_return }}</div>
        </div>
      </template>
      <!-- 购买信息 -->
      <template slot="Buying" slot-scope="item">
        <div>购买项目名称：{{ item.project.name }}</div>
        <div>
          购买金额：<span style="color:red">{{ item.amount }}</span>
        </div>
        <div>
          收入方式：<a-tag :color="item.income_way == 0 ? 'blue' : 'cyan'">{{
            item.income_way == 0 ? "每日结息到期还本" : "到期还本还息"
          }}</a-tag>
        </div>
        <div>购买时间：{{ item.buy_time | formDate }}</div>
      </template>
      <!--  -->
      <template slot="daily_return" slot-scope="item">
        <div>{{ item.income_type == 1 ? item.project.daily_return : "" }}</div>
      </template>
      <!--  -->

      <span slot="original" slot-scope="is_return_original">
        <a-tag :color="is_return_original == 0 ? 'red' : 'green'">
          {{ is_return_original == 0 ? "否" : "是" }}
        </a-tag>
      </span>
      <span slot="status" slot-scope="status">
        <a-tag :color="status === 0 ? 'red' : 'green'">
          {{ status == 0 ? "分红中" : "已返本" }}
        </a-tag>
      </span>
      <!-- <template slot="income_way" slot-scope="income_way">
        <a-tag :color="income_way == 0 ? 'blue' : 'cyan'">{{
          income_way == 0 ? "每日结息到期还本" : "到期还本还息"
        }}</a-tag>
      </template> -->
      <template slot="action" slot-scope="item">
        <a-space size="large">
          <a
            v-if="item.project.income_way == 0 && item.status != 1"
            @click="handleSettlement(item, 1)"
            >一键返息</a
          >
          <a
            v-if="item.project.income_way == 0 && item.status != 1"
            @click="handleSettlement(item, 2)"
            >一键返本返息</a
          >
          <a
            v-if="item.project.income_way == 1 && item.status != 1"
            @click="handleSettlement(item, 2)"
            >一键返本返息</a
          >

          <a @click="orderDetails(item)">订单详情</a>
          <a v-if="item.gift_coins" @click="handleGiftList(item.id)"
            >赠送平台币记录</a
          >
        </a-space>
      </template>
    </a-table>
    <BuyDetails
      ref="buyDetailsRef"
      :isVisible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :buyId="buyId"
    ></BuyDetails>
  </a-card>
</template>

<script>
import { formDateType, formDateUserColor } from "@/utils/filters";
import { miningService } from "@/services";
import BuyDetails from "./components/BuyDetails.vue";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "订单号",
    align: "center",
    dataIndex: "order_no",
  },

  {
    title: "用户信息",
    align: "left",
    scopedSlots: { customRender: "userinfo" },
  },
  {
    title: "员工代理信息",
    align: "left",
    scopedSlots: { customRender: "agentinfo" },
  },
  {
    title: "收益类型",
    align: "center",
    scopedSlots: { customRender: "income_type" },
  },
  {
    title: "购买信息",
    align: "left",
    scopedSlots: { customRender: "Buying" },
  },
  {
    title: "总分红数",
    align: "center",
    dataIndex: "total_dividend_num",
  },
  {
    title: "已分红数",
    align: "center",
    dataIndex: "paid_dividend_num",
  },
  {
    title: "是否返本",
    align: "center",
    fixed: "right",
    dataIndex: "is_return_original",
    scopedSlots: { customRender: "original" },
  },
  {
    title: "状态",
    align: "center",
    fixed: "right",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },

  {
    title: "操作",
    align: "center",
    fixed: "right",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "BuyMiningRecord",
  components: { BuyDetails },
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      buyRecordList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      //
      form: this.$form.createForm(this),
      //
      visible: false, // 对话框显示隐藏
      buyId: "",
    };
  },
  activated() {
    this.getBuyRecordList();
  },
  methods: {
    // 赠送平台币记录
    handleGiftList(id) {
      console.log("==================>赠送平台币记录");
      this.$router.push({
        path: `/buyMining/getGiftCurrencyLogs?id=${id}`,
      });
    },
    // 结算事件
    handleSettlement(item, type) {
      this.loading = true;
      miningService
        .settlement({
          id: item.id,
          income_way: item.project.income_way,
          type,
        })
        .then((res) => {
          // console.log("==================>res", res);
          this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success(msg);
          this.getBuyRecordList();
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        })
        .finally(() => (this.loading = false));
    },
    //   对话框取消按钮事件
    handleCancel() {
      this.visible = false;
    },
    //   对话框确认按钮事件
    handleOk() {},
    //   点击查看订单详情按钮
    orderDetails(item) {
      //   console.log("==================>item", item);
      this.visible = true;
      this.orderId = item.id;
      this.$refs.buyDetailsRef.buyId = item.id;
      this.$refs.buyDetailsRef.getOrderDetail();
    },
    // 查询按钮事件
    handleSearch() {
      this.pageIndex = 1;
      //   this._getRecharge();
      this.getBuyRecordList();
    },
    // 重置按钮事件
    handleReset() {
      this.pageIndex = 1;
      this.$refs.searchRef.form.resetFields();
      this.getBuyRecordList();
    },
    // 获取虚拟货币列表
    getBuyRecordList() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        // console.log("==================>values", values);
        miningService
          .miningBuyRecord({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            // console.log("==================>res.data", res.data);
            if (code !== 200) return this.$message.error(msg);
            this.buyRecordList = data.list;
            this.total = data.total;
            setTimeout(() => {
              this.$forceUpdate();
            }, 500);
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getBuyRecordList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getBuyRecordList();
    },
  },
};
</script>

<style></style>
