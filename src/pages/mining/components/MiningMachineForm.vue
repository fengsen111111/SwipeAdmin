<!--
 * @Author: your name
 * @Date: 2022-03-01 14:11:41
 * @LastEditTime: 2022-05-24 17:02:14
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\mining\components\MiningMachineForm.vue
-->
<template>
  <a-modal
    :visible="isVisible"
    :title="status === 1 ? '新增矿机' : '修改矿机'"
    :confirmLoading="loading"
    @ok="handleOK"
    @cancel="handleCancel"
    :width="1200"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-row type="flex">
          <a-col flex="auto">
            <a-form-item label="虚拟货币项目">
              <a-select
                v-decorator="[
                  'project_id',
                  {
                    rules: [{ required: true, message: '请选择虚拟货币项目' }],
                  },
                ]"
                placeholder="请选择虚拟货币项目"
                show-search
                :filter-option="proxyFilter"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in allVirtualCurrency"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col flex="auto">
            <a-form-item label="收入方式">
              <a-select
                v-decorator="[
                  'income_way',
                  {
                    rules: [{ required: true, message: '请选择收入方式' }],
                  },
                ]"
                placeholder="请选择收入方式"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in income"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col flex="auto"
            ><a-form-item label="项目名称">
              <a-input
                allowClear
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入项目名称' }],
                  },
                ]"
                placeholder="请输入项目名称"
              ></a-input> </a-form-item
          ></a-col>
          <a-col flex="auto"
            ><a-form-item label="项目总额">
              <a-input
                allowClear
                v-decorator="[
                  'can_buy_balance',
                  {
                    rules: [{ required: true, message: '请输入项目总额' }],
                  },
                ]"
                placeholder="请输入项目总额"
              ></a-input> </a-form-item
          ></a-col>
        </a-row>

        <a-form-item label="收益类型">
          <a-select
            v-decorator="[
              'income_type',
              {
                rules: [{ required: true }],
                initialValue: 1,
              },
            ]"
            @change="onChange"
          >
            <a-select-option key="1" :value="1">按比例</a-select-option>
            <a-select-option key="2" :value="2">按等级</a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="selectedValue == 2">
          <DynamicForm
            ref="DynamicFormRef"
            v-bind="$attrs"
            :configure="configure"
            v-if="isVisible"
            @getMinNum="getMinNum"
            @getMaxNum="getMaxNum"
          />
        </template>

        <a-row>
          <a-col :span="6"
            ><a-form-item
              label="日收益率"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="0.001"
                :max="1"
                :step="0.001"
                :disabled="selectedValue == 2"
                v-decorator="[
                  'daily_return',
                  {
                    rules: [{ required: true, message: '请输入收益率' }],
                    initialValue: 0.001,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6"
            ><a-form-item
              label="申请天数"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="1"
                :max="1000000"
                :step="1"
                v-decorator="[
                  'explain_days',
                  {
                    rules: [{ required: true, message: '请输入申请天数' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6"
            ><a-form-item
              label="最小购买"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="1"
                :max="1000000000"
                :step="10"
                :disabled="selectedValue == 2"
                v-decorator="[
                  'minimum',
                  {
                    rules: [{ required: true, message: '请输入最小购买金额' }],
                  },
                ]"
              ></a-input-number> </a-form-item
          ></a-col>
          <a-col :span="6"
            ><a-form-item
              label="最大购买"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="1"
                :max="1000000000"
                :step="100"
                :disabled="selectedValue == 2"
                v-decorator="[
                  'biggest',
                  {
                    rules: [{ required: true, message: '请输入最大购买金额' }],
                  },
                ]"
              ></a-input-number> </a-form-item
          ></a-col>
        </a-row>
        <!-- ! -->
        <a-row type="flex">
          <a-col flex="auto">
            <a-form-item
              label="权重"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                :min="0"
                :max="1000000000"
                :step="1"
                v-decorator="[
                  'weight',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入权重值',
                      },
                    ],
                    initialValue: 0,
                  },
                ]"
                placeholder="请输入"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col flex="auto">
            <a-form-item label="限购次数">
              <a-input
                allowClear
                v-decorator="[
                  'purchase_num',
                  {
                    rules: [
                      { required: true, message: '请输入限购次数,0不限购' },
                    ],
                  },
                ]"
                placeholder="请输入限购次数,0不限购"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col flex="auto">
            <a-form-item
              v-if="status == 2"
              label="项目进度"
              :labelCol="{
                span: 9,
              }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input-number
                v-decorator="['progress']"
                :step="0.01"
                :min="0"
                :max="100"
                :formatter="(value) => `${value}%`"
                :parser="(value) => value.replace('%', '')"
              />
            </a-form-item>
          </a-col>
          <a-col flex="auto"
            ><a-form-item
              label="项目图片"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 14 }"
            >
              <a-upload
                name="picture"
                list-type="picture-card"
                :data="{ type: 'mill' }"
                class="avatar-uploader"
                :show-upload-list="false"
                action="/admin/mproject/upload"
                :before-upload="beforeUpload"
                @change="handleChange"
                :headers="headers"
                v-decorator="[
                  'image',
                  {
                    rules: [{ required: true, message: '请上传图片' }],
                  },
                ]"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  alt="image"
                  style="width: 100px"
                />
                <div v-else>
                  <a-icon :type="loadings ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-item></a-col
          >
        </a-row>
        <a-form-item
          label="规则介绍"
          v-if="isVisible"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }"
        >
          <div ref="editor"></div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Cookie from "js-cookie";
