<template>
  <a-modal
    :title="status === 1 ? '新增商品分类' : '修改商品分类'"
    :visible="visible"
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
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="分类名称">
          <a-input
            placeholder="请输入分类名称"
            allowClear
            v-decorator="[
              'category',
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
        <a-form-item label="中文释义">
          <a-input
            placeholder="请输入分类名称中文释义"
            allowClear
            v-decorator="[
              'category_zh',
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
        <a-form-item label="状态">
          <a-radio-group
            name="radioGroup"
            defaultChecked
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
            <a-radio :value="0"> 禁用 </a-radio>
            <a-radio :value="1"> 启用 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// 表单字段
const fields = ["id", "category_zh", "category", "status"];
export default {
  name: "StaffForm",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    modules: {
      type: Object,
      default: () => null,
    },

    status: {
      type: Number,
      default: 1,
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