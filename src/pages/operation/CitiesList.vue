<template>
  <a-card>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="amountCodeList"
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
        <a @click="handleUpdate(item)"> <a-icon type="edit"></a-icon>修改</a>
      </div>
      <!-- 状态 -->
      <!-- 状态 -->
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 0" color="red">禁用</a-tag>
        <a-tag v-else-if="status === 1" color="green">启用</a-tag>
      </span>

      <template #title>
        <!-- 新增 -->
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus"></a-icon>
          添加
        </a-button>
      </template>
    </a-table>
    <!-- 表单 -->
    <cities-list-form
      ref="citiesRef"
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
import CitiesListForm from "./components/CitiesListForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "城市英文名称",
    dataIndex: "cityen_name",
    align: "center",
  },
  {
    title: "城市中文名称",
    dataIndex: "citycn_name",
    align: "center",
  },
  {
    title: "国家中文名称",
    dataIndex: "countrycn_name",
    align: "center",
  },
  {
    title: "国家英文名称",
    dataIndex: "countryen_name",
    align: "center",
  },
  {
    title: "城市状态",
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
  components: { CitiesListForm },
  name: "CitiesList",
  data() {
    return {
      advanced: false, // 展开收起
      columns: columns,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      amountCodeList: [],
      visible: false,
      confirmLoading: false,
      modules: null,
      isStatus: 1,
    };
  },
  created() {
    this._getUserList();
  },
  methods: {
    /* 获取数据 */
    _getUserList() {
      this.loading = true;
      operationService
        .getCitiesList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.amountCodeList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    /* 新增 */
    handleCreate() {
      this.$refs.citiesRef.form.resetFields();
      this.visible = true;
      this.isStatus = 1;
    },
    // 修改
    handleUpdate(item) {
      console.log(item);
      this.isStatus = 2;
      this.modules = {
        en_name: item.countryen_name,
        cn_name: item.countrycn_name,
        country_id: parseInt(item.country_id),
        language: parseInt(item.language),
        id: item.id,
      };
      this.visible = true;
    },
    // 确定
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.citiesRef.form;
      form.validateFields((error, values) => {
        console.log(values);
        if (!error) {
          // 为新增
          if (this.isStatus === 1) {
            operationService
              .addCityAddition({
                en_name: values.en_name,
                cn_name: values.cn_name,
                country_id: values.country_id,
                language: values.language,
                type: 1,
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
                  this._getUserList();
                }
              });
          } else {
            // 为编辑
            operationService
              .setCityModification({
                en_name: values.en_name,
                cn_name: values.cn_name,
                country_id: values.country_id,
                language: values.language,
                type: 1,
                id: values.id,
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
                  this._getUserList();
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
      this.$refs.citiesRef.form.resetFields();
    },
    /* 展开收起切换 */
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    /* 分页 */
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getUserList();
    },
    /* 分页 */
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getUserList();
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
