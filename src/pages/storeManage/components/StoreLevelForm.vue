<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增店铺等级' : '修改店铺等级'"
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
        <!-- id -->
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>

        <a-row>
          <!-- 分类名称 -->
          <a-col :span="12">
            <a-form-item
              label="名称"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入分类名字"
                allowClear
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入分类名字',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <!-- 订单数量 -->
          <a-col :span="12">
            <a-form-item
              label="订单数量"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入订单数量"
                allowClear
                v-decorator="[
                  'order_num',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入订单数量',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <!-- 发货率 -->
            <a-form-item
              label="发货率"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入发货率"
                allowClear
                v-decorator="[
                  'shipment_rate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入发货率',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 营业额 -->
            <a-form-item
              label="营业额"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入营业额"
                allowClear
                v-decorator="[
                  'operate_amount',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入营业额',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <!-- 体验时间 -->
            <a-form-item
              label="体验时间"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="单位(秒)，0代表永久"
                allowClear
                v-decorator="[
                  'experience_time',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入体验时间',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 佣金比例 -->
            <a-form-item
              label="佣金比例"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入佣金比例"
                allowClear
                v-decorator="[
                  'commission_rate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入佣金比例',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <!-- 保证金 -->
            <a-form-item
              label="保证金"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入保证金"
                allowClear
                v-decorator="[
                  'security_deposit',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入保证金',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 等级 -->
            <a-form-item
              label="等级"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入等级"
                allowClear
                v-decorator="[
                  'level',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入等级',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <!-- 可选商品数量 -->
            <a-form-item
              label="可选商品数量"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-input
                placeholder="请输入可选商品数量"
                allowClear
                v-decorator="[
                  'goods_num',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入可选商品数量',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 可选商品id -->
             <a-form-item
              label="可选商品id"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >

            <a-select
              mode="multiple"
              :size="size"
              placeholder="请选择商品"
              style="width: 200px"
              @change="handChange"
              v-decorator="[
                  'goods_info',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入可选商品id',
                      },
                    ],
                  },
                ]"
            >
              <a-select-option v-for="item in allTypeList" :key="item.id"
              >
                {{ item.category_zh }}
              </a-select-option>
            </a-select>
            </a-form-item> 
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <!-- 段位 -->
            <a-form-item label="段位">
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'type',
                  {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              >
                <a-radio :value="1"> 黑铁 </a-radio>
                <a-radio :value="2"> 钻石 </a-radio>
                <a-radio :value="3"> 皇冠 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 展示图 -->
            <a-form-item
              label="展示图"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15 }"
            >
              <a-upload
                name="picture"
                list-type="picture-card"
                class="avatar-uploader"
                :data="{ type: 'shoplevel' }"
                :show-upload-list="false"
                action="/admin/uploadImg"
                :before-upload="beforeUpload"
                @change="handleChange"
                :headers="headers"
                v-decorator="[
                  'logo',
                  {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
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
import { storeManageService } from "@/services";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fields = [
  "id",
  "name",
  "logo",
  "order_num",
  "shipment_rate",
  "experience_time",
  "operate_amount",
  "commission_rate",
  "security_deposit",
  "type",
  "level",
  "goods_num",
  "goods_info",
];
export default {
  name: "StoreLevelForm",
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
      size: 'default',
      loadings: false,
      form: this.$form.createForm(this),
      imageUrl: "",
      headers: {
        token: "",
      },
      allTypeList:[],

    };
  },
  activated(){

  },

  created() {
    this._getAllTypeProducts()
    this.headers.token = Cookie.get("token");
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    
    // 所有可选商品
    _getAllTypeProducts(){
      storeManageService
          .allTypeProducts()
          .then((res) => {
          const { code, msg, data, } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.allTypeList = data
            console.log(data);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 选择框事件
    handChange(value) {
      console.log(`${value}`);
    },
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

<style lang="scss" scoped></style>
