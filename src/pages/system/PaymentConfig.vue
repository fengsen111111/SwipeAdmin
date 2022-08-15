<template>
  <a-card>
    <a-form layout="horizontal" :form="form" ref="searchRef">
      <div>
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="支付类型"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                v-decorator="['account_type']"
                placeholder="选择支付类型"
              >
                <a-select-option value="1"> 钱包地址 </a-select-option>
                <!-- <a-select-option value="2"> 银行卡 </a-select-option> -->
                <a-select-option value="3"> 三方通道 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" style="margin-left: 8px">
            <a-form-item>
              <a-space size="middle">
                <a-button type="primary" @click="handleCreate">
                  <a-icon type="plus"></a-icon>
                  新增钱包地址
                </a-button>
                <a-button type="primary" @click="handleTripartite">
                  <a-icon type="plus"></a-icon>
                  新增三方通道
                </a-button>
                <a-button @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table
      :loading="loading"
      :columns="columns"
      bordered
      :data-source="paymentList"
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
      <template slot="name" slot-scope="item">
        <div>
          {{ item.account_type !== 1 ? item.name : item.account_name }}
        </div>
      </template>
      <!--  -->
      <template slot="recharge" slot-scope="item">
        <div>{{ item.min_recharge }}~{{ item.max_recharge }}</div>
      </template>
      <!--  -->
      <template slot="withdrawl" slot-scope="item">
        <div>{{ item.min_withdrawl }}~{{ item.max_withdrawl }}</div>
      </template>
      <!--  -->
      <template slot="gateway" slot-scope="item">
        <div v-if="item.account_type !== 1">
          <div>支付网关：{{ item.gateway }}</div>
          <div>代付网关：{{ item.cashout_gateway }}</div>
        </div>
        <div v-if="item.account_type == 1">
          <div style="width: 80px; height: 80px">
            <img style="width: 80px; height: 80px" :src="item.qr_code" alt="" />
          </div>
        </div>
      </template>
      <!--  -->
      <template slot="rate" slot-scope="item">
        <div>代收费率：{{ item.payment_rate }}</div>
        <div>代付费率：{{ item.payout_rate }}</div>
      </template>
      <!--  -->
      <template slot="account_type" slot-scope="account_type">
        {{ account_type | accountType }}
      </template>
      <template slot="status" slot-scope="status">
        <a-tag :color="status === 1 ? '#17D7A0' : '#FF5677'">{{
          status === 1 ? "是" : "否"
        }}</a-tag>
      </template>
      <template slot="type" slot-scope="type">
        <a-tag :color="payType[type].color">{{ payType[type].text }}</a-tag>
      </template>
      <div slot="actions" slot-scope="actions">
        <a-space size="large">
          <a @click="handleUpdate(actions)">
            <a-icon type="edit"></a-icon>
            编辑
          </a>
          <a-popconfirm
            :title="
              `你确定要${actions.status === 1 ? '封禁' : '解封'}此支付吗?`
            "
            ok-text="确定"
            cancel-text="取消"
            @confirm="banRecord(actions)"
          >
            <a>
              {{ actions.status === 1 ? "封禁" : "解封" }}
            </a>
          </a-popconfirm>
        </a-space>
      </div>
    </a-table>
    <payment-form
      :loading="confirmLoading"
      :visible="isVisible"
      ref="payMentRef"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
      :CountrySelectList="CountrySelectList"
      :payTitleStatus="payTitleStatus"
    />
    <AddPayment
      :AddConfirmLoading="AddConfirmLoading"
      :isAddShow="isAddShow"
      :AddModules="AddModules"
      :titleStatus="titleStatus"
      ref="addPaymentFormRef"
      @cancel="CancelAdd"
      @ok="OkAdd"
      :CountrySelectList="CountrySelectList"
    />
  </a-card>
</template>

