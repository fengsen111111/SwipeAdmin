<template>
  <a-modal
    :title="status === 1 ? '新增管理员' : '修改管理员'"
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
        <a-form-item label="类型" has-feedback>
          <a-select
            v-decorator="[
              'role_id',
              {
                rules: [{ required: true, message: '请选择关联的角色!' }],
              },
            ]"
            placeholder="请选择管理员关联角色"
          >
            <a-select-option
              v-for="item in roleList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.rolename }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input
            placeholder="请输入昵称"
            allowClear
            v-decorator="[
              'nickname',
              {
                rules: [
                  {
                    required: true,
                    min: 5,
                    message: '请输入昵称',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            placeholder="请输入管理员用户名"
            allowClear
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '请输入用户名' }],
              },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            :placeholder="
              status === 1 ? '请输入管理员密码' : '不修改为默认密码'
            "
            v-decorator="[
              'password',
              {
                rules: [{ required: status === 1, message: '请输入密码' }],
              },
            ]"
            allowClear
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// 表单字段
const fields = ["nickname", "password", "username", "role_id", "id"];
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
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
        span: 3,
      },
      wrapperCol: {
        span: 21,
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
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(this.model);
    });
  },
};
</script>