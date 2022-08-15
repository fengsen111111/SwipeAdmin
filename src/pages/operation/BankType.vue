<template>
  <a-card>
    <a-form layout="horizontal" :form="form" ref="searchRef">
      <div>
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="银行代码"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-input
                v-decorator="['code']"
                allowClear
                placeholder="请输入银行代码"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="银行名称"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-input
                v-decorator="['name']"
                allowClear
                placeholder="请输入银行名称"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" style="margin-left: 8px">
            <a-form-item>
              <a-space size="middle">
                <a-button type="primary" @click="handleCreate">
                  <a-icon type="plus"></a-icon>
                  新增
                </a-button>
                <a-button @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table
      :loading="loading"
      :bordered="true"
      :columns="columns"
      :data-source="bankLists"
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
      <template slot="actions" slot-scope="actions">
        <a-space size="middle">
          <a @click="handleUpdate(actions)">
            <a-icon type="edit"></a-icon>
            编辑
          </a>
        </a-space>
      </template>
    </a-table>
    <bank-type-form
      ref="bankTypeRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
      :isStatus="isStatus"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import BankTypeForm from "./components/BankTypeForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "银行代号",
    dataIndex: "code",
    align: "center",
  },
  {
    title: "银行名称",
    dataIndex: "name",
    align: "center",
  },
  // {
  //   title: "状态",
  //   dataIndex: "status",
  //   scopedSlots: { customRender: "status" },
  //   align: "center",
  // },
  {
    title: "操作",
    scopedSlots: { customRender: "actions" },
    align: "center",
  },
];
export default {
  components: { BankTypeForm },
  name: "BankType",
  data() {
    return {
      loading: false,
      columns: columns,
      bankLists: [],
      form: this.$form.createForm(this),
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      modules: null,
      visible: false,
      confirmLoading: false,
      isStatus: 1,
    };
  },
  created() {
    this._bankTypeAll();
  },
  methods: {
    _bankTypeAll() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        operationService
          .getBankTypeList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.bankLists = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._bankTypeAll();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._bankTypeAll();
    },
    handleCreate() {
      this.visible = true;
      this.isStatus = 1;
    },
    handleUpdate(item) {
      this.isStatus = 2;
      this.modules = {
        ...item,
      };
      this.visible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.bankTypeRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            operationService
              .createBankType({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  form.resetFields();
                  this.visible = false;
                  this._bankTypeAll();
                }
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err);
              });
          } else {
            operationService
              .updateBankType({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  form.resetFields();
                  this.visible = false;
                  this._bankTypeAll();
                }
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
    handleCancel() {
      this.visible = false;
      this.$refs.bankTypeRef.form.resetFields();
    },
    handleSearch() {
      this.pageIndex = 1;
      this._bankTypeAll();
    },

    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._bankTypeAll();
    },
  },
};
</script>

<style lang="scss" scoped></style>
