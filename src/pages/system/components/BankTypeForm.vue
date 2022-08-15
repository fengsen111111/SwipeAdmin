<!--
 * @Author: your name
 * @Date: 2022-03-22 17:31:11
 * @LastEditTime: 2022-03-22 17:44:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\system\components\BankTypeForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="titleStatus == 1 ? '新增银行卡类型' : '修改银行卡类型'"
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
          label="国家"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 16, offset: 1 }"
        >
          <a-select
            v-decorator="[
              'country_id',
              { rules: [{ required: true, message: '请选择国家' }] },
            ]"
            placeholder="请选择国家"
          >
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in CountrySelectList"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="银行代码">
          <a-input
            allowClear
            v-decorator="[
              'code',
              { rules: [{ required: true, message: '请输入' }] },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item label="银行名称">
          <a-input
            allowClear
            v-decorator="[
              'name',
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
const fields = ["id", "name", "code", "country_id"];
export default {
  name: "BankTypeForm",
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
    CountrySelectList: {
      type: Array,
      default: () => [],
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
  methods: {
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    // },
    proxyFilter(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style>
</style>