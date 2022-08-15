<!--
 * @Author: your name
 * @Date: 2022-03-28 13:16:01
 * @LastEditTime: 2022-06-09 17:13:39
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\components\UsdtRecharge.vue
 * USDT 充值
-->
<template>
  <div>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" ref="searchRef">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="用户名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  v-decorator="['username']"
                  placeholder="请输入用户名"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="充值状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select placeholder="状态" v-decorator="['status']">
                  <a-select-option value="1">待审核</a-select-option>
                  <a-select-option value="2">通过审核</a-select-option>
                  <a-select-option value="3">未通过审核</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="订单号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  v-decorator="['order_no']"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <!-- payLists -->

            <a-col :md="8" :sm="24">
              <a-form-item
                label="支付渠道"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select
                  placeholder="请选择到支付渠道"
                  v-decorator="['pay_company']"
                  :filter-option="filterOption"
                  show-search
                >
                  <a-select-option
                    v-for="item in payLists"
                    :key="item.id"
                    :value="item.name"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="充值时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-range-picker
                  v-decorator="['time']"
                  style="width: 100%"
                  :ranges="fastDate"
                  show-time
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="注册来源"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select placeholder="请选择" v-decorator="['reg_type']">
                  <a-select-option
                    :value="item.id"
                    :key="item.id"
                    v-for="item in registerTypeList"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item
                label="到账方式"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-select
                  placeholder="请选择到账方式"
                  v-decorator="['arrive_mode']"
                >
                  <a-select-option value="0">未到账</a-select-option>
                  <a-select-option value="1">三方回调</a-select-option>
                  <a-select-option value="2">手动补单</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->

            <!-- <a-col :md="8" :sm="24">
              <a-form-item
                label="平台订单号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 0 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  v-decorator="['pltf_order_id']"
                />
              </a-form-item>
            </a-col> -->
          </a-row>
          <a-row v-if="advanced"> </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset"
            >重置</a-button
          >
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <advance-table
        :columns="columns"
        :dataSource="UsdtRechargeList"
        :loading="loading"
        :bordered="true"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id"
        @a-cardrefresh="handleCardRefresh"
        @clear="onClear"
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
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <template slot="title">
          <a-row type="flex" justify="center">
            <a-col>
              <span class="left-title">充值数量:</span>
              <span class="right-title">{{ total }}</span>
            </a-col>
            <a-col>
              <span class="left-title">充值总额:</span>
              <span class="right-title">{{ money }}</span>
            </a-col>
            <!-- <a-col>
              <span class="left-title">三方服务费总额:</span>
              <span class="right-title">{{ totalRecharge.third_fee }}</span>
            </a-col> -->
          </a-row>
        </template>
        <template slot="verify" slot-scope="{ record }">
          <div>
            {{
              record.verify_money && record.sign == 1
                ? `币价: ${record.verify_money}`
                : record.verify_money
                ? `1: ${record.verify_money}`
                : "1 : 1"
            }}
          </div>
          <!-- <div></div> -->
        </template>
        <div
          style="width: 40px; height: 40px"
          slot="image"
          slot-scope="{ record }"
        >
          <!-- {{ record.native_url }} -->
          <div style="width: 40px; height: 40px">
            <img
              :src="record.native_url"
              alt=""
              style="width: 40px; height: 40px"
              @click="previewImg(baseUrl + '/' + record.native_url)"
            />
          </div>
        </div>
        <span slot="time" slot-scope="{ record }">
          {{ record.time | formDate }}
        </span>
        <!-- 到账时间 -->
        <span slot="arrive_time" slot-scope="{ record }">{{
          record.arrive_time | formDate
        }}</span>
        <span slot="arrive" slot-scope="{ record }">
          <a-tag :color="record.arrive_mode | formateRechargeTypeColor">
            {{ record.arrive_mode | formateRechargeType }}
          </a-tag>
        </span>
        <span slot="status" slot-scope="{ record }">
          <a-tag :color="record.status | formateRechargeStatusColor">{{
            record.status | formateUSDTRechargeStatus
          }}</a-tag>
        </span>
        <span slot="regType" slot-scope="{ record }">
          <a-tag :color="record.user.reg_type | formDateUserColor">
            {{ record.user.reg_type | formDateType }}
          </a-tag>
        </span>
        <div slot="actions" slot-scope="{ record }">
          <a-space size="middle">
            <a @click="handleManual(record)" v-if="record.status === 1">
              <a-icon type="check-square"></a-icon>审核
            </a>
          </a-space>
        </div>
        <!-- 充值金额 -->
        <template slot="money" slot-scope="{ record }">
          <div
            v-if="
              (record.account_name == 'BTC' && record.sign == 1) ||
                (record.account_name == 'ETH' && record.sign == 1)
            "
          >
            {{ `数量：${record.money}` }}
          </div>
          <div v-else>{{ record.money }}</div>
        </template>
        <!-- 到账金额 -->
        <template slot="arrive_money" slot-scope="{ record }">
          <div
            v-if="
              (record.account_name == 'BTC' && record.sign == 1) ||
                (record.account_name == 'ETH' && record.sign == 1)
            "
          >
            {{ `数量：${record.arrive_money}` }}
          </div>
          <div v-else>{{ record.arrive_money }}</div>
        </template>
      </advance-table>
    </div>
    <a-modal
      :visible="auditShow"
      title="审核"
      :confirm-loading="auditShowLoading"
      @ok="handleAuditOk"
      @cancel="handleAuditCancel"
    >
      <a-form :form="auditForm" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="审核状态">
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'status',
              { rules: [{ required: true }], message: '请选择状态' },
            ]"
          >
            <a-radio :value="2"> 审核通过 </a-radio>
            <a-radio :value="3"> 审核不通过 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核不通过理由">
          <a-textarea
            placeholder="填入审核不通过理由"
            :rows="2"
            v-decorator="['msg']"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { financeService } from "@/services";
