<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <!-- 用户名 -->
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
            <!-- 昵称 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="昵称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['user_nickname']"
                  allowClear
                  placeholder="请输入昵称"
                />
              </a-form-item>
            </a-col>
            <!-- 代理名称 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="代理手机号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['agent_username']"
                  allowClear
                  placeholder="请输入代理手机号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 二排 -->
          <a-row v-show="advanced">
            <!-- 代理名称 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="代理名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['agent_nickname']"
                  allowClear
                  placeholder="请输入代理名称"
                />
              </a-form-item>
            </a-col>
            <!-- 店铺名称 -->
            <a-col :md="8" :sm="24">
              <a-form-item
                label="店铺名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['shop_name']"
                  allowClear
                  placeholder="请输入店铺名称"
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
                  <a-select-option value="0"> 审核中</a-select-option>
                  <a-select-option value="1"> 审核通过</a-select-option>
                  <a-select-option value="-1"> 驳回审核</a-select-option>
                </a-select>
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
        <!-- 等级列表 -->
        <div style="margin-bottom: 10px">
          自动审核
          <a-switch v-model="is_auto_examine" @change="handleSwitch" />
        </div>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="storeAuditList"
      :rowKey="(record) => record.shop_id"
      :scroll="{ x: 'max-content' }"
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
      <!-- 图片 -->
      <div
        slot="img"
        slot-scope="item"
        style="display: flex; justify-content: center"
      >
        <div style="width: 40px; height: 40px">
          <img
            style="width: 100%; height: 100%"
            alt=""
            srcset=""
            :src="baseUrl + '/' + item"
          />
        </div>
      </div>
      <!-- 用户信息 -->
      <template slot="userinfo" slot-scope="item">
        <div>
          <a-tag :color="item | formDateUserColor">
            {{ item | formDateType }}
          </a-tag>
        </div>
      </template>
      <!-- 状态 -->
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 0" color="orange">审核中</a-tag>
        <a-tag v-else-if="type === 1" color="green">审核通过</a-tag>
        <a-tag v-else-if="type === -1" color="red">驳回审核</a-tag>
      </span>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)" v-if="item.status === 0">
            <a-icon type="edit"></a-icon>审核</a
          >
        </a-space>
      </div>
      <!-- 时间 -->
      <span slot="create_time" slot-scope="create_time">
        {{ create_time | formDate }}
      </span>
    </a-table>
    <store-audit-form
      ref="storeAuditRrf"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { storeManageService } from "@/services";
import StoreAuditForm from "./components/StoreAuditForm.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
const columns = [
  {
    title: "id",
    dataIndex: "shop_id",
    align: "center",
  },
  {
    title: "店铺名称",
    dataIndex: "shop_name",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "代理名称",
    dataIndex: "agent_nickname",
    align: "center",
  },
  {
    title: "代理手机号",
    dataIndex: "agent_username",
    align: "center",
  },
  {
    title: "总代理名称",
    dataIndex: "master_agent_username",
    align: "center",
  },
  {
    title: "店铺logo",
    dataIndex: "shop_logo",
    align: "center",
    scopedSlots: { customRender: "img" },
  },
  {
    title: "身份证",
    dataIndex: "id_card",
    align: "center",
    scopedSlots: { customRender: "img" },
  },
  {
    title: "店铺状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "提交审核时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "审核通过时间",
    dataIndex: "examine_pass_time",
    align: "center",
    scopedSlots: { customRender: "create_time" },
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
  components: { StoreAuditForm },
  filters: {
    formDateType,
    formDateUserColor,
  },
  name: "StoreAudit",
  data() {
    return {
      columns: columns,
      storeAuditList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      baseUrl: "",
      confirmLoading: false,
      visible: false,
      modules: null,
      is_auto_examine: false,
      form: this.$form.createForm(this),
      advanced: false,
    };
  },
  activated() {
    this._getStoreAuditList();
  },
  created() {
    this.$watch("is_auto_examine", () => {});
    this._getStoreAuditList();
  },
  methods: {
    // 审核店铺列表
    _getStoreAuditList() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        // values数据处理
        for(let item in values) {
          if(values[item]===""){
            values[item]=undefined
          }
        }
        // 
        storeManageService
          .getStoreList({
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
              this.is_auto_examine = data.is_auto_examine == 1 ? true : false;
              this.storeAuditList = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 审核
    handleUpdate(item) {
      this.modules = {
        id: item.shop_id,
      };
      this.visible = true;
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this._getStoreAuditList();
    },
    // 重置
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getStoreAuditList();
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.$refs.storeAuditRrf.form.resetFields();
    },
    // 确定
    handleOk() {
      const form = this.$refs.storeAuditRrf.form;
      form.validateFields((error, values) => {
        if (!error) {
          // 判断是否需要填写理由
          if (values.status === -1 && !values.remarks) {
            this.$message.error("请输入驳回理由");
          } else {
            this.confirmLoading = true;
            storeManageService
              .auditStore({
                ...values,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  form.resetFields();
                  this.visible = false;
                  this._getStoreAuditList();
                }
              })
              .catch((err) => {
                this.$message.error(err);
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 自动审核
    handleSwitch(e) {
      this.checked = e;
      storeManageService
        .operationStoreAudit({
          is_auto_examine: e === true ? 1 : 0,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            if (e) {
              this.$message.success("自动审核已开启");
            } else {
              this.$message.error("自动审核已关闭");
            }
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 搜索框展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getStoreAuditList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getStoreAuditList();
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
