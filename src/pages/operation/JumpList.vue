
// **********************************************
// 创建时间: 2021-12-02 17:10:46
// description:'跳转页配置'
// **********************************************
<template>
  <a-card>
    <a-table
      :columns="columns"
      :data-source="jumpTypeList"
      :rowKey="(record) => record.id"
      bordered
      :scroll="{ x: 'max-content' }"
    >
      <template slot="title">
        <a-button
          type="primary"
          style="margin-bottom: 10px"
          @click="handleCreate"
          >新增</a-button
        >
      </template>
      <span slot="create_time" slot-scope="create_time">
        {{ create_time | formDate }}
      </span>
      <template slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" /> 修改</a>
          <!-- <a-popconfirm title="你确定要删除吗？" @confirm="handleDelete(item)">
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm> -->
        </a-space>
      </template>

      <!-- ======================status======================= -->
      <span slot="status" slot-scope="status">
        <a-tag color="red" v-if="status === 0">禁用</a-tag>
        <a-tag color="green" v-else-if="status === 1">启用</a-tag>
        <a-tag color="#3880FF" v-else>删除</a-tag>
      </span>
      <!-- ======================类型======================= -->
      <span slot="type" slot-scope="type">
        <a-tag color="#6E3CBC" v-if="type === 1">H5</a-tag>
        <a-tag color="#7267CB" v-else-if="type === 2">APP</a-tag>
        <a-tag color="#98BAE7" v-else>小程序</a-tag>
      </span>
    </a-table>

    <jump-form
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
import JumpForm from "./components/JumpForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "type",
    align: "center",
    scopedSlots: {
      customRender: "type",
    },
  },
  {
    title: "名称",
    dataIndex: "title",
    align: "center",
  },

  {
    title: "跳转地址",
    dataIndex: "url",
    align: "center",
  },
  {
    title: "添加时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  components: { JumpForm },
  name: "JumpList",
  data() {
    return {
      columns: columns,
      jumpTypeList: [],
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
        .getJumpList()
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.jumpTypeList = data;
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
            operationService
              .createJump({
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
              .updateJump({
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
        url: item.url,
        title: item.title,
        status: item.status,
        type: item.type.toString(),
      };
    },
    handleDelete(item) {
      operationService
        .updateAdvertisingType({ id: item.id })
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



