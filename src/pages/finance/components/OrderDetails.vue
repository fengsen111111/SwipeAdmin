<template>
  <a-modal
    :visible="visible"
    :width="800"
    title="订单详情"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-descriptions
        bordered
        :column="{ xxl: 2, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }"
        title="提现详情"
        size="small"
      >
        <a-descriptions-item label="会员昵称">
          {{ userModules.nickname }}
        </a-descriptions-item>

        <a-descriptions-item label="手续费">{{
          userModules.service_charge
        }}</a-descriptions-item>
        <a-descriptions-item label="首次出款"
          >{{ userModules.isFirstWithdrawal ? "是" : "否" }}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="提现积分">
          {{ userModules.integral }}
        </a-descriptions-item> -->
        <a-descriptions-item label="申请提现金额">{{
          userModules.money
        }}</a-descriptions-item>
        <a-descriptions-item label="实际提现金额">
          {{ userModules.payment }}
        </a-descriptions-item>
        <a-descriptions-item label="会员手机号">{{
          userModules.phone
        }}</a-descriptions-item>
        <a-descriptions-item label="申请时间" :span="2">
          {{ userModules.create_time | formDate }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions
        bordered
        :column="{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }"
        title="盈利信息"
        size="small"
        style="margin-top: 10px"
      >
        <a-descriptions-item label="今日充值">
          {{ userModules.todayRecharge }}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="今日输赢">
          <div style="color: red; display: flex">
            <a-badge status="processing" />
            {{
              userModules.todayWinOrLose > 0 ? "用户赢" : "用户输"
            }}&nbsp;&nbsp;&nbsp; {{ userModules.todayWinOrLose }}
          </div>
        </a-descriptions-item> -->
        <!-- <a-descriptions-item label="今日流水">
          {{ userModules.todayStream }}
        </a-descriptions-item>
        <a-descriptions-item label="总流水">
          {{ userModules.totalStream }}
        </a-descriptions-item> -->
        <a-descriptions-item label="总充值">
          {{ userModules.totalRecharge }}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="总输赢">
          <div style="color: red; display: flex">
            <a-badge status="processing" />
            {{
              userModules.totalWinOrLose > 0 ? "用户赢" : "用户输"
            }}&nbsp;&nbsp;&nbsp;{{ userModules.totalWinOrLose }}
          </div>
        </a-descriptions-item> -->
      </a-descriptions>
      <a-descriptions
        bordered
        :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }"
        title="提现账户"
        size="small"
        style="margin-top: 10px"
      >
        <a-descriptions-item label="开户银行">
          {{ userModules.bank_name }}</a-descriptions-item
        >
        <a-descriptions-item label="开户姓名">
          {{ userModules.account_holder }}
        </a-descriptions-item>
        <a-descriptions-item label="银行账户">{{
          userModules.bank_number
        }}</a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ userModules.phone }}
        </a-descriptions-item>
        <a-descriptions-item label="IFSC code" :span="2">
          {{ userModules.ifsc_code }}
        </a-descriptions-item>
      </a-descriptions>

      <a-form :form="form" v-bind="formLayout" style="margin-top: 20px">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="前台订单备注">
          <a-textarea
            auto-size
            placeholder="请输入"
            v-decorator="['front_message']"
          />
        </a-form-item>
        <a-form-item label="后台订单备注">
          <a-textarea
            auto-size
            placeholder="请输入"
            v-decorator="['message']"
          />
        </a-form-item>
        <!-- <a-form-item label="用户备注">
          <a-textarea
            auto-size
            placeholder="请输入"
            v-decorator="['remarks']"
          />
        </a-form-item> -->
        <a-form-item label="代付通道">
          <a-select
            v-decorator="[
              'pay_type',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              },
            ]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in aisleType" :key="item.name">
              {{ item.alias }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button
        type="danger"
        @click="
          () => {
            $emit('handleFail');
          }
        "
        >不通过</a-button
      >
      <a-button
        type="primary"
        @click="
          () => {
            $emit('ok');
          }
        "
        >通过</a-button
      >
      <a-button
        @click="
          () => {
            $emit('handleManual');
          }
        "
        >手动出款</a-button
      >
    </template>
  </a-modal>
</template>

<script>
const fields = ["id", "message", "front_message", "type"];
export default {
  name: "OrderForm",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    userModules: {
      type: Object,
      default: () => {},
    },
    aisleType: {
      type: Array,
      default: () => [],
    },
    modules: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return { form: this.$form.createForm(this) };
  },
  created() {
   
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
       console.log("213123123",this.aisleType);
    });
  },
};
</script>

<style lang="less" scoped>
</style>
