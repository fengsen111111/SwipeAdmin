<template>
  <a-modal
    :title="status === 1 ? '新增头像' : '修改头像'"
    :visible="visible"
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

        <a-form-item label="头像">
          <a-upload
            name="picture"
            list-type="picture-card"
            class="avatar-uploader"
            :data="{ type: 'robot' }"
            :show-upload-list="false"
            action="/admin/uploadImg"
            :before-upload="beforeUpload"
            @change="handleChange"
            :headers="headers"
            v-decorator="['avatar']"
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
          </a-radio-group>
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
// 表单字段
const fields = ["id", "avatar", "status"];
export default {
  name: "AvatarForm",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    modules: {
      type: Object,
      default: () => null,
    },

    status: {
      type: Number,
      default: 1,
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
      loadings: false,
      imageUrl: "",
      headers: {
        token: "",
      },
    };
  },
  created() {
    // 防止表单未注册
    this.headers.token = Cookie.get("token");
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
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