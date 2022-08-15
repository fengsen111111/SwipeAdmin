<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增类别' : '修改类别'"
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

        <a-form-item label="类型">
          <a-select placeholder="类型" v-decorator="['type']">
            <a-select-option value="1">H5</a-select-option>
            <a-select-option value="2">App</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分类名称">
          <a-input
            placeholder="请输入"
            allowClear
            v-decorator="[
              'title',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入分类名称',
                  },
                ],
              },
            ]"
          />
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
            <a-radio :value="0">禁用</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="链接地址">
          <a-input
            placeholder="请输入链接地址"
            allowClear
            v-decorator="[
              'url',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入链接地址',
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
const fields = ["id", "type", "title", "status", "url"];
export default {
  name: "JumpForm",
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
        span: 5,
      },
      wrapperCol: {
        span: 19,
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
