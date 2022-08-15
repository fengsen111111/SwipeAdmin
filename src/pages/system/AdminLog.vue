<template>
  <a-card>
    <a-form layout="horizontal" :form="form" ref="searchRef">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="管理员名称"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['nickname']"
              allowClear
              placeholder="请输入管理员名称"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="描述"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['msg']"
              allowClear
              placeholder="请输入描述"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4" offset="1">
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset"
              >重置</a-button
            >
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="logList"
      bordered
      :rowKey="(record) => record.create_time"
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
    </a-table>
  </a-card>
</template>

<script>
import { systemService } from "@/services";
const columns = [
  {
    title: "管理员昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "添加时间",
    dataIndex: "create_time",
    scopedSlots: { customRender: "time" },
    align: "center",
  },
  {
    title: "IP",
    dataIndex: "ip",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "msg",
    align: "center",
  },
];
export default {
  name: "AdminLog",
  data() {
    return {
      columns: columns,
      loading: false,
      logList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
    };
  },
  activated() {
    this._getLogs();
  },
  methods: {
    _getLogs() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        systemService
          .getAdminLogList({
            limit: this.pageSize,
            page: this.pageIndex,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.logList = data.list;
              this.total = data.total;
            }
          })
          .catch((error) => {
            this.$message.error(error);
            this.loading = false;
          });
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getLogs();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getLogs();
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getLogs();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getLogs();
    },
  },
};
</script>

<style lang="scss" scoped></style>
