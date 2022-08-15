<template>
  <a-card>
    <a-form layout="horizontal" :form="form" ref="searchRef">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="用户名"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['username']"
              allowClear
              placeholder="请输入用户名"
            />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="日期"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-range-picker
              v-decorator="['created_at']"
              style="width: 100%"
              :ranges="fastDate"
              show-time
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
      :data-source="smsCodeLists"
      bordered
      :rowKey="(record) => record.created_at"
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
      <span slot="templateType" slot-scope="item">
        <a-tag color="green">{{ item === 0 ? "注册" : "重置密码" }}</a-tag>
      </span>
      <span slot="codeType" slot-scope="item">
        <a-tag color="green">{{
          item === 0 ? "数字验证码" : "字符验证码"
        }}</a-tag>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { systemService } from "@/services";
const columns = [
  { title: "用户名", dataIndex: "username", align: "center" },
  {
    title: "国际电话区号(+00)",
    dataIndex: "area_code",
    align: "center",
  },
  {
    title: "模板",
    dataIndex: "template_type",
    align: "center",
    scopedSlots: {
      customRender: "templateType",
    },
  },
  {
    title: "验证码类型",
    dataIndex: "code_type",
    align: "center",
    scopedSlots: { customRender: "codeType" },
  },
  {
    title: "验证码长度",
    dataIndex: "code_length",
    align: "center",
  },
  {
    title: "验证码",
    dataIndex: "code",
    align: "center",
  },
  {
    title: "失效时间(分钟)",
    dataIndex: "expire",
    align: "center",
  },
  {
    title: "记录时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: { customRender: "time" },
  },
];
export default {
  name: "SMSCodeList",
  data() {
    return {
      columns: columns,
      loading: false,
      smsCodeLists: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
    };
  },
  activated() {
    this._getCodeSms();
  },
  methods: {
    _getCodeSms() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        values.created_at = this.config?.timeFormat(values.created_at);
        systemService
          .getCodeSms({
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
              this.smsCodeLists = data.list;
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
      this._getCodeSms();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getCodeSms();
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getCodeSms();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getCodeSms();
    },
  },
};
</script>

<style lang="scss" scoped></style>
