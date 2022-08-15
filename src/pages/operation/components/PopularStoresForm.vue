<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增店铺' : '修改店铺'"
    :confirmLoading="loading"
    :width="650"
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
        <!-- 店铺名字 -->
        <a-form-item label="店铺名字">
          <a-input
            placeholder="请输入店铺名字"
            allowClear
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    message: '请输入店铺名字',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 店铺等级 -->
        <a-form-item label="店铺等级">
          <a-input
            placeholder="请输入店铺等级"
            allowClear
            v-decorator="['grade']"
          />
        </a-form-item>
        <!-- 店铺LOGO -->
        <a-form-item label="店铺LOGO">
          <a-upload
            name="picture"
            list-type="picture-card"
            class="avatar-uploader"
            :data="{ type: 'hotshop' }"
            :show-upload-list="false"
            action="/admin/uploadImg"
            :before-upload="beforeUpload"
            @change="handleChange"
            :headers="headers"
            v-decorator="['img']"
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
        <!-- 24小时收益 -->
        <a-form-item label="24小时收益">
          <a-input
            placeholder="请输入24小时收益"
            allowClear
            v-decorator="[
              'profit',
              {
                rules: [
                  {
                    min: 1,
                    message: '请输入24小时收益',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 24小时订单数 -->
        <a-form-item label="24小时订单数">
          <a-input
            placeholder="请输入24小时订单数"
            allowClear
            v-decorator="['order_num']"
          />
        </a-form-item>
        <!-- 发货及时率 -->
        <a-form-item label="发货及时率">
          <a-input
            placeholder="请输入发货及时率"
            allowClear
            v-decorator="[
              'promptness',
              {
                rules: [
                  {
                    min: 1,
                    message: '请输入发货及时率',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 好评率 -->
        <a-form-item label="好评率">
          <a-input
            placeholder="请输入好评率"
            allowClear
            v-decorator="[
              'praise',
              {
                rules: [
                  {
                    min: 1,
                    message: '请输入好评率',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <!-- 排序权重 -->
        <a-form-item label="权重">
          <a-input placeholder="请输入权重" allowClear v-decorator="['sort']" />
        </a-form-item>
        <!-- 状态 -->
        <a-form-item label="状态">
          <a-radio-group name="radioGroup" v-decorator="['status']">
            <a-radio :value="0"> 不显示 </a-radio>
            <a-radio :value="1"> 显示 </a-radio>
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
const fields = [
  "id",
  "name",
  "grade",
  "img",
  "profit",
  "order_num",
  "promptness",
  "praise",
  "sort",
  "status",
];
export default {
  name: "PartnerListFrom",
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
    // 上传图片
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
    // 处理图片格式
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
