<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <!-- 一排 -->
          <a-row>
            <!-- 申请者账号 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="申请者账号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['users_username']"
                  allowClear
                  placeholder="请输入申请者账号"
                />
              </a-form-item>
            </a-col>
            <!-- 审核者账号 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="审核者账号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['admin_username']"
                  allowClear
                  placeholder="请输入审核者账号"
                />
              </a-form-item>
            </a-col>
            <!-- 状态 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select placeholder="状态" v-decorator="['status']">
                  <a-select-option value="1"> 审核中</a-select-option>
                  <a-select-option value="2"> 审核通过</a-select-option>
                  <a-select-option value="3"> 审核未通过</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 二排 -->
          <a-row v-show="advanced">
            <!-- 时间 -->

            <a-col :md="8" :sm="24">
              <a-form-item
                label="兑换时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-range-picker
                  v-decorator="['time']"
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
          </a-row>
        </div>
        <!-- 搜索 -->
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

      <!-- 新增按钮 -->
      <a-button
        type="primary"
        @click="handleCreate"
        style="margin-bottom: 10px"
        :disabled="!hasSelected"
      >
        <a-icon type="plus"></a-icon>
        批量审核
      </a-button>
    </div>
    <!-- 列表 -->

    <a-table
      :columns="columns"
      :data-source="commissionList"
      :rowKey="(record) => record.id"
      :scroll="{ x: 'max-content' }"
      :row-selection="rowSelection"
      bordered
      :loading="loading"
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
      <!-- 状态 -->
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 1" color="orange">审核中</a-tag>
        <a-tag v-else-if="type === 2" color="green">审核通过</a-tag>
        <a-tag v-else-if="type === 3" color="red">审核未通过</a-tag>
      </span>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleExamine(item)" v-if="item.status === 1"> 审核</a>
        </a-space>
      </div>
    </a-table>
    <!-- 审核 -->
    <batch-audit-form
      ref="batchAuditRrf"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleBatchCancel"
      @ok="handleBatchOk"
    />
    <!-- 详情 -->
    <div>
      <a-drawer
        title="审核详情"
        :placement="placement"
        :closable="false"
        :visible="is_visible"
        @close="onClose"
        width="300px"
      >
        <div v-if="examineModules">
          <p><b>审核者：</b>{{ examineModules.user.username }}</p>
          <p><b>金额：</b>{{ examineModules.amount }}</p>
          <p>
            <b>状态：</b>
            <a-tag v-if="examineModules.status === 1" color="orange"
              >审核中</a-tag
            >
            <a-tag v-else-if="examineModules.status === 2" color="green"
              >审核通过</a-tag
            >
            <a-tag v-else-if="examineModules.status === 3" color="red"
              >审核未通过</a-tag
            >
          </p>
          <p><b>审核不通过原因：</b>{{ examineModules.remark }}</p>
        </div>
      </a-drawer>
    </div>
  </a-card>
</template>

<script>
import { financeService } from "@/services";
import moment from "moment";
import BatchAuditForm from "./components/BatchAuditForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "申请者账号",
    dataIndex: "users_username",
    align: "center",
  },
  {
    title: "审核者账号",
    dataIndex: "admin_username",
    align: "center",
  },
  {
    title: "佣金",
    dataIndex: "amount",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "时间",
    dataIndex: "time",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  components: { BatchAuditForm },
  name: "UserCommission",
  data() {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      columns,
      commissionList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      moment,
      selectedRowKeys: [],
      selectedRows: null,
      confirmLoading: false,
      visible: false,
      modules: null,
      // 抽屉
      placement: "right", //抽屉弹出方向
      is_visible: false, //详情打开/关闭
      examineModules: null, //数据
    };
  },
  created() {
    this._getCommissionListSearch();
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: this.getCheckboxProps,
        selectedRowKeys: this.selectedRowKeys,
      };
    },
    // 勾选
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    // 查询搜索提佣列表
    _getCommissionListSearch() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        console.log(values);
        values.time = values.time
          ? [
              moment(values.time[0] / 1000).valueOf(),
              moment(values.time[1] / 1000).valueOf(),
            ]
          : null;
        financeService
          .getCommissionListSearch({
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
              this.commissionList = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 详情
    handleUpdate(item) {
      this.is_visible = true;
      financeService
        .getCommissionDetails({
          id: item.id,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.examineModules = data;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this._getCommissionListSearch();
    },
    // 批量审核
    handleCreate() {
      this.modules = {
        id: this.selectedRowKeys.join(),
      };
      this.visible = true;
    },
    // 审核
    handleExamine(item) {
      this.modules = {
        id: item.id,
      };
      this.visible = true;
    },
    // 审核确认
    handleBatchOk() {
      const form = this.$refs.batchAuditRrf.form;
      form.validateFields((error, values) => {
        console.log(values);
        if (!error) {
          this.confirmLoading = true;
          financeService
            .AuditCommission({
              ...values,
            })
            .then((res) => {
              this.selectedRowKeys = [];
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("审核成功");
                form.resetFields();
                this.visible = false;
                this._getCommissionListSearch();
              }
            })
            .catch((err) => {
              this.$message.error(err);
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 审核取消
    handleBatchCancel() {
      this.visible = false;
      this.$refs.batchAuditRrf.form.resetFields();
      this.selectedRowKeys = [];
    },
    // 重置
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getCommissionListSearch();
    },
    // 勾选事件
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 禁用
    getCheckboxProps(record) {
      console.log(record.status);
      return {
        props: {
          disabled: record.status === 3 || record.status === 2,
        },
      };
    },
    // 关闭抽屉
    onClose() {
      this.is_visible = false;
      this.examineModules = null;
    },
    onChange(e) {
      this.placement = e.target.value;
    },
    // 搜索框展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getCommissionListSearch();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getCommissionListSearch();
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
