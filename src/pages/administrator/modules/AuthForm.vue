<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增权限' : '修改权限'"
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
        <a-form-item label="上级名称" has-feedback>
          <a-select
            v-decorator="['parent_id']"
            placeholder="请选择上级权限,一级为0"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in roleList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="权限名称">
          <a-input
            placeholder="请输入权限名称"
            allowClear
            v-decorator="[
              'permission_name',
              {
                rules: [
                  {
                    required: true,
                    min: 3,
                    message: '权限名称是必须的',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="权限地址">
          <a-input
            placeholder="请输入权限地址"
            allowClear
            v-decorator="[
              'address',
              {
                rules: [{ required: true, message: '请输入权限地址' }],
              },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["parent_id", "permission_name", "address", "id"];
export default {
  name: "AuthForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modeles: {
      type: Object,
      default: () => {},
    },
    roleList: {
      type: Array,
      default: () => [],
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 17,
      },
    };
    return {
      form: this.$form.createForm(this, { parent_id: 0 }),
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modeles", () => {
      console.log(this.modeles);
      this.modeles && this.form.setFieldsValue(this.modeles);
    });
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>
