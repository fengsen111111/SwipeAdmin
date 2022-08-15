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
        <a-form-item label="最大金额">
          <a-input
            allowClear
            placeholder="请输入"
            v-decorator="[
              'max_money',
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
        <a-form-item label="最小金额">
          <a-input
            allowClear
            placeholder="请输入"
            v-decorator="[
              'min_money',
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
        <a-form-item label="赠送比例">
          <a-input
            allowClear
            placeholder="请输入"
            v-decorator="[
              'ratio',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    pattern: new RegExp(/^(0){1}.[1-5]$/),
                    message: '请输入数字不能大于0.5',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            placeholder="请输入备注"
            v-decorator="['remark']"
            :auto-size="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "max_money", "min_money", "remark", "ratio"];
export default {
  name: "RechargeForm",
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
