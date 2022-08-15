<!--
 * @Author: your name
 * @Date: 2022-03-28 15:10:41
 * @LastEditTime: 2022-05-24 16:14:21
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\components\FiatCurrencyWithdraw.vue
 * 法币提现
-->

<template>
  <div>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="订单号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  allowClear
                  v-decorator="['order_no']"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="用户名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  v-decorator="['username']"
                  placeholder="请输入用户名"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="提现状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select placeholder="状态" v-decorator="['status']">
                  <a-select-option value="0">待审核</a-select-option>
                  <a-select-option value="1">已成功</a-select-option>
                  <a-select-option value="2">审核未通过</a-select-option>
                  <a-select-option value="3">进行中</a-select-option>
                  <a-select-option value="4">失败</a-select-option>
                  <a-select-option value="5">锁定中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="平台订单号"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 17, offset: 0 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入平台订单号"
                  v-decorator="['pltf_order_no']"
                  allowClear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
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
                label="出款方式"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select
                  placeholder="请选择出款方式"
                  v-decorator="['arrive_mode']"
                >
                  <a-select-option value="0">未到账</a-select-option>
                  <a-select-option value="1">三方出款</a-select-option>
                  <a-select-option value="2">手动出款</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="审核时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-range-picker
                  v-decorator="['approval_time']"
                  style="width: 100%"
                  :ranges="fastDate"
                  show-time
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="提现时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-range-picker
                  v-decorator="['create_time']"
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
        :dataSource="withdrawList"
        :loading="loading"
        :bordered="true"
        @a-cardrefresh="handleCardRefresh"
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
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <!-- <template slot="title">
            <a-space class="operator" size="large">
              <a-dropdown>
                <a-menu @click="handleMenuClick" slot="overlay">
                  <a-menu-item key="audit">审核</a-menu-item>
                </a-menu>
                <a-button type="primary"
                  >批量操作 <a-icon type="down" />
                </a-button>
              </a-dropdown>
            </a-space>
          </template> -->
        <template slot="title">
          <a-row type="flex">
            <a-col>
              <span class="left-title">提现数量:</span
              ><span class="right-title">{{ total }}</span>
            </a-col>
            <a-col>
              <span class="left-title">提现总额:</span
              ><span class="right-title">{{ totalWithdraw.money }}</span>
            </a-col>
            <a-col>
              <span class="left-title">三方服务费总额:</span
              ><span class="right-title">{{ totalWithdraw.third_fee }}</span>
            </a-col>
            <a-col>
              <span class="left-title">平台手续费:</span
              ><span class="right-title">{{ totalWithdraw.service_fee }}</span>
            </a-col>
          </a-row>
        </template>
        <!-- 用户信息 -->
        <template slot="userinfo" slot-scope="{ record }">
          <div>
            注册类型：<a-tag
              :color="record.user.reg_type | formDateUserColor"
              >{{ record.user.reg_type | formDateType }}</a-tag
            >
          </div>
          <div>昵称：{{ record.user.nickname }}</div>
          <div>用户名：{{ record.user.username }}</div>
        </template>
        <!-- 提现信息 -->
        <template slot="withdraw" slot-scope="{ record }">
          <div style="height: 110px">
            <div>USDT金额：{{ record.usdt_money }}</div>
            <div>提现金额：{{ record.money }}</div>
            <div>手续费：{{ record.service_charge }}</div>
            <div>到账金额：{{ record.payment }}</div>
            <div>申请时间：{{ record.create_time | formDate }}</div>
          </div>
        </template>
        <!-- 三方信息 -->
        <template slot="third_fee" slot-scope="{ record }">
          <div>费率：{{ record.third_rate }}</div>
          <div>手续费：{{ record.third_fee }}</div>
        </template>
        <!-- 收款人信息 -->
        <template slot="beneficiary" slot-scope="{ record }">
          <div>收款人：{{ record.account_holder }}</div>
          <div>IFSC CODE：{{ record.ifsc_code }}</div>
          <div>持卡人电话：{{ record.phone }}</div>
          <div>银行卡号：{{ record.bank_number }}</div>
        </template>
        <!-- 法币信息 -->
        <template slot="currency" slot-scope="{ record }">
          <div>简称：{{ record.currency && record.currency.short_name }}</div>
          <div>
            汇率：{{ record.currency && record.currency.exchange_rate }}
          </div>
        </template>

        <span slot="payStatus" slot-scope="{ record }">
          <a-tag :color="record.pay_status | formateWithdrawTypeColor">{{
            record.pay_status | formateWithdrawType
          }}</a-tag>
        </span>
        <span slot="appRoTime" slot-scope="{ record }">
          {{ record.approval_time | formDate }}
        </span>
        <span slot="createTime" slot-scope="{ record }">
          {{ record.create_time | formDate }}
        </span>
        <span slot="loanTime" slot-scope="{ record }">
          {{ record.loan_time | formDate }}
        </span>
        <span slot="regType" slot-scope="{ record }">
          <a-tag :color="record.user.reg_type | formDateUserColor">{{
            record.user.reg_type | formDateType
          }}</a-tag>
        </span>
        <!-- ======================状态======================= -->
        <span slot="status" slot-scope="{ record }">
          <a-tag :color="record.status | formateWithdrawStatusColor">{{
            record.status | formateWithdrawStatus
          }}</a-tag>
        </span>
        <!-- 代理审核状态 -->
        <span slot="is_confirm" slot-scope="{ record }">
          <a-tag :color="record.is_confirm | formDateInConfirmColor">{{
            record.is_confirm | formDateInConfirm
          }}</a-tag>
        </span>
        <!--  -->

        <div slot="actions" slot-scope="{ record }">
          <!-- {{ record }} -->
          <a-space size="middle">
            <a v-if="record.status === 0" @click="handleAudit(record)">
              <a-icon type="check-square"></a-icon>
              审核
            </a>
            <!-- <a
                v-if="record.status === 0 || record.status === 5"
                @click="handleLocking(record)"
              >
                <a-icon type="key"></a-icon>
                {{ record.user.is_withdrawal !== 1 ? "解锁" : "锁定" }}
              </a> -->
          </a-space>
        </div>
      </advance-table>
    </div>
    <order-details
      :visible="isVisible"
      :loading="confirmLoading"
      @cancel="handleCancel"
      ref="withdrawRef"
      :userModules="userModules"
      @ok="handleOk"
      :aisleType="aisleType"
      :modules="modules"
      @handleFail="handleFail"
      @handleManual="handleManual"
    />
    <a-modal
      :visible="isLocking"
      :title="lockingTitle"
      @ok="lockingOk"
      :confirm-loading="lockingLoading"
      @cancel="
        () => {
          isLocking = false;
        }
      "
      ><a-input v-model="remaks" placeholder="请输入备注"
    /></a-modal>
    <batch-form
      :aisleTypeList="aisleType"
      :isBatch="isBatch"
      :bathcLoading="bathcLoading"
      ref="batchRef"
      @cancel="
        () => {
          isBatch = false;
        }
      "
      @ok="batchOk"
    />
  </div>
