<template>
  <a-modal
    :visible="visible"
    :title="pageStatus === 1 ? '新增银行卡' : '修改银行卡'"
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
        <a-form-item label="国家"
          ><a-select disabled v-decorator="['country_id']">
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in CountrySelectList"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>

        <a-form-item label="开户行">
          <a-select
            v-decorator="[
              'bank_id',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择开户行',
                  },
                ],
              },
            ]"
            placeholder="请选择开户行"
          >
            <a-select-option
              v-for="item in bankTypeList"
              :key="item.id"
              :items="item"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="开户人">
          <a-input
            placeholder="请输入开户人"
            v-decorator="[
              'account_holder',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入开户行',
                  },
                ],
              },
            ]"
            allowClear
          />
        </a-form-item>
        <a-form-item label="银行卡号">
          <a-input
            placeholder="请输入银行卡号"
            v-decorator="[
              'bank_num',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入开户行',
                  },
                ],
              },
            ]"
            allowClear
          ></a-input>
        </a-form-item>
        <a-form-item label="预留手机号">
          <a-input
            placeholder="请输入银行预留手机号"
            v-decorator="[
              'phone',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入银行预留手机号',
                  },
                ],
              },
            ]"
            allowClear
          ></a-input>
        </a-form-item>
        <a-form-item label="IFSC">
          <a-input
            placeholder="请输入IFSC CODE"
            v-decorator="['ifsc_code']"
            allowClear
          ></a-input>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            placeholder="请输入邮箱"
            v-decorator="[
              'mail',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱',
                  },
                ],
              },
            ]"
            allowClear
          />
        </a-form-item>
        <!-- <a-form-item label="状态">
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'status',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择状态',
                  },
                ],
              },
            ]"
          >
            <a-radio :value="0">启用</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = [
  "account_holder",
  "bank_num",
  "phone",
  "user_phone",
  "ifsc_code",
  "mail",
  "bank_id",
  "user_id",
  "id",
  "country_id",
];

export default {
  name: "BankForm",
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
      default: () => {},
    },
    bankTypeList: {
      type: Array,
      default: () => [],
    },
    pageStatus: {
      type: Number,
    },
    CountrySelectList: {
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
        span: 18,
      },
    };
    return {
      form: this.$form.createForm(this),
      userLists: [],
      bankTypeDatas: {
        code: "",
        name: "",
      },
      renderedOptions: [], // 已渲染的下拉列表
      filterDataList: [], // 过滤的数据列表 -- 从dataList中过滤出含搜索内容的数据
      searchVal: "", // 搜索的内容
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
  methods: {},
};
</script>

<style lang="less" scoped>
</style>
