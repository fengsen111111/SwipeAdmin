<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增安全问题' : '修改安全问题'"
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
    <!-- 表单 -->
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 隐藏id -->
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <!-- 问题 -->
        <a-form-item label="问题">
          <a-input
            placeholder="请输入问题"
            allowClear
            v-decorator="[
              'ask',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入问题',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 状态 -->
        <a-form-item label="状态">
          <a-radio-group name="radioGroup" v-decorator="['status']">
            <a-radio :value="0"> 关闭 </a-radio>
            <a-radio :value="1"> 开启 </a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 语言 -->
        <a-form-item label="语言">
          <div>
          <a-select
            placeholder="请输入语言"
            style="width: 100%"
            :filter-option="filterOption"
            show-search
            v-decorator="[
              'language_id',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入语言',
                  },
                ],
              },
            ]"
          >
            <a-select-option
              v-for="item in languageList"
              :value="item.id"
              :key="item.id"
              >{{ item.name }}
            </a-select-option>
          </a-select>
        </div>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Cookie from "js-cookie";
import { operationService } from "@/services";
const fields = ["id", "ask", "status", "language_id"];
export default {
  name: "SafetyProblemForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    isStatus: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
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
      languageList:[],
    };
  },
  created() {
    this._getLanguages()

    this.headers.token = Cookie.get("token");
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    // 语言列表下拉框
    _getLanguages(){
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
        .catch((err) => {
          this.$message.error(err);
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

<style lang="scss" scoped>
</style>
