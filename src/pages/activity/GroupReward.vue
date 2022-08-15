<template>
  <a-card>
    <a-table
      :columns="columns"
      :data-source="rechargeList"
      :loading="loading"
      :rowKey="(record) => record.id"
      bordered
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
      <span slot="status" slot-scope="status">
        <a-tag color="#F48024" v-if="status == 0">待审核</a-tag>
        <a-tag color="green" v-else-if="status == 1">通过</a-tag>
        <a-tag color="red" v-else>拒绝</a-tag>
      </span>
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)" v-if="item.status === 0">
            <a-icon type="edit" />审核
          </a>
        </a-space>
      </div>
    </a-table>
    <group-reward-form
      :loading="confirmLoading"
      :isVisible="isVisible"
      ref="groupRef"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { activityService } from "@/services";
import GroupRewardForm from "./components/GroupRewardForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "user.username",
    align: "center",
  },
  {
    title: "用户昵称",
    dataIndex: "user.nickname",
    align: "center",
  },
  {
    title: "用户填写ID",
    dataIndex: "group_account",
    align: "center",
  },
  {
    dataIndex: "remark",
    title: "备注",
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
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  name: "GroupReward",
  components: {
    GroupRewardForm,
  },
  data() {
    return {
      rechargeList: [],
      columns: columns,
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      modules: null,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
    };
  },
  activated() {
    this._getGroup();
  },
  methods: {
    _getGroup() {
      this.loading = true;
      activityService
        .groupList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.rechargeList = data.list;
            this.total = data.total;
          }
        });
    },
    handleUpdate(item) {
      this.modules = {
        id: item.id,
        status: 1,
        remark: "",
      };
      this.isVisible = true;
    },
    handleCreate() {
      this.isStatus = 1;
      this.isVisible = true;
    },
    handleCancel() {
      this.isVisible = false;
      const form = this.$refs.groupRef.form;
      form.resetFields();
    },
    handleOk() {
      const form = this.$refs.groupRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          activityService
            .reviewGroup({
              ...values,
            })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code === 200) {
                this.$message.success("审核完成");
                this.isVisible = false;
                this._getGroup();
              } else {
                this.$message.error(msg);
              }
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getGroup();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getGroup();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
