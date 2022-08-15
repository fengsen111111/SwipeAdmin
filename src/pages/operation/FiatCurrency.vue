<!--
 * @Author: your name
 * @Date: 2022-03-22 13:58:05
 * @LastEditTime: 2022-03-22 14:56:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\FiatCurrency.vue
-->
<template>
  <a-card>
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="7" :sm="24">
          <a-form-item
            label="法币简称"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['short_name']"
              allowClear
              placeholder="请输入法币简称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item
            label="中文名称"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['zh_name']"
              allowClear
              placeholder="请输入中文名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-form-item>
            <span style="float: right">
              <a-button type="primary" @click="handleCreate"
                ><a-icon type="plus"></a-icon> 新增</a-button
              >
              <a-button
                type="primary"
                @click="handleSearch"
                style="margin-left: 8px"
                >查询</a-button
              >
              <a-button style="margin-left: 8px" @click="handleReset"
                >重置</a-button
              >
            </span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="FiatCurrencyList"
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
      <template slot="action" slot-scope="item">
        <!-- <a @click="handleCompile(item)"><a-icon type="edit" /> 编辑</a> -->
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <!-- <a-popconfirm
            :title="`你确定要删除吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item)"
          >
            <a> <a-icon type="delete" />删除 </a>
          </a-popconfirm> -->
        </a-space>
      </template>
    </a-table>
    <FiatCurrencyForm
      ref="FiatCurrencyFormRef"
      :titleStatus="titleStatus"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import FiatCurrencyForm from "./components/FiatCurrencyForm.vue";
import { operationService } from "@/services";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "法币简称",
    align: "center",
    dataIndex: "short_name",
  },
  {
    title: "中文名称",
    align: "center",
    dataIndex: "zh_name",
  },
  {
    title: "法币兑换美元汇率",
    align: "center",
    dataIndex: "exchange_rate",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "FiatCurrency",
  components: {
    FiatCurrencyForm,
  },
  data() {
    return {
      columns: columns,
      loading: false,
      FiatCurrencyList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      //
      modules: null, //给对话框传内容
      confirmLoading: false, // 对话框loading
      visible: false, // 对话框显示隐藏
      titleStatus: 1, //状态判断新增还是修改
    };
  },
  created() {
    this.getFiatCurrencyList();
  },
  methods: {
    // 编辑事件
    handleUpdate(item) {
      this.titleStatus = 2;
      this.modules = {
        id: item.id,
        short_name: item.short_name,
        zh_name: item.zh_name,
        exchange_rate: item.exchange_rate,
      };
      this.visible = true;
    },
    // 对话框组件确认按钮
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.FiatCurrencyFormRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.titleStatus == 1) {
            delete values.id;
            operationService
              .addFiatCurrency({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("添加成功");
                this.visible = false;
                form.resetFields();
                this.getFiatCurrencyList();
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            operationService
              .editFiatCurrency({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("修改成功");
                this.visible = false;
                form.resetFields();
                this.getFiatCurrencyList();
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
    // 对话框组件取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.FiatCurrencyFormRef.form.resetFields();
    },
    //
    // 查询按钮事件
    handleSearch() {
      this.pageIndex = 1;
      this.getFiatCurrencyList();
    },
    // 重置按钮事件
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this.getFiatCurrencyList();
    },
    // 新增按钮事件
    handleCreate() {
      // console.log("==================>xinz");
      this.visible = true;
      this.titleStatus = 1;
    },
    // 获取法币列表
    getFiatCurrencyList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        operationService
          .fiatCurrency({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.FiatCurrencyList = data.list;
            this.total = data.total;
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getFiatCurrencyList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getFiatCurrencyList();
    },
  },
};
</script>

<style>
</style>