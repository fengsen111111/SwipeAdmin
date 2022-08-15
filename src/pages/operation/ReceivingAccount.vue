<!--
 * @Author: your name
 * @Date: 2022-03-11 16:09:40
 * @LastEditTime: 2022-05-19 16:46:35
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\operation\ReceivingAccount.vue
-->
<template>
  <a-card>
    <a-form layout="horizontal" :form="form" ref="searchRef">
      <div>
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-item
              label="状态"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <!-- <a-input
                v-decorator="['status']"
                allowClear
                placeholder="请输入银行代码"
              /> -->
              <a-select v-decorator="['status']" placeholder="选择状态">
                <!-- <a-select-option :value="0"> 全部 </a-select-option> -->
                <a-select-option :value="1"> 开启 </a-select-option>
                <a-select-option :value="2"> 关闭 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item
              label="账号类型"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                v-decorator="['account_type', { initialValue: 0 }]"
                placeholder="选择账户类型"
              >
                <a-select-option :value="0"> 全部 </a-select-option>
                <a-select-option :value="1"> USDT </a-select-option>
                <a-select-option :value="2"> 银行卡 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" style="margin-left: 8px">
            <a-form-item>
              <a-space size="middle">
                <a-button type="primary" @click="handleCreate">
                  <a-icon type="plus"></a-icon>
                  新增
                </a-button>
                <a-button @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="ReceivingAccountList"
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
      <!-- <template slot="images" slot-scope="logo">
        <img :src="logo" alt="" srcset="" style="width: 40px" />
      </template> -->
      <!-- 账号信息 -->
      <template slot="account" slot-scope="item">
        <div>
          <span>账号类型：</span
          >{{ item.account_type == 1 ? "USDT" : "银行卡" }}
        </div>
        <div><span>户 名：</span>{{ item.account_name }}</div>
        <div><span>账户地址：</span>{{ item.account_number }}</div>
      </template>
      <span slot="status" slot-scope="status">
        <a-tag :color="status == 1 ? 'green' : 'red'">{{
          status == 1 ? "开启" : "关闭"
        }}</a-tag>
      </span>
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
    <ReceivingAccountForm
      ref="receivingAccountFormRef"
      :status="isStatus"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import ReceivingAccountForm from "./components/ReceivingAccountForm.vue";
import { operationService } from "@/services";
const columns = [
  {
    title: "账号信息",
    scopedSlots: { customRender: "account" },
    align: "left",
  },
  {
    title: "单笔最小金额",
    dataIndex: "min_recharge",
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "sort",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  name: "receivingAccount",
  components: { ReceivingAccountForm },
  data() {
    return {
      loading: false,
      columns: columns,
      form: this.$form.createForm(this),
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      ReceivingAccountList: [],
      //
      modules: null, //给对话框传内容
      confirmLoading: false, // 对话框loading
      visible: false, // 对话框显示隐藏
      isStatus: 1, //状态判断新增还是修改
    };
  },
  activated() {
    this.getReceivingAccountList();
  },
  created() {
    // this.form.setFieldsValue({
    //   status: 0,
    // });
    // this.getReceivingAccountList();
  },
  mounted() {
    //   设置初始值
    // this.form.setFieldsValue({
    //   status: 0,
    // });
    // this.getReceivingAccountList();
  },
  methods: {
    //   对话框组件确认按钮
    handleOk() {
      //   console.log("==================>ok");
      this.confirmLoading = true;
      const form = this.$refs.receivingAccountFormRef?.form;
      form.validateFields((error, values) => {
        console.log("==================>values", values);
        if (!error) {
          if (this.isStatus == 1) {
            delete values.id;
            operationService
              .addReceiveAccount({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("添加成功");
                this.visible = false;
                form.resetFields();
                this.getReceivingAccountList();
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
            // if (values.type == 1) {
            // }
          } else {
            operationService
              .editReceiveAccount({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("修改成功");
                this.visible = false;
                form.resetFields();
                this.getReceivingAccountList();
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

    // 删除事件
    handleDelete(item) {
      operationService
        .deleteReceiveAccount({ id: item.id })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success("删除成功");
          this.getReceivingAccountList();
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    // 编辑按钮事件
    handleUpdate(item) {
      this.isStatus = 2;
      console.log("==================>item", item);
      this.modules = {
        id: item.id,
        sort: item.sort,
        status: item.status,
        account_type: item.account_type,
        name: item.name,
        account_name: item.account_name,
        account_number: item.account_number,
        min_recharge: item.min_recharge,
        remark: item.remark,
        bank_account_name: item.bank_account_name,
        bank_account_address: item.bank_account_address,
      };
      this.visible = true;
    },

    // 对话框组件取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.receivingAccountFormRef.genre = 1;
      this.$refs.receivingAccountFormRef.form.resetFields();
    },
    //   新增按钮事件
    handleCreate() {
      console.log("==================>新增");
      this.visible = true;
      this.isStatus = 1;
    },
    // 查询按钮事件
    handleSearch() {
      this.pageIndex = 1;
      //   console.log("==================>查询");
      this.getReceivingAccountList();
    },
    // 重置按钮事件
    handleReset() {
      //   console.log("==================>重置");
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this.getReceivingAccountList();
    },
    // 获取列表数据
    getReceivingAccountList() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        console.log("==================>values", values);
        operationService
          .receiveAccountList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.ReceivingAccountList = data.list;
            this.total = data.total;
          });
        // console.log("==================>values", values);
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getReceivingAccountList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getReceivingAccountList();
    },
  },
};
</script>

<style></style>
