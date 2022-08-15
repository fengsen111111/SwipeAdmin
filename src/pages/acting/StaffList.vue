<template>
  <a-spin :spinning="spinning">
    <a-card>
      <slot name="title">
        <div>
          <a-form layout="horizontal" :form="form" ref="searchRef">
            <div>
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item
                    label="昵称"
                    :labelCol="{ span: 3 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-input
                      v-decorator="['nickname']"
                      allowClear
                      placeholder="请输入昵称"
                    />
                  </a-form-item>
                </a-col>
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
                <a-col :md="8" sm="24" style="margin-left: 10px">
                  <a-form-item>
                    <a-space size="large">
                      <a-button type="primary" @click="handleCreate">
                        <a-icon type="plus"></a-icon>
                        新增
                      </a-button>
                      <a-button @click="handleSearch"> 查询 </a-button>
                      <a-button type="dashed" @click="handleReset">
                        重置
                      </a-button>
                    </a-space>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </slot>
      <a-table
        :columns="columns"
        :dataSource="staffList"
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
        <span slot="inviteUrl" slot-scope="item">
          <a-space size="small">
            <span>{{ item }}</span>
            <a>
              <a-icon type="copy" v-copy="item" theme="twoTone" />
            </a>
          </a-space>
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleUpdate(item)">
              <a-icon type="edit"></a-icon>
              编辑
            </a>
            <a @click="banActing(item)">
              {{ item.status === 0 ? "启用" : "禁用" }}
            </a>
          </a-space>
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
            status === 1 ? "启用" : "禁用"
          }}</a-tag>
        </span>
        <span slot="agentType" slot-scope="item">
          <a-tag :color="item == 1 ? '#2db7f5' : '#87d068'">{{
            item | formDateType
          }}</a-tag>
        </span>
        <span slot="isGiveGift" slot-scope="item">
          <a-tag :color="item === 0 ? 'red' : 'green'">{{
            item === 1 ? "是" : "否"
          }}</a-tag>
        </span>
      </a-table>
      <!-- ======================Form======================= -->
      <staff-form
        :loading="confirmLoading"
        :status="isStatus"
        :visible="isVisible"
        ref="staffForm"
        :modules="modules"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { actingService } from "@/services";
import StaffForm from "./components/StaffForm.vue";
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
    title: "邀请码",
    dataIndex: "in_code",
    align: "center",
  },
  {
    title: "代理类型",
    dataIndex: "agent_type_type",
    align: "center",
    scopedSlots: {
      customRender: "agentType",
    },
  },
  {
    title: "是否可赠送礼金",
    align: "center",
    dataIndex: "is_give_gift",
    scopedSlots: {
      customRender: "isGiveGift",
    },
  },
  {
    title: "默认语言",
    align: "center",
    dataIndex: "language",
  },
  {
    title: "总代理昵称",
    align: "center",
    dataIndex: "relation.all_agent_nickname",
  },
  {
    title: "总代理用户名",
    align: "center",
    dataIndex: "relation.all_agent_username",
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
    title: "邀请链接",
    align: "center",
    dataIndex: "invite_url",
    scopedSlots: {
      customRender: "inviteUrl",
    },
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
  name: "StaffList",
  components: { StaffForm },
  filters: {
    formDateType(val) {
      switch (Number(val)) {
        case 0:
          return "不是代理";
        case 1:
          return "全线";
        case 2:
          return "直推";
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
      staffList: [],
      total: 0,
      modules: null,
      confirmLoading: false,
      isStatus: 1,
      isVisible: false,
    };
  },
  activated() {
    this._getStaffList();
  },
  methods: {
    handleCreate() {
      this.isVisible = true;
      this.isStatus = 1;
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getStaffList();
    },
    handleReset() {
      this.form.resetFields();
      this._getStaffList();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getStaffList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getStaffList();
    },
    _getStaffList() {
      this.loading = true;
      this.form.validateFields().then((values) => {
        actingService
          .getStaff({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code === 200) {
              this.staffList = data.list;
              this.total = data.total;
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
    handleUpdate(item) {
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        nickname: item.nickname,
        username: item.username,
        agent_type_type: item.agent_type_type,
        is_recharge: item.is_recharge,
        is_login: item.is_login,
        is_withdrawal: item.is_withdrawal,
        is_buy: item.is_buy,
        is_give_gift: item.is_give_gift,
        password: "",
        language: item.language,
      };
      this.isVisible = true;
    },
    banActing(item) {
      this.loading = true;
      actingService
        .banStaff({
          id: item.id,
          status: item.status === 0 ? 1 : 0,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code === 200) {
            this.$message.success(`${item.status === 1 ? "禁用" : "启用"}成功`);
            this._getStaffList();
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.staffForm.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.staffForm.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            actingService
              .createStaff({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code === 200) {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getStaffList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            actingService
              .updateStaff({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code === 200) {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getStaffList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
