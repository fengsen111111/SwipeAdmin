<template>
  <a-card>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="giftList"
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
      <template slot="title">
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus" /> 新增
        </a-button>
      </template>
      <template slot="images" slot-scope="images">
        <img
          :src="baseUrl + '/' + images"
          alt=""
          srcset=""
          style="width: 40px"
          @click="blackImage(baseUrl + '/' + images)"
        />
      </template>
      <span slot="status" slot-scope="record">
        <a-tag :color="record === 1 ? 'green' : 'red'">
          {{ record === 1 ? "正常" : "下架" }}
        </a-tag>
      </span>
      <template slot="actions" slot-scope="record">
        <a-space size="large">
          <a @click="handleUpdate(record)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm
            :title="`你确定要${record.status === 1 ? '下架' : '上架'}此活动吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="banRecord(record)"
          >
            <a>
              {{ record.status == 0 ? "上架" : "下架" }}
            </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previImages" />
    </a-modal>
    <activity-form
      :loading="confirmLoading"
      :status="isStatus"
      :visible="isVisible"
      ref="activityForm"
      :modules="modules"
      @cancel="handleCancelFrom"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { activityService } from "@/services";
import ActivityForm from "./components/ActivityForm.vue";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "游戏名称",
    align: "center",
    dataIndex: "name",
  },
  {
    title: "图片",
    dataIndex: "image",
    align: "center",
    scopedSlots: { customRender: "images" },
  },
  {
    title: "权重",
    dataIndex: "weight",
    align: "center",
  },
  {
    title: "游戏状态",
    align: "center",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  components: { ActivityForm },
  name: "Activity",
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      giftList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      previewVisible: false,
      baseUrl: "",
      previImages: "",

      isVisible: false,

      confirmLoading: false,
      modules: null,
      isStatus: 1,
      imageUrl: "",
    };
  },
  created() {
    this._allGift();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    _allGift() {
      this.loading = true;
      activityService
        .activityList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.giftList = data.list;
            this.total = data.total;
          }
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._allGift();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._allGift();
    },
    handleCancel() {
      this.previewVisible = false;
    },
    blackImage(images) {
      this.previImages = images;
      this.previewVisible = true;
    },
    handleUpdate(item) {
      console.log(item);
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        weight: item.weight,
        image: item.image,
        name: item.name,
      };
      this.$refs.activityForm.imageUrl = this.baseUrl + "/" + item.image;
      this.imageUrl = item.image;
      this.isVisible = true;
    },
    banRecord(item) {
      activityService
        .activityBan({ id: item.id, status: item.status === 0 ? 1 : 0 })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success(`${item.status === 0 ? "上架" : "下架"}成功`);
            this._allGift();
          }
        });
    },
    handleSubmit() {
      this.confirmLoading = true;
      activityService
        .activityUpdate({
          id: this.gameId,
          weight: this.weights,
        })
        .then((res) => {
          this.confirmLoading = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("修改成功");
            this._allGift();
            this.isVisible = false;
          }
        });
    },
    handleCreate() {
      this.isStatus = 1;
      this.isVisible = true;
    },
    handleCancelFrom() {
      this.isVisible = false;
      this.$refs.activityForm.imageUrl = "";
      this.$refs.activityForm.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.activityForm.form;
      form.validateFields((error, values) => {
        if (!error) {
          values.image = values?.image.file
            ? values?.image?.file?.response?.data?.img_path
            : this.imageUrl;
          if (this.isStatus === 1) {
            activityService
              .activityCreate({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._allGift();
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
              });
          } else {
            activityService
              .activityUpdate({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._allGift();
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
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

<style lang="scss" scoped>
</style>
