<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="7" :sm="24">
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
              label="添加时间"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-range-picker
                v-decorator="['create_time']"
                style="width: 100%"
                :ranges="fastDate"
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [
                    moment('00:00:00', 'HH:mm:ss'),
                    moment('23:59:59', 'HH:mm:ss'),
                  ],
                }"
              />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="注册来源"
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 14, offset: 1 }"
            >
              <a-select placeholder="请选择" v-decorator="['reg_type']">
                <a-select-option
                  :value="item.id"
                  v-for="item in registerTypeList"
                  :key="item.id"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="管理员昵称"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-input
                v-decorator="['admin_nickname']"
                allowClear
                placeholder="请输入后台管理员昵称"
              />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <a-form-item>
              <span style="float: right">
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset"
                  >重置</a-button
                >
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="upAndDownRecordsList"
        bordered
        :rowKey="(record) => record._id.$oid"
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
        <span slot="startTime" slot-scope="record">{{
          record | formDate
        }}</span>
        <span slot="regType" slot-scope="text">
          <a-tag :color="text | formDateUserColor">{{
            text | formDateType
          }}</a-tag>
        </span>
        <span slot="type" slot-scope="type">
          <a-tag :color="type | formDataTypeColor">{{
            type | formDataTypeText
          }}</a-tag>
        </span>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import moment from "moment";
import { financeService } from "@/services";
import {
  formDateType,
  formDateUserColor,
  formDataTypeText,
  formDataTypeColor,
} from "@/utils/filters";
import { registerTypeList } from "@/utils/util";
const columns = [
  {
    title: "后台管理员昵称",
    dataIndex: "admin_nickname",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "昵称",
    align: "center",
    dataIndex: "nickname",
  },
  {
    title: "金额",
    align: "center",
    dataIndex: "amount",
    customCell: () => {
      return { style: { color: "red" } };
    },
  },
  {
    title: "之前的余额",
    align: "center",
    dataIndex: "before",
    customCell: () => {
      return { style: { color: "red" } };
    },
  },
  {
    title: "之后的余额",
    dataIndex: "after",
    align: "center",
    customCell: () => {
      return { style: { color: "green" } };
    },
  },
  {
    title: "操作时间",
    dataIndex: "create_time",
    scopedSlots: { customRender: "startTime" },
    align: "center",
  },
  {
    title: "注册类型",
    dataIndex: "reg_type",
    align: "center",
    scopedSlots: { customRender: "regType" },
  },
  {
    title: "上下分类型",
    dataIndex: "type",
    align: "center",
    scopedSlots: {
      customRender: "type",
    },
  },
];

export default {
  name: "UpAndDownRecord",
  filters: {
    formDateType,
    formDateUserColor,
    formDataTypeColor,
    formDataTypeText,
  },
  data() {
    this.registerTypeList = registerTypeList;
    return {
      spinning: false,
      columns: columns,
      loading: false,
      upAndDownRecordsList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      paginationType: 1,
      moment,
    };
  },
  activated() {
    this._getUpAndDown();
  },
  methods: {
    _getUpAndDown() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        financeService
          .getUpDownRecords({
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
              this.upAndDownRecordsList = data.list;
              this.total = data.total;
            }
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getUpAndDown();
    },
    handleReset() {
      this.paginationType = 1;
      this.$refs.searchRef.form.resetFields();
      this._getUpAndDown();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      if (this.paginationType === 1) {
        this._getUpAndDown();
      } else {
        this.handleSearch();
      }
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      if (this.paginationType === 1) {
        this._getUpAndDown();
      } else {
        this.handleSearch();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
