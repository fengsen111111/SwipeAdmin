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
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm title="你确定要删除吗？" @confirm="handleDelete(item)">
            <a> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
        </a-space>
      </div>
    </a-table>
    <!-- <first-charge
      :loading="confirmLoading"
      :status="isStatus"
      :isVisible="isVisible"
      ref="userForm"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    /> -->
    <first-charge-form
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
import FirstChargeForm from "./components/FirstChargeForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "人数",
    dataIndex: "persons",
    align: "center",
  },
  {
    title: "奖励金额",
    dataIndex: "amount",
    align: "center",
  },
  {
    dataIndex: "weight",
    title: "权重",
    align: "center",
  },

  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  name: "FirstCharge",
  components: {
    FirstChargeForm,
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
    };
  },
  created() {
    this._rechargeGift();
  },
  methods: {
    _rechargeGift() {
      this.loading = true;
      activityService
        .firstRechargeList({
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
          }
        })
        .catch((error) => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    handleUpdate(item) {
      const { id, amount, weight, persons } = item;
      this.modules = {
        id,
        weight,
        persons,
        amount,
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
            activityService.firstRechargeCreate({ ...values }).then((res) => {
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
            activityService.firstRechargeUpdate({ ...values }).then((res) => {
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
      activityService.firstRechargeDelete({ id: item.id }).then((res) => {
        const { code, msg } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.$message.success("删除成功");
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