import { registerTypeList } from "@/utils/util";
import AdvanceTable from "../../../components/table/advance/AdvanceTable.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
import {
  formateUSDTRechargeStatus,
  formateRechargeStatusColor,
  formateRechargeType,
  formateRechargeTypeColor,
} from "@/utils/filters";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "支付渠道",
    dataIndex: "pay_company",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "account_name",
    align: "center",
  },
  {
    title: "订单号",
    dataIndex: "order_no",
    align: "center",
  },
  {
    title: "用户昵称",
    align: "center",
    dataIndex: "user.nickname",
  },
  {
    title: "用户名",
    dataIndex: "user.username",
    align: "center",
  },

  {
    title: "充值金额",
    dataIndex: "money",
    align: "center",
    scopedSlots: { customRender: "money" },
    sorter: true,
  },
  {
    title: "支付凭证",
    align: "center",
    dataIndex: "native_url",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "付款地址",
    align: "center",
    dataIndex: "account_number",
  },
  {
    title: "用户备注",
    align: "center",
    dataIndex: "match_code",
  },
  // {
  //   title: "三方手续费费率",
  //   dataIndex: "third_rate",
  //   align: "center",
  // },
  // {
  //   title: "三方手续费",
  //   dataIndex: "third_fee",
  //   align: "center",
  // },
  // {
  //   title: "到账方式",
  //   align: "center",
  //   dataIndex: "arrive_mode",
  //   scopedSlots: { customRender: "arrive" },
  // },

  {
    title: "充值时间",
    dataIndex: "time",
    scopedSlots: { customRender: "time" },
    align: "center",
  },
  {
    title: "注册类型",
    dataIndex: "reg_type",
    align: "center",
    scopedSlots: {
      customRender: "regType",
    },
  },
  {
    title: "到账时间",
    dataIndex: "arrive_time",
    scopedSlots: { customRender: "arrive_time" },
    align: "center",
  },
  {
    title: "到账金额",
    dataIndex: "arrive_money",
    scopedSlots: { customRender: "arrive_money" },
    align: "center",
  },
  {
    title: "换算比例",
    align: "center",
    scopedSlots: { customRender: "verify" },
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
    fixed: "right",
    width: 90,
  },
  {
    title: "操作",
    dataIndex: "",
    scopedSlots: { customRender: "actions" },
    align: "center",
    width: 170,
    fixed: "right",
  },
];
export default {
  name: "UsdtRecharge",
  components: {
    // StandardTable,
    AdvanceTable,
  },
  filters: {
    formateUSDTRechargeStatus,
    formateRechargeStatusColor,
    formateRechargeType,
    formateRechargeTypeColor,
    formDateType,
    formDateUserColor,
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    this.registerTypeList = registerTypeList;
    return {
      advanced: false,
      columns: columns,
      UsdtRechargeList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      loading: false,
      spinning: false,
      payLists: [],
      baseUrl: "",
      money: 0,
      // 对话框
      auditForm: this.$form.createForm(this),
      auditShow: false,
      auditShowLoading: false,
      USDTID: 0,
    };
  },
  computed: {
    // 计算属性获取websocket推送过来放进vuex中的数据
    countNum() {
      return this.$store.state.socket.usdtRecharge;
    },
  },
  // 监听数据变化 再将获取到的数据放入列表第一位
  watch: {
    countNum: function(newVal) {
      if (newVal) {
        console.log("==================>newVal", newVal);
        this.UsdtRechargeList.unshift(newVal);
      } else {
        throw new Error("监听错误");
      }
    },
  },
  activated() {
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    this.getUsdtRechargeList();
    this._getPay();
    // this.getFiatCurrencyList();
  },
  // mounted() {
  //   this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  //   this.getUsdtRechargeList();
  //   this._getPay();
  // },
  methods: {
    // 对话框取消按钮
    handleAuditCancel() {
      this.auditShow = false;
      this.auditForm.resetFields();
    },
    // 对话框确认按钮
    handleAuditOk() {
      this.auditShowLoading = true;
      this.auditForm.validateFields((errors, values) => {
        if (!errors) {
          // console.log("==================>values", values);
          values.id = this.USDTID;
          financeService
            .usdtRechargeAudit({ ...values })
            .then((res) => {
              this.auditShow = false;
              const { code, msg } = res.data;
              this.auditShowLoading = false;
              if (code !== 200) return this.$message.error(msg);
              this.$message.success("审核成功");
              this.auditForm.resetFields();
              this.getUsdtRechargeList();
            })
            .catch((err) => {
              this.auditShowLoading = false;
              this.$message.error(err);
            });
        } else {
          this.auditShowLoading = false;
        }
      });
    },
    // 审核按钮
    handleManual(item) {
      // console.log("==================>item", item);
      this.USDTID = item.id;
      this.auditShow = true;
    },
    // 查看图片点击事件
    previewImg(url) {
      this.$hevueImgPreview(url);
    },
    //   查询按钮事件
    handleSearch() {
      this.pageIndex = 1;
      this.getUsdtRechargeList();
    },
    // 重置按钮事件
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this.getUsdtRechargeList();
    },
    // 展开收起事件
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 获取USDT充值列表
    getUsdtRechargeList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        values.time = this.config.timeFormat(values.time);
        financeService
          .usdtRechargeList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.UsdtRechargeList = data.list;
            this.total = data.total;
            this.money = data.money;
            setTimeout(() => {
              this.$forceUpdate();
            }, 500);
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
      this.getUsdtRechargeList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getUsdtRechargeList();
    },
    // 获取支付渠道方式
    _getPay() {
      financeService
        .getPayList({ account_type: [1, 4], country_id: 0 })
        .then((res) => {
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.payLists = data;
          }
        });
    },
    // 审核按钮
    // 选择器筛选事件
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // ?
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    // ?
    onChange(pagination, filters, sorter) {
      let { field, order } = sorter;
      console.log("==================>field,order", field, order);
    },
    // ?
    onSelectChange(item) {
      console.log("==================>item", item);
      this.remarksData = item;
    },
    // ? 刷新事件
    handleCardRefresh() {
      console.log("==================>刷新");
      this.getRisefallRecordList();
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
