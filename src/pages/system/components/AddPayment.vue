<!--
 * @Author: your name
 * @Date: 2022-03-17 17:08:18
 * @LastEditTime: 2022-05-27 18:59:07
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\system\components\AddPayment.vue
-->
<template>
  <a-modal
    :visible="isAddShow"
    :title="titleStatus == 1 ? '新增支付账户' : '修改支付账户'"
    :confirmLoading="AddConfirmLoading"
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
    <a-spin :spinning="AddConfirmLoading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item label="账户类型">
              <!-- <a-input
                allowClear
                v-decorator="[
                  'account_name',
                  {
                    rules: [{ required: true, message: '请输入账户类型' }],
                  },
                ]"
                placeholder="请输入账户类型"
              ></a-input> -->
              <a-select
                v-decorator="[
                  'account_name',
                  {
                    rules: [{ required: true, message: '请选择账户类型' }],
                  },
                ]"
                placeholder="请选择账户类型"
              >
                <a-select-option value="TRC">TRC</a-select-option>
                <a-select-option value="ERC20">ERC20</a-select-option>
                <a-select-option value="ETH">ETH</a-select-option>
                <a-select-option value="BTC">BTC</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12"
            ><a-form-item label="支付别名">
              <a-input
                allowClear
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入支付别名' }],
                  },
                ]"
                placeholder="请输入支付别名"
              ></a-input> </a-form-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="最小充值金额"
              :labelCol="{
                span: 7,
              }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                allowClear
                v-decorator="[
                  'min_recharge',
                  {
                    rules: [{ required: true, message: '请输入最小充值金额' }],
                  },
                ]"
                placeholder="请输入最小充值金额"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12"
            ><a-form-item
              label="最大充值金额"
              :labelCol="{
                span: 7,
              }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                allowClear
                v-decorator="[
                  'max_recharge',
                  {
                    rules: [{ required: true, message: '请输入最大充值金额' }],
                  },
                ]"
                placeholder="请输入最大充值金额"
              ></a-input> </a-form-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item :label="genre == 1 ? '钱包地址' : '银行账号'">
              <a-input
                allowClear
                v-decorator="[
                  'account_number',
                  {
                    rules: [{ required: true, message: '请输入' }],
                  },
                ]"
                :placeholder="
                  genre == 1 ? '请输入钱包地址' : '请输入银行开户地'
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注">
              <a-textarea
                placeholder="请输入备注"
                :rows="2"
                v-decorator="['remark']"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="状态">
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'status',
                  {
                    rules: [{ required: true, message: '请选择状态' }],
                  },
                ]"
              >
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="账户类型" v-show="false">
              <a-select
                v-decorator="[
                  'account_type',
                  {
                    initialValue: 1,
                    rules: [{ required: true, message: '请选择账户类型' }],
                  },
                ]"
                show-search
                :disabled="titleStatus == 2 ? true : false"
                @change="handleChange"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in selectArr"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row> </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const selectArr = [
  {
    id: 1,
    name: "USDT",
  },
  // {
  //   id: 2,
  //   name: "银行卡",
  // },
];
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
const fields = [
  "id",
  "account_type",
  "name",
  "account_name",
  "account_number",
  "min_recharge",
  "max_recharge",
  "status",
  "remark",
];
export default {
  name: "AddPayment",
  props: {
    isAddShow: {
      type: Boolean,
      default: false,
    },
    AddConfirmLoading: {
      type: Boolean,
      default: false,
    },
    AddModules: {
      type: Object,
      default: () => {},
    },
    titleStatus: {
      type: Number,
      default: 1,
    },
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
    return {
      selectArr,
      payTypeList,
      form: this.$form.createForm(this),
      genre: 1, //判断银行卡还是USDT
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("AddModules", () => {
      this.AddModules && this.form.setFieldsValue(this.AddModules);
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
    //   选择器事件
    handleChange(value) {
      console.log("==================>value", value);
      this.genre = value;
      //   console.log(`selected ${value}`);
    },
  },
};
</script>

<style></style>
