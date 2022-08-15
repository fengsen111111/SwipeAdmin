<template>
  <div>
    <a-card title="">
      <a-table
        :columns="columns"
        :data-source="adminLists"
        :row-key="(record) => record.id"
        bordered
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
        :loading="loading"
      >
        <template slot="title">
          <a-button type="primary" class="mb-2" @click="handleAdd">
            <a-icon type="plus" />新增</a-button
          >
        </template>
        <template slot="status" slot-scope="status">
          <a-tag :color="status === 1 ? 'green' : 'pink'">
            {{ status | statusStr }}
          </a-tag>
        </template>
        <div slot="action" slot-scope="item">
          <a style="margin-right: 8px" @click="updateAdmin(item)">
            <a-icon type="edit" />编辑
          </a>

          <a-popconfirm
            title="你确定要删除此用户吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm(item)"
            @cancel="cancel"
          >
            <a style="margin-right: 8px"> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
          <a-popconfirm
            :title="
              item.status === 3 ? '你确定要解封此用户?' : '你确定要封禁此用户?'
            "
            ok-text="确定"
            cancel-text="取消"
            @confirm="bindConfirm(item)"
          >
            <a>
              {{ item.status === 3 ? "解封" : "封禁" }}
            </a>
          </a-popconfirm>
        </div>
      </a-table>
    </a-card>
    <create-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="adminModule"
      @cancel="handleCancel"
      @ok="handleOk"
      :roleList="roleList"
      :status="bulletStatus"
    />
  </div>
</template>

<script>
import { adminService } from "@/services";
import CreateForm from "./modules/CreateForm";

const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "关联角色",
    dataIndex: "role.rolename",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  name: "Administrator",
  components: {
    CreateForm,
  },
  filters: {
    statusStr(val) {
      switch (val) {
        case 0:
          return "未激活";
        case 1:
          return "在线";
        case 2:
          return "离线";
        case 3:
          return "封禁";
        default:
          return "未知";
      }
    },
  },
  data() {
    return {
      adminLists: [],
      pagination: {},
      loading: false,
      columns,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      visible: false,
      confirmLoading: false,
      bulletStatus: 1,
      roleList: [],
      adminModule: null,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm();
  },
  created() {
    this._getAdminList();
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getAdminList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getAdminList();
    },
    _getAdminList() {
      this.loading = true;
      adminService
        .getAdminList(this.pageSize, this.pageIndex)
        .then((res) => {
          this.loading = false;
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg, 3);
          } else {
            this.adminLists = data.list;
            this.roleList = data.role;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },

    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.bulletStatus === 1) {
            adminService
              .addAdmin({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.visible = false;
                  // 重置表单数据
                  form.resetFields();
                  // 刷新表格
                  this._getAdminList();
                  this.$message.success("新增成功");
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            adminService
              .updateAdmin({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.visible = false;
                  this.confirmLoading = false;
                  // 重置表单数据
                  form.resetFields();
                  // 刷新表格
                  this._getAdminList();
                  this.$message.info("修改成功");
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    handleAdd() {
      this.bulletStatus = 1;
      this.visible = true;
      this.adminModule = null;
      this.$refs.createModal.form.resetFields();
    },
    updateAdmin(item) {
      this.bulletStatus = 2;
      this.visible = true;
      const { username, nickname, role, id } = item;
      this.adminModule = {
        nickname,
        password: "",
        username,
        role_id: role.id,
        id,
      };
    },
    confirm(item) {
      this.loading = true;
      adminService
        .deleteAdmin({ id: item.id })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getAdminList();
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    cancel() {
      this.$message.error("取消删除");
    },
    bindConfirm(item) {
      const { status, id } = item;
      if (status === 3) {
        adminService
          .reliveAdmin({ id })
          .then((res) => {
            const { code, msg } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
              return;
            } else {
              this.$message.success("解封成功");
              this._getAdminList();
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      } else {
        adminService
          .bindAdmin({ id })
          .then((res) => {
            const { code, msg } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
              return;
            } else {
              this.$message.success("封禁成功");
              this._getAdminList();
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
