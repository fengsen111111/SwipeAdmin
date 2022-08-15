<template>
  <a-modal :visible="visible" title="编辑货币钱包" :confirmLoading="loading" width="1300px" @ok="handleOk" @cancel="
    () => {
      $emit('cancel');
    }
  ">
    <a-spin :spinning="loading">
      <a-form-model ref="dynamicValidateForm" :model="dynamicValidateForm">
        <a-row v-for="item in dynamicValidateForm.currency_walletList" :key="item.id" ref="reference">
          <a-col :span="2">
            <a-form-model-item label="">
              <a-input allowClear placeholder="请输入锁定币数量" disabled="" :data-label="item.symbol" :value="item.symbol">
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="4">
            <a-form-model-item label="币数量" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 0 }">
              <a-input v-model="item.wallet" allowClear placeholder="请输入锁定币数量" disabled=""></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="4">
            <a-form-model-item label="锁定数量" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 0 }">
              <a-input allowClear v-model="item.locked" placeholder="请输入锁定币数量" disabled=""></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="4">
            <a-form-model-item label="类型" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 0 }">
              <a-select v-model="item.type" placeholder="请选择">
                <a-select-option key="1" value="1">钱包</a-select-option>
                <a-select-option key="2" value="2">锁定</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="4">
            <a-form-model-item label="操作项" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 0 }">
              <a-select v-model="item.edit_type" placeholder="请选择">
                <a-select-option key="1" value="1">减扣</a-select-option>
                <a-select-option key="2" value="2">增加</a-select-option>
                <a-select-option key="3" value="3">解锁/锁定</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="3">
            <a-form-model-item label="金额" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18, offset: 0 }">
              <a-input allowClear placeholder="请输入金额" v-model="item.value">
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2" style="margin-left:10px">
            <a-form-model-item label="">
              <a-button type="primary" @click="handleSubmit('dynamicValidateForm', item.symbol)">提交</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: "EditWalletForm",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      dynamicValidateForm: {
        currency_walletList: [],
      },
      rules: {
        value: [
          { required: true, message: '123', trigger: 'change' }
        ]
      },
    };
  },

  created() {
    // 防止表单未注册

    console.log(this.currency_walletList);
    // fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("currency_walletList", () => {
      console.log("执行");
    });
  },
  methods: {
    // 验证不能大于八位
    validateEight(value,) {
      if (value.length > 8) {
        return this.$message.error('不能大于八位')
      } else {
        return
      }
    },
    handleSubmit(formName, bitText) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const result = {}
          this.dynamicValidateForm.currency_walletList.forEach((item) => {
            if (item.symbol == bitText) {
              result.id = item.id
              result.wallet = item.wallet
              result.locked = item.locked
              result.type = item.type
              result.edit_type = item.edit_type
              result.value = item.value
            }
          })
          if (result.value.length > 8) {
            this.$message.error('不能大于八位')
          } else {

            this.$emit("ok", result);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleOk() {

      this.$emit("handleOkClose");
    },
    handleBlur(item) {
      console.log("==================>item", item);
    },
    handleChange(change) {
      console.log("==================>change", change);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
