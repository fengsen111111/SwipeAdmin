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
        <a-form-item label="分类名称">
          <a-input
            placeholder="请输入"
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
        <a-form-item label="分类名称释义">
          <a-input
            placeholder="请输入"
            allowClear
            v-decorator="[
              'category_zh',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入分类名称释义',
                  },
                ],
              },
            ]"
          />
        </a-form-item>

        <a-form-item
          label="分类能添加几条数据"
          :labelCol="{ span: 7 }"
          :wrapperCol="{ span: 17, offset: 0 }"
        >
          <a-input
            placeholder="请输入,0=不限制"
            allowClear
            v-decorator="['max_number']"
          ></a-input>
        </a-form-item>
        <a-form-item label="状态" v-show="status !== 1">
          <a-radio-group name="radioGroup" v-decorator="['status']">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "category_zh", "category", "status", "max_number"];
export default {
  name: "ArticleFormType",
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
