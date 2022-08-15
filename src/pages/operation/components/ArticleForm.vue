<template>
  <a-spin :spinning="updateSpinning">
    <a-modal
      :visible="isVisible"
      :title="status === 1 ? '新增文章' : '修改文章'"
      :confirmLoading="loading"
      width="600px"
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
          <a-form-item label="类型">
            <a-select
              placeholder="请选择"
              v-decorator="[
                'cid',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择类型',
                    },
                  ],
                },
              ]"
            >
              <a-select-option
                v-for="d in articleTypeData"
                :key="d.id"
                :value="d.id"
              >
                {{ d.category_zh }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="语言">
            <a-select
              placeholder="请选择语言"
              v-decorator="[
                'language_id',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择类型',
                    },
                  ],
                },
              ]"
            >
              <a-select-option
                v-for="d in languageList"
                :key="d.id"
                :value="d.id"
              >
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="文章标题">
            <a-input
              allowClear
              placeholder="请输入"
              v-decorator="[
                'title',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入标题',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="权重"
                :labelCol="{
                  span: 8,
                }"
                :wrapperCol="{
                  span: 16,
                }"
              >
                <a-input-number
                  allowClear
                  :min="0"
                  placeholder="请输入"
                  v-decorator="[
                    'sort',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入权重',
                        },
                      ],
                      initialValue: 0,
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
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
            </a-col>
          </a-row>
          <a-form-item label="文章图片">
            <a-upload
              name="picture"
              list-type="picture-card"
              class="avatar-uploader"
              :data="{ type: 'help' }"
              :show-upload-list="false"
              action="/admin/uploadImg"
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

          <a-form-item label="文章内容" v-if="isVisible">
            <div ref="editor"></div>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-spin>
</template>

<script>
import Cookie from "js-cookie";
import { commodityService } from "@/services";
const fields = ["id", "image", "cid", "title", "status", "sort", "language_id"];
import E from "wangeditor";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name: "ArticleForm",
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
    articleTypeData: {
      type: Array,
      default: () => [],
    },
    languageList: {
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
      imageUrl: "",
      headers: {
        token: "",
      },
      loadings: false,
      editor: null,
      context: "",
      baseUrl: "",
      updateSpinning: false,
    };
  },
  created() {
    this.headers.token = Cookie.get("token");
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
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
    initWangeEditor() {
      const that = this;
      this.$nextTick(() => {
        this.editor = new E(this.$refs.editor);
        this.editor.config.uploadImgHeaders = {
          token: this.headers.token,
        };
        that.editor.config.height = 100;
        // 自定义 fileName
        // 上传函数
        that.editor.config.uploadImgAccept = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "bmp",
          "webp",
        ];

        // 图片上传回调
        that.editor.config.customUploadImg = function(files, insertImgFn) {
          let formData = new FormData();
          formData.append("picture", files[0]);
          formData.append("type", "help");
          //   let data = await this.upload(formData);
          commodityService.addImage(formData).then((res) => {
            const { code, msg, data } = res.data;
            if (code !== 200) {
              that.$message.error(msg);
            } else {
              that.$message.success("上传成功");
              const url = `${process.env.VUE_APP_IMAGE_URL}/${data.img_path}`;
              insertImgFn(url);
            }
          });

          // 上传图片，返回结果，将图片插入到编辑器中
        };

        // 视屏上传
        that.editor.config.uploadVideoServer = "/admin/video/uploadVideo";
        that.editor.config.uploadVideoName = "url";
        that.editor.config.uploadVideoHeaders = {
          token: this.headers.token,
        };

        that.editor.config.uploadVideoHooks = {
          // 上传视频之前
          before: function(xhr) {
            console.log(xhr);
            // that.updateSpinning = true;
          },
          // 视频上传并返回了结果，视频插入已成功
          success: function(xhr) {
            console.log("success", xhr);
          },
          // 视频上传并返回了结果，但视频插入时出错了
          fail: function(xhr, editor, resData) {
            console.log("fail", resData);
          },
          // 上传视频出错，一般为 http 请求的错误
          error: function(xhr, editor, resData) {
            console.log("error", xhr, resData);
          },
          // 上传视频超时
          timeout: function() {
            console.log("timeout");
          },
          // 视频上传并返回了结果，想要自己把视频插入到编辑器中
          // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
          customInsert: function(insertVideoFn, result) {
            // that.updateSpinning = false;
            // result 即服务端返回的接口
            console.log("customInsert", result);
            if (result.code === 200) {
              // that.$message.success("上传成功");
              const url = `${process.env.VUE_APP_IMAGE_URL}/${result.data?.video_url}`;
              insertVideoFn(url);
            } else {
              that.$message.error(result.msg);
            }
          },
        };

        that.editor.config.showLinkImg = false;
        that.editor.create();
        that.editor.txt.html(that.context); // 重新设置编辑器内容
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
