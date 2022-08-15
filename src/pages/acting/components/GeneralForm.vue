<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增总代理' : '修改总代理'"
    :confirmLoading="loading"
    width="800px"
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
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-row>
          <a-col :span="12">
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
                        min: 1,
                        message: '请输入昵称',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码">
              <a-input-password
                :placeholder="
                  isStatus === 1 ? '请输入密码' : '不修改为默认密码'
                "
                v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: isStatus === 1, message: '请输入密码' },
                    ],
                  },
                ]"
              ></a-input-password>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="账号">
              <a-input
                @blur="validateUsername"
                placeholder="请输入账号"
                allowClear
                v-decorator="[
                  'username',
                  {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        message: '请输入账号',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="备注">
              <a-input
                placeholder="请输入备注"
                allowClear
                v-decorator="[
                  'remark',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入备注',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <a-transfer
      :data-source="mockData"
      show-search
      :list-style="{
        width: '45%',
        height: '300px',
      }"
      :titles="['所有代理', '已分配代理']"
      :filter-option="filterOption"
      :target-keys="targetKeys"
      :render="(item) => item.title"
      @change="handleChange"
      @search="handleSearch"
    />
  </a-modal>
</template>

<script>
const fields = ["id", "nickname", "password", "remark", "username"];
export default {
  name: "GeneralFrom",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isStatus: {
      type: Number,
      default: 0,
    },
    mockData: {
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
        span: 18,
      },
    };
    return {
      targetKeys: [],

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
    filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1;
    },
    handleChange(targetKeys) {
      this.targetKeys = targetKeys;
    },
    handleSearch(dir, value) {
      console.log("search:", dir, value);
    },
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > label {
    width: 100px;
  }
  margin-bottom: 10px;
}
</style>