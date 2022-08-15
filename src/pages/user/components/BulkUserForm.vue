<template>
  <a-modal
    :visible="visible"
    title="批量添加测试会员"
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
        <a-form-item label="批量添加数量">
          <a-input
            placeholder="请输入数量"
            allowClear
            v-decorator="[
              'number',
              {
                rules: [
                  {
                    required: true,
                    message: '数量是必须的',
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
const fields = ["number"];

export default {
  name: "BulkUserForm",
  props: {
    visible: {
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
        span: 5,
      },
      wrapperCol: {
        span: 17,
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
      console.log(this.modules);
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
};
</script>

<style lang="less" scoped>
</style>