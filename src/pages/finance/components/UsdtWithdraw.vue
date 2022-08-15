<!--
 * @Author: your name
 * @Date: 2022-03-28 15:19:58
 * @LastEditTime: 2022-06-06 15:14:57
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\components\UsdtWithdraw.vue
 * USDT 提现
-->

<template>
  <div>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
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
            <a-col :md="8" :sm="24">
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
            <a-col :md="8" :sm="24">
              <a-form-item
                label="提现状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select placeholder="状态" v-decorator="['status']">
                  <a-select-option value="0">待审核</a-select-option>
                  <a-select-option value="1">已成功</a-select-option>
                  <a-select-option value="2">审核未通过</a-select-option>
                  <!-- <a-select-option value="3">进行中</a-select-option>
                  <a-select-option value="4">失败</a-select-option>
                  <a-select-option value="5">锁定中</a-select-option> -->
                </a-select>
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
                    >{{ item.name }}
                  </a-select-option>
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
                    >{{ item.name }}
                  </a-select-option>
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
              <span class="left-title">平台手续费:</span
              ><span class="right-title">{{ totalWithdraw.service_fee }}</span>
            </a-col>
          </a-row>
        </template>
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
        <span slot="payStatus" slot-scope="{ record }">
          <a-tag :color="record.pay_status | formateWithdrawTypeColor">{{
            record.pay_status | formateWithdrawType
          }}</a-tag>
        </span>

        <div slot="actions" slot-scope="{ record }">
          <!-- {{ record }} -->
          <a-space size="middle">
            <a v-if="record.status === 0" @click="handleAudit(record)">
              <a-icon type="check-square"></a-icon>
              审核
            </a>
          </a-space>
        </div>
      </advance-table>
    </div>
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
    >
      <a-input v-model="remaks" placeholder="请输入备注" />
    </a-modal>
    <a-modal
      :visible="auditShow"
      title="审核"
      :confirm-loading="auditShowLoading"
      @ok="handleAuditOk"
      @cancel="handleAuditCancel"
    >
      <a-form :form="auditForm" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="审核状态">
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'status',
              { rules: [{ required: true }], message: '请选择状态' },
            ]"
          >
            <a-radio :value="1"> 审核通过 </a-radio>
            <a-radio :value="2"> 审核不通过 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="自动出款通道">
          <a-select
            v-decorator="['pay_type']"
            placeholder="需要自动出款,请选择通道"
            allowClear
          >
            <a-select-option v-for="item in aisleType" :key="item.name">
              {{ item.alias }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="前台备注">
          <a-textarea
            placeholder="填入前台备注"
            :rows="2"
            v-decorator="['front_message']"
          />
        </a-form-item>
        <a-form-item label="后台备注">
          <a-textarea
            placeholder="填入后台备注"
            :rows="2"
            v-decorator="['message']"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { financeService } from "@/services";

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
    title: "用户名",
    dataIndex: "user.username",
    align: "center",
  },

  {
    title: "用户名昵称",
    dataIndex: "user.nickname",
    align: "center",
  },

  // {
  //   title: "支付状态",
  //   dataIndex: "pay_status",
  //   align: "center",
  //   scopedSlots: { customRender: "payStatus" },
  // },
  {
    title: "提现金额",
    dataIndex: "money",
    align: "center",
    sorter: true,
  },
  {
    title: "手续费",
    dataIndex: "service_charge",
    align: "center",
  },
  {
    title: "到账金额",
    dataIndex: "payment",
    align: "center",
  },
  {
    title: "支付状态",
    dataIndex: "pay_status",
    align: "center",
    scopedSlots: { customRender: "payStatus" },
  },
  {
    title: "申请时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: { customRender: "createTime" },
  },
  {
    title: "USDT地址",
    align: "center",
    dataIndex: "bank_number",
  },
  {
    title: "类型",
    align: "center",
    dataIndex: "bank_name",
  },
  {
    title: "注册类型",
    dataIndex: "reg_type",
    align: "center",
    scopedSlots: {
      customRender: "regType",
    },
  },
  {
    title: "三方通道名称",
    align: "center",
    dataIndex: "pay_company",
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
  name: "UsdtWithdraw",
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
    AdvanceTable,
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    this.registerTypeList = registerTypeList;
    return {
      advanced: false,
      form: this.$form.createForm(this),
      columns: columns,
      withdrawList: [],
      selectedRows: [],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
      isLocking: false,
      lockingTitle: "锁定",
      lockingLoading: false,
      remaks: "",
      lockingId: "",
      lockStatus: "",

      // ----------
      orderSort: "",
      fieldSort: "",
      third_fee: "",
      payLists: [],
      totalWithdraw: {
        money: "",
        service_fee: "",
      },
      // 对话框
      auditForm: this.$form.createForm(this),
      auditShow: false,
      auditShowLoading: false,
      USDTID: 0,
      //
      aisleType: [],
    };
  },
  activated() {
    this._getWithdraw();
    this._getPay();
  },
  // mounted() {
  //   this._getWithdraw();
  //   this._getPay();
  // },
  computed: {
    //

    // 计算属性获取websocket推送过来放进vuex中的数据
    countNum() {
      return this.$store.state.socket.usdtWithdraw;
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
    //
    getAutoPay() {
      financeService
        .getPayList({ account_type: [4], country_id: 0 })
        .then((res) => {
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            // this.payLists = data;
            // console.log("==================>data", data);
            this.aisleType = data;
          }
        });
    },
    // 对话框取消按钮
    handleAuditCancel() {
      this.auditShow = false;
      this.auditForm.resetFields();
    },
    // 对话框确认按钮
    handleAuditOk() {
      this.auditShowLoading = true;
      this.auditForm.validateFields((errors, values) => {
        if (!errors) {
          // console.log("==================>values", values);
          values.id = this.USDTID;
          financeService
            .usdtWithdrawAudit({ ...values })
            .then((res) => {
              this.auditShow = false;
              const { code, msg } = res.data;
              this.auditShowLoading = false;
              this.auditForm.resetFields();
              if (code !== 200) return this.$message.error(msg);
              this.$message.success("审核成功");
              this._getWithdraw();
            })
            .catch((err) => {
              this.auditShowLoading = false;
              this.$message.error(err);
            });
        } else {
          this.auditShowLoading = false;
          // this.auditForm.resetFields();
        }
      });
    },
    // 获取支付渠道列表
    _getPay() {
      financeService
        .getPayList({ account_type: [1, 4], country_id: 0 })
        .then((res) => {
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.payLists = data;
            // console.log("==================>data", data);
            // this.aisleType = data;
          }
        });
    },
    // 获取提现列表
    _getWithdraw() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        values.approval_time = this.config.timeFormat(values.approval_time);
        financeService
          .usdtWithdrawList({
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
              console.log("==================>data.list", data.list);
              this.withdrawList = data.list;
              this.total = data.total;
              this.totalWithdraw.money = data.money;
              this.totalWithdraw.service_fee = data.service_fee;
              setTimeout(() => {
                this.$forceUpdate();
              }, 500);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 重置
    handleSearch() {
      this.pageIndex = 1;
      this._getWithdraw();
    },
    // 查询
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._getWithdraw();
    },
    // 展开收起事件
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
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getWithdraw();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getWithdraw();
    },
    // 审核按钮
    handleAudit(item) {
      // console.log("==================>item", item);
      this.getAutoPay();
      this.USDTID = item.id;
      this.auditShow = true;
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
    //选择器筛选函数
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
