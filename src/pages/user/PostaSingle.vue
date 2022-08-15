<template>
  <a-spin :spinning="spinning">
    <a-card>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="用户名Id"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    v-decorator="['user_id']"
                    allowClear
                    placeholder="请输入用户名Id"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="晒单来源"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="晒单来源" v-decorator="['status']">
                    <a-select-option value="1">物流</a-select-option>
                    <a-select-option value="2">收货</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="订单编号"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    placeholder="订单编号"
                    allowClear
                    v-decorator="['order_number']"
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
                    v-decorator="['created_at']"
                    style="width: 100%"
                    :ranges="fastDate"
                    show-time
                  />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item
                  label="状态"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="请选择" v-decorator="['status']">
                    <a-select-option value="0">待审核</a-select-option>
                    <a-select-option value="1">通过</a-select-option>
                    <a-select-option value="2">不通过</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="商品Id"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    style="width: 100%"
                    placeholder="请输入"
                    allowClear
                    v-decorator="['商品ID']"
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
        :dataSource="postSingleList"
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

        <span slot="source" slot-scope="text">
          <a-tag :color="text === 1 ? '#519259' : '#064635'">{{
            text === 1 ? "物流" : "收货"
          }}</a-tag>
        </span>
        <template slot="star" slot-scope="item">
          <a-rate :default-value="item" disabled />
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status | formSingleColor">{{
            status | formSingle
          }}</a-tag>
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleReview(item)" v-if="item.status === 0">
              <a-icon type="edit"></a-icon>
              审核
            </a>
            <a @click="handleDetails(item.id)">详情</a>
          </a-space>
        </template>
      </a-table>
      <!-- ======================Form======================= -->
      <verified-form
        :loading="confirmLoading"
        :visible="isVisible"
        ref="singleRef"
        :modules="modules"
        @cancel="handleCancel"
        @ok="handleOk"
        :titleType="2"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import { formSingle, formSingleColor } from "@/utils/filters";
import VerifiedForm from "./components/VerifiedForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户ID",
    dataIndex: "user_id",
    align: "center",
  },
  {
    title: "订单编号",
    dataIndex: "order_number",
    align: "center",
  },
  {
    title: "商品ID",
    dataIndex: "goods_id",
    align: "center",
  },

  {
    title: "晒单来源",
    dataIndex: "source",
    align: "center",
    scopedSlots: { customRender: "source" },
  },

  {
    title: "评星",
    dataIndex: "star",
    align: "center",
    scopedSlots: { customRender: "star" },
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: {
      customRender: "createTime",
    },
  },
  {
    title: "操作",

    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];

export default {
  components: { VerifiedForm },
  name: "PostSingle",
  filters: {
    formSingle,
    formSingleColor,
  },
  data() {
    return {
      spinning: false,
      columns,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      postSingleList: [],
      total: 0,
      advanced: false,
      modules: null,
      confirmLoading: false,
      isVisible: false,
    };
  },
  activated() {
    this._getPostSingleList();
  },

  computed: {
    countNum() {
      return this.$store.state.socket.postListData;
    },
  },
  watch: {
    countNum: function (newVal) {
      if (newVal) {
        this.postSingleList.unshift(newVal);
      } else {
        throw new Error("监听错误");
      }
    },
  },
  methods: {
    _getPostSingleList() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.created_at = this.config?.timeFormat(values.created_at);
        userService
          .getPostSingleList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.total = data.total;
            this.postSingleList = data.list;
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getPostSingleList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getPostSingleList();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getPostSingleList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getPostSingleList();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleReview(item) {
      this.modules = {
        id: item.id,
        status: "1",
        reason: "",
      };
      this.isVisible = true;
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.singleRef.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.singleRef.form;
      form.validateFields((err, values) => {
        if (!err) {
          userService
            .postSingleReview({
              id: values.id,
              status: values.status,
              remark: values.reason,
            })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code === 200) {
                this.$message.success("审核成功");
                this.isVisible = false;
                this._getPostSingleList();
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
    handleDetails(id) {
      this.$router.push({
        path: `/single/details?id=${id}`,
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