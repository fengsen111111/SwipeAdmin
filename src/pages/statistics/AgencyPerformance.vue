<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item
              label="日期"
              :labelCol="{ span: 3 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-range-picker
                v-decorator="['create_time']"
                style="width: 100%"
                :ranges="fastDate"
                show-time
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="用户昵称"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-input
                v-decorator="['nickname']"
                allowClear
                placeholder="请输入用户昵称"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item
              label="总代理名称"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                v-decorator="['agent_id']"
                placeholder="请选择或搜索总代理"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option v-for="item in agentLists" :key="item.id">
                  {{ item.nickname }}
                </a-select-option>
              </a-select>
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

      <advance-table
        :loading="loading"
        :columns="columns"
        bordered
        :data-source="agencyList"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id"
        @a-cardrefresh="handleCardRefresh"
        :pagination="{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: true,
          onChange: onPageChange,
          pageSizeOptions: [
            '10',
            '20',
            '30',
            '40',
            '50',
            '100',
            '200',
            '300',
            '400',
            '500',
          ],
          onShowSizeChange: onSizeChange,
        }"
      >
        <template slot="title">
          <a-row type="flex">
            <a-col>
              <span class="left-title">充值总额:</span
              ><span class="right-title">{{ totalAgentData.recharge }}</span>
            </a-col>
            <a-col>
              <span class="left-title">提现总额:</span
              ><span class="right-title">{{ totalAgentData.withdrawal }}</span>
            </a-col>
            <a-col>
              <span class="left-title">提现进行中总额:</span
              ><span class="right-title">{{ totalAgentData.progress }}</span>
            </a-col>
            <a-col>
              <span class="left-title">盈利总额:</span
              ><span class="right-title">{{ totalAgentData.profit }}</span>
            </a-col>
          </a-row>
        </template>
        <!-- <template slot="actions" slot-scope="item">
          <a @click="handleProxy(item.id)">代理详情</a>
        </template> -->
      </advance-table>
      <!-- <agency-diagram
        :isVisible="isVisible"
        :diagramList="diagramList"
        :agencyDetails="agencyDetails"
        @cancel="
          () => {
            isVisible = false;
          }
        "
      /> -->
    </a-card>
  </a-spin>
</template>

<script>
import { statisticsService } from "@/services";
import AdvanceTable from "../../components/table/advance/AdvanceTable.vue";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "代理昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "代理用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "新增用户",
    dataIndex: "new_users",
    align: "center",
  },
  {
    title: "活跃人数",
    dataIndex: "active_num",
    align: "center",
  },
  {
    title: "首充总人数",
    dataIndex: "fist_recharge_num",
    align: "center",
  },
  {
    title: "首充货币人数",
    dataIndex: "fist_recharge_h_num",
    align: "center",
  },
  {
    title: "首充法币人数",
    dataIndex: "fist_recharge_f_num",
    align: "center",
  },
  {
    title: "首充总货币金额",
    dataIndex: "fist_recharge_amount",
    align: "center",
  },
  {
    title: "首充货币金额",
    dataIndex: "fist_recharge_h_amount",
    align: "center",
  },
  {
    title: "首充法币金额",
    dataIndex: "fist_recharge_f_amount",
    align: "center",
  },
  {
    title: "充值人数",
    dataIndex: "recharge_num",
    align: "center",
  },
  {
    title: "充值总货币金额",
    dataIndex: "recharge_amount",
    align: "center",
  },
  {
    title: "充值货币金额",
    dataIndex: "recharge_h_amount",
    align: "center",
  },
  {
    title: "充值法币金额",
    dataIndex: "recharge_f_amount ",
    align: "center",
  },

  {
    title: "三方充值服务费总额",
    dataIndex: "three_fee",
    align: "center",
  },
  {
    title: "提现总货币金额",
    dataIndex: "withdraw_usdt",
    align: "center",
  },
  {
    title: "提现法币金额",
    dataIndex: "withdraw_f",
    align: "center",
  },
  {
    title: "提现货币金额",
    dataIndex: "withdraw_h",
    align: "center",
  },
  {
    title: "三方提现服务费总额",
    dataIndex: "withdraw_three_fee",
    align: "center",
  },
  {
    title: "平台提现收取服务费总额",
    dataIndex: "withdraw_platform_fee",
    align: "center",
  },
  {
    title: "上分金额",
    dataIndex: "upper_points",
    align: "center",
  },
  {
    title: "下分金额",
    dataIndex: "down_points",
    align: "center",
  },

  {
    title: "后台赠送礼金",
    dataIndex: "gift_money",
    align: "center",
  },
  // {
  //   title: "操作",
  //   dataIndex: "",
  //   scopedSlots: { customRender: "actions" },
  //   align: "center",
  //   fixed: "right",
  //   width: 120,
  // },
];
export default {
  components: { AdvanceTable },
  name: "AgencyPerFormance",
  data() {
    return {
      spinning: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      agencyList: [],
      columns: columns,
      form: this.$form.createForm(this),
      isVisible: false,
      // tableHeight: document.documentElement.clientHeight - 260 + "px",
      agentLists: [],
      totalAgentData: {
        profit: 0,
        progress: 0,
        withdrawal: 0,
        recharge: 0,
      },
    };
  },
  activated() {
    this._getProxyALl();
    this.allTotalAgent();
  },
  mounted() {
    /** 控制table的高度 */
    // window.onresize = function () {
    //   this.tableHeight = document.documentElement.clientHeight - 260 + "px";
    // };
  },
  methods: {
    _getProxyALl() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        statisticsService
          .getAgentPerformance({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.agencyList = data.list;
              this.total = data.total;
              this.totalAgentData.recharge =
                data?.recharge === null ? 0 : data.recharge;
              this.totalAgentData.withdrawal =
                data?.withdrawal === null ? 0 : data.withdrawal;
              this.totalAgentData.progress =
                data?.progress === null ? 0 : data.progress;
              this.totalAgentData.profit =
                data?.profit === null ? 0 : data.profit;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    allTotalAgent() {
      statisticsService
        .getTotalAgent()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.agentLists = data;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleReset() {
      this.pageIndex = 1;
      this.$refs.searchRef.form.resetFields();
      this._getProxyALl();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getProxyALl();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getProxyALl();
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getProxyALl();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleCardRefresh() {
      this._getProxyALl();
    },
  },
};
</script>

<style lang="less" scoped>
&:deep(.ant-table-body) {
  max-height: v-bind(tableHeight) !important;
}
&:deep(.ant-table-body-inner) {
  max-height: v-bind(tableHeight) !important;
}
&:deep(.ant-table-thead) > tr > th {
  white-space: nowrap !important; // 防止IE等浏览器不支持'max-content'属性 导致内容换行
}
::v-deep .ant-statistic-content {
  font-size: 14px;
}
</style>
