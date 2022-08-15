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
                  label="审核状态"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="账号" v-decorator="['status']">
                    <a-select-option value="0">待审核</a-select-option>
                    <a-select-option value="1">审核成功 </a-select-option>
                    <a-select-option value="2">审核失败</a-select-option>
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
                  label="创建日期"
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
                  label="手机号"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    placeholder="请输入"
                    allowClear
                    v-decorator="['phone']"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="PAN ID"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    style="width: 100%"
                    placeholder="请输入"
                    allowClear
                    v-decorator="['pin_id']"
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

      <a-table
        :columns="columns"
        :dataSource="verifiedList"
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

        <span slot="status" slot-scope="status">
          <a-tag v-if="status === 0" color="orange">待审核</a-tag>
          <a-tag v-else-if="status === 1" color="green">审核成功</a-tag>
          <a-tag :color="red" v-else> 审核失败 </a-tag>
        </span>
        <span slot="regType" slot-scope="item">
          <a-tag :color="item == 1 ? '#2db7f5' : '#87d068'">{{
            item | formDateType
          }}</a-tag>
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleReview(item)" v-if="item.status === 0"> 审核 </a>
          </a-space>
        </template>
      </a-table>
      <!-- ======================Form======================= -->
      <verified-form
        :loading="confirmLoading"
        :visible="isVisible"
        ref="veriForm"
        :modules="modules"
        @cancel="handleCancel"
        @ok="handleOk"
        :titleType="1"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import VerifiedForm from "./components/VerifiedForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "user.username",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "user.nickname",
    align: "center",
  },
  {
    title: "真实姓名",
    dataIndex: "actual_name",
    align: "center",
  },
  {
    title: "PAN ID",
    dataIndex: "pin_id",
    align: "center",
  },
  {
    title: "Aadhaar ID",
    dataIndex: "aadhaar_id",
    align: "center",
  },
  {
    title: "地址",
    dataIndex: "address",
    align: "center",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: {
      customRender: "createTime",
    },
  },

  {
    title: "不通过理由",
    dataIndex: "reason",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    fixed: "right",
    width: 100,
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    width: 100,
    scopedSlots: {
      customRender: "actions",
    },
  },
];
export default {
  components: { VerifiedForm },
  name: "Verified",
  data() {
    return {
      spinning: false,
      columns,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      verifiedList: [],
      total: 0,
      advanced: false,
      // Form
      confirmLoading: false,
      modules: null,
      isVisible: false,
    };
  },
  created() {
    this._getVerifiedList();
  },
  methods: {
    _getVerifiedList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        console.log("===========>values", values);
        userService
          .getVerifiedList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.verifiedList = data.list;
              this.total = data.total;
              this.loading = false;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getVerifiedList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getVerifiedList();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleReview(item) {
      this.isVisible = true;
      this.modules = {
        id: item.id,
      };
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getVerifiedList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getVerifiedList();
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.veriForm.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.veriForm.form;
      form.validateFields((err, values) => {
        if (!err) {
          userService
            .reviewVerified(values)
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code === 200) {
                this.$message.success("审核成功");
                this.isVisible = false;
                this._getVerifiedList();
                form.resetFields();
              } else {
                this.$message.error(msg);
              }
            })
            .catch(() => {
              this.confirmLoading = false;
            });
        }
      });
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
