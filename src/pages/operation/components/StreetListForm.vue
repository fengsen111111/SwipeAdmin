<template>
  <a-modal
    v-drag-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '添加街道' : '修改街道'"
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
    <a-spin :spinning="loadings">
      <a-form :form="form" v-bind="formLayout">
        <!-- id -->
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <!-- 国家id -->
        <!-- <a-form-item
          v-show="false"
          label="国家"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 15, offset: 0 }"
        >
          <a-select
            show-search
            placeholder="请选择"
            option-filter-prop="children"
            :filter-option="filterOption"
            v-decorator="[
              'country_id',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择国家',
                  },
                ],
              },
            ]"
          >
            <a-select-option
              :value="item.id"
              :key="item.id"
              v-for="item in countryList"
              >{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- 城市ID -->
        <a-form-item
          label="城市"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 15, offset: 0 }"
        >
          <a-cascader
            :show-search="{ filter }"
            placeholder="请选择"
            option-filter-prop="children"
            :filter-option="filterOption"
            :options="cityList"
            v-decorator="[
              'pid',
              { rules: [{ required: true, message: '请选择城市' }] },
            ]"
          />
        </a-form-item>
        <!-- 街道中文名 -->
        <a-form-item
          label="街道中文名"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 15, offset: 0 }"
        >
          <a-input
            placeholder="请输入街道中文名"
            allowClear
            v-decorator="[
              'cn_name',
              {
                rules: [
                  {
                    message: '请输入街道中文名',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 街道英文名 -->
        <a-form-item
          label="街道英文名"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 15, offset: 0 }"
        >
          <a-input
            placeholder="请输入街道英文名"
            allowClear
            v-decorator="[
              'en_name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入街道英文名',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { operationService } from "@/services";
import Cookie from "js-cookie";
const fields = [
  "id",
  // "country_id",
  "pid",
  "cn_name",
  "en_name",
];
export default {
  name: "StreetListForm",
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
      cityList: [],
    };
  },

  created() {
    this._getCityList();
    this.headers.token = Cookie.get("token");
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
    this.$watch("isVisible", () => {
      this.loadings = true;
      //   this._getCountryList();
      //   this._getLanguagesList();

      this.loadings = false;
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
            this.languageList = data.list;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    _options(options) {
      options.forEach((item) => {
        if (item.city) {
          this._options(item.city);
        }
      });
    },
    mapTreeData(data) {
      return data.map((item) => {
        return {
          value: item.id,
          label: item.en_name,
          children:
            item.city == null || item.city.length <= 0
              ? []
              : this.mapTreeData(item.city),
        };
      });
    },
    // 城市接口
    _getCityList() {
      operationService
        .setNationalCity()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.cityList = this.mapTreeData(data);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 下拉填入内容
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
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
