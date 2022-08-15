<!--
 * @Author: your name
 * @Date: 2022-03-23 13:53:56
 * @LastEditTime: 2022-05-27 17:06:53
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\user\GetAddressList.vue
-->
<template>
  <a-card>
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="4" :sm="24">
          <a-form-item
            label="用户名"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['username']"
              allowClear
              placeholder="请输入用户名"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item
            label="钱包类型"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16, offset: 1 }"
          >
            <a-select v-decorator="['type']" placeholder="请选择钱包类型">
              <a-select-option value="TRC">TRC</a-select-option>
              <a-select-option value="ERC20">ERC20</a-select-option>
              <a-select-option value="ETH">ETH</a-select-option>
              <a-select-option value="BTC">BTC</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item
            label="钱包地址类型"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16, offset: 0 }"
          >
            <a-select
              v-decorator="['address_type']"
              placeholder="请选择钱包地址类型"
            >
              <a-select-option :key="1" :value="1">提现地址</a-select-option>
              <a-select-option :key="2" :value="2">充值地址</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="5" :sm="24">
          <a-form-item
            label="钱包地址"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-decorator="['address']"
              allowClear
              placeholder="请输入钱包地址"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="3" :sm="24">
          <a-form-item>
            <span style="float: right">
              <a-button type="primary" @click="handleSearch">查询</a-button>
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
      :data-source="GetAddressList"
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
      <template slot="walletAddress" slot-scope="item">
        <div v-if="item.address_type == 1">提现地址：{{ item.address }}</div>
        <div v-else>充值地址：{{ item.address }}</div>
      </template>
      <template slot="action" slot-scope="item" v-if="item.address_type == 1">
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
        </a-space>
      </template>
    </a-table>
    <GetAddressForm
      ref="getAddressFormRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { userService } from "@/services";
import GetAddressForm from "./components/GetAddressForm.vue";
const columns = [
  {
    title: "用户ID",
    align: "center",
    dataIndex: "user_id",
  },
  {
    title: "用户昵称",
    align: "center",
    dataIndex: "user.nickname",
  },
  {
    title: "用户名",
    align: "center",
    dataIndex: "user.username",
  },
  {
    title: "提币类型",
    align: "center",
    dataIndex: "type",
  },
  {
    title: "钱包地址",
    align: "left",
    // dataIndex: "address",
    scopedSlots: { customRender: "walletAddress" },
  },
  // {
  //   title: "提币类型",
  //   align: "center",
  //   dataIndex: "type",
  // },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "GetAddressList",
  components: { GetAddressForm },
  data() {
    return {
      columns,
      loading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      GetAddressList: [],
      form: this.$form.createForm(this),
      //
      modules: null, //给对话框传内容
      confirmLoading: false, // 对话框loading
      visible: false, // 对话框显示隐藏
    };
  },
  activated() {
    this._getAddressList();
  },
  methods: {
    //   对话框组件确认按钮
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs?.getAddressFormRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          userService
            .editWalletAddress({ ...values })
            .then((res) => {
              const { code, msg } = res.data;
              this.confirmLoading = false;
              if (code !== 200) return this.$message.error(msg);
              this.$message.success("修改成功");
              this.visible = false;
              form.resetFields();
              this._getAddressList();
            })
            .catch((err) => {
              this.$message.error(err);
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 对话框组件取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.getAddressFormRef.form.resetFields();
    },
    // 编辑接口
    handleUpdate(item) {
      this.modules = {
        id: item.id,
        type: item.type,
        address: item.address,
      };
      this.visible = true;
      console.log("==================>item", item);
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this._getAddressList();
    },
    // 重置
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._getAddressList();
    },
    // 获取用户提币地址列表
    _getAddressList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        console.log("==================>values", values);
        userService
          .walletAddressList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.GetAddressList = data.list;
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
      this._getAddressList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getAddressList();
    },
  },
};
</script>

<style></style>
