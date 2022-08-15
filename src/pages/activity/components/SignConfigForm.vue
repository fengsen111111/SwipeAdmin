<!--
 * @Author: your name
 * @Date: 2022-03-18 14:43:38
 * @LastEditTime: 2022-03-18 15:04:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\activity\components\SignConfigForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="titleStatus == 1 ? '新增签到配置' : '修改签到配置'"
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
          label="可领取金额"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 19 }"
        >
          <a-input
            v-decorator="[
              'coinPerHour',
              {
                rules: [{ required: true, message: '请输入' }],
              },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item label="最低金额">
          <a-input
            v-decorator="[
              'downLimit',
              {
                rules: [{ required: true, message: '请输入' }],
              },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item label="最高金额">
          <a-input
            v-decorator="[
              'upLimit',
              {
                rules: [{ required: true, message: '请输入' }],
              },
            ]"
            placeholder="请输入"
          ></a-input>
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
const fields = ["id", "coinPerHour", "downLimit", "upLimit", "remark"];
export default {
  name: "SignConfigForm",
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
      // proxyList: [],
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
  methods: {},
};
</script>

<style>
</style>