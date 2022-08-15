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
              label="IP地址"
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 14, offset: 1 }"
            >
              <a-input v-decorator="['ip']" placeholder="请输入IP" allowClear />
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item>
              <span style="float: right; margin-top: 3px">
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
        :bordered="true"
        :columns="columns"
        :data-source="firstRechargeList"
        :rowKey="(record) => record._id.$oid"
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
        <span slot="firstTime" slot-scope="record">{{
          record | formDate
        }}</span>
        <template slot="actions" slot-scope="item">
          <a type="primary" @click="handleEdit(item)" style="margin-right: 8px">
            <a-icon type="edit"></a-icon>编辑
          </a>
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
            status === 0 ? "否" : "是"
          }}</a-tag>
        </span>
      </a-table>
      <ip-form
        :loading="confirmLoading"
        :visible="isVisible"
        ref="ipFormRef"
        :modules="modules"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import IpForm from "./components/IpForm";
const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "用户登录Ip",
    dataIndex: "ip",
    align: "center",
  },
  {
    title: "时间",
    dataIndex: "create_time",
    scopedSlots: { customRender: "firstTime" },
    align: "center",
  },
  {
    title: "是否加入黑名单",
    dataIndex: "is_blacklist",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "操作",
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
      spinning: false,
      columns: columns,
      loading: false,
      firstRechargeList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      confirmLoading: false,
      isVisible: false,
      modules: null,
    };
  },
  created() {
    this._getRecharge();
  },
  methods: {
    _getRecharge() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        const params = {
          page: this.pageIndex,
          limit: this.pageSize,
          ...values,
        };
        userService
          .getIpList(params)
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
            this.$message.error(err.message);
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
    handleEdit(item) {
      this.modules = {
        create_time: item.create_time,
        ip: item.ip,
        is_blacklist: item.is_blacklist,
      };
      this.isVisible = true;
    },

    handleCancel() {
      this.isVisible = false;
    },
    handleOk() {
      const form = this.$refs.ipFormRef.form;
      this.confirmLoading = true;
      form.validateFields((err, values) => {
        if (!err) {
          userService
            .banUserIp({ ...values })
            .then((res) => {
              const { msg, code } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("修改成功");
                this.isVisible = false;
                this.confirmLoading = false;
                this._getRecharge();
              }
            })
            .catch((error) => {
              this.$message.error(error);
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
