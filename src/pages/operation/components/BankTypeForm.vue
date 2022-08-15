<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增银行卡类型' : '修改银行卡类型'"
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

        <a-form-item label="银行代码">
          <a-input
            placeholder="请输入银行代码"
            allowClear
            v-decorator="[
              'code',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    message: '银行代码是必须的',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="银行名称">
          <a-input
            placeholder="请输入银行名称"
            allowClear
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '银行名称是必须的',
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
const fields = ["id", "name", "code"];
export default {
  name: "GeneralFrom",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isStatus: {
      type: Number,
      default: 0,
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

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > label {
    width: 100px;
  }
  margin-bottom: 10px;
}
</style>
