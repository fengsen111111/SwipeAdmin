<template>
  <a-modal
    :visible="visible"
    :title="status === 1 ? '新增Ip' : '修改Ip'"
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
        <a-form-item label="IP">
          <a-input
            placeholder="请输入"
            allowClear
            v-decorator="[
              'code',
              { rules: [{ required: true, message: '请输入' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-input placeholder="请输入" allowClear v-decorator="['remark']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "code", "remark"];
export default {
  name: "IpForm",
  props: {
    visible: {
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
