<template>
  <a-modal
    :title="status === 1 ? '新增员工代理' : '修改员工代理'"
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
                    min: 2,
                    message: '请输入昵称',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            @blur="validateUsername"
            placeholder="请输入管理员用户名"
            allowClear
            v-decorator="[
              'username',
              {
                rules: [
                  { required: true, message: '请输入用户名' },
                  { min: 2, message: '用户名不能少于2位' },
                ],
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
        <a-form-item label="语言">
          <a-select placeholder="请选择默认语言" v-decorator="['language']">
            <a-select-option value="CN">中文</a-select-option>
            <!-- <a-select-option value="US">英语</a-select-option> -->
            <!-- <a-select-option value="IDA">印地语</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item
          label="代理类型"
          :labelCol="{
            span: 4,
          }"
          :wrapperCol="{ span: 14 }"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'agent_type_type',
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
            <a-radio :value="0"> 不是代理 </a-radio>
            <a-radio :value="1"> 全线 </a-radio>
            <a-radio :value="2">直推</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="是否可充值"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'is_recharge',
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
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="是否可登录"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'is_login',
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
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="是否可提现"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'is_withdrawal',
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
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="是否可购买"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'is_buy',
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
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          label="代理是否可以给会员赠送礼金"
          :labelCol="{
            span: 10,
          }"
          :wrapperCol="{ span: 14 }"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'is_give_gift',
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
            <a-radio :value="0"> 不可以 </a-radio>
            <a-radio :value="1"> 可以 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// 表单字段
const fields = [
  "nickname",
  "password",
  "username",
  "id",
  "is_buy",
  "is_withdrawal",
  "is_login",
  "is_recharge",
  "agent_type_type",
  "is_give_gift",
  "language",
];
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
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    // 不能输入中文
    validateNickname(e) {
      console.log("==================>e.target.value", e.target.id);
      // 校验函数返回 true 表示校验通过，false 表示不通过
      if (
        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
          e.target.value
        )
      ) {
        const arr = [
          {
            message: "不能输入中文!",
            field: "nickname",
          },
        ];
        // console.log('不能输入中文')
        this.form.setFields({ nickname: { value: "", errors: arr } });
        // this.nickname = ''
      }
    },
    validateUsername(e) {
      console.log("==================>e.target.value", e.target.id);
      // 校验函数返回 true 表示校验通过，false 表示不通过
      if (
        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
          e.target.value
        )
      ) {
        const arr = [
          {
            message: "不能输入中文!",
            field: "username",
          },
        ];
        // console.log('不能输入中文')
        this.form.setFields({ username: { value: "", errors: arr } });
        // this.nickname = ''
      }
    },
  },
};
</script>