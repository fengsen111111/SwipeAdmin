<template>
  <a-card>
    <template slot="title">
      <a-button type="primary" @click="handleCreate">
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </template>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="ipList"
      :rowKey="(record) => record.id"
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
    >
      <span slot="time" slot-scope="time">
        {{ time | formDate }}
      </span>
      <div slot="actions" slot-scope="actions">
        <a-space size="large">
          <a @click="handleUpdate(actions)">
            <a-icon type="edit"></a-icon>
            编辑
          </a>
          <a-popconfirm
            title="你确定要删除吗？"
            @confirm="handleDelete(actions)"
          >
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
        </a-space>
      </div>
    </a-table>
    <ip-form
      :loading="confirmLoading"
      :visible="isVisible"
      :status="isStatus"
      ref="ipRef"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { systemService } from "@/services";
import IpForm from "./components/IpForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "IP",
    dataIndex: "code",
    align: "center",
  },
  {
    title: "时间",
    dataIndex: "created_at",
    scopedSlots: { customRender: "time" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "",
    scopedSlots: { customRender: "actions" },
    align: "center",
  },
];
export default {
  name: "IpList",
  components: {
    IpForm,
  },
  data() {
    return {
      ipList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      loading: false,
      columns: columns,
      confirmLoading: false,
      modules: null,
      isVisible: false,
      isStatus: 1,
    };
  },
  activated() {
    this._ipList();
  },
  methods: {
    _ipList() {
      this.loading = true;
      systemService
        .getIpSystemList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.ipList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._ipList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._ipList();
    },
    handleUpdate(item) {
      this.modules = {
        code: item.code,
        id: item.id,
        remark: item.remark,
      };
      this.isVisible = true;
      this.isStatus = 2;
    },
    handleDelete(item) {
      systemService.deleteIpSystem({ id: item.id }).then((res) => {
        const { code, msg } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.$message.success("删除成功");
          this._ipList();
        }
      });
    },
    handleCreate() {
      this.isStatus = 1;
      this.isVisible = true;
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.ipRef.form.resetFields();
    },
    handleOk() {
      const form = this.$refs.ipRef.form;
      this.confirmLoading = true;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            systemService.createIpSystem({ ...values }).then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("添加成功");
                this.isVisible = false;
                this._ipList();
                form.resetFields();
              }
            });
          } else {
            systemService.updateIpSystem({ ...values }).then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("修改成功");
                this.isVisible = false;
                this._ipList();
                form.resetFields();
              }
            });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
