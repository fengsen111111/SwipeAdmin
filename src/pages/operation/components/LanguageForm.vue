<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增语言' : '修改语言'"
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
          <a-input v-decorator="['id']" disabled />
        </a-form-item>

        <a-form-item label="中文名称">
          <a-input
            placeholder="请输入中文名"
            allowClear
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    message: '请输入中文名',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="英文名称">
          <a-input
            placeholder="请输入英文名称"
            allowClear
            v-decorator="[
              'en_name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入英文名称',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="缩写">
          <a-input
            placeholder="请输入缩写"
            allowClear
            v-decorator="[
              'code',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    message: '请输入缩写',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="权重">
          <a-input
            placeholder="请输入权重"
            allowClear
            v-decorator="[
              'weight',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入权重',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'status',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              },
            ]"
          >
            <a-radio :value="0"> 禁用 </a-radio>
            <a-radio :value="1"> 启用 </a-radio>
            <a-radio :value="2">默认</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="国家图片">
          <a-upload
            name="picture"
            list-type="picture-card"
            class="avatar-uploader"
            :data="{ type: 'language' }"
            :show-upload-list="false"
            action="/admin/uploadImg"
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
        </a-form-item>
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
const fields = ["id", "name", "code", "weight", "status", "en_name", "icon"];
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
      imageUrl: "",
      headers: {
        token: "",
      },
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
  },

  methods: {
    filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1;
    },
    handleChange(info) {
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
