<!--
 * @Author: your name
 * @Date: 2022-03-11 17:40:19
 * @LastEditTime: 2022-03-21 18:14:45
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\components\ReceivingAccountForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增入款账户' : '修改入款账户'"
    :confirmLoading="loading"
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
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            allowClear
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入名称' }],
              },
            ]"
            placeholder="请输入名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="账户类型">
          <a-select
            v-decorator="[
              'account_type',
              {
                initialValue: 1,
                rules: [{ required: true, message: '请选择账户类型' }],
              },
            ]"
            show-search
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
        <a-form-item label="账户姓名">
          <a-input
            allowClear
            v-decorator="[
              'account_name',
              {
                rules: [{ required: true, message: '请输入账号姓名' }],
              },
            ]"
            placeholder="请输入账号姓名"
          ></a-input>
        </a-form-item>
        <a-form-item :label="genre == 1 ? 'USDT地址' : '银行账号'">
          <a-input
            allowClear
            v-decorator="[
              'account_number',
              {
                rules: [{ required: true, message: '请输入' }],
              },
            ]"
            :placeholder="genre == 1 ? '请输入USDT地址' : '请输入银行开户地'"
          ></a-input>
        </a-form-item>
        <a-form-item label="开户银行" v-show="genre == 2">
          <a-input
            allowClear
            v-decorator="['bank_account_name']"
            placeholder="请输入开户银行"
          ></a-input>
        </a-form-item>
        <a-form-item label="银行开户地" v-show="genre == 2">
          <a-input
            allowClear
            v-decorator="['bank_account_address']"
            placeholder="请输入银行开户地"
          ></a-input>
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="单笔最小金额"
              :labelCol="{
                span: 12,
              }"
              :wrapperCol="{ span: 10 }"
            >
              <a-input-number
                :min="1"
                :max="1000000"
                :step="1"
                v-decorator="[
                  'min_recharge',
                  {
                    rules: [{ required: true, message: '请输入最小金额' }],
                  },
                ]"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="排序"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="0"
                :max="1000"
                :step="1"
                v-decorator="['sort']"
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
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
            <a-radio :value="2">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            placeholder="请输入备注"
            :rows="3"
            v-decorator="['remark']"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = [
  "id",
  "account_type",
  "name",
  "account_name",
  "account_number",
  "min_recharge",
  "sort",
  "status",
  "remark",
  "bank_account_name",
  "bank_account_address",
];
const selectArr = [
  {
    id: 1,
    name: "USDT",
  },
  {
    id: 2,
    name: "银行卡",
  },
];
export default {
  name: "ReceivingAccountForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Object,
      default: () => {},
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return {
      selectArr,
      form: this.$form.createForm(this),
      proxyList: [],
      genre: 1, //判断银行卡还是USDT
      TrueRules: [],
    };
  },
  created() {
    // this._getProxyUserList();
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    //   选择器事件
    handleChange(value) {
      console.log("==================>value", value);
      this.genre = value;
      //   console.log(`selected ${value}`);
    },
  },
};
</script>

<style>
</style>