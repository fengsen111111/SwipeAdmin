<template>
  <a-modal v-drag-modal :title="status === 1 ? '新增用户' : '修改用户'" :visible="visible" :confirmLoading="loading" @ok="
    () => {
      $emit('ok');
    }
  " @cancel="
  () => {
    $emit('cancel');
  }
">
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="员工代理">
          <a-select placeholder="请选择员工代理" v-decorator="['agent_id']" show-search :filter-option="proxyFilter">
            <a-select-option :key="item.id" :value="item.id" v-for="item in agentAllList">{{ item.nickname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input placeholder="请输入昵称" allowClear v-decorator="[
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
          ]" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input placeholder="请输入管理员用户名" allowClear v-decorator="[
            'username',
            {
              rules: [
                { required: true, message: '请输入用户名' },
                { min: 2, message: '用户名不能少于2位' },
              ],
            },
          ]"></a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password :placeholder="
            status === 1 ? '请输入管理员密码' : '不修改为默认密码'
          " v-decorator="[
  'password',
  {
    rules: [{ required: status === 1, message: '请输入密码' }],
  },
]" allowClear></a-input-password>
        </a-form-item>
        <a-form-item label="支付密码">
          <a-input-password :placeholder="
            status === 1 ? '请输入管理员密码' : '不修改为默认密码'
          " v-decorator="[
  'pay_pwd',
  {
    rules: [{ required: status === 1, message: '请输入支付密码' }],
  },
]" allowClear></a-input-password>
        </a-form-item>
        <a-form-item label="提现打码量">
          <a-input v-decorator="['withdrawal_limit']" placeholder="请输入"></a-input>
        </a-form-item>

        <a-form-item label="用户类型">
          <a-radio-group name="radioGroup" v-decorator="[
            'reg_type',
            {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            },
          ]">
            <a-radio :value="0"> H5注册会员 </a-radio>
            <a-radio :value="1"> 测试会员 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item label="是否可充值" :labelCol="{
              span: 9,
            }" :wrapperCol="{ span: 14 }">
              <a-radio-group name="radioGroup" v-decorator="[
                'is_recharge',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                },
              ]">
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否可登录" :labelCol="{
              span: 9,
            }" :wrapperCol="{ span: 14 }">
              <a-radio-group name="radioGroup" v-decorator="[
                'is_login',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                },
              ]">
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="是否可提现" :labelCol="{
              span: 9,
            }" :wrapperCol="{ span: 14 }">
              <a-radio-group name="radioGroup" v-decorator="[
                'is_withdrawal',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                },
              ]">
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否可购买" :labelCol="{
              span: 9,
            }" :wrapperCol="{ span: 14 }">
              <a-radio-group name="radioGroup" v-decorator="[
                'is_buy',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                },
              ]">
                <a-radio :value="0"> 否 </a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="备注">
          <a-textarea placeholder="请输入备注" :rows="3" v-decorator="['remarks']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import { userService } from "@/services";
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
  "reg_type",
  "remarks",
  "agent_id",
  "pay_pwd",
  "withdrawal_limit",
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
    agentAllList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return {
      form: this.$form.createForm(this),
      proxyList: [],
    };
  },
  created() {
    // this._getProxyUserList();
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
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
    // _getProxyUserList() {
    //   userService.getProxyUserList().then((res) => {
    //     const { code, msg, data } = res.data;
    //     if (code !== 200) return this.$message.error(msg);
    //     this.proxyList = data;
    //   });
    // },
  },
};
</script>