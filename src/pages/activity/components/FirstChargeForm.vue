<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增充值赠送' : '修改充值赠送'"
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
        <a-form-item label="人数">
          <a-input
            allowClear
            placeholder="请输入人数"
            v-decorator="[
              'persons',
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
        <a-form-item label="奖励金额">
          <a-input
            allowClear
            placeholder="请输入奖励金额"
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
        <a-form-item label="权重">
          <a-input
            allowClear
            placeholder="请输入权重"
            v-decorator="[
              'weight',
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
const fields = ["id", "persons", "amount", "weight"];
export default {
  name: "FirstRechargeForm",
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
        span: 4,
      },
      wrapperCol: {
        span: 18,
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