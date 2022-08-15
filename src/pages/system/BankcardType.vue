<!--
 * @Author: your name
 * @Date: 2022-03-17 10:54:03
 * @LastEditTime: 2022-03-22 18:07:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\system\BankcardType.vue
-->
<template>
  <a-card>
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="7" :sm="24">
          <a-form-item
            label="国家"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 1 }"
          >
            <a-select v-decorator="['country_id']" placeholder="请选择国家">
              <a-select-option
                :key="item.id"
                :value="item.id"
                v-for="item in CountrySelectList"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-form-item>
            <span style="float: right">
              <a-button
                type="primary"
                @click="handleCreate"
                style="margin-right: 8px"
              >
                <a-icon type="plus"></a-icon> 新增</a-button
              >
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
      :data-source="bankcardList"
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
      <template slot="status" slot-scope="item">
        <!-- <a-tag :color="status == 0 ? 'red' : 'green'">
          {{ status == 0 ? "关闭" : "开启" }}
        </a-tag> -->
        <a-switch
          :checked="item.status === 1 ? true : false"
          @change="banRecord(item)"
        />
      </template>
      <template slot="country" slot-scope="item">
        <!-- {{ item }} -->
        <div>英文名称：{{ item.country.en_name }}</div>
        <div>中文名称：{{ item.country.cn_name }}</div>
        <div>区号：{{ item.country.area_code }}</div>
      </template>
      <template slot="action" slot-scope="item">
        <a @click="handleCompile(item)"><a-icon type="edit" /> 编辑</a>
        <!-- <a-space size="large">
          <a-popconfirm
            :title="`你确定要${item.status === 1 ? '封禁' : '解封'}此支付吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="banRecord(item)"
          >
            <a>
              {{ item.status === 1 ? "封禁" : "解封" }}
            </a>
          </a-popconfirm>
        </a-space> -->
      </template>
    </a-table>
    <BankTypeForm
      ref="BankTypeFormRef"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      :titleStatus="titleStatus"
      @cancel="handleCancel"
      @ok="handleOk"
      :CountrySelectList="CountrySelectList"
    />
  </a-card>
</template>

<script>
import BankTypeForm from "./components/BankTypeForm.vue";
import { systemService, operationService } from "@/services";
const columns = [
  { title: "#", align: "center", dataIndex: "id" },
  { title: "银行代号", align: "center", dataIndex: "code" },
  { title: "银行名称", align: "center", dataIndex: "name" },
  { title: "国家", align: "center", scopedSlots: { customRender: "country" } },
  {
    title: "状态",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  { title: "操作", align: "center", scopedSlots: { customRender: "action" } },
];
export default {
  name: "BankcardType",
  components: { BankTypeForm },
  data() {
    return {
      bankcardList: [],
      loading: false,
      columns,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      form: this.$form.createForm(this),
      //
      titleStatus: 1,
      modules: null,
      visible: false,
      confirmLoading: false,
      CountrySelectList: [],
    };
  },
  activated() {
    this.getBankTypeList();
    this.getCountrySelectList();
  },
  methods: {
    // 对话框确认按钮
    handleOk() {
      this.confirmLoading = false;
      const form = this.$refs?.BankTypeFormRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.titleStatus == 1) {
            // console.log("===========", values);
            delete values.id;
            systemService
              .addBankType({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("添加成功");
                this.visible = false;
                form.resetFields();
                this.getBankTypeList();
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            systemService
              .editBanktype({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("修改成功");
                this.visible = false;
                form.resetFields();
                this.getBankTypeList();
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
    // 对话框取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.BankTypeFormRef.form.resetFields();
    },
    // 查询事件
    handleSearch() {
      this.pageIndex = 1;
      this.getBankTypeList();
    },
    // 重置事件
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this.getBankTypeList();
    },
    // handleCreate 新增事件
    handleCreate() {
      this.visible = true;
      this.titleStatus = 1;
    },
    // 编辑事件
    handleCompile(item) {
      // console.log("==================>item", item);
      this.titleStatus = 2;
      this.modules = {
        id: item.id,
        code: item.code,
        name: item.name,
        country_id: item.country_id,
      };
      this.visible = true;
    },
    // 获取列表
    getBankTypeList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        systemService
          .bankTypeList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.bankcardList = data.list;
            this.total = data.total;
          });
      });
    },
    // 开关事件
    banRecord(item) {
      systemService
        .bankTypeSwitch({
          status: item.status === 0 ? 1 : 0,
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success(`${item.status === 1 ? "关闭" : "开启"}成功`);
          this.getBankTypeList();
        });
    },
    // 获取国家列表
    getCountrySelectList() {
      operationService.countrySelect().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.CountrySelectList = data;
        // console.log("==================>this.", this.CountrySelectList);
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getBankTypeList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getBankTypeList();
    },
  },
};
</script>

<style>
</style>