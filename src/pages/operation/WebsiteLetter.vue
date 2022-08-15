<template>
  <a-card>
    <!-- 新增按钮 -->
    <a-button type="primary" @click="handleCreate" style="margin-bottom: 10px">
      <a-icon type="plus"></a-icon>
      新增
    </a-button>
    <!-- 列表 -->
    <a-table
      :columns="columns"
      :data-source="classificationList"
      :rowKey="(record) => record.id"
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
      <!-- 图片插槽处理 -->
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
      <!-- 状态 -->
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 2" color="red">禁用</a-tag>
        <a-tag v-else-if="status === 1" color="green">启用</a-tag>
      </span>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleSendOut(item)">
            <a-icon type="edit"></a-icon>发送站内信</a
          >
          <a @click="handleUpdate(item)"> <a-icon type="edit"></a-icon>更新</a>
          <a-popconfirm
            :title="`你确定要删除吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item)"
          >
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
        </a-space>
      </div>
      <!-- 时间 -->
      <span slot="create_time" slot-scope="create_time">
        {{ create_time | formDate }}
      </span>
    </a-table>

    <!-- 弹出表单 -->
    <website-letter-form
      ref="websiteFormRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
    <!-- 发布站内消息 -->
    <station-information-form
      ref="stationFormRef"
      :isVisible="isStationVisible"
      :loading="stationLoading"
      @cancel="handleStationCancel"
      @ok="handleStationOk"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import WebsiteLetterForm from "./components/WebsiteLetterForm.vue";
import StationInformationForm from "./components/StationInformationForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "图片",
    dataIndex: "img",
    align: "center",
    scopedSlots: { customRender: "img" },
  },
  {
    title: "	权重",
    dataIndex: "weight",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "操作",
    dataIndex: "",
    scopedSlots: { customRender: "actions" },
    align: "center",
  },
];
export default {
  components: { WebsiteLetterForm, StationInformationForm },
  name: "WebsiteLetter",
  data() {
    return {
      columns: columns,
      classificationList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      baseUrl: "",
      visible: false,
      confirmLoading: false,
      modules: null,
      isStatus: 1,
      itemWeight: 1,
      isStationVisible: false,
      stationLoading: false,
      stationModules: null,
      sendOutId: "",
    };
  },
  created() {
    this._getClassificationList();
  },
  methods: {
    // 获取分类列表
    _getClassificationList() {
      this.loading = true;
      operationService
        .getClassificationList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;

          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.classificationList = data;
            this.total = data.total || data.length;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },

    // 新增
    handleCreate() {
      this.$refs.websiteFormRef.form.resetFields();
      this.$refs.websiteFormRef.imageUrl = "";
      this.visible = true;
      this.isStatus = 1;
    },
    // 更新
    handleUpdate(item) {
      this.isStatus = 2;
      delete item.create_time;
      this.modules = {
        ...item,
      };
      this.$refs.websiteFormRef.imageUrl = this.baseUrl + "/" + item.img;
      this.imageUrl = item.img;
      this.visible = true;
    },
    // 删除
    handleDelete(item) {
      console.log(item);
      operationService
        .deleteClassification({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getClassificationList();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.$refs.websiteFormRef.form.resetFields();
    },
    // 确认
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.websiteFormRef.form;
      form.validateFields((error, values) => {
        console.log(values);
        if (!error) {
          if (values.img) {
            if (typeof values?.img !== "string") {
              values.img = values?.img.file
                ? values?.img?.file?.response?.data?.img_path
                : this.imageUrl;
            }
          }
          if (this.isStatus === 1) {
            operationService
              .createClassification({
                ...values,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  form.resetFields();
                  this.visible = false;
                  this._getClassificationList();
                }
              });
          } else {
            operationService
              .setClassification({
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
                  this._getClassificationList();
                }
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 发送站内信
    handleSendOut(item) {
      this.$refs.stationFormRef.form.resetFields();
      this.isStationVisible = true;
      this.sendOutId = item.id;
    },
    // 站内信取消
    handleStationCancel() {
      this.isStationVisible = false;
      this.$refs.stationFormRef.form.resetFields();
    },
    // 站内信确定
    handleStationOk() {
      this.stationLoading = true;
      const form = this.$refs.stationFormRef.form;
      form.validateFields((error, values) => {
        console.log(values, this.sendOutId);
        if (!error) {
          operationService
            .sendInStationLetter({
              title: values.title,
              content: values.content,
              user_ids: values.user_ids,
              category_id: this.sendOutId,
            })
            .then((res) => {
              this.stationLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("发送成功");
                form.resetFields();
                this.isStationVisible = false;
                this._getClassificationList();
              }
            });
        } else {
          this.stationLoading = false;
        }
      });
    },

    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getClassificationList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getClassificationList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
