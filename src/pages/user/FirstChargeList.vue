<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="6" :sm="24">
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
              label="充值日期"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-range-picker
                v-decorator="['create_time']"
                style="width: 100%"
                :ranges="fastDate"
                show-time
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="5" :sm="24">
            <a-form-item
              label="注册来源"
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 14, offset: 1 }"
            >
              <a-select placeholder="请选择" v-decorator="['reg_id']">
                <a-select-option
                  :value="item.id"
                  v-for="item in registerTypeList"
                  :key="item.id"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col> -->
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
      <!-- <div style="display: flex">
        <a-statistic
          title="首充总额"
          :value="money"
          style="margin-right: 50px"
        />
        <a-statistic
          title="首充数量"
          :value="total"
          groupSeparator=""
          style="margin-right: 50px"
        />
      </div> -->
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="firstRechargeList"
        :rowKey="(record) => record.id"
        :scroll="{ x: 'max-content' }"
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
        <span slot="firstTime" slot-scope="record">{{
          record | formDate
        }}</span>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import { registerTypeList } from "@/utils/util";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户昵称",
    dataIndex: "nickname",
    align: "center",
  },
  // {
  //   title: "用户手机号",
  //   dataIndex: "phone",
  //   align: "center",
  // },
  {
    title: "用户名",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "首充金额",
    dataIndex: "money",
    align: "center",
  },
  {
    title: "三方通道",
    dataIndex: "pay_company",
    align: "center",
  },
  {
    title: "三方充值方式",
    dataIndex: "pay_type",
    align: "center",
  },
  {
    title: "三方费率",
    dataIndex: "third_rate",
    align: "center",
  },
  {
    title: "三方手续费",
    dataIndex: "third_fee",
    align: "center",
  },
  {
    title: "首充时间",
    dataIndex: "time",
    scopedSlots: { customRender: "firstTime" },
    align: "center",
  },
];
export default {
  name: "FirstCharge",
  data() {
    this.registerTypeList = registerTypeList;
    return {
      spinning: false,
      columns: columns,
      loading: false,
      firstRechargeList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      // money: "",
    };
  },
  activated() {
    this._getRecharge();
  },
  methods: {
    _getRecharge() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        userService
          .firstCharge({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
              return;
            } else {
              this.firstRechargeList = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getRecharge();
    },
    handleReset() {
      this.pageIndex = 1;
      this.$refs.searchRef.form.resetFields();
      this._getRecharge();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getRecharge();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getRecharge();
    },
  },
};
</script>

<style lang="scss" scoped></style>
