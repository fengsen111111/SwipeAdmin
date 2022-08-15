
// **********************************************
// 创建时间: 创建时间  2022-02-15 15:51:43
// description:'创建专属商品'
// **********************************************
<template>
  <a-modal
    :title="`新人专享总价格(${goodMoneys})`"
    :visible="exclusivelyVisible"
    :confirmLoading="exclusivelyLoading"
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
    <a-spin :spinning="exclusivelyLoading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="用户ID">
          <a-input
            placeholder="请输入用户ID"
            allowClear
            v-decorator="[
              'user_id',
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
        <a-form-item label="总数">
          <a-input
            placeholder="请输入总数(份)"
            allowClear
            @change="changeTotal"
            v-decorator="[
              'amount',
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
        <a-form-item label="最大购买限制">
          <a-input
            placeholder="请输入最大购买限制"
            allowClear
            v-decorator="[
              'limited',
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
        <a-form-item label="每份价格">
          <a-input
            placeholder="请输入每份价格"
            allowClear
            disabled
            v-decorator="[
              'per_price',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入没份价格',
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
            <a-radio :value="0"> 预售 </a-radio>
            <a-radio :value="1"> 立即进行 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// 表单字段
const fields = ["amount", "limited", "per_price", "user_id"];
export default {
  name: "CreateExclsively",
  props: {
    exclusivelyVisible: {
      type: Boolean,
      required: true,
    },
    exclusivelyLoading: {
      type: Boolean,
      default: () => false,
    },
    exclusivelyModules: {
      type: Object,
      default: () => null,
    },
    goodMoneys: {
      type: String,
      default: "",
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
      this.exclusivelyModules &&
        this.form.setFieldsValue(this.exclusivelyModules);
    });
  },
  methods: {
    changeTotal(val) {
      const total = this.goodMoneys / Number(val.target.value);
      const reg = /^(\d+)(.\d{0,2})?$/;
      if (!reg.test(total)) {
        this.$message.error("每份不能大于两位小数");
      }
      this.form.setFieldsValue({
        per_price: total,
      });
    },
  },
};
</script>