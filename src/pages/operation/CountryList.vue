<!--
 * @Author: your name
 * @Date: 2022-03-19 10:58:22
 * @LastEditTime: 2022-06-08 10:50:16
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\system\CountryList.vue
-->
<template>
  <a-card>
    <a-form layout="horizontal" :form="form" ref="searchRef">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="国家区号"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <!-- <a-select
                v-decorator="['id']"
                placeholder="请选择国家"
                show-search
                :filter-option="proxyFilter"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.id"
                  v-for="item in CountrySelectList"
                  >{{ item.name }}</a-select-option
                >
              </a-select> -->
              <a-input
                allowClear
                v-decorator="['area_code']"
                placeholder="请输入国家区号"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="默认展示状态"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 15, offset: 1 }"
            >
              <a-select
                v-decorator="['default_status']"
                placeholder="请选择状态"
              >
                <a-select-option :value="1">开启</a-select-option>
                <a-select-option :value="2">关闭</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="是否有支付渠道"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 15, offset: 1 }"
            >
              <a-select
                v-decorator="['is_payment_channel']"
                placeholder="请选择状态"
              >
                <a-select-option :value="1">有</a-select-option>
                <a-select-option :value="2">无</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24" style="margin-left: 8px">
            <a-form-item>
              <a-space size="middle">
                <!-- <a-button type="primary" @click="handleCreate">
                  <a-icon type="plus"></a-icon>
                  新增
                </a-button> -->
                <a-button @click="handleSearch" type="primary">查询</a-button>
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
      :data-source="CountryList"
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
      <!--  -->
      <template slot="icon" slot-scope="images">
        <img
          :src="baseUrl + '/' + images"
          alt=""
          srcset=""
          style="width: 40px"
        />
      </template>
      <!--  -->
      <template slot="status" slot-scope="item">
        <!-- <a-tag :color="status == 1 ? 'green' : 'red'">
          {{ status == 1 ? "开启" : "关闭" }}
        </a-tag> -->
        <a-switch
          :checked="item.status === 1 ? true : false"
          @change="CountryStatus(item)"
        />
      </template>
      <!-- 是否在首页展示 -->
      <template slot="default_status" slot-scope="item">
        <!-- {{ is_home_display }} -->
        <a-switch
          :checked="item.default_status === 1 ? true : false"
          @change="DefaultStatus(item)"
        />
      </template>
      <!--  -->
      <template slot="currency" slot-scope="item" v-if="item.currency">
        <div>法币ID：{{ item.currency.id }}</div>
        <div>法币简称：{{ item.currency.short_name }}</div>
        <div>中文名称：{{ item.currency.zh_name }}</div>
      </template>

      <!--  -->
      <template slot="payment" slot-scope="item" v-if="item.currency">
        <!-- <a-tag :color="payment == 1 ? 'green' : 'red'">
          {{ payment == 1 ? "有" : "无" }}
        </a-tag> -->
        <a-switch
          :checked="item.is_payment_channel === 1 ? true : false"
          @change="paymentStatus(item)"
        />
      </template>
      <!-- 是否为系统货币 -->
      <template slot="is_system" slot-scope="item" v-if="item.currency">
        <a-switch
          :checked="item.is_system === 1 ? true : false"
          @change="monetarySystem(item)"
        />
      </template>

      <template slot="action" slot-scope="item">
        <!-- <a @click="handleCompile(item)"><a-icon type="edit" /> 编辑</a> -->
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <!-- <a-popconfirm
            :title="`你确定要${item.status === 1 ? '关闭' : '开启'}此国家吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="banRecord(item)"
          >
            <a>
              {{ item.status === 1 ? "关闭" : "开启" }}
            </a>
          </a-popconfirm> -->
        </a-space>
      </template>
    </a-table>
    <CountryForm
      ref="CountryFormRef"
      :modules="modules"
      :loading="confirmLoading"
      :isVisible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      :allLanguageList="allLanguageList"
      :allFiatCurrencyList="allFiatCurrencyList"
    />
  </a-card>
</template>

