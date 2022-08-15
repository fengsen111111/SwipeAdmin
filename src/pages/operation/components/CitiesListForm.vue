<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '添加城市' : '修改城市'"
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
    <a-form :form="form" v-bind="formLayout">
      <!-- id -->
      <a-form-item v-show="false" label="ID">
        <a-input v-decorator="['id']" disabled />
      </a-form-item>
      <!-- 国家id -->
      <a-form-item
        label="国家ID"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 15, offset: 0 }"
      >
        <a-select
          show-search
          placeholder="请选择"
          option-filter-prop="children"
          :filter-option="filterOption"
          v-decorator="['country_id', { rules: [{ required: true }] }]"
        >
          <a-select-option
            :value="parseInt(item.id)"
            :key="parseInt(item.id)"
            v-for="item in countryList"
            >{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 语言id -->
      <a-form-item
        label="语言ID"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 15, offset: 0 }"
      >
        <a-select
          show-search
          placeholder="请选择"
          option-filter-prop="children"
          :filter-option="filterOption"
          v-decorator="['language', { rules: [{ required: true }] }]"
        >
          <a-select-option
            :value="parseInt(item.id)"
            :key="parseInt(item.id)"
            v-for="item in languageList"
            >{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 类型 -->
      <!-- <a-form-item
        label="类型"
        v-show="false"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 15, offset: 0 }"
      >
        <a-radio-group name="radioGroup" v-decorator="['type']">
          <a-radio :value="1"> 城市 </a-radio>
          <a-radio :value="2"> 街道 </a-radio>
        </a-radio-group>
      </a-form-item> -->
      <!-- 城市中文名 -->
      <a-form-item
        label="城市中文名"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 15, offset: 0 }"
      >
        <a-input
          placeholder="请输入城市中文名"
          allowClear
          v-decorator="[
            'cn_name',
            {
              rules: [
                {
                  required: true,
                  message: '请输入城市中文名',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <!-- 城市英文名 -->
      <a-form-item
        label="城市英文名"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 15, offset: 0 }"
      >
        <a-input
          placeholder="请输入城市英文名"
          allowClear
          v-decorator="[
            'en_name',
            {
              rules: [
                {
                  required: true,
                  message: '请输入城市英文名',
                },
              ],
            },
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { operationService } from "@/services";
import Cookie from "js-cookie";
const fields = ["id", "country_id", "language", "cn_name", "en_name"];
export default {
  name: "CitiesListForm",
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
      form: this.$form.createForm(this),
      loadings: false,
      headers: {
        token: "",
      },
      countryList: [],
      languageList: [],
    };
  },

  created() {
    this.headers.token = Cookie.get("token");
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
    this.$watch("isVisible", () => {
      this._getCountryList();
      this._getLanguagesList();
    });
  },
  methods: {
    // 国家接口
    _getCountryList() {
      operationService
        .getCountrySelect()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.countryList = data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 语言接口
    _getLanguagesList() {
      operationService
        .getLanguages({
          page: 1,
          limit: 100,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            console.log(data);
            this.languageList = data.list;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
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
