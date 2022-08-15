<template>
  <a-card>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="streetLists"
      bordered
      :rowKey="(record) => record.id"
      :scroll="{ x: 'max-content' }"
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
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a @click="handleUpdate(item)"> <a-icon type="edit"></a-icon>编辑</a>
      </div>
      <!-- 状态 -->
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 0" color="red">禁用</a-tag>
        <a-tag v-else-if="status === 1" color="green">启用</a-tag>
      </span>
      <template #title>
        <!-- 新增 -->
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </template>
    </a-table>
    <!-- 表单 -->
    <street-list-form
      ref="streetRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      :isStatus="isStatus"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import StreetListForm from "./components/StreetListForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "国家中文名",
    dataIndex: "countrycn_name",
    align: "center",
  },
  {
    title: "国家英文名",
    dataIndex: "countryen_name",
    align: "center",
  },
  {
    title: "城市中文名",
    dataIndex: "citycn_name",
    align: "center",
  },
  {
    title: "城市英文名",
    dataIndex: "cityen_name",
    align: "center",
  },
  {
    title: "街道英文名",
    dataIndex: "streeten_name",
    align: "center",
  },
  {
    title: "街道中文名",
    dataIndex: "streetcn_name",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
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
  components: { StreetListForm },
  name: "StreetList",
  data() {
    return {
      advanced: false, // 展开收起
      columns: columns,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      streetLists: [],
      visible: false,
      confirmLoading: false,
      modules: null,
      isStatus: 1,
    };
  },
  activated() {
    this._getStreet();
  },
  methods: {
    /* 获取数据 */
    _getStreet() {
      this.loading = true;
      operationService
        .getStreetList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          const { code, data, msg } = res.data;
          this.loading = false;
          if (code !== 200) return this.message.error(msg);
          this.streetLists = data.list;
          this.total = data.total;
        });
    },
    // 编辑
    handleUpdate(item) {
      console.log(item);
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        pid: [item.country_id, item.pid],
        en_name: item.streeten_name,
        cn_name: item.streetcn_name,
      };
      this.visible = true;
    },
    /* 新增 */
    handleCreate() {
      this.$refs.streetRef.form.resetFields();
      this.visible = true;
      this.isStatus = 1;
    },
    // 确定
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.streetRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          // 为新增
          if (this.isStatus === 1) {
            operationService
              .addStreet({
                country_id: values.pid[0],
                type: 2,
                pid: values.pid[1],
                cn_name: values.cn_name,
                en_name: values.en_name,
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
                  this._getStreet();
                }
              });
          } else {
            // 为编辑
            operationService
              .editStreetEditor({
                id: values.id,
                country_id: values.pid[0],
                type: 2,
                pid: values.pid[1],
                cn_name: values.cn_name,
                en_name: values.en_name,
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
                  this._getStreet();
                }
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.$refs.streetRef.form.resetFields();
    },
    /* 展开收起切换 */
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    /* 分页 */
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getStreet();
    },
    /* 分页 */
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getStreet();
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
