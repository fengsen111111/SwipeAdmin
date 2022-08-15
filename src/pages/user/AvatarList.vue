<template>
  <a-card>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="avatarList"
      bordered
      :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record.id"
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
      <template slot="title">
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus" /> 新增
        </a-button>
      </template>
      <template slot="images" slot-scope="images">
        <img
          :src="baseUrl + '/' + images"
          alt=""
          srcset=""
          style="width: 40px"
          @click="blackImage(baseUrl + '/' + images)"
        />
      </template>
      <span slot="status" slot-scope="record">
        <a-tag :color="record === 1 ? 'green' : 'red'">
          {{ record === 0 ? "禁用" : "启用" }}
        </a-tag>
      </span>
      <span slot="createTime" slot-scope="time">
        {{ time | formDate }}
      </span>

      <template slot="actions" slot-scope="record">
        <a-space size="large">
          <a @click="handleUpdate(record)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm
            :title="`你确定要删除吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record)"
          >
            <a> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previImages" />
    </a-modal>
    <avatar-form
      :loading="confirmLoading"
      :status="isStatus"
      :visible="isVisible"
      ref="avatarRef"
      :modules="modules"
      @cancel="handleCancelFrom"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { userService } from "@/services";
import AvatarForm from "./components/AvatarForm.vue";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },

  {
    title: "图片",
    dataIndex: "avatar",
    align: "center",
    scopedSlots: { customRender: "images" },
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: {
      customRender: "createTime",
    },
  },
  {
    title: "状态",
    align: "center",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  components: { AvatarForm },
  name: "Activity",
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      avatarList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      previewVisible: false,
      baseUrl: "",
      previImages: "",
      isVisible: false,

      confirmLoading: false,
      modules: null,
      isStatus: 1,
      imageUrl: "",
    };
  },
  created() {
    this._getAvatar();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    _getAvatar() {
      this.loading = true;
      userService
        .avatarList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.avatarList = data.list;
            this.total = data.total;
          }
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getAvatar();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getAvatar();
    },
    handleCancel() {
      this.previewVisible = false;
    },
    blackImage(images) {
      this.previImages = images;
      this.previewVisible = true;
    },
    handleUpdate(item) {
      console.log(item);
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        avatar: item.avatar,
        status: item.status,
      };
      this.$refs.avatarRef.imageUrl = this.baseUrl + "/" + item.avatar;
      this.imageUrl = item.avatar;
      this.isVisible = true;
    },

    handleCreate() {
      this.isStatus = 1;
      this.isVisible = true;
    },
    handleCancelFrom() {
      this.isVisible = false;
      this.$refs.avatarRef.imageUrl = "";
      this.$refs.avatarRef.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.avatarRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          values.avatar = values?.avatar.file
            ? values?.avatar?.file?.response?.data?.img_path
            : this.imageUrl;
          if (this.isStatus === 1) {
            userService
              .avatarCreate({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getAvatar();
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
              });
          } else {
            userService
              .avatarUpdate({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getAvatar();
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
    handleDelete(item) {
      userService
        .avatarDelete({ id: item.id })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getAvatar();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>