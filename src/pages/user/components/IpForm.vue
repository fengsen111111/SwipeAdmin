<template>
  <a-modal
    :visible="visible"
    title="编辑"
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
            v-decorator="['create_time', { initialValue: 0 }]"
            disabled
          />
        </a-form-item>
        <a-form-item label="IP地址">
          <a-input
            placeholder="请输入IP"
            allowClear
            v-decorator="[
              'ip',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入IP',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="是否加入黑名单"
          :labelCol="{
            span: 7,
          }"
          :wrapperCol="{ span: 16 }"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'is_blacklist',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              },
            ]"
          >
            <a-radio :value="0"> 否 </a-radio>
            <a-radio :value="1"> 是 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["create_time", "ip", "is_blacklist"];

export default {
  name: "IPForm",
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
      console.log(this.modules);
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
};
</script>

<style lang="less" scoped>
</style>
