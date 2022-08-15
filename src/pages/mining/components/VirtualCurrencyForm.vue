<!--
 * @Author: your name
 * @Date: 2022-03-01 09:57:26
 * @LastEditTime: 2022-06-09 10:52:47
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\mining\components\VirtualCurrencyform.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增虚拟货币' : '修改虚拟货币'"
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
        <!-- <a-form-item>??????</a-form-item> -->
        <!-- <a-form-item label="货币种类">
          <a-select
            v-decorator="[
              'currency_id',
              {
                rules: [{ required: true, message: '请选择货币种类' }],
              },
            ]"
            show-search
            :filter-option="proxyFilter"
          >
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in allCurrencyList"
              >{{ item.symbol }}</a-select-option
            >
          </a-select>
        </a-form-item> -->
        <a-form-item label="项目名称">
          <a-input
            allowClear
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入项目名称' }],
              },
            ]"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <!-- <a-row>
          <a-col :span="12"> </a-col>
        </a-row> -->
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="日收益率"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="0.001"
                :max="1"
                :step="0.001"
                v-decorator="[
                  'yield',
                  {
                    rules: [{ required: true, message: '请输入收益率' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="申请天数"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="1"
                :max="1000000"
                :step="1"
                v-decorator="[
                  'apply_days',
                  {
                    rules: [{ required: true, message: '请输入申请天数' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="权重"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="0"
                :max="1000000000"
                :step="1"
                v-decorator="[
                  'weight',
                  {
                    rules: [{ required: true, message: '请输入权重值' }],
                  },
                ]"
                placeholder="请输入"
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["id", "yield", "apply_days", "name", "weight"];
export default {
  name: "VirtualCurrencyForm",
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
    // allCurrencyList: {
    //   type: Array,
    //   default: () => [],
    // },
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
  },
};
</script>

<style></style>
