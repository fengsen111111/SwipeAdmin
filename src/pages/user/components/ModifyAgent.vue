<template>
  <a-modal
    :visible="agentVisible"
    title="批量修改代理线"
    :confirmLoading="agentLoading"
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
    <a-spin :spinning="agentLoading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="选择代理">
          <a-select
            placeholder="请选择/搜索代理"
            allowClear
            show-search
            :filter-option="proxyFilter"
            v-decorator="[
              'staff_id',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择代理',
                  },
                ],
              },
            ]"
          >
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in agentAllList"
              >{{ item.nickname }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["staff_id"];

export default {
  name: "ModifyAgent",
  props: {
    agentVisible: {
      type: Boolean,
      default: false,
    },
    agentLoading: {
      type: Boolean,
      default: false,
    },
    agentModules: {
      type: Object,
      default: () => {},
    },
    agentAllList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 17,
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
  methods: {
    proxyFilter(input, option) {
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