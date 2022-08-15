
<template>
  <a-modal
    :visible="isVisible"
    title="审核"
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
        <a-form-item label="状态">
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'status',
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
            <a-radio :value="1"> 通过 </a-radio>
            <a-radio :value="2">不通过</a-radio>
          </a-radio-group>
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
const fields = ["id", "remark", "status"];
export default {
  name: "GroupRewardFrom",
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
      console.log("==================>this.modules", this.modules);
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
};
</script>

<style lang="scss" scoped>
</style>
