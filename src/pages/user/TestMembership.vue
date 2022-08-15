<template>
  <a-card>
    <a-table
      :columns="columns"
      :dataSource="testUsrList"
      :loading="loading"
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
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </template>
      <div
        slot="avatar"
        slot-scope="item"
        style="display: flex; justify-content: center"
      >
        <div style="width: 40px; height: 40px">
          <img
            style="width: 100%; height: 100%"
            :src="baseUrl + '/' + item"
            @click="previewImg(baseUrl + '/' + item)"
          />
        </div>
      </div>
      <span slot="status" slot-scope="record">
        <a-tag color="red" v-if="record === 0"> 禁用 </a-tag>

        <a-tag color="green" v-else-if="record === 1"> 启用 </a-tag>

        <a-tag color="#fc5531" v-else> 已使用 </a-tag>
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
    <test-member-form
      :loading="confirmLoading"
      :status="isStatus"
      :visible="isVisible"
      ref="testUserRef"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { userService } from "@/services";
import TestMemberForm from "./components/TestMemberForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "头像",
    dataIndex: "avatar",
    align: "center",
    scopedSlots: {
      customRender: "avatar",
    },
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
    align: "center",
    scopedSlots: {
      customRender: "actions",
    },
  },
];
export default {
  components: { TestMemberForm },
  name: "TestMembership",
  data() {
    TestMemberForm;
    return {
      columns,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      testUsrList: [],
      total: 0,
      modules: null,
      confirmLoading: false,
      isStatus: 1,
      isVisible: false,
      baseUrl: "",
      imageUrl: "",
    };
  },
  created() {
    this._testUser();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    _testUser() {
      this.loading = true;
      userService
        .testUserList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { data, code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.testUsrList = data.list;
          this.total = data.total;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._testUser();
    },

    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._testUser();
    },
    handleCreate() {
      console.log(123);
      this.isVisible = true;
      this.isStatus = 1;
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.testUserRef.form;
      // const testRef = this.$refs.testUserRef;
      form.validateFields((err, values) => {
        if (!err) {
          if (typeof values?.avatar !== "string") {
            values.avatar = values?.avatar.file
              ? values?.avatar?.file?.response?.data?.img_path
              : this.imageUrl;
          }

          if (this.isStatus === 1) {
            userService
              .testUserCreate(values)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("添加成功");
                this.isVisible = false;
                form.resetFields();
                this._testUser();
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err.message);
              });
          } else {
            userService
              .testUserUpdate(values)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("修改成功");
                this.isVisible = false;
                form.resetFields();
                this._testUser();
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err.message);
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.testUserRef?.form?.resetFields();
      this.$refs.testUserRef.imageUrl = "";
    },
    handleUpdate(item) {
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        status: item.status,
        avatar: item.avatar,
        username: item.username,
        nickname: item.nickname,
      };
      this.$refs.testUserRef.imageUrl = this.baseUrl + "/" + item.avatar;

      this.imageUrl = item.avatar;
      this.isVisible = true;
    },
    handleDelete(item) {
      this.loading = true;
      userService
        .testUserDelete({
          id: item.id,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success("删除成功");
          this._testUser();
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
    previewImg(url) {
      this.$hevueImgPreview(url);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>