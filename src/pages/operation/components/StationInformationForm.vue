<template>
  <a-modal
    :visible="isVisible"
    :confirmLoading="loading"
    :width="650"
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
        <!-- id -->
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <!-- 标题 -->
        <a-form-item label="标题">
          <a-input
            placeholder="请输入标题"
            allowClear
            v-decorator="[
              'title',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 内容 -->
        <a-form-item label="内容">
          <a-textarea
            :rows="4"
            placeholder="内容"
            :maxlength="6"
            v-decorator="[
              'content',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入内容',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- id -->
        <a-form-item label="id">
          <a-textarea
            :rows="4"
            placeholder="接受站内信用户id集合，0-所有人 非0-用户id以英文逗号分割"
            :maxlength="6"
            v-decorator="[
              'user_ids',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入内容',
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
const fields = ["id", "title", "content", "user_ids"];
export default {
  name: "StationInformationForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
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
      loadings: false,
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

  methods: {},
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
