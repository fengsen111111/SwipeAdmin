<template>
  <a-card>
    <a-table
      :columns="columns"
      :dataSource="categoryList.list"
      :loading="loading"
      bordered
      :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record.id"
    >
      <template slot="title">
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </template>
      <span slot="status" slot-scope="status">
        <a-tag :color="status === 0 ? 'red' : 'green'">{{
          status === 1 ? "启用" : "禁用"
        }}</a-tag>
      </span>
      <span slot="createTime" slot-scope="time">
        {{ time | formDate }}
      </span>
      <template slot="action" slot-scope="item">
        <a-space size="middle">
          <a @click="handleUpdate(item)">
            <a-icon type="edit"></a-icon>
            编辑
          </a>
          <a-popconfirm
            title="你确定要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteCategory(item.id)"
          >
            <a>
              <a-icon type="delete" />
              删除
            </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <category-form
      :loading="confirmLoading"
      :status="isStatus"
      :visible="isVisible"
      ref="categoryRef"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    ></category-form>
  </a-card>
</template>

<script>
import { commodityService } from "@/services";
import CategoryForm from "./components/CategoryForm.vue";
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
    title: "分类名称释义",
    dataIndex: "category_zh",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    scopedSlots: { customRender: "createTime" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { CategoryForm },
  name: "CategoryList",
  data() {
    return {
      loading: false,
      categoryList: [],
      columns,
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      modules: null,
    };
  },
  created() {
    this._getCategoryList();
  },
  methods: {
    _getCategoryList() {
      commodityService
        .getCategoryList({
          page: 1,
          limit: 100
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          console.log("1",data);
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.categoryList = data;
            console.log("===========>data", data);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    handleCreate() {
      this.isStatus = 1;
      this.isVisible = true;
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.categoryRef.form.resetFields();
    },
    handleOk() {
      const form = this.$refs.categoryRef.form;
      this.confirmLoading = true;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            commodityService
              .createCategory({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getCategoryList();
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            commodityService
              .updateCategory({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getCategoryList();
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    //编辑
    handleUpdate(item) {
      console.log("===========>iitem", item);
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        status: item.status,
        category: item.category,
        category_zh: item.category_zh,
      };
      this.isVisible = true;
      this._getCategoryList();
    },
    //删除
    deleteCategory(id) {
      commodityService
        .deleteCategory({
          id: id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getCategoryList();
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
