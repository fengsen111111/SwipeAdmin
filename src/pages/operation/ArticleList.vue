<template>
  <a-spin :spinning="spinning">
    <a-card>
      <!-- 搜索框 -->
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="文章标题"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    allowClear
                    v-decorator="['title']"
                    placeholder="请输入标题"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item
                  label="类型"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="请选择" v-decorator="['cid']">
                    <a-select-option
                      v-for="d in articleTypeData"
                      :key="d.id"
                      :value="d.id"
                    >
                      {{ d.category_zh }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="状态"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="状态" v-decorator="['status']">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="语言"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select
                    placeholder="请选择语言"
                    v-decorator="['language_id']"
                  >
                    <a-select-option
                      :value="item.id"
                      v-for="item in languageList"
                      :key="item.id"
                      >{{ item.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item>
                  <a-button type="primary" @click="handleSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handleReset"
                    >重置</a-button
                  >
                  <a-button
                    type="primary"
                    style="margin-left: 10px"
                    @click="handleCreate"
                  >
                    <a-icon type="plus" />
                    新增</a-button
                  >
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- <span style="float: right; margin-top: 3px"> </span> -->
        </a-form>
      </div>

      <!-- 表格数据 -->
      <!-- columns表头  articleList表格数据  rowKey键  bordered  loading动画  scroll宽度  pagination分页    -->
      <a-table
        :columns="columns"    
        :data-source="articleList"
        :rowKey="(record) => record.id"
        bordered
        :loading="loading"
        :scroll="{ x: 'max-content' }"
        :pagination="{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: true,
          onChange: onPageChange,
          onShowSizeChange: onSizeChange,
        }"
      >
        <template slot="images" slot-scope="images">
          <img
            :src="baseUrl + '/' + images"
            alt=""
            srcset=""
            style="width: 30px"
            @click="blackImage(baseUrl + '/' + images)"
          />
        </template>
        <span slot="context" slot-scope="context" class="context">
          <a-tooltip>
            <template slot="title">
              <span v-html="context"></span>
            </template>
            <span v-html="context"></span>
          </a-tooltip>
        </span>
        <span slot="create_time" slot-scope="create_time">
          {{ create_time | formDate }}
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="large">
            <a @click="handleUpdate(item)"> <a-icon type="edit" /> 修改</a>
            <a-popconfirm
              title="你确定要删除吗？"
              @confirm="handleDelete(item)"
            >
              <a><a-icon type="delete" />删除</a>
            </a-popconfirm>
          </a-space>
        </template>
        <span slot="status" slot-scope="item">
          <a-tag :color="item === 1 ? 'green' : 'red'">{{
            item === 1 ? "启用" : "禁用"
          }}</a-tag>
        </span>
      </a-table>
    </a-card>

    <!-- 底部 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previImages" />
    </a-modal>


    <!-- 新增/修改界面 -->
    <article-form
      :isVisible="isVisible"
      :loading="confirmLoading"
      :status="isStatus"
      ref="articleRef"
      :modules="modules"
      @cancel="handleCancelForm"
      :languageList="languageList"
      @ok="handleOk"
      :articleTypeData="articleTypeData"
    />
  </a-spin>
</template>

<script>
import { operationService } from "@/services";
import ArticleForm from "./components/ArticleForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },

  {
    title: "文章类型",
    dataIndex: "category.category_zh",
    align: "center",
  },
  {
    title: "文章标题",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "语言",
    dataIndex: "language.name",
    align: "center",
  },
  {
    title: "图片",
    dataIndex: "image",
    align: "center",
    scopedSlots: { customRender: "images" },
  },
  {
    title: "添加时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "权重",
    dataIndex: "sort",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    // width: "200px",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  components: { ArticleForm },
  name: "ArtiCle",
  data() {
    return {
      form: this.$form.createForm(this),
      spinning: false,
      advanced: false,
      articleTypeData: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      loading: false,
      articleList: [],
      columns: columns,
      baseUrl: "",
      previImages: "",
      previewVisible: false,
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      modules: null,
      imageText: "",
      languageList: [],
    };
  },
  created() {
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    this._articleType();
    this._getArticle();
    this._initLanguage();
  },
  methods: {
    _initLanguage() {
      operationService.getLanguages({ page: 1, limit: 100 }).then((res) => {
        const { data } = res.data;
        this.languageList = data?.list.filter((item) => item.status !== 0);
      });
    },
    handleReset() {
      this.form.resetFields();
      this.pageIndex = 1;
      this._getArticle();
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getArticle();
    },
    _articleType() {
      operationService
        .getArticleTypes()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.articleTypeData = data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    _getArticle() {
      this.loading = true;
      this.form?.validateFields((error, values) => {
        operationService
          .getArticles({
            limit: this.pageSize,
            page: this.pageIndex,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.articleList = data.list;
              this.total = data.total;
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getArticle();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getArticle();
    },
    blackImage(item) {
      this.previImages = item;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
      this.$refs.articleRef.form.resetFields();
    },
    handleCancelForm() {
      this.isVisible = false;
      const articleRef = this.$refs.articleRef;
      articleRef.editor.txt.clear();
      articleRef.imageUrl = "";
      articleRef.context = "";
      articleRef.form.resetFields();
      // articleRef.editor.destroy();
      // articleRef.editor = null;
    },
    handleOk() {
      const articleRef = this.$refs.articleRef;
      const form = articleRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        values.image = values?.image?.file?.response?.data?.img_path;
        if (!errors) {
          if (this.isStatus === 1) {
            operationService
              .createArticle({
                content: articleRef.editor.txt.html(),
                ...values,
              })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$message.success("新增成功");
                  this.isVisible = false;
                  // 重置表单数据
                  form.resetFields();
                  this._getArticle();
                  this.$refs.articleRef.editor.txt.clear();
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
              });
          } else {
            operationService
              .updateArticle({
                content: articleRef.editor.txt.html(),
                ...values,
              })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  // 重置表单数据
                  form.resetFields();
                  this._getArticle();
                  this.$refs.articleRef.editor.txt.clear();
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCreate() {
      this.isVisible = true;
      this.isStatus = 1;
      this.$refs.articleRef.initWangeEditor();
    },

    handleUpdate(item) {
      const {
        id,
        image,
        cid,
        title,
        content,
        sort,
        status,
        language_id,
      } = item;
      const articleRef = this.$refs.articleRef;
      this.isStatus = 2;
      this.isVisible = true;
      // articleRef.initWangeEditor();
      this.modules = {
        id,
        image,
        cid,
        title,
        sort,
        status,
        language_id,
      };

      articleRef.context = content; // 重新设置编辑器内容
      articleRef.imageUrl = this.baseUrl + "/" + item.image;
    },
    handleDelete(item) {
      operationService
        .deleteArticle({ id: item.id })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getArticle();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
};
</script>

<style lang="less">
span > p {
  overflow: hidden !important;
  // text-overflow: ellipsis !important;
  white-space: nowrap !important;
  max-width: 444px !important;
}
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.title-text {
  width: 200px;
  text-align: center;
  // overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
