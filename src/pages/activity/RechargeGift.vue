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
      <template slot="title">
        <a-button type="primary" @click="handleCreate"
          ><a-icon type="plus" />新增
        </a-button>
      </template>
      <span slot="status" slot-scope="status">
        <a-tag :color="status === 1 ? 'red' : 'green'">{{
          status === 1 ? "禁用" : "启用"
        }}</a-tag>
      </span>
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm
            :title="`你确定要${item.status === 0 ? '封禁' : '解封'}吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item)"
          >
            <a>
              {{ item.status === 0 ? "封禁" : "解封" }}
            </a>
          </a-popconfirm>
        </a-space>
      </div>
    </a-table>
    <recharge-form
      :loading="confirmLoading"
      :status="isStatus"
      :isVisible="isVisible"
      ref="userForm"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { activityService } from "@/services";
import RechargeForm from "./components/RechargeForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "最大充值",
    dataIndex: "max_money",
    align: "center",
  },
  {
    title: "最小充值",
    dataIndex: "min_money",
    align: "center",
  },
  {
    dataIndex: "ratio",
    title: "赠送比例",
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
  name: "RechargeGift",
  components: {
    RechargeForm,
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
  created() {
    this._rechargeGift();
  },
  methods: {
    _rechargeGift() {
      this.loading = true;
      activityService
        .rechargeGiftList({
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
      const { id, max_money, min_money, remark, ratio } = item;
      this.modules = {
        id,
        max_money,
        min_money,
        remark,
        ratio: Number(ratio),
      };
      this.isVisible = true;
      this.isStatus = 2;
    },
    handleCreate() {
      this.isStatus = 1;
      this.isVisible = true;
    },
    handleCancel() {
      this.isVisible = false;
      const form = this.$refs.userForm.form;
      form.resetFields();
    },
    handleOk() {
      const form = this.$refs.userForm.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.isStatus === 1) {
            activityService.rechargeGiftCreate({ ...values }).then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("添加成功");
                this.isVisible = false;
                form.resetFields();
                this._rechargeGift();
              }
            });
          } else {
            activityService.rechargeGiftUpdate({ ...values }).then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("修改成功");
                this.isVisible = false;
                form.resetFields();
                this._rechargeGift();
              }
            });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleDelete(item) {
      activityService
        .rechargeGiftBan({ id: item.id, status: item.status === 1 ? 0 : 1 })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("操作成功");
            this._rechargeGift();
          }
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._rechargeGift();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._rechargeGift();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
