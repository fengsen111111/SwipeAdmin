<template>
  <div>
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="isStatus === 1 ? '新增商品' : '修改商品'" sub-title=""
      @back="() => $router.go(-1)">
      <template slot="extra">
        <a-button type="primary" @click="handleCreate" :loading="loading">
          {{ isStatus === 1 ? "新增" : "修改" }}
        </a-button>
      </template>
    </a-page-header>
    <a-card>
      <a-form v-bind="formLayout" :form="form" ref="searchRef">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-row>
          <a-col :span="8">
            <a-form-item label="商品类别">
              <a-select placeholder="请选择" @change="changeCategory" v-decorator="[
                'cid',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                },
              ]">
                <a-select-option :key="item.id" :value="item.id" v-for="item in categoryList">
                  {{ item.category_zh }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="商品积分" v-if="categoryType === 12">
              <a-input placeholder="请输入商品积分" v-decorator="[
                'points',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入商品积分',
                    },
                  ],
                },
              ]"></a-input>
            </a-form-item>
            <a-form-item label="商品名称">
              <a-input placeholder="请输入" v-decorator="[
                'name',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                    {
                      min: 3,
                      message: '商品名称不能少于3位',
                    },
                  ],
                },
              ]"></a-input>
            </a-form-item>
            <a-form-item label="商品首图">
              <a-row type="flex" justify="start">
                <a-col flex="auto">
                  <a-upload name="picture" list-type="picture-card" class="avatar-uploader" :data="{ type: 'first' }"
                    :show-upload-list="false" action="/admin/goodsStorehouses/uploadImg" :before-upload="beforeUpload"
                    @change="handleChange" :headers="headers" v-decorator="['picture']">
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 100px" />
                    <div v-else>
                      <a-icon :type="loadings ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                </a-col>
                <a-col flex="40px">
                  <a-icon type="delete" style="font-size: 20px" @click="deleteImages"></a-icon>
                </a-col>
              </a-row>
            </a-form-item>

            <!-- ======================照片墙======================= -->
            <a-form-item label="商品轮播(多张)">
              <div class="clearfix">
                <a-upload action="/admin/goodsStorehouses/uploadImg" list-type="picture-card" :file-list="fileList"
                  @preview="handlePreview" @change="handleUpdateSwiper" :headers="headers" :data="{ type: 'carousel' }"
                  name="picture" :remove="removePhtoto">
                  <div v-if="fileList.length < 8">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="商品价格">
              <a-input placeholder="请输入" v-decorator="[
                'price',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                },
              ]"></a-input>
            </a-form-item>
            <a-form-item label="商品库存">
              <a-input placeholder="请输入" v-decorator="[
                'stock',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                },
              ]"></a-input>
            </a-form-item>
            <a-form-item label="状态">
              <a-radio-group name="radioGroup" v-decorator="[
                'status',
                {
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                },
              ]">
                <a-radio :value="0"> 禁用 </a-radio>
                <a-radio :value="1"> 启用 </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="详情">
              <div id="details"></div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { commodityService } from "@/services";
import Cookie from "js-cookie";
import E from "wangeditor";

