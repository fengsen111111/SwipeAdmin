<template>
  <a-card>
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="5" :sm="24">
          <a-form-item label="用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
            <a-input v-decorator="['username',]" allowClear placeholder="请输入用户名"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="用户注册类型" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15, offset: 0 }">
            <a-select placeholder="请选择" v-decorator="['reg_type', { initialValue: 0 }]">
              <a-select-option :value="item.id" :key="item.id" v-for="item in registerTypeList">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>

    <a-table :loading="loading" :columns="columns" :data-source="UserWallList" bordered :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record.id" :pagination="{
        current: pageIndex,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }">
      <div slot="reg_type" slot-scope="item">
        <a-tag :color="item | formDateUserColor">
          {{ item | formDateType }}
        </a-tag>
      </div>
      <template slot="currencyDataDetails" slot-scope="item">
        <ul v-for="currency in item.currency_wallet" style="display:flex;" :key="currency.id">
          <li style="margin-right: 10px;">
            <span style="font-weight: bold;color: chocolate;">币种名称</span>:
            <span style="color: green;">{{
                currency.symbol
            }}</span>
          </li>
          <li style="margin-right: 10px;">
            <span style="font-weight: bold; color: chocolate;">币数量</span>:
            <span style="color: green;">{{ currency.wallet }}</span>
          </li>
          <li style="margin-right: 10px;">
            <span style="font-weight: bold;color: chocolate;">锁定币数量</span>:
            <span style="color: green;">{{
                currency.locked
            }}</span>
          </li>
        </ul>
      </template>

      <template slot="actions" slot-scope="item">
        <a-space size="middle">
          <template v-if="!item.is_platform_currency">
            <a @click="handleCreate(item.id)">
              <a-icon type="plus"></a-icon>
              新增
            </a>
          </template>
          <template v-else>

            <a @click="_getEditWallet(item)">编辑</a>
          </template>
          <a @click="_getOperationRecord(item.id)">操作记录</a>
          <a @click="_getFlashCashRecord(item)">闪兑记录</a>
        </a-space>
      </template>
    </a-table>

    <edit-wallet-form @cancel="handleCancel" @ok="handleOk" :visible="isVisible" :loading="formLoading"
      :modules="modules" ref="walletRef" @handleOkClose="handleOkClose">
    </edit-wallet-form>
    <!-- 操作记录 -->
    <WalletRecord :visible="recordVisible" ref="walletRecordRef" :backgroundRecord="backgroundRecord"
      :loading="recordLoading" :pageData="pageData" :total="walletTotal" @page-change="handlePageChange"
      @pageSize-change="handlePageSizeChange" @ok="handleWalletOk" @cancel="handleWalletCancel"
      :currenList="currenList2" @search="detailsSearch" />

    <!-- 新增平台币 -->
    <NewPlatformCurrency :visible="newPlatformCurrencyVisible" ref="newPlatformCurrencyRef"
      :loading="newPlatformCurrencyLoading" @ok="handleNewPlatformCurrencyOk" @cancel="handleNewPlatformCurrencyCancel"
      :currenList="currenList" />

  </a-card>
</template>

<script>
import {
  userCurrencyWallet,
  editCurrencyQuantity,
  backgroundCurrencyOperation,
  addPlatformCoin
  //   userWalletFlashCashRecord,
} from "@/services/user";
import EditWalletForm from "./components/EditWalletForm.vue";
import WalletRecord from "./components/WalletRecord.vue";
import NewPlatformCurrency from "./components/NewPlatformCurrency.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
import { allPlatformCurrency } from '@/services/game'
import { registerTypeList } from "@/utils/util";
const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "注册类型",
    align: "center",
    dataIndex: "reg_type",
    scopedSlots: {
      customRender: "reg_type",
    },
  },
  {
    title: "用户昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "币种数据详情",
    align: "center",
    scopedSlots: { customRender: "currencyDataDetails" },
  },
  //     {
  //     title: "币种类型",
  //     align: "center",
  //     scopedSlots: { customRender: "currencyDataDetails" },

  //    },

  {
    title: "操作",
    align: "center",

    scopedSlots: {
      customRender: "actions",
    },
  },
];

