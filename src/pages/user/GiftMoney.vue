
<template>
  <a-spin :spinning="spinning">
    <a-card>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <div :class="advanced ? null : 'fold'">
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
                  label="账号状态"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="账号" v-decorator="['status']">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="2">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="用户昵称"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    placeholder="请输入"
                    allowClear
                    v-decorator="['nickname']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="注册日期"
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

              <a-col :md="8" :sm="24">
                <a-form-item
                  label="注册来源"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="请选择" v-decorator="['reg_type']">
                    <a-select-option value="0">普通H5注册</a-select-option>
                    <a-select-option value="1">网站测试会员</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="员工代理用户名"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    style="width: 100%"
                    placeholder="请输入"
                    allowClear
                    v-decorator="['agent_username']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset"
              >重置</a-button
            >
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
      <div style="height: 10px"></div>
      <a-table
        :columns="columns"
        :dataSource="userList"
        :loading="loading"
        bordered
        :scroll="{ x: 'max-content' }"
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
        <span slot="createTime" slot-scope="time">
          {{ time | formDate }}
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleGift(item.id)">
              <a-icon type="gift" />
              赠送礼金</a
            >
          </a-space>
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
            status === 1 ? "启用" : "禁用"
          }}</a-tag>
        </span>
        <template slot="inCode" slot-scope="text">
          <a-space size="small">
            <span>{{ text }}</span>
            <a>
              <a-icon type="copy" v-copy="text" theme="twoTone" />
            </a>
          </a-space>
        </template>
      </a-table>
      <!-- ======================Form======================= -->
      <!-- <up-down-form
      /> -->
      <gift-form
        :loading="confirmLoading"
        :visible="isVisible"
        ref="userRef"
        :modules="modules"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import GiftForm from "./components/GiftForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "员工代理用户名",
    dataIndex: "agent_username",
    align: "center",
  },
  {
    title: "员工代理昵称",
    dataIndex: "agent_nickname",
    align: "center",
  },
  {
    title: "邀请码",
    dataIndex: "in_code",
    align: "center",
    scopedSlots: { customRender: "inCode" },
  },
  {
    title: "余额",
    dataIndex: "balance",
    align: "center",
    customCell: () => {
      return { style: { color: "red" } };
    },
  },
  // {
  //   title: "积分余额",
  //   dataIndex: "points_balance",
  //   align: "center",
  //   customCell: () => {
  //     return { style: { color: "red" } };
  //   },
  // },
  {
    title: "注册时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: {
      customRender: "createTime",
    },
  },
  {
    title: "注册类型",
    dataIndex: "reg_type",
    align: "center",
    scopedSlots: {
      customRender: "regType",
    },
  },
  {
    title: "累计充值金额",
    dataIndex: "cl_recharge",
    align: "center",
  },
  {
    title: "累计提现金额",
    dataIndex: "cl_withdrawal",
    align: "center",
  },
  // {
  //   title: "积分总额",
  //   dataIndex: "cl_integral",
  //   align: "center",
  // },
  {
    title: "购买总额",
    dataIndex: "cl_buy",
    align: "center",
  },
  {
    title: "状态",
    align: "center",
    dataIndex: "status",
    fixed: "right",
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    width: 140,
    scopedSlots: {
      customRender: "actions",
    },
  },
];
export default {
  components: { GiftForm },
  name: "upAndDown",
  filters: {
    formDateType(val) {
      switch (Number(val)) {
        case 0:
          return "H5注册";
        case 1:
          return "后台测试";
        case 2:
          return "PC注册";
        case 3:
          return "安卓APP注册";
        case 4:
          return "IOSAPP注册";
        default:
          break;
      }
    },
  },
  data() {
    return {
      spinning: false,
      columns,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      userList: [],
      total: 0,
      advanced: false,
      confirmLoading: false,
      isVisible: false,
      modules: null,
    };
  },
  activated() {
    this._getUserList();
  },
  methods: {
    handleSearch() {
      this.pageIndex = 1;
      this._getUserList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getUserList();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getUserList();
    },

    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getUserList();
    },
    _getUserList() {
      this.loading = true;
      this.form.validateFields().then((values) => {
        values.create_time = this.config?.timeFormat(values.create_time);
        userService
          .getUserList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code === 200) {
              this.userList = data?.list;
              this.total = data?.total;
            } else {
              this.$message.error(msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.userRef.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.userRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          userService
            .giftMoney({
              ...values,
            })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code === 200) {
                this.$message.success("赠送成功");
                this.isVisible = false;
                this._getUserList();
              } else {
                this.$message.error(msg);
              }
            })
            .catch((err) => {
              this.confirmLoading = false;
              this.$message.error(err);
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleGift(id) {
      this.isVisible = true;
      this.modules = {
        id: id,
        amount: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
