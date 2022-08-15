<!--
 * @Author: your name
 * @Date: 2022-03-10 10:18:49
 * @LastEditTime: 2022-03-10 12:27:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\Curlst.vue
-->
<template>
  <a-card>
    <template slot="title">
      <a-button type="primary" @click="handleCreate">
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </template>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="List"
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
      <span slot="created_at" slot-scope="created_at">
        {{ created_at | formDate }}
      </span>
      <template slot="action" slot-scope="item">
        <!-- <a @click="handleCompile(item)"><a-icon type="edit" /> 编辑</a> -->
        <a-space size="large">
          <!-- <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a> -->
          <a-popconfirm
            :title="`你确定要删除吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item.id)"
          >
            <a> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <CurlstForm
      ref="curlstFormRef"
      :status="isStatus"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
      :allCurrencyList="allCurrencyList"
    />
  </a-card>
</template>

<script>
import { operationService, gameService } from "@/services";
import CurlstForm from "./components/CurlstForm.vue";
const columns = [
  {
    title: "昵称",
    align: "center",
    dataIndex: "name",
  },
  {
    title: "货币种类",
    align: "center",
    dataIndex: "currency",
  },
  {
    title: "金额",
    align: "center",
    dataIndex: "money",
  },
  {
    title: "修改时间",
    align: "center",
    dataIndex: "created_at",
    scopedSlots: { customRender: "created_at" },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "Curlst",
  components: { CurlstForm },
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      List: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      allCurrencyList: [],
      //
      modules: null, //给对话框传内容
      confirmLoading: false, // 对话框loading
      visible: false, // 对话框显示隐藏
      isStatus: 1, //状态判断新增还是修改
    };
  },
  created() {
    this.getList();
    this.getAllCurrencyList();
  },
  methods: {
    //   对话框组件确认按钮
    handleOk() {
      //   console.log("==================>ok");
      this.confirmLoading = true;
      const form = this.$refs?.curlstFormRef?.form;
      form
        .validateFields((error, values) => {
          if (!error) {
            delete values.id;
            operationService.addTransaction({ ...values }).then((res) => {
              const { code, msg } = res.data;
              this.confirmLoading = false;
              if (code == 200) {
                this.$message.success("添加成功");
                this.visible = false;
                form.resetFields();
                this.getList();
              } else {
                this.$message.error(msg);
              }
            });
          } else {
            this.confirmLoading = false;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.confirmLoading = false;
        });
    },
    //   新增按钮事件
    handleCreate() {
      this.visible = true;
    },
    // 对话框组件取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.curlstFormRef.form.resetFields();
    },
    // 删除事件
    handleDelete(id) {
      //   console.log("==================>item", id);
      operationService.deleteTransaction({ id }).then((res) => {
        const { code, msg } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.$message.success("删除成功");
        this.getList();
      });
    },
    // 获取列表
    getList() {
      this.loading = true;
      operationService
        .transaction({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.List = data.list;
          this.total = data.total;
        });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getList();
    },
    // 获取所有币种
    getAllCurrencyList() {
      gameService.allCurrency().then((res) => {
        // this.loading = false;
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        // 获取订阅的货币
        const subData = data.filter((item) => item.is_subscribe == 1);
        this.allCurrencyList = subData;
      });
    },
  },
};
</script>

<style>
</style>