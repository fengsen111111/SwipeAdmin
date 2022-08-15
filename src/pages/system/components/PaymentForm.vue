<template>
  <a-modal
    :visible="visible"
    :title="payTitleStatus == 1 ? '新增支付配置' : '修改支付配置'"
    :confirmLoading="loading"
    :width="800"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item label="商户ID">
              <a-input
                placeholder="请输入昵称"
                allowClear
                v-decorator="[
                  'merchant_id',
                  {
                    rules: [
                      {
                        required: true,
                        min: 2,
                        message: '请输入昵称',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="商户密钥">
              <a-input
                placeholder="请输入商户密钥"
                allowClear
                v-decorator="[
                  'secret_key',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入商户密钥',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="支付别名">
              <a-input
                placeholder="请输入支付别名"
                allowClear
                v-decorator="['alias']"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="类型">
              <a-select
                v-decorator="[
                  'type',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择类型',
                      },
                    ],
                  },
                ]"
                placeholder="请选择类型"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in payTypeList"
                  :key="item.id"
                >
                  {{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="充值类型">
              <a-input
                placeholder="请输入充值类型"
                allowClear
                v-decorator="['payment_type']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="提现类型">
              <a-input
                placeholder="请输入提现类型"
                allowClear
                v-decorator="['payout_type']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- ======================Add======================= -->
        <a-row>
          <a-col :span="12">
            <a-form-item label="代收费率">
              <a-input
                addon-after="%"
                placeholder="请输入代收费率"
                allowClear
                v-decorator="[
                  'payment_rate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入代收费率',
                      },
                      {
                        pattern: new RegExp(/([1-9]?\d|100)$/),
                        message: '请输入0~100整数',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="代付费率">
              <a-input
                placeholder="请输入代付费率"
                allowClear
                addon-after="%"
                v-decorator="[
                  'payout_rate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入代付费率',
                      },
                      {
                        pattern: new RegExp(/([1-9]?\d|100)$/),
                        message: '请输入0~100整数',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="最大充值金额">
              <a-input
                placeholder="请输入最大充值金额"
                allowClear
                v-decorator="[
                  'max_recharge',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入最大充值金额',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最小充值金额">
              <a-input
                placeholder="请输入最小充值金额"
                allowClear
                v-decorator="[
                  'min_recharge',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入最小充值金额',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="支付网关">
              <a-input
                placeholder="请输入支付网关"
                allowClear
                v-decorator="[
                  'gateway',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入支付网关',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="代付网关">
              <a-input
                placeholder="请输入代付网关"
                v-decorator="[
                  'cashout_gateway',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入代付网关',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="代付密钥">
              <a-input
                placeholder="请输入代付密钥"
                allowClear
                v-decorator="['another_secret_key']"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="权重">
              <a-input
                placeholder="请输入权重"
                allowClear
                v-decorator="[
                  'weigh',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入权重',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="国家">
              <a-select
                v-decorator="[
                  'country_id',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择国家,自动回调随便选',
                      },
                    ],
                  },
                ]"
                placeholder="请选择国家,自动回调随便选"
                show-search
                :filter-option="proxyFilter"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in CountrySelectList"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="名称">
              <a-input
                :disabled="payTitleStatus == 2"
                placeholder="请输入名称"
                allowClear
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入名称',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="回调类型">
              <a-select
                v-decorator="[
                  'account_type',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择回调类型',
                      },
                    ],
                  },
                ]"
                placeholder="请选择回调类型"
              >
                <a-select-option :key="3" :value="3">手动回调</a-select-option>
                <a-select-option :key="4" :value="4">自动回调</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <a-transfer
          :data-source="bankTypeList"
          :list-style="{
            width: '340px',
            height: '300px',
          }"
          show-search
          :titles="['银行卡', '已添加银行卡']"
          :target-keys="targetKeys"
          :selected-keys="selectedKeys"
          :render="(item) => item.title"
          @change="handleChange"
          @selectChange="handleSelectChange"
        /> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = [
  "account_type",
  "merchant_id",
  "secret_key",
  "type",
  "max_recharge",
  "min_recharge",
  "gateway",
  "cashout_gateway",
  // "max_withdrawl",
  // "min_withdrawl",
  // "recharge_amounts",
  // "withdrawl_amounts",
  "another_secret_key",
  "alias",
  "weigh",
  "id",
  "payment_rate",
  "payout_rate",
  // Add
  "payout_type",
  "payment_type",
  "country_id",
  "name",
];
export default {
  name: "PaymentForm",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    payTitleStatus: {
      type: Number,
      default: 1,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Object,
      default: () => {},
    },
    // bankTypeList: {
    //   type: Array,
    //   default: () => [],
    // },
    CountrySelectList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const payTypeList = [
      {
        id: 1,
        label: "可充值",
      },
      {
        id: 2,
        label: "可提现",
      },
      {
        id: 3,
        label: "可充值可提现",
      },
    ];
    return {
      form: this.$form.createForm(this),
      targetKeys: ["1"],
      selectedKeys: [],
      payTypeList,
      //   mockData,
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    proxyFilter(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys;
      console.log("targetKeys: ", nextTargetKeys);
      console.log("direction: ", direction);
      console.log("moveKeys: ", moveKeys);
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
      console.log("sourceSelectedKeys: ", sourceSelectedKeys);
      console.log("targetSelectedKeys: ", targetSelectedKeys);
    },
  },
};
</script>

<style lang="scss" scoped></style>