// const fields = ["cid", "name", "price", "stock", "status", "id", "points"];
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
function getBase642(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  name: "CommodityAdd",
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
      categoryList: [],
      loadings: false,
      imageUrl: "",
      headers: {
        token: "",
      },
      fileList: [],
      previewVisible: false,
      previewImage: "",
      editor: null,
      deleImageText: "",
      isStatus: 1,
      baseUrl: "",
      loading: false,
      categoryType: 0,
    };
  },
  created() {
    this._getCategory();
    this.headers.token = Cookie.get("token");
    this.initEditor();
    // fields.forEach((v) => {
    //   console.log(v)
    //   //bug
    //   this.form.getFieldDecorator(v);
    // });
    // console.log("最终数据", this.form);
  },
  activated() {
    this.isStatus = Number(this.$route.query.status);
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    const id = this.$route.query.id;
    if (id && id !== "") {
      this._commodityFind(id);
    } else {
      this.form.resetFields();
      this.fileList = [];
      this.imageUrl = "";
      this.editor?.txt?.clear();
    }
  },
  methods: {
    _getCategory() {
      commodityService
        .getCategoryList({
          page: 1,
          limit: 100
        })
        .then((res) => {
          // console.log("成功",res?.data?.data);
          this.categoryList = res?.data?.data.list.filter(
            (item) => {
              item.status === 1
            }
          );
        })
        .catch((err) => {
          // console.log("失败");
          this.$message.error(err);
        });
    },
    _commodityFind(id) {
      commodityService
        .commodityFind({
          id,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.form.setFieldsValue({
              cid: data.cid,
              name: data.name,
              price: data.price,
              stock: data.stock,
              status: data.status,
              id: data.id,
              points: data.points,
            });
            this.editor.txt.html(data.details);
            const resultImages = data.images?.map((item, index) => {
              if (item && item != "undefined") {
                return {
                  uid: index,
                  name: "image.png",
                  status: "done",
                  url: this.baseUrl + "/" + item,
                };
              }
            });

            this.fileList = resultImages;
            this.imageUrl = this.baseUrl + "/" + data?.picture;
            this.deleImageText = data?.picture;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 图片上传
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loadings = true;
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.$message.success("上传成功");
          console.log("===========>imageUrl", imageUrl);
          this.deleImageText = info?.file?.response?.data?.img_path;
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

    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase642(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleUpdateSwiper({ fileList }) {
      this.fileList = fileList;
    },
    removePhtoto(item) {
      const strIndex = item?.url?.indexOf("storage");
      const strUrl = item.url.substring(strIndex);
      commodityService
        .deleteImage({
          img_path: item?.response?.data?.img_path || strUrl,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
          }
        });
    },
    initEditor() {
      this.$nextTick(() => {
        if (this.editor === null || this.editor === undefined) {
          this.editor = new E("#details");
        } else {
          this.editor.destroy(); //这里做了一次判断，判断编辑器是否被创建，如果创建了就先销毁。
        }
        const { editor } = this;
        editor.config.height = 100;

        editor.config.excludeMenus = ["video"];

        // 设置上传本地图片地址
        editor.config.uploadImgServer = "admin/goodsStorehouses/uploadImg";
        // 传递验证的 token
        editor.config.uploadImgHeaders = {
          token: this.headers.token,
        };

        editor.config.uploadImgAccept = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "bmp",
          "webp",
        ];
        // 图片上传回调
        editor.config.customUploadImg = function (files, insertImgFn) {
          let formData = new FormData();
          formData.append("picture", files[0]);
          formData.append("type", "detail");
          //   let data = await this.upload(formData);
          commodityService
            .addImage(formData)
            .then((res) => {
              const { code, msg, data } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                const url = `${process.env.VUE_APP_IMAGE_URL}/${data.img_path}`;

                insertImgFn(url);
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
          // 上传图片，返回结果，将图片插入到编辑器中
        };
        // 上传的钩子函数
        // editor.config.onchange = (html) => {
        //   this.editorContent = html;
        //   this.onchange(html);
        // };
        editor.create();
      });
    },
    deleteImages() {
      commodityService
        .deleteImage({
          img_path: this.deleImageText,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.deleImageText = "";
            this.imageUrl = "";
            this.$message.success("删除成功");
          }
        });
    },
    // 新增
    handleCreate() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        if (!error) {
          values.picture = values.picture?.file
            ? values.picture?.file?.response?.data?.img_path
            : this.deleImageText;

          const params = {
            details: this.editor.txt.html(),
            images: this.fileList.map((item) => {
              let strUrl = "";
              if (item.url) {
                const strIndex = item.url.indexOf("storage");
                strUrl = item.url.substring(strIndex);
              }
              return item.response ? item.response?.data?.img_path : strUrl;
            }),
            ...values,
          };
          if (this.isStatus === 1) {
            commodityService
              .createCommodity(params)
              .then((res) => {
                this.loading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("新增成功");
                  this.form.resetFields();
                  this.$router.go(-1);
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.loading = false;
              });
          } else {
            commodityService
              .updateCommodity(params)
              .then((res) => {
                this.loading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.$router.go(-1);
                }
              })
              .catch((error) => {
                this.$message.error(error);
              });
          }
        } else {
          this.loading = false;
        }
      });
    },
    changeCategory(item) {
      console.log("==================>item", item);
      this.categoryType = item;
    },
  },
};
</script>

<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
