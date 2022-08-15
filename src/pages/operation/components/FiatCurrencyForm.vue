<!--
 * @Author: your name
 * @Date: 2022-03-22 14:37:46
 * @LastEditTime: 2022-03-22 14:57:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\components\FiatCurrencyForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="titleStatus == 1 ? '新增法币' : '修改法币'"
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
          <a-input
            allowClear
            v-decorator="['id', { initialValue: 0 }]"
            disabled
          />
        </a-form-item>
        <a-form-item label="法币简称">
          <a-input
            allowClear
            v-decorator="[
              'short_name',
              { rules: [{ required: true, message: '请输入' }] },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item label="中文名称">
          <a-input
            allowClear
            v-decorator="[
              'zh_name',
              { rules: [{ required: true, message: '请输入' }] },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item label="汇率">
          <a-input
            allowClear
            v-decorator="[
              'exchange_rate',
              { rules: [{ required: true, message: '请输入' }] },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "short_name", "zh_name", "exchange_rate"];
export default {
  name: "FiatCurrencyForm",
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
    titleStatus: {
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
      form: this.$form.createForm(this),
      proxyList: [],
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

<style>
</style>