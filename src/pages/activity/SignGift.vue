<template>
  <a-card>
    <template name="title">
      <a-button type="primary" @click="handleCreate"
        ><a-icon type="plus" />新增
      </a-button>
    </template>
    <a-table
      :columns="columns"
      :data-source="rechargeList"
      :loading="loading"
      :rowKey="(record) => record.id"
      bordered
    >
      <template slot="status" slot-scope="status">
        <a-tag :color="status === 1 ? 'green' : 'pink'">{{
          status === 1 ? "启用" : "禁用"
        }}</a-tag>
      </template>
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm
            :title="`你确定要${item.status === 1 ? '禁用' : '启用'}是否继续?`"
            @confirm="handleBan(item)"
          >
            <a> {{ item.status === 1 ? "禁用" : "启用" }} </a>
          </a-popconfirm>
        </a-space>
      </div>
    </a-table>
    <sign-form
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
import SignForm from "./components/SignForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "签到名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "需要充值",
    dataIndex: "amount",
    align: "center",
  },
  {
    dataIndex: "daily_rebate",
    title: "每日可以领取的回扣",
    align: "center",
  },
  {
    dataIndex: "payback_cycle",
    title: "本金回收周期",
    align: "center",
  },
  {
    title: "可得到的金额",
    dataIndex: "profit",
    align: "center",
  },
  {
    title: "库存",
    dataIndex: "stock",
    align: "center",
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
  name: "SignGift",
  components: {
    SignForm,
  },
  data() {
    return {
      rechargeList: [],
      columns: columns,
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      modules: null,
    };
  },
  created() {
    this._rechargeGift();
  },
  methods: {
    _rechargeGift() {
      this.loading = true;
      activityService.getEvent().then((res) => {
        this.loading = false;
        const { code, msg, data } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.rechargeList = data;
        }
      });
    },
    handleUpdate(item) {
      const { id, stock, payback_cycle, daily_rebate, amount, name } = item;
      this.modules = {
        id,
        stock,
        payback_cycle,
        daily_rebate,
        amount,
        name,
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
            activityService.createPack({ ...values }).then((res) => {
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
            activityService.updatePack({ ...values }).then((res) => {
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
    handleBan(item) {
      activityService
        .banPack({ id: item.id, status: item.status === 1 ? 0 : 1 })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success(`${item.status !== 1 ? "启用" : "禁用"}成功`);
            this._rechargeGift();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