<script>
import { systemService, operationService } from "@/services";
import PaymentForm from "./components/PaymentForm.vue";
import AddPayment from "./components/AddPayment.vue";
export default {
  name: "Payment",
  components: {
    PaymentForm,
    AddPayment,
  },
  data() {
    const columns = [
      {
        title: "#",
        dataIndex: "id",
      },
      {
        title: "支付类型",
        align: "center",
        dataIndex: "account_type",
        scopedSlots: { customRender: "account_type" },
      },
      {
        title: "支付公司",
        // dataIndex: "account_name",
        scopedSlots: { customRender: "name" },
        align: "center",
      },
      {
        title: "支付别名",
        dataIndex: "alias",
        align: "center",
      },
      // {
      //   title: "权重",
      //   dataIndex: "weigh",
      //   align: "center",
      // },
      {
        title: "商户ID",
        dataIndex: "merchant_id",
        align: "center",
      },
      {
        title: "网关",
        align: "left",
        scopedSlots: { customRender: "gateway" },
      },
      // {
      //   title: "支付网关",
      //   dataIndex: "gateway",
      //   align: "center",
      // },
      // {
      //   title: "代付网关",
      //   dataIndex: "cashout_gateway",
      //   align: "center",
      // },
      {
        title: "商户密钥",
        dataIndex: "secret_key",

        align: "center",
        ellipsis: true,
        customRender: (text) => {
          return {
            children: (
              <a-tooltip placement="top">
                <template slot="title">{text}</template>
                <div class="title-text">{text}</div>
              </a-tooltip>
            ),
          };
        },
      },
      {
        title: "费率",
        align: "left",
        scopedSlots: { customRender: "rate" },
      },
      // {
      //   title: "代收费率",
      //   dataIndex: "payment_rate",
      //   align: "center",
      // },
      // {
      //   title: "代付费率",
      //   dataIndex: "payout_rate",
      //   align: "center",
      // },
      {
        title: "代付密钥",
        dataIndex: "another_secret_key",
        align: "center",
      },
      {
        title: "充值限制",
        align: "left",
        scopedSlots: { customRender: "recharge" },
      },
      // {
      //   title: "最大充值金额",
      //   dataIndex: "max_recharge",
      //   align: "center",
      // },
      // {
      //   title: "最小充值金额",
      //   dataIndex: "min_recharge",
      //   align: "center",
      // },
      {
        title: "充值金额",
        dataIndex: "recharge_amounts",
        align: "center",
      },
      {
        title: "提现限制",
        align: "left",
        scopedSlots: { customRender: "withdrawl" },
      },
      // {
      //   title: "最大提现金额",
      //   dataIndex: "max_withdrawl",
      //   align: "center",
      // },
      // {
      //   title: "最小提现金额",
      //   dataIndex: "min_withdrawl",
      //   align: "center",
      // },
      {
        title: "提现金额",
        dataIndex: "withdrawl_amounts",
        align: "center",
      },
      {
        title: "是否启用",
        dataIndex: "status",
        align: "center",
        scopedSlots: { customRender: "status" },
        fixed: "right",
      },
      {
        title: "代收付类型",
        dataIndex: "type",
        scopedSlots: { customRender: "type" },
        align: "center",
        fixed: "right",
      },
      {
        title: "操作",
        dataIndex: "",
        scopedSlots: { customRender: "actions" },
        align: "center",
        // width: "200px",
        fixed: "right",
      },
    ];
    return {
      form: this.$form.createForm(this),
      paymentList: [],
      loading: false,
      columns: columns,
      isVisible: false,
      confirmLoading: false,
      //
      isAddShow: false,
      AddConfirmLoading: false,
      AddModules: null,
      titleStatus: 1,
      //
      payTitleStatus: 1,
      modules: null,
      bankTypeList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      CountrySelectList: [],
      payType: {
        1: {
          color: "#06d6a0",
          text: "可充值",
        },
        2: {
          color: "#118ab2",
          text: "可提现",
        },
        3: {
          color: "#83c5be",
          text: "可充值可提现",
        },
      },
    };
  },
  filters: {
    accountType(val) {
      switch (val) {
        case 1:
          return "钱包地址";
        case 2:
          return "银行卡";
        case 3:
          return "三方通道";
        case 4:
          return "三方通道";
        default:
          return "未知";
      }
    },
  },
  activated() {
    this._getPay();
    // this.getBankTypeList();
    this.getCountrySelectList();
  },
  mounted() {},
  methods: {
    // 新增按钮事件
    handleCreate() {
      console.log("==================>新增??????????");
      this.isAddShow = true;
      // console.log("==================>this.isAddShow", this.isAddShow);
      this.titleStatus = 1;
    },
    // 取消事件
    CancelAdd() {
      // console.log("==================>Cancel");
      this.isAddShow = false;
      this.$refs.addPaymentFormRef.genre = 1;
      this.$refs.addPaymentFormRef.form.resetFields();
    },
    // 确认事件
    OkAdd() {
      // console.log("==================>ok");
      this.AddConfirmLoading = true;
      const form = this.$refs.addPaymentFormRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          // 等于1 为新增
          if (this.titleStatus == 1) {
            delete values.id;
            systemService
              .payAdd({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.AddConfirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("添加成功");
                this.isAddShow = false;
                form.resetFields();
                this._getPay();
              })
              .catch((err) => {
                this.$message.error(err);
                this.AddConfirmLoading = false;
              });
          } else {
            systemService
              .updatePay({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.AddConfirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("修改成功");
                this.isAddShow = false;
                form.resetFields();
                this._getPay();
              })
              .catch((err) => {
                this.$message.error(err);
                this.AddConfirmLoading = false;
              });
          }
        } else {
          this.AddConfirmLoading = false;
        }
      });
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;

      this._getPay();
    },
    // 重置
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._getPay();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getPay();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getPay();
    },
    // 获取支付列表
    _getPay() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        console.log("==================>values", values);
        systemService
          .getPay({
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
              this.paymentList = data.list;
              this.total = data.total;
              setTimeout(() => {
                this.$forceUpdate();
              }, 500);
            }
            // this.$nextTick(() => {
            //   this.$refs.table.doLayout();
            // });
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      });
    },

    // 获取银行列表
    getBankTypeList() {
      // this.loading = true;
      systemService.bankTypeList().then((res) => {
        // this.loading = false;
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.bankTypeList = data.map((item) => {
          return {
            code: item.code,
            key: item.id.toString(),
            title: item.name,
          };
        });
      });
    },
    // 新增三方事件
    handleTripartite() {
      this.payTitleStatus = 1;
      this.isVisible = true;
    },
    // 编辑按钮事件
    handleUpdate(item) {
      // console.log("==================>item", item.account_type);
      if (item.account_type == 1) {
        console.log("==================>item.", item);
        this.AddModules = {
          id: item.id,
          account_type: item.account_type,
          name: item.name,
          account_name: item.account_name,
          account_number: item.account_number,
          min_recharge: item.min_recharge,
          max_recharge: item.max_recharge,
          status: item.status,
          remark: item.remark,
        };
        this.$refs.addPaymentFormRef.genre = item.account_type;
        this.titleStatus = 2;
        this.isAddShow = true;
      } else {
        const {
          account_type,
          id,
          merchant_id,
          secret_key,
          max_recharge,
          min_recharge,

          // recharge_amounts,
          // max_withdrawl,
          // withdrawl_amounts,
          // min_withdrawl,
          another_secret_key,
          alias,
          cashout_gateway,
          gateway,
          type,
          weigh,
          payment_rate,
          payout_rate,
          payment_type,
          payout_type,
          country_id,
          name,
        } = item;
        this.modules = {
          account_type,
          id,
          merchant_id,
          secret_key,
          max_recharge,
          min_recharge,
          // recharge_amounts,
          // max_withdrawl,
          // withdrawl_amounts,
          // min_withdrawl,
          another_secret_key,
          alias,
          cashout_gateway,
          gateway,
          type,
          weigh,
          payment_rate: Number(payment_rate) * 100,
          payout_rate: Number(payout_rate) * 100,
          payment_type,
          payout_type,
          country_id,
          name,
        };
        this.payTitleStatus = 2;
        this.$refs.payMentRef.targetKeys = item.banks.map((item) =>
          item.id.toString()
        );
        this.isVisible = true;
      }
    },
    // account_type等于3,4的编辑确定按钮
    handleOk() {
      const form = this.$refs.payMentRef.form;
      this.confirmLoading = true;
      form.validateFields((error, values) => {
        values.payment_rate = values.payment_rate / 100;
        values.payout_rate = values.payout_rate / 100;
        if (values.account_type == 4) {
          delete values.country_id;
        }
        // let bankIdList = this.$refs.payMentRef.targetKeys;
        if (!error) {
          if (this.payTitleStatus == 1) {
            delete values.id;
            const params = {
              ...values,

              // bank_ids: bankIdList.join(","),
            };
            systemService
              .payAdd(params)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("新增成功");
                  this.isVisible = false;
                  this._getPay();
                  form.resetFields();
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            const params = {
              ...values,

              // bank_ids: bankIdList.join(","),
            };
            systemService
              .updatePay(params)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  this._getPay();
                  form.resetFields();
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 三方取消按钮
    handleCancel() {
      this.$refs.payMentRef.targetKeys = [];
      this.$refs.payMentRef.form.resetFields();
      this.isVisible = false;
    },
    // 封禁，解封事件
    banRecord(item) {
      systemService
        .payBan({
          status: item.status === 0 ? 1 : 0,
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success(`${item.status === 1 ? "封禁" : "解封"}成功`);
            this._getPay();
          }
        });
    },
    // 获取国家列表
    getCountrySelectList() {
      operationService.countrySelect().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.CountrySelectList = data;
        // console.log("==================>this.", this.CountrySelectList);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title-text {
  max-width: 200px;
  text-align: center;
  // overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.ant-table-fixed-header .ant-table-body-inner {
  overflow: hidden; // 很重要
}
</style>
