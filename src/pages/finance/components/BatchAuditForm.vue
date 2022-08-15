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
    <a-form :form="form" v-bind="formLayout">
      <!-- id -->
      <a-form-item v-show="false" label="ID">
        <a-input v-decorator="['id']" disabled />
      </a-form-item>
      <!-- 审核 -->
      <a-form-item label="审核">
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
          <a-radio :value="2"> 审核通过 </a-radio>
          <a-radio :value="3"> 审核不通过 </a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 驳回理由 -->
      <a-form-item label="原因">
        <a-textarea
          placeholder="如果审核不通过，填入理由"
          v-decorator="['remark']"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import Cookie from "js-cookie";

const fields = ["id", "status", "remark"];
export default {
  name: "BatchAuditForm",
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
      loadings: false,
      form: this.$form.createForm(this),
      headers: {
        token: "",
      },
    };
  },
  created() {
    this.headers.token = Cookie.get("token");
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

<style lang="scss" scoped></style>