<script>
import CountryForm from "./components/CountryForm.vue";
import { operationService } from "@/services";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "首字母",
    align: "center",
    dataIndex: "first_letter",
  },
  {
    title: "名称",
    align: "center",
    dataIndex: "en_name",
  },
  {
    title: "地区区号",
    align: "center",
    dataIndex: "area_code",
  },
  {
    title: "默认展示",
    align: "center",
    scopedSlots: { customRender: "default_status" },
  },
  {
    title: "状态",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "是否有支付渠道",
    align: "center",
    // dataIndex: "is_payment_channel",
    scopedSlots: { customRender: "payment" },
  },
  {
    title: "系统货币",
    align: "center",
    scopedSlots: { customRender: "is_system" },
  },
  // {
  //   title:'支付渠道状态',
  //   align: "center",
  //   scopedSlots: { customRender: ""}
  // },
  {
    title: "法币",
    align: "center",
    scopedSlots: { customRender: "currency" },
  },
  {
    title: "汇率",
    align: "center",
    dataIndex: "currency.exchange_rate",
  },
  {
    title: "默认语言",
    align: "center",
    dataIndex: "language.name",
  },
  // {
  //   title: "国旗",
  //   align: "center",
  //   dataIndex: "icon",
  //   scopedSlots: { customRender: "icon" },
  // },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "CountryList",
  components: { CountryForm },
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      CountryList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      //
      form: this.$form.createForm(this),
      CountrySelectList: [],
      //
      modules: null, //给对话框传内容
      confirmLoading: false, // 对话框loading
      visible: false, // 对话框显示隐藏
      allLanguageList: [],
      allFiatCurrencyList: [],
      baseUrl: "",
      imageTextComm: "",
    };
  },
  // activated() {
  created() {
    this.getCountryList();
    this.getAllLanguageList();
    this.getFiatCurrencyList();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    // this.getCountrySelectList();
  },
  methods: {
    // 对话框组件确认按钮
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs?.CountryFormRef?.form;
      form.validateFields((error, values) => {
        // values.icon = values?.icon?.file
        //   ? values?.icon?.file?.response?.data?.img_path
        //   : this.imageTextComm;
        operationService
          .countryEdit({ ...values })
          .then((res) => {
            const { code, msg } = res.data;
            this.confirmLoading = false;
            if (code !== 200) return this.$message.error(msg);
            this.$message.success("编辑成功");
            this.visible = false;
            form.resetFields();
            this.getCountryList();
            // this.$refs.CountryFormRef.imageUrl = "";
          })
          .catch((err) => {
            this.$message.error(err);
            this.confirmLoading = false;
          });
      });
    },
    // 对话框组件取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.CountryFormRef.form.resetFields();
    },
    // 编辑按钮
    handleUpdate(item) {
      console.log("==================>item", item);
      this.modules = {
        id: item.id,
        cn_name: item.cn_name,
        currency_id: item.currency_id,
        language_id: item.language_id,
      };
      // this.imageTextComm = item?.icon;
      // this.$refs.CountryFormRef.imageUrl = this.baseUrl + "/" + item?.icon;
      this.visible = true;
    },

    // 重置
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      // this.pageIndex = 1;
      this.getCountryList();
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this.getCountryList();
    },
    // 系统货币
    monetarySystem(item) {
      console.log("==================>xit");
      operationService
        .countrySwitch({
          status: item.status,
          id: item.id,
          is_system: item.is_system == 1 ? 2 : 1,
          default_status: item.default_status,
          is_payment_channel: item.is_payment_channel,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success(
              `${item.is_system == 1 ? "关闭" : "开启"}成功`
            );
            this.getCountryList();
          }
        });
    },
    // 支付渠道开关
    paymentStatus(item) {
      console.log("==================>zhifu");
      operationService
        .countrySwitch({
          status: item.status,
          id: item.id,
          is_system: item.is_system,
          default_status: item.default_status,
          is_payment_channel: item.is_payment_channel == 1 ? 2 : 1,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success(
              `${item.is_payment_channel == 1 ? "关闭" : "开启"}成功`
            );
            this.getCountryList();
          }
        });
    },

    //  默认展示开关
    DefaultStatus(item) {
      console.log("==================>moren");
      // console.log("==================>item", item);
      operationService
        .countrySwitch({
          id: item.id,
          is_system: item.is_system,
          status: item.status,
          default_status: item.default_status == 2 ? 1 : 2,
          is_payment_channel: item.is_payment_channel,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success(
            `默认展示${item.default_status == 1 ? "关闭" : "开启"}成功`
          );
          this.getCountryList();
        });
    },
    // 关闭开启国家
    CountryStatus(item) {
      console.log("==================>国家");
      // console.log("==================>item", item);
      operationService
        .countrySwitch({
          status: item.status == 1 ? 2 : 1,
          id: item.id,
          is_system: item.is_system,
          default_status: item.default_status,
          is_payment_channel: item.is_payment_channel,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success(`${item.status == 1 ? "关闭" : "开启"}成功`);
            this.getCountryList();
          }
        });
    },
    // 获取国家列表
    getCountryList() {
      this.loading = true;
      this.form.validateFields((_, values) => {
        operationService
          .countryList({ ...values })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.CountryList = data.list;
            this.total = data.total;
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getCountryList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getCountryList();
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
    // 选择器筛选函数
    proxyFilter(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 获取所有启用语言
    getAllLanguageList() {
      operationService
        .allLanguage()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.allLanguageList = data;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 获取所有法币
    getFiatCurrencyList() {
      operationService
        .allFiatCurrency()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.allFiatCurrencyList = data;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>

<style></style>
