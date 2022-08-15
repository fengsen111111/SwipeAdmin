<template>
  <div>
    <a-card>
      <a-table
        bordered
        :columns="columns"
        :data-source="lastFiveLists"
        ref="table"
        :row-key="(record) => record.id"
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
        :loading="loading"
      >
        <template slot="title">
          <a-button type="primary" @click="lastFiveAdd" class="mb-2">
            <a-icon type="plus" />
            新增</a-button
          >
        </template>
        <template slot="text" slot-scope="item">
          <span v-html="item">{{ item }}</span>
        </template>
        <div slot="action" slot-scope="item">
          <a-space size="large">
            <a @click="updateLastFive(item)"> <a-icon type="edit" />编辑 </a>
            <a-popconfirm
              title="你确定要删除此角色吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirm(item)"
            >
              <a> <a-icon type="delete" />删除</a>
            </a-popconfirm>
          </a-space>
        </div>
      </a-table>
      <last-five-form
        :loading="confirmLoading"
        ref="createModal"
        :status="isStatus"
        :isVisible="isVisible"
        :modul="lastModel"
        @cancel="handleCancel"
        @ok="handleOk"
        :rightLists="rightLists"
      />
    </a-card>
  </div>
</template>

<script>
import { adminService } from "@/services";
import LastFiveForm from "./modules/LastFiveForm.vue";

const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "角色名称",
    dataIndex: "rolename",
    align: "center",
  },
  {
    title: "权限",
    dataIndex: "jurisdiction",
    width: "1000px",
    align: "center",
    scopedSlots: {
      customRender: "text",
    },
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "LastFive",
  components: {
    LastFiveForm,
  },
  data() {
    return {
      columns,
      lastFiveLists: [],
      loading: false,
      confirmLoading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      isStatus: 1,
      isVisible: false,
      rightLists: [],
      lastModel: null,
    };
  },
  created() {
    this._getLastFive();
    this._getRight();
  },
  methods: {
    _getLastFive() {
      this.loading = true;
      adminService
        .getLastFive(this.pageSize, this.pageIndex)
        .then((res) => {
          this.loading = false;
          const { msg, data, code } = res.data;
          if (code !== 200) {
            this.$message.error(msg, 3);
            return;
          } else {
            this.lastFiveLists = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    mapTreeData(data) {
      return data.map((item) => {
        return {
          title: item.name,
          key: item.id,
          children:
            item.children_list == null || item.children_list.length <= 0
              ? []
              : this.mapTreeData(item.children_list),
        };
      });
    },
    _getRight() {
      adminService
        .getRight()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.rightLists = this.mapTreeData(data);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getLastFive();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
    },
    lastFiveAdd() {
      this.isVisible = true;
      this.isStatus = 1;
      this.lastModel = null;
      this.$refs.createModal.lastForm.resetFields();
      this.formClear();
    },
    formClear() {
      this.$refs.createModal.expandedKeys = [];
      this.$refs.createModal.checkedKeys = [];
    },
    handleOk() {
      const form = this.$refs.createModal.lastForm;
      const datas = this.$refs.createModal.checkedKeys;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.isStatus === 1) {
            const params = {
              rolename: values.rolename,
              jurisdiction: datas.join(","),
            };
            adminService
              .addLastFive(params)
              .then((res) => {
                this.confirmLoading = false;
                const { msg, code } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$notification.success({
                    message: "提示",
                    description: "添加成功需要重新登录生效",
                    onClick: () => {
                      console.log("Notification Clicked!");
                    },
                  });
                  this.isVisible = false;
                  form.resetFields();
                  this._getLastFive();
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          } else {
            const params = {
              id: values.id,
              rolename: values.rolename,
              jurisdiction: datas.join(","),
            };
            adminService
              .updateLast(params)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$notification.success({
                    message: "提示",
                    description: "修改成功需要重新登录生效",
                    onClick: () => {
                      console.log("Notification Clicked!");
                    },
                  });
                  this.isVisible = false;
                  form.resetFields();
                  this._getLastFive();
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          }
          //   console.log(values);
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.isVisible = false;
    },
    updateLastFive(item) {
      console.log(item);
      this.formClear();
      this.isStatus = 2;
      this.isVisible = true;
      this.lastModel = {
        rolename: item.rolename,
        id: item.id,
      };
    },
    confirm(item) {
      this.loading = true;
      adminService
        .deleteLast({ id: item.id })
        .then((res) => {
          this.loading = false;
          const { msg, code } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.$message.success("删除成功");
            this._getLastFive();
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
