<!--
 * @Author: your name
 * @Date: 2022-02-28 12:15:19
 * @LastEditTime: 2022-06-09 10:51:07
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\mining\VirtualCurrencyList.vue
-->
<template>
  <a-card>
    <!-- <template slot="title">
      <a-button type="primary" @click="handleCreate">
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </template> -->
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="项目名称"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 15, offset: 0 }"
          >
            <a-input
              v-decorator="['name']"
              allowClear
              placeholder="请输入项目名称"
            />
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-form-item>
            <span style="float: right">
              <a-button type="primary" @click="handleCreate">
                <a-icon type="plus"></a-icon>
                新增
              </a-button>
              <a-button
                style="margin-left: 8px"
                type="primary"
                @click="handleSearch"
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
      :data-source="virtualCurrencyList"
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
      <!-- LOGO -->
      <template slot="images" slot-scope="logo">
        <img :src="logo" alt="" srcset="" style="width: 40px" />
      </template>
      <template slot="action" slot-scope="item">
        <!-- <a @click="handleCompile(item)"><a-icon type="edit" /> 编辑</a> -->
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm
            :title="`你确定要删除吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item)"
          >
            <a> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <VirtualCurrencyForm
      ref="virtualCurrencyFormRef"
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
import { gameService, miningService } from "@/services";
import VirtualCurrencyForm from "./components/VirtualCurrencyForm";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  // {
  //   title: "币种名称",
  //   align: "center",
  //   dataIndex: "currency.symbol",
  // },
  // {
  //   title: "LOGO",
  //   align: "center",
  //   dataIndex: "currency.logo",
  //   scopedSlots: { customRender: "images" },
  // },
  {
    title: "项目名称",
    align: "center",
    dataIndex: "name",
  },
  {
    title: "日收益率",
    align: "center",
    dataIndex: "yield",
  },
  {
    title: "申请天数",
    align: "center",
    dataIndex: "apply_days",
  },
  {
    title: "项目进度(%)",
    align: "center",
    dataIndex: "progress",
  },
  {
    title: "权重",
    align: "center",
    dataIndex: "weight",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "VirtualCurrencyList",
  components: { VirtualCurrencyForm },
  data() {
    return {
      form: this.$form.createForm(this),
      spinning: false,
      columns: columns,
      loading: false,
      virtualCurrencyList: [],
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
  activated() {
    this.getVirtualCurrencyList();
    // this.getAllCurrencyList();
  },
  methods: {
    handleSearch() {
      this.pageIndex = 1;
      this.getVirtualCurrencyList();
    },
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this.getVirtualCurrencyList();
    },
    //   对话框组件确认按钮
    handleOk() {
      // console.log("==================>ok");
      this.confirmLoading = true;
      const form = this.$refs?.virtualCurrencyFormRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            delete values.id;
            miningService
              .addVirtualCurrency({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code === 200) {
                  this.$message.success("添加成功");
                  this.visible = false;
                  form.resetFields();
                  this.getVirtualCurrencyList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            miningService
              .editVirtualCurrency({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code === 200) {
                  this.$message.success("修改成功");
                  this.visible = false;
                  form.resetFields();
                  this.getVirtualCurrencyList();
                } else {
                  this.$message.error(msg);
                }
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
      this.$refs.virtualCurrencyFormRef.form.resetFields();
    },
    // 新增虚拟货币
    handleCreate() {
      console.log("==================>新增");
      this.visible = true;
      this.isStatus = 1;
    },
    // 编辑虚拟币
    handleUpdate(item) {
      this.isStatus = 2;
      console.log("==================>item", item);
      this.modules = {
        id: item.id,
        yield: item.yield,
        name: item.name,
        apply_days: item.apply_days,
        weight: item.weight,
        // progress: item.progress,
        // currency_id: item.currency_id,
      };
      this.visible = true;
    },
    // 删除虚拟币
    handleDelete(item) {
      // this.loading = true;
      miningService
        .deleteVirtualCurrency({ id: item.id })
        .then((res) => {
          // this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this.getVirtualCurrencyList();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 获取虚拟货币列表
    getVirtualCurrencyList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        miningService
          .VirtualCurrencyList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            // console.log("==================>res.data", res.data);
            if (code !== 200) return this.$message.error(msg);
            this.virtualCurrencyList = data.list;
            this.total = data.total;
          });
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getVirtualCurrencyList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getVirtualCurrencyList();
    },
    // 获取所有币种
    getAllCurrencyList() {
      gameService.allCurrency().then((res) => {
        // this.loading = false;
        const { code, msg, data } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.allCurrencyList = data;
          // console.log("==================>data", data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
