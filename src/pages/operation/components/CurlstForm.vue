<!--
 * @Author: your name
 * @Date: 2022-03-10 11:34:27
 * @LastEditTime: 2022-03-10 12:26:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\components\CurlstForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    title="新增榜单数据"
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
        <a-form-item label="人数">
          <a-input-number
            :min="1"
            :max="1000000"
            :step="1"
            v-decorator="[
              'number',
              {
                rules: [{ required: true, message: '请设置人数' }],
              },
            ]"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="币种">
          <a-select
            v-decorator="[
              'currency',
              {
                rules: [{ required: true, message: '请选择货币种类' }],
              },
            ]"
            show-search
            :filter-option="proxyFilter"
          >
            <a-select-option
              :key="item.id"
              :value="item.symbol"
              v-for="item in allCurrencyList"
              >{{ item.symbol }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="起始金额"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="0"
                :max="1000000"
                :step="1"
                @change="onChange"
                v-decorator="[
                  'money',
                  {
                    rules: [{ required: true, message: '请输入起始金额' }],
                  },
                ]"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结束金额"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="minmoney"
                :max="1000000"
                :step="1"
                v-decorator="['money1']"
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "number", "currency", "money", "money1"];
export default {
  name: "CurlstForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Object,
      default: () => {},
    },
    status: {
      type: Number,
      default: 1,
    },
    allCurrencyList: {
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
      minmoney: 0,
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
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    // },
    proxyFilter(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    onChange(value) {
      //   console.log("==================>value", value);
      if (value) {
        this.minmoney = value;
      } else {
        this.minmoney = 1;
      }
    },
  },
};
</script>

<style>
</style>