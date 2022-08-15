<template>
  <a-card>
    <a-table
      :columns="columns"
      :data-source="articleTypeList"
      :rowKey="(record) => record.id"
      bordered
      :scroll="{ x: true }"
    >
      <template slot="title">
        <a-button
          type="primary"
          style="margin-bottom: 10px"
          @click="handleCreate"
        >
          <a-icon type="plus"></a-icon>
          新增</a-button
        >
      </template>
      <span slot="create_time" slot-scope="create_time">
        {{ create_time | formDate }}
      </span>
      <template slot="status" slot-scope="status">
        <a-tag :color="status == 1 ? 'green' : 'red'">
          {{ status == 1 ? "启用" : "禁用" }}
        </a-tag>
      </template>
      <template slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" /> 修改</a>
          <a-popconfirm title="你确定要删除吗？" @confirm="handleDelete(item)">
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <article-type-form
      :isVisible="isVisible"
      :loading="confirmLoading"
      :status="isStatus"
      ref="articleRef"
      :modules="modules"
      @cancel="handleCancelForm"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import ArticleTypeForm from "./components/ArticleTypeForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "分类名称",
    dataIndex: "category",
    align: "center",
  },
  {
    title: "分类释义",
    dataIndex: "category_zh",
    align: "center",
  },
  {
    title: "分类能添加几条数据",
    dataIndex: "max_number",
    align: "center",
  },
  {
    title: "状态",
    align: "center",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "添加时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  components: { ArticleTypeForm },
  name: "ArticleType",
  data() {
    return {
      columns: columns,
      articleTypeList: [],
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      modules: null,
    };
  },
  created() {
    this._articleType();
  },
  methods: {
    handleCreate() {
      this.isVisible = true;
      this.isStatus = 1;
    },
    _articleType() {
      this.loading = true;
      operationService
        .getArticleTypes()
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.articleTypeList = data;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    handleCancelForm() {
      this.isVisible = false;
      this.$refs.articleRef.form.resetFields();
    },
    handleOk() {
      const articleRef = this.$refs.articleRef;
      const form = articleRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.isStatus === 1) {
            // delete values.status;
            operationService
              .createArticleType({
                ...values,
              })
              .then((res) => {
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$message.success("新增成功");
                  this.isVisible = false;
                  // 重置表单数据
                  form.resetFields();
                  this._articleType();
                }
                this.confirmLoading = false;
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err);
              });
          } else {
            operationService
              .updateArticleType({
                ...values,
              })
              .then((res) => {
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  // 重置表单数据
                  form.resetFields();
                  this._articleType();
                }
                this.confirmLoading = false;
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err);
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleUpdate(item) {
      this.isVisible = true;
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        category_zh: item.category_zh,
        category: item.category,
        status: item.status,
        max_number: item.max_number,
      };
    },
    handleDelete(item) {
      operationService
        .deleteArticleType({ id: item.id })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._articleType();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
