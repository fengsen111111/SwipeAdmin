<!--
 * @Author: Fuyi002 2669702453@qq.com
 * @Date: 2022-05-19 14:09:55
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @LastEditTime: 2022-05-20 14:04:45
 * @FilePath: \lottery-admin\src\pages\mining\components\MiningLevelForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="titleStatus == 1 ? '新增等级' : '编辑等级'"
    :confirm-loading="confirmLoading"
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
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="平台币">
          <a-select
            placeholder="请选择平台币"
            :disabled="titleStatus == 2"
            v-decorator="[
              'issued_currency_id',
              {
                rules: [{ required: true, message: '请选择平台币' }],
                initialValue: 0,
              },
            ]"
            @change="handleChange"
          >
            <a-select-option :key="0" :value="0">无</a-select-option>
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in AllPlatformCurrencyList"
              >{{ item.symbol }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="赠送比例" v-show="issued">
          <a-input-number
            style="width: 100%;"
            placeholder="请输入赠送比例,千分比:0~1000"
            v-decorator="[
              'gift_ratio',
              {
                rules: [
                  { required: true, message: '请输入赠送比例,千分比:0~1000' },
                ],
                initialValue: 0,
              },
            ]"
            :min="0"
            :max="1000"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="等级名称">
          <a-input
            allowClear
            placeholder="请输入等级名称"
            v-decorator="[
              'level',
              {
                rules: [{ required: true, message: '请输入等级名称' }],
              },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "level", "issued_currency_id", "gift_ratio"];
export default {
  name: "MiningLevelForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    titleStatus: {
      type: Number,
      default: 1,
    },
    AllPlatformCurrencyList: {
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
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return {
      form: this.$form.createForm(this),
      issued: 0,
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
    handleChange(value) {
      this.issued = value;
      console.log("==================>value", value);
    },
  },
};
</script>

<style></style>