</template>

<script>
import { financeService } from "@/services";
import OrderDetails from "./OrderDetails.vue";
import BatchForm from "./BatchForm.vue";
import { registerTypeList } from "@/utils/util";
import AdvanceTable from "../../../components/table/advance/AdvanceTable.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
import {
  formateWithdrawStatus,
  formateWithdrawStatusColor,
  formateWithdrawType,
  formateWithdrawTypeColor,
} from "@/utils/filters";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "订单号",
    dataIndex: "order_no",
    align: "center",
  },
  {
    title: "平台订单号",
    dataIndex: "pltf_order_no",
    align: "center",
  },
  {
    title: "用户信息",
    align: "left",
    dataIndex: "user",
    scopedSlots: { customRender: "userinfo" },
  },

  {
    title: "支付状态",
    dataIndex: "pay_status",
    align: "center",
    scopedSlots: { customRender: "payStatus" },
  },
  {
    title: "提现信息",
    align: "left",
    // height: 100,
    // width: 100,
    scopedSlots: { customRender: "withdraw" },
  },
  {
    title: "三方信息",
    align: "left",
    scopedSlots: { customRender: "third_fee" },
  },
  {
    title: "收款人信息",
    align: "left",
    scopedSlots: { customRender: "beneficiary" },
  },
  {
    title: "法币信息",
    align: "left",
    dataIndex: "currency",
    scopedSlots: { customRender: "currency" },
  },
  {
    title: "审批时间",
    dataIndex: "approval_time",
    align: "center",
    scopedSlots: { customRender: "appRoTime" },
  },

  {
    title: "审核不通过理由",
    dataIndex: "message",
    align: "center",
  },
  {
    title: "到账时间",
    dataIndex: "loan_time",
    align: "center",
    scopedSlots: { customRender: "loanTime" },
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
    fixed: "right",
  },
  {
    title: "代理审核状态",
    dataIndex: "is_confirm",
    align: "center",
    scopedSlots: { customRender: "is_confirm" },
    fixed: "right",
  },
  {
    title: "支付渠道",
    dataIndex: "pay_company",
    align: "center",
    fixed: "right",
  },
  {
    title: "审核员",
    align: "center",
    dataIndex: "auditor.nickname",
    fixed: "right",
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    fixed: "right",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  name: "FiatCurrencyWithdraw",
  filters: {
    formateWithdrawStatus,
    formateWithdrawStatusColor,
    formateWithdrawType,
    formateWithdrawTypeColor,
    formDateType,
    formDateUserColor,
    formDateInConfirm(val) {
      switch (Number(val)) {
        case 0:
          return "未确认";
        case 1:
          return "已确认";
        case 2:
          return "拒绝";
        default:
          break;
      }
    },
    formDateInConfirmColor(val) {
      switch (Number(val)) {
        case 0:
          return "";
        case 1:
          return "#22C55E";
        case 2:
          return "#EF4444";
        default:
          break;
      }
    },
  },
  components: {
    OrderDetails,
    BatchForm,
    AdvanceTable,
  },
  data() {
    this.registerTypeList = registerTypeList;
    return {
      advanced: false,
      spinning: false,
      form: this.$form.createForm(this),
      columns: columns,
      withdrawList: [],
      selectedRows: [],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
      isVisible: false,
      confirmLoading: false,
      userModules: {},
      aisleType: [],
      modules: {},
      isLocking: false,
      lockingTitle: "锁定",
      lockingLoading: false,
      remaks: "",
      lockingId: "",
      lockStatus: "",
      isBatch: false,
      bathcLoading: false,
      batchLists: [],

      // ----------
      orderSort: "",
      fieldSort: "",
      third_fee: "",
      payLists: [],
      fiatCurrency: [],
      totalWithdraw: {
        money: "",
        third_fee: "",
        service_fee: "",
      },
    };
  },
  activated() {
    this._getWithdraw();
    this._getPay();
    this.getFiatCurrencyList();
  },
  // mounted() {
  //   this._getWithdraw();
  //   this._getPay();
  //   this.getFiatCurrencyList();
  // },
  computed: {
    // 计算属性获取websocket推送过来放进vuex中的数据
    countNum() {
      return this.$store.state.socket.fiatWithdraw;
    },
  },
  // 监听数据变化 再将获取到的数据放入列表第一位
  watch: {
    countNum: function(newVal) {
      if (newVal) {
        this.withdrawList.unshift(newVal);
      } else {
        throw new Error("监听错误");
      }
    },
  },
  methods: {
    _getPay() {
      financeService
        .getPayList({ account_type: [2], country_id: 0 })
        .then((res) => {
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            console.log(data);
            this.payLists = data;
            this.aisleType = data;
          }
        });
    },
    _getWithdraw() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        values.approval_time = this.config.timeFormat(values.approval_time);
        financeService
          .getWithdraw({
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
              this.withdrawList = data.list;
              this.total = data.total;
              this.totalWithdraw.money = data.money;
              this.totalWithdraw.third_fee = data.third_fee;
              this.totalWithdraw.service_fee = data.service_fee;
              setTimeout(() => {
                this.$forceUpdate();
              }, 500);
            }
            // const myEvent = new Event("resize");
            // window.dispatchEvent(myEvent);
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    _getAisle(id) {
      financeService
        .getPayList({ account_type: [3], country_id: id })
        .then((res) => {
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            // this.payLists = data;
            this.aisleType = data;
          }
        });
    },

    handleSearch() {
      this.pageIndex = 1;
      this._getWithdraw();
    },
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._getWithdraw();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleMenuClick(e) {
      if (e.key === "audit") {
        this.batchReview();
      }
    },
    batchReview() {
      if (this.batchLists.length === 0) {
        this.$message.warning("请选择需要审核的行");
      } else {
        this.isBatch = true;
      }
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onChange(pagination, filters, sorter) {
      let { field, order } = sorter;
      console.log("==================>field,order", field, order);
    },
    onSelectChange(item) {
      console.log("==================>item", item);
      this.batchLists = item;
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getWithdraw();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getWithdraw();
    },
    handleAudit(item) {
      this.spinning = true;
      console.log("==================>item", item);
      financeService.userById({ id: item.id }).then((res) => {
        this.spinning = false;
        const { code, msg, data } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this._getAisle(item.country_id); // 获取支付方式
          this.modules = {
            id: item.id,
            message: data?.message,
            front_message: data?.front_message,
            remarks: data?.user?.remarks,
            type: "",
          };
          this._getPay()
          this.userModules = data;
          this.isVisible = true;
        }
      });
    },
    handleCancel() {
      this.isVisible = false;
    },
    handleOk() {
      const form = this.$refs.withdrawRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        const { id, message, front_message, pay_type } = values;
        if (!errors) {
          let params = {
            id,
            message,
            front_message,
            pay_type,
            status: 1,
          };
          // this.form.validateFields((_, values) => {
          //   params.type = values.reg_source_id || 0;
          // }),
          financeService
            .withdrawalAudit(params)
            .then((res) => {
              this.confirmLoading = false;
              const { msg, code } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                form.resetFields();
                this.$message.success("审核成功");
                this._getWithdraw();
                this.isVisible = false;
              }
            })
            .catch((error) => {
              this.confirmLoading = false;
              this.$message.error(error);
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleLocking(item) {
      this.isLocking = true;
      this.lockingTitle = item.user?.is_withdrawal === 1 ? "锁定" : "解锁";
      this.remaks = item.user?.remaks;
      this.lockingId = item.id;
      this.lockStatus = item.user?.is_withdrawal;
    },
    lockingOk() {
      const { lockingId, remaks, lockStatus } = this;
      const params = {
        id: lockingId,
        is_withdrawal: lockStatus === 1 ? 0 : 1,
        remarks: remaks,
      };
      this.lockingLoading = true;
      financeService
        .withdrawLock(params)
        .then((res) => {
          this.lockingLoading = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("操作成功");
            this._getWithdraw();
            this.isLocking = false;
          }
        })
        .catch((err) => {
          this.lockingLoading = false;
          this.$message.error(err);
        });
    },
    batchOk() {
      const form = this.$refs.batchRef.form;
      this.bathcLoading = true;
      form.validateFields((error, values) => {
        if (!error) {
          const params = {
            ...values,
            status: 1,
            ids: this.batchLists,
            type: "",
          };
          this.form.validateFields((_, values) => {
            params.type = values.reg_source_id || 0;
          }),
            financeService.withdrawBatch(params).then((res) => {
              this.bathcLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$messages.error(msg);
              } else {
                this.$messages.success("批量审核成功");
                this._getWithdraw();
              }
            });
        } else {
          this.bathcLoading = false;
        }
      });
    },
    // 不通过
    handleFail() {
      const form = this.$refs.withdrawRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        const { id, message, front_message, pay_type } = values;
        let params = {
          id,
          message,
          front_message,
          pay_type,
          status: 2,
        };
        console.log(params);
        financeService
          .withdrawalAudit(params)
          .then((res) => {
            this.confirmLoading = false;
            const { msg, code } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              form.resetFields();
              this.$message.success("操作成功");
              this._getWithdraw();
              this.isVisible = false;
            }
          })
          .catch((err) => {
            this.confirmLoading = false;
            this.$message.error(err);
          });
      });
    },
    handleManual() {
      console.log("手动出款");
      // manualWithdraw().then(res);
      const form = this.$refs.withdrawRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        const { id, message, front_message } = values;
        let params = {
          id,
          message: message || "message",
          front_message: front_message || "front_message",
        };
        financeService.manualWithdraw(params).then((res) => {
          this.confirmLoading = false;
          const { msg, code } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            form.resetFields();
            this.$message.success("手动出款成功");
            this._getWithdraw();
            this.isVisible = false;
          }
        });
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
      this._getWithdraw();
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
