<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增签到礼包' : '修改签到礼包'"
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
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            allowClear
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="库存">
          <a-input
            allowClear
            v-decorator="[
              'stock',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="产品金额">
          <a-input
            allowClear
            v-decorator="[
              'amount',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    pattern: new RegExp(/^(\d+).(\d?){2}$/),
                    message: '请输入数字',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="每日回报金额">
          <a-input
            allowClear
            v-decorator="[
              'daily_rebate',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    pattern: new RegExp(/^(\d+).(\d?){2}$/),
                    message: '请输入数字',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="投资回收期">
          <a-input
            allowClear
            v-decorator="[
              'payback_cycle',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = [
  "id",
  "stock",
  "payback_cycle",
  "daily_rebate",
  "amount",
  "name",
];
export default {
  name: "SignForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    status: {
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
      form: this.$form.createForm(this),
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
};
</script>

<style lang="scss" scoped>
</style>
