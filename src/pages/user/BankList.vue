<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="5" :sm="24">
            <a-form-item
              label="国家"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 0 }"
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
          <a-col :md="5" :sm="24">
            <a-form-item
              label="预留手机号"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 15, offset: 0 }"
            >
              <a-input
                v-decorator="['phone']"
                allowClear
                placeholder="请输入会员手机号"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item
              label="开户人"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 0 }"
            >
              <a-input
                v-decorator="['account_holder']"
                allowClear
                placeholder="请输入开户人姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item
              label="银行账号"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 0 }"
            >
              <a-input
                v-decorator="['bank_num']"
                allowClear
                placeholder="请输入银行账号"
              />
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
        :bordered="true"
        :columns="columns"
        :data-source="bankList"
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
        <span slot="createTime" slot-scope="record">{{
          record | formDate
        }}</span>
        <span slot="status" slot-scope="record">
          {{ record === 0 ? "启用" : "禁用" }}
        </span>
        <div slot="action" slot-scope="record">
          <a-space size="large">
            <a @click="handleUpdate(record)"> <a-icon type="edit" />编辑 </a>
            <a-popconfirm
              title="你确定要删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a> <a-icon type="delete" />删除 </a>
            </a-popconfirm>
          </a-space>
        </div>
      </a-table>
      <bank-form
        :loading="confirmLoading"
        :visible="isVisible"
        ref="bankForm"
        :modules="modules"
        :pageStatus="pageStatus"
        @cancel="handleCancel"
        :bankTypeList="bankTypeList"
        @ok="handleOk"
        :CountrySelectList="CountrySelectList"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { userService, operationService } from "@/services";
import BankForm from "./components/BankForm.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "国家",
    align: "center",
    dataIndex: "country_id",
  },
  {
    title: "开户人",
    dataIndex: "account_holder",
    align: "center",
  },
  {
    title: "预留手机号",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "银行账号",
    dataIndex: "bank_num",
    align: "center",
  },
  {
    title: "所属银行",
    dataIndex: "bank_type",
    align: "center",
  },
  {
    title: "IFSC 码",
    dataIndex: "ifsc_code",
    align: "center",
  },
  {
    title: "添加时间",
    align: "center",
    dataIndex: "add_time",
    scopedSlots: { customRender: "createTime" },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
    fixed: "right",
  },
];
export default {
  name: "BankList",
  components: { BankForm },
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      bankList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      bankTypeList: [],
      confirmLoading: false,
      isVisible: false,
      modules: null,
      pageType: 1,
      pageStatus: 1,
      bankDatas: {
        bank_type_id: "",
        bank_code: "",
      },
      CountrySelectList: [],
    };
  },
  activated() {
    this._getRecharge();
    // this._bankType();
    this.getCountrySelectList();
  },
  methods: {
    // 获取国家列表
    getCountrySelectList() {
      operationService.countrySelect().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.CountrySelectList = data;
        // console.log("==================>this.", this.CountrySelectList);
      });
    },
    _bankType(id) {
      userService.getBankType({ country_id: id }).then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.bankTypeList = data;
        }
      });
    },
    _getRecharge() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        userService
          .getBankList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
              return;
            } else {
              this.bankList = data.list;
              this.total = data.total;
            }
          });
      });
    },

    handleSearch() {
      this.pageIndex = 1;
      this._getRecharge();
    },
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this._getRecharge();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getRecharge();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getRecharge();
    },
    handleUpdate(item) {
      this._bankType(item.country_id);
      // console.log("==================>item", item);
      this.pageStatus = 2;
      const {
        account_holder,
        bank_num,
        phone,
        id,
        ifsc_code,
        mail,
        bank_id,
        country_id,
      } = item;
      this.$refs.bankForm.bankTypeDatas.name = item.bank_type;
      this.$refs.bankForm.bankTypeDatas.code = item.bank_code;
      this.bankDatas.bank_type = item.bank_type;
      this.bankDatas.bank_code = item.bank_code;
      this.modules = {
        account_holder,
        bank_num,
        phone,
        id,
        mail,
        ifsc_code,
        bank_id,
        country_id,
      };

      this.isVisible = true;
    },
    handleCancel() {
      const form = this.$refs.bankForm.form;
      form.resetFields();
      this.isVisible = false;
    },
    handleOk() {
      const form = this.$refs.bankForm.form;
      const items = this.$refs.bankForm.bankTypeDatas;

      form.validateFields((error, values) => {
        if (!error) {
          this.confirmLoading = true;

          userService
            .bankUpdate({
              ...values,
              bank_type: items.name,
              bank_code: items.code,
            })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("修改成功");
                this.isVisible = false;
                form.resetFields();
                this._getRecharge();
              }
            })
            .catch((err) => {
              this.$message.error(err);
              this.confirmLoading = false;
            });
        }
      });
    },
    handleDelete(item) {
      userService
        .bankDelete({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getRecharge();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // handleCreate() {
    //   this.isVisible = true;
    //   this.pageStatus = 1;
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
