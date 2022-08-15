// ********************************************** // 创建时间: 2021-09-07
15:23:33 // description:'多语言列表' //
**********************************************

<template>
  <a-card>
    <slot name="title">
      <a-button
        type="primary"
        @click="handleCreate"
        style="margin-bottom: 10px"
      >
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </slot>
    <a-table
      :columns="columns"
      :data-source="languageList"
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
      <!--  -->
      <template slot="default" slot-scope="item">
        <a-switch
          :checked="item.system_default == 1 ? true : false"
          @change="Subscribe(item)"
        />
      </template>
      <div
        slot="icon"
        slot-scope="item"
        style="display: flex; justify-content: center"
      >
        <div style="width: 40px; height: 40px">
          <img
            style="width: 100%; height: 100%"
            :src="baseUrl + '/' + item"
            @click="previewImg(baseUrl + '/' + item)"
          />
        </div>
      </div>
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 0" color="red"> 禁用 </a-tag>
        <a-tag v-else-if="status === 1" color="green">启用</a-tag>
        <a-tag v-else color="#87d068">默认</a-tag>
      </span>
      <div slot="actions" slot-scope="item">
        <a @click="handleUpdate(item)">
          <a-icon type="edit"></a-icon>
          编辑
        </a>
      </div>
    </a-table>
    <language-form
      ref="languageRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
      :isStatus="isStatus"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import LanguageForm from "./components/LanguageForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "英文名称",
    dataIndex: "en_name",
    align: "center",
  },
  {
    title: "中文名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "国家图片",
    dataIndex: "icon",
    align: "center",
    scopedSlots: {
      customRender: "icon",
    },
  },
  {
    title: "语言缩写",
    dataIndex: "code",
    align: "center",
  },
  {
    title: "权重",
    dataIndex: "weight",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  // {
  //   title: "是否设置为默认语言",
  //   align: "center",
  //   scopedSlots: { customRender: "default" },
  // },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  components: { LanguageForm },
  name: "Language",

  data() {
    return {
      languageList: [],
      columns: columns,
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      modules: null,
      confirmLoading: false,
      visible: false,
      isStatus: 1,
      baseUrl: "",
    };
  },
  created() {
    this._getLanguages();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    // // 是否设置为默认语言开关事件
    // Subscribe(item) {
    //   this.loading = true;
    //   operationService
    //     .systemLanguage({
    //       id: item.id,
    //       system_default: item.system_default == 1 ? 0 : 1,
    //     })
    //     .then((res) => {
    //       this.loading = false;
    //       const { code, msg } = res.data;
    //       if (code !== 200) return this.$message.error(msg);
    //       this.$message.success(msg);
    //       this._getLanguages();
    //     })
    //     .catch((err) => {
    //       this.loading = false;
    //       this.$message.error(err);
    //     });
    // },
    // 获取列表
    _getLanguages() {
      this.loading = true;
      operationService
        .getLanguages({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.languageList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getLanguages();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getLanguages();
    },
    handleCreate() {
      this.visible = true;
      this.isStatus = 1;
    },
    handleUpdate(item) {
      console.log("===========>item", item);
      this.isStatus = 2;
      delete item.create_time;
      this.modules = {
        ...item,
      };
      this.$refs.languageRef.imageUrl = this.baseUrl + "/" + item.icon;
      this.imageUrl = item.icon;
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.$refs.languageRef.form.resetFields();
      this.$refs.languageRef.imageUrl = "";
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.languageRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (typeof values?.icon !== "string") {
            values.icon = values?.icon.file
              ? values?.icon?.file?.response?.data?.img_path
              : this.imageUrl;
          }
          if (this.isStatus === 1) {
            operationService
              .createLanguage({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  form.resetFields();
                  this.visible = false;
                  this._getLanguages();
                }
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err);
              });
          } else {
            operationService
              .updateLanguage({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  form.resetFields();
                  this.visible = false;
                  this._getLanguages();
                }
              })
              .catch((err) => {
                this.confirmLoading = false;
                this.$message.error(err);
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