import DynamicForm from "./DynamicForm.vue";
import { commodityService } from "@/services";
import E from "wangeditor";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fields = [
  "id",
  "name",
  "image",
  "can_buy_balance",
  "daily_return",
  "explain_days",
  "minimum",
  "biggest",
  "project_id",
  "weight",
  "income_way",
  "purchase_num",
  "progress",
  "income_type",
];
const income = [
  { id: 0, name: "每日结息到期还本" },
  { id: 1, name: "到期还本还息" },
];
export default {
  name: "MiningMachineForm",
  components: { DynamicForm },
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
    status: {
      type: Number,
      default: 1,
    },
    allVirtualCurrency: {
      type: Array,
      default: () => [],
    },
    configure: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    return {
      income,
      form: this.$form.createForm(this),
      proxyList: [],
      loadings: false,
      imageUrl: "",
      headers: {
        token: "",
      },
      selectedValue: 1,
      MinNum: null,
      MaxNum: null,
      // 富文本编辑器所需
      context: "",
      editor: null,
    };
  },
  created() {
    // this._getProxyUserList();
    this.headers.token = Cookie.get("token");
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  mounted() {},
  methods: {
    //
    // 获取子组件中的最小限购值
    getMinNum(MinNum) {
      console.log("==================>MinNum", MinNum);
      const min = Math.min(...MinNum);
      this.form.setFieldsValue({ minimum: min });
    },
    // 获取子组件中的最大限购值
    getMaxNum(MaxNum) {
      console.log("==================>MaxNum", MaxNum);
      const max = Math.max(...MaxNum);
      this.form.setFieldsValue({ biggest: max });
    },
    //  将子组件中cancel事件传递出去
    handleCancel() {
      this.selectedValue = 1;
      this.$emit("cancel");
      // console.log("==================>this.selectedValue", this.selectedValue);
    },
    // 将子组件中的ok事件传递出去
    handleOK() {
      const Dform = this?.$refs?.DynamicFormRef?.form;
      console.log("==================>Dform", Dform?.dynamicItem);
      this.$emit("ok", Dform?.dynamicItem);
    },
    // 选择框change事件
    onChange(value) {
      // console.log(`selected ${value}`);
      this.selectedValue = value;
      console.log("==================>this.selectedValue", this.selectedValue);
    },
    //
    proxyFilter(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 上传图片事件
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
    // 上传图片事件
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
    // 富文本所需要的事件
    initWangeEditor() {
      const that = this;
      this.$nextTick(() => {
        this.editor = new E(this.$refs.editor);
        this.editor.config.uploadImgHeaders = {
          token: this.headers.token,
        };
        that.editor.config.height = 200;
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
