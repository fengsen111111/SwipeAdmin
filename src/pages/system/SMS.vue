<template>
  <a-card>
    <slot name="title">
      <a-button type="primary" @click="handleCreate">
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </slot>
    <div style="height: 10px"></div>
    <a-table
      :columns="columns"
      :dataSource="smsLists"
      :loading="loading"
      bordered
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
      <p slot="expandedRowRender" slot-scope="{ details }" style="margin: 0">
        <a-list item-layout="horizontal" :data-source="details">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta :description="item.val">
              <a slot="title">{{ item.name }}</a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </p>
      <span slot="createTime" slot-scope="time">
        {{ time | formDate }}
      </span>
      <template slot="actions" slot-scope="item">
        <a-space size="middle">
          <a @click="handleUpdate(item)">
            <a-icon type="edit"></a-icon>
            编辑
          </a>
          <a-popconfirm
            title="确定要删除吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item)"
          >
            <a>
              <a-icon type="delete"></a-icon>
              删除
            </a>
          </a-popconfirm>
        </a-space>
      </template>
      <span slot="status" slot-scope="status">
        <a-tag :color="status === 1 || status === 2 ? 'green' : 'red'">
          {{ status | formMateStatus }}
        </a-tag>
      </span>
    </a-table>
    <!-- ======================Form======================= -->
    <sms-form
      :loading="confirmLoading"
      :status="isStatus"
      :visible="isVisible"
      ref="smsForm"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "服务商(英文) 名称",
    dataIndex: "service_provider",
    align: "center",
  },
  {
    title: "失效时间(分钟)",
    dataIndex: "expire",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "state",
    align: "center",
    scopedSlots: {
      customRender: "status",
    },
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
    scopedSlots: {
      customRender: "actions",
    },
  },
];

import { systemService } from "@/services";
import SmsForm from "./components/SmsForm.vue";
const PARTONE = "partOne";
export default {
  components: { SmsForm },
  name: "SMS",
  filters: {
    formMateStatus(val) {
      switch (Number(val)) {
        case 1:
          return "启用";
        case 2:
          return "使用中";
        case 3:
          return "禁用";
        case 4:
          return "已删除";
        default:
          break;
      }
    },
  },
  data() {
    return {
      loading: false,
      smsLists: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      columns,
      modules: null,
      confirmLoading: false,
      isStatus: 1,
      isVisible: false,
      PARTONE,
    };
  },

  created() {
    this._smsList();
  },
  methods: {
    _smsList() {
      this.loading = true;
      systemService
        .getSmsCode({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, data, msg } = res.data;
          if (code === 200) {
            this.smsLists = data.list.map((item) => {
              return {
                ...item,
                details: this.formateObj(item.value),
              };
            });
            this.total = data.total;
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._smsList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._smsList();
    },
    formateObj(obj = {}) {
      const result = [];
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          result.push({
            name: key,
            val: element,
          });
        }
      }
      return result;
    },

    handleDelete(item) {
      systemService
        .deleteSms({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            this.$message.success("删除成功");
            this._smsList();
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleUpdate(item) {
      this.modules = {
        id: item.id,
        service_provider: item.service_provider,
        expire: item.expire,
        state: item.state,
      };
      const arr = this.formateObj(item.value);
      this.$refs.smsForm.detailsArr = arr;
      this.isStatus = 2;
      this.isVisible = true;
    },
    handleCreate() {
      this.isVisible = true;
      this.isStatus = 1;
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.smsForm.detailsArr = [];
      this.$refs.smsForm.form.resetFields();

      //   this.$refs.smsForm.resetForm();
    },
    handleOk() {
      const form = this.$refs.smsForm.form;
      this.confirmLoading = true;
      form.validateFields((error, values) => {
        if (!error) {
          const result = [];
          values[`${PARTONE}Name`].forEach((item, index) => {
            result.push({
              name: item,
              val: values[`${PARTONE}Val`][index],
            });
          });
          let data = {};
          result.forEach((item) => {
            if (item.name && item.val) {
              data[item.name] = item.val;
            }
          });
          if (this.isStatus === 1) {
            systemService
              .createSms({
                value: data,
                service_provider: values.service_provider,
                expire: values.expire,
                state: values.state,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code === 200) {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  this._smsList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            systemService
              .updateSms({
                id: values.id,
                value: data,
                service_provider: values.service_provider,
                expire: values.expire,
                state: values.state,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code === 200) {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  this._smsList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
