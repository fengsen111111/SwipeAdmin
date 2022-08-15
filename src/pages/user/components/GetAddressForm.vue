<!--
 * @Author: your name
 * @Date: 2022-04-02 11:26:37
 * @LastEditTime: 2022-05-27 17:07:19
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\user\components\GetAddressForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    title="编辑钱包地址"
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
        <a-form-item
          label="钱包类型"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-select v-decorator="['type']" placeholder="请选择钱包类型">
            <a-select-option value="TRC">TRC</a-select-option>
            <a-select-option value="ERC20">ERC20</a-select-option>
            <a-select-option value="ETH">ETH</a-select-option>
            <a-select-option value="BTC">BTC</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="钱包地址"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 18, offset: 1 }"
        >
          <a-input
            v-decorator="['address']"
            allowClear
            placeholder="请输入钱包地址"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "type", "address"];
export default {
  name: "GetAddressForm",
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
      form: this.$form.createForm(this),
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
};
</script>

<style></style>
