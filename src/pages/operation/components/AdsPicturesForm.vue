<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增广告图' : '修改广告图'"
    :confirmLoading="loading"
    width="700px"
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
            <a-form-item label="标题">
              <a-input
                placeholder="请输入标题"
                allowClear
                v-decorator="[
                  'title',
                  {
                    rules: [{ required: true, message: '请输入标题' }],
                  },
                ]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="类型">
              <a-select
                placeholder="请选择类型"
                v-decorator="[
                  'cid',
                  {
                    rules: [{ required: true, message: '请选择类型' }],
                  },
                ]"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in advertList"
                  >{{ item.category_zh }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="状态:">
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'status',
                  {
                    rules: [{ required: true, message: '请输入权重' }],
                  },
                ]"
              >
                <a-radio :value="0">禁用</a-radio>
                <a-radio :value="1">启用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权重">
              <a-input
                placeholder="请输入权重"
                allowClear
                v-decorator="[
                  'sort',
                  {
                    rules: [{ required: true, message: '请输入权重' }],
                  },
                ]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="url类型:">
              <a-radio-group
                @change="handleUrlChange"
                name="radioGroup"
                v-decorator="[
                  'url_type',
                  {
                    rules: [{ required: true, message: '请选择' }],
                  },
                ]"
              >
                <a-radio :value="1">外链</a-radio>
                <a-radio :value="2">内链</a-radio>
                <a-radio :value="0">无</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- ======================外链======================= -->
        <a-row v-if="urlType === 1">
          <a-col :span="12">
            <a-form-item label="外链地址">
              <a-input
                placeholder="请输入外链地址"
                allowClear
                v-decorator="[
                  'url',
                  {
                    rules: [{ required: true, message: '外链参数是必填的' }],
                  },
                ]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- ======================内链======================= -->

        <a-row v-else-if="urlType===2">
          <a-col :span="12">
            <a-form-item label="内链类型">
              <a-select
                placeholder="请选择内链"
                v-decorator="[
                  'link_id',
                  {
                    rules: [{ required: true, message: '请选择类型' }],
                  },
                ]"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in jumpList"
                  >{{ item.title }}{{ item.url }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="内链ID">
              <a-input
                placeholder="请输入内链ID"
                allowClear
                v-decorator="[
                  'to_id',
                  {
                    rules: [{ message: 'ID参数是必填的' }],
                  },
                ]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row>
          <a-col :span="12">
            <a-form-item label="图片">
              <a-upload
                name="picture"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="/admin/uploadImg"
                :data="{ type: 'banner' }"
                :before-upload="beforeUpload"
                @change="handleChange"
                :headers="headers"
                v-decorator="['image']"
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
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Cookie from "js-cookie";
import { operationService } from "@/services";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fields = [
  "id",
  "title",
  "status",
  "image",
  "sort",
  "url_type",
  "url",
  "link_id",
  "to_id",
  "cid",
];
export default {
  name: "CommodityForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 1,
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
        span: 6,
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
      advertList: [], // 分类列表
      jumpList: [], // 跳转列表
      urlType: 1,
    };
  },
  created() {
    this.headers.token = Cookie.get("token");
    this.initBanner();
    // 防止表单未注册
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
    initBanner() {
      operationService
        .getAdvertisingTypes()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.advertList = data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
      operationService
        .getJumpList()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.jumpList = data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleUrlChange(e) {
      console.log("===========>e.target.value", e.target.value);
      this.urlType = e.target?.value;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
