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
      :data-source="popularList"
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
      <!-- 状态 -->
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 0" color="red">关闭</a-tag>
        <a-tag v-else-if="status === 1" color="green">开启</a-tag>
      </span>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit"></a-icon>编辑</a>
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
    </a-table>
    <!-- 弹出表单 -->
    <safety-problem-form
      ref="safetyFormRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import SafetyProblemForm from "./components/SafetyProblemForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "问题",
    dataIndex: "ask",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "语言ID",
    dataIndex: "language.id",
    align: "center",
  },
  {
    title: "语言",
    dataIndex: "language.name",
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
  components: { SafetyProblemForm },
  name: "SafetyProblem",
  data() {
    return {
      columns: columns,
      popularList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      //表单属性
      visible: false,
      confirmLoading: false,
      modules: null,
      isStatus: 1,
      itemLanguage:null
    };
  },
  created() {
    this._getSafetyList();
  },
  methods: {
    // 安全问题列表数据
    _getSafetyList() {
      this.loading = true;
      operationService
        .getSafetyProblemList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.popularList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    // 新增
    handleCreate() {
      // 重置表单
      this.$refs.safetyFormRef.form.resetFields();
      // 开启表单
      this.visible = true;
      // 1为新增
      this.isStatus = 1;
    },
    // 编辑
    handleUpdate(item) {
      this.isStatus = 2;
      this.itemLanguage = item.language
      delete item.language;
      this.modules = {
        ...item,
      };
      item.language = this.itemLanguage
      this.visible = true;
    },
    // 删除
    handleDelete(item) {
      operationService
        .deleteSecurityIssues({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getSafetyList();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.$refs.safetyFormRef.form.resetFields();
    },
    // 确认
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.safetyFormRef.form;
      // 检验表单内容完整
      form.validateFields((error, values) => {
        if (!error) {
          // 判断为新增或者修改处理事件
          if (this.isStatus === 1) {
            operationService
              .createSecurityIssues({
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
                  this._getSafetyList();
                }
              })
              .catch((err) => {
                this.$message.error(err);
              });
          } else {
            // 这里既为修改处理
            operationService
              .setSecurityIssues({
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
                  this._getSafetyList();
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
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getSafetyList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getSafetyList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
