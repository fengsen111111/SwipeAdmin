<!--
 * @Author: your name
 * @Date: 2022-03-22 12:18:53
 * @LastEditTime: 2022-06-08 10:49:28
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\components\CountryForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    title="编辑国家信息"
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
        <a-form-item label="中文名称">
          <a-input
            allowClear
            v-decorator="['cn_name']"
            placeholder="请输入"
          ></a-input>
        </a-form-item>
        <a-form-item
          label="国家默认法币"
          :labelCol="{
            span: 5,
          }"
          :wrapperCol="{ span: 19 }"
        >
          <a-select v-decorator="['currency_id']" placeholder="请选择">
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in allFiatCurrencyList"
              >{{ item.zh_name }}----{{ item.short_name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          label="国家默认语言"
          :labelCol="{
            span: 5,
          }"
          :wrapperCol="{ span: 19 }"
        >
          <a-select v-decorator="['language_id']" placeholder="请选择">
            <a-select-option
              :key="item.id"
              :value="item.id"
              v-for="item in allLanguageList"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="国旗">
          <a-upload
            name="picture"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/admin/uploadImg"
            :data="{ type: 'issued' }"
            :before-upload="beforeUpload"
            @change="handleChange"
            :headers="headers"
            v-decorator="['icon']"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="avatar"
              style="width: 100px"
            />
            <div v-else>
              <a-icon :type="loadings ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Cookie from "js-cookie";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fields = ["id", "cn_name", "currency_id", "language_id"];
export default {
  name: "CountryForm",
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
    allLanguageList: {
      type: Array,
      default: () => [],
    },
    allFiatCurrencyList: {
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
      //
      loadings: false,
      imageUrl: "",
      headers: {
        token: "",
      },
    };
  },
  created() {
    this.headers.token = Cookie.get("token");
    // this._getProxyUserList();
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    handleChange(info) {
      console.log("==================>info", info);
      if (info.file.status === "uploading") {
        this.loadings = true;
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.$message.success("上传成功");
          this.imageUrl = imageUrl;
          this.loadings = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    // },
    // proxyFilter(input, option) {
    //   return (
    //     option.componentOptions.children[0].text
    //       .toLowerCase()
    //       .indexOf(input.toLowerCase()) >= 0
    //   );
    // },
  },
};
</script>

<style></style>
