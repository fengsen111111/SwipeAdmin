// ********************************************** // 创建时间: 2021-12-03
12:09:29 // description:'广告图片列表' //
**********************************************

<template>
  <a-card>
    <template name="title">
      <a-button type="primary" @click="handleAdd">
        <a-icon type="plus"></a-icon>
        新增</a-button
      >
    </template>
    <div style="height: 10px"></div>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="commodityList"
      :rowKey="(record) => record.id"
      :scroll="{ x: 'max-content' }"
      bordered
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
      <template slot="images" slot-scope="images">
        <img
          :src="baseUrl + '/' + images"
          alt=""
          srcset=""
          style="width: 40px"
          @click="blackImage(baseUrl + '/' + images)"
        />
      </template>
      <template slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" /> 修改</a>
          <a-popconfirm title="你确定要删除吗？" @confirm="handleDelete(item)">
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
        </a-space>
      </template>

      <span slot="status" slot-scope="status">
        <a-tag :color="status === 0 ? 'red' : 'green'">{{
          status === 1 ? "启用" : "禁用"
        }}</a-tag>
      </span>
      <span slot="url_type" slot-scope="item">
        <a-tag v-if="item === 1" color="green">外链></a-tag>
        <a-tag v-else-if="item === 2" color="#519259">内链</a-tag>
        <a-tag v-else color="#3b82f6">无</a-tag>
      </span>
    </a-table>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previImages" />
    </a-modal>
    <ads-pictures-form
      :isVisible="isVisible"
      :loading="confirmLoading"
      :status="isStatus"
      ref="commodityRef"
      :modules="modules"
      @cancel="handleCancelForm"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import AdsPicturesForm from "./components/AdsPicturesForm.vue";

const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "权重",
    dataIndex: "sort",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "category.category_zh",
    align: "center",
  },
  {
    title: "链接类型",
    dataIndex: "url_type",
    align: "center",
    scopedSlots: { customRender: "url_type" },
  },
  {
    title: "内链名称",
    dataIndex: "link.title",
    align: "center",
  },

  {
    title: "外链地址",
    dataIndex: "url",
    align: "center",
  },
  {
    title: "图片",
    dataIndex: "image",
    scopedSlots: { customRender: "images" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  name: "Swiper",
  components: { AdsPicturesForm },
  data() {
    return {
      loading: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      columns: columns,
      commodityList: [],
      previewVisible: false,
      previImages: "",
      baseUrl: "",
      isVisible: false,
      isStatus: 1,
      modules: null,
      confirmLoading: false,
      imageTextComm: "",
    };
  },
  activated() {
    this._getRecharge();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    _getRecharge() {
      this.loading = true;
      operationService
        .getBannerList({ page: this.pageIndex, limit: this.pageSize })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.commodityList = data.list;
            this.total = data.total;
          }
        });
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
    handleCancel() {
      this.previewVisible = false;
    },
    blackImage(item) {
      this.previImages = item;
      this.previewVisible = true;
    },
    handleCancelForm() {
      this.isVisible = false;
      this.$refs.commodityRef.form.resetFields();
      this.$refs.commodityRef.imageUrl = "";
    },
    handleOk() {
      const form = this.$refs.commodityRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        values.image = values?.image?.file
          ? values?.image?.file?.response?.data?.img_path
          : this.imageTextComm;
        if (this.isStatus === 1) {
          operationService
            .createBanner({ ...values })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("添加成功");
                this.isVisible = false;
                form.resetFields();
                this._getRecharge();
                this.$refs.commodityRef.imageUrl = "";
              }
            })
            .catch((err) => {
              this.confirmLoading = false;
              this.$message.error(err);
            });
        } else {
          operationService
            .updateBanner({ ...values })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("修改成功");
                this.isVisible = false;
                form.resetFields();
                this._getRecharge();
                this.$refs.commodityRef.imageUrl = "";
              }
            })
            .catch((err) => {
              this.confirmLoading = false;
              this.$message.error(err);
            });
        }
      });
    },
    handleAdd() {
      this.isVisible = true;
      this.isStatus = 1;
    },
    handleUpdate(item) {
      this.modules = {
        id: item?.id,
        title: item?.title,
        image: item?.image,
        sort: item?.sort,
        status: item?.status,
        url_type: item?.url_type,
        url: item?.url,
        link_id: item?.link_id,
        to_id: item?.to_id,
        cid: item?.cid,
      };
      this.$refs.commodityRef.urlType = item?.url_type.toString();
      this.$refs.commodityRef.imageUrl = this.baseUrl + "/" + item?.image;
      this.imageTextComm = item?.image;

      this.isStatus = 2;
      this.isVisible = true;
    },
    handleDelete(item) {
      operationService
        .deleteBanner({ id: item.id })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getRecharge();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
