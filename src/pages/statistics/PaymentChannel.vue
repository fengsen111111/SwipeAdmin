<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a slot="extra" @click="handleRefs">刷新</a>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item
              label="日期"
              :labelCol="{ span: 3 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-range-picker
                v-decorator="['create_time']"
                style="width: 100%"
                :ranges="fastDate"
                show-time
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
      <a-tabs @change="changeCallback" default-active-key="recharge">
        <a-tab-pane key="recharge" tab="充值渠道"> </a-tab-pane>
        <a-tab-pane key="withdrawal" tab="提现渠道"></a-tab-pane>
      </a-tabs>
      <a-table
        :loading="loading"
        :columns="columns"
        bordered
        :data-source="paymentList"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.pay_company"
      >
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import { statisticsService } from "@/services";
const columns = [
  {
    title: "渠道",
    dataIndex: "pay_company",
    align: "center",
  },
  {
    title: "笔数",
    dataIndex: "number",
    align: "center",
  },
  {
    title: "三方服务费",
    dataIndex: "third_fee",
    align: "center",
  },
  {
    title: "金额",
    dataIndex: "money",
    align: "center",
  },
];
export default {
  name: "PaymentChannel",
  data() {
    return {
      paymentList: [],
      loading: false,
      columns: columns,
      form: this.$form.createForm(this),
      channelType: "recharge",
      spinning: false,
    };
  },
  activated() {
    this._getPayChanel();
  },
  methods: {
    _getPayChanel() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        statisticsService
          .getPayChanel({
            ...values,
            channel: this.channelType,
          })
          .then((res) => {
            this.loading = false;
            this.spinning = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.paymentList = data.list;
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
            this.spinning = false;
          });
      });
    },
    handleReset() {
      this.form.resetFields();
      this._getPayChanel();
    },
    handleSearch() {
      this.spinning = true;
      this._getPayChanel();
    },
    changeCallback(item) {
      this.spinning = true;
      this.channelType = item;
      this._getPayChanel();
    },
    handleRefs() {
      this._getPayChanel();
    },
  },
};
</script>

<style lang="scss" scoped></style>