export default {
  name: "UserWalletList",
  components: { EditWalletForm, WalletRecord, NewPlatformCurrency },
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    this.registerTypeList = registerTypeList;
    return {
      columns,
      loading: false,
      UserWallList: [],
      agentAllList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      backgroundRecord: [],
      userWalletRecord: [],
      formLoading: false,
      modules: null,
      isVisible: false,
      form: this.$form.createForm(this),
      userId: 0,
      userName: "",
      recordVisible: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
      },
      walletTotal: 0,
      walletId: 0,
      newPlatformCurrencyVisible: false,
      newPlatformCurrencyLoading: false,
      currenList: [],
      recordLoading: false,
      currenList2: []
    };
  },

  activated() {
    this._getUserList();
    this._allPlatformCurrency()
  },

  methods: {
    _allPlatformCurrency() {
      allPlatformCurrency().then(res => {
        console.log("==================>res", res);
        this.currenList = res.data.data
        this.currenList2 = [...this.currenList, {
          id: 100,
          symbol: "BTC",
        }, {
          id: 101,
          symbol: 'ETH'
        }]
      })
    },
    _getUserList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        console.log("==================>values", values);
        const params = {
          limit: this.pageSize,
          page: this.pageIndex,
          ...values
        };
        userCurrencyWallet(params).then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.UserWallList = data.list;
            this.total = data.total;
          }
        });
      })
    },
    _getEditWallet(item) {
      console.log(item);
      this.userId = item.id;
      if (item.currency_wallet.length > 0) {
        const bitList = item.currency_wallet.map((item) => {
          return {
            wallet_id: item.id,
            symbol: item.symbol,
            locked: item.locked,
            wallet: item.wallet,
            type: '',
            edit_type: '',
            value: '',
            id: item.id
          };
        });
        this.$refs.walletRef.dynamicValidateForm.currency_walletList = bitList;

        this.isVisible = true;
      } else {
        this.$message.info("你暂无币种");
      }
    },
    _getOperationRecord(id, currentId) {
      this.walletId = id;
      const params = {
        user_id: id,
        limit: this.pageData.pageSize,
        page: this.pageData.pageIndex,
      }
      this.recordLoading = true;
      currentId && (params.symbol = currentId)
      backgroundCurrencyOperation(params).then((res) => {
        console.log(res);
        const { code, msg, data } = res.data;
        this.recordLoading = false;
        if (code !== 200) {
          this.$message.error(msg);
          return;
        } else {
          this.backgroundRecord = data.list;
          this.walletTotal = data.total;
          this.recordVisible = true;
        }
      });
    },
    _getFlashCashRecord(item) {
      console.log(item);
      this.$router.push(`/flash/exchange-record?id=${item.id}`);
      //   const params = {}; userWalletFlashCashRecord({
      //   }).then((res) => {
      //     console.log(res);
      //     const { code, msg, data } = res.data;
      //     if (code !== 200) {
      //       this.$message.error(msg);
      //       return;
      //     } else {
      //       this.userWalletRecord = data.list;
      //       this.walletTotal = data.total;
      //     }
      //   });
    },

    handleCancel() {
      this.isVisible = false;
    },
    handleOk(item) {
      editCurrencyQuantity({

        ...item
      }).then((res) => {
        const { code, msg } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.$message.success("操作成功");
        this.isVisible = false;
        this._getUserList();
      });
    },

    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getUserList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getUserList();
    },
    handleSearch() {
      this._getUserList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.userName = "";
      this._getUserList();
    },
    handlePageChange(page) {
      console.log("==================>page", page);
      this.pageData.pageIndex = page.pageIndex;
      this.pageData.pageSize = page.pageSize;
      this._getOperationRecord(this.walletId);
    },
    handlePageSizeChange(pageSize) {
      console.log("==================>pageSize", pageSize);
      this.pageData.pageIndex = pageSize.pageIndex;
      this.pageData.pageSize = pageSize.pageSize;
      this._getOperationRecord(this.walletId);
    },
    handleWalletCancel() {
      this.recordVisible = false;
    },
    handleWalletOk() {
      this.recordVisible = false;
    },
    handleCreate(item) {
      this.newPlatformCurrencyVisible = true;
      this.userId = item
    },
    handleOkClose() {
      this.isVisible = false;
    },
    handleNewPlatformCurrencyOk() {
      this.newPlatformCurrencyLoading = true;
      const form = this.$refs.newPlatformCurrencyRef.form
      form.validateFields((error, value) => {
        if (!error) {
          console.log("==================>value", value);
          addPlatformCoin({
            user_id: this.userId,
            ...value
          }).then((res) => {
            this.newPlatformCurrencyLoading = false;
            const { code, msg } = res.data
            if (code !== 200) return this.$message.error(msg)
            this.$message.success("操作成功")
            this.newPlatformCurrencyVisible = false;
            this._getUserList()
            form.resetFields()
          }).finally(() => {
            this.newPlatformCurrencyLoading = false;
          })
        } else {
          this.newPlatformCurrencyLoading = false;
        }
      })

    },
    handleNewPlatformCurrencyCancel() {
      this.newPlatformCurrencyVisible = false;
      const form = this.$refs.newPlatformCurrencyRef.form
      form.resetFields()
    },
    detailsSearch(id) {
      this._getOperationRecord(this.walletId, id)
    }
  },
};
</script>

<style lang="less" scoped>
ul {
  list-style: none;
}
</style>
