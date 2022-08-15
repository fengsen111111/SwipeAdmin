<template>
  <a-spin :spinning="spinning">
    <a-card>
      <a-form :form="form" ref="searchRef">
        <a-row>
          <a-col :md="5" :sm="24">
            <a-form-item
              label="用户名"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 0 }"
            >
              <a-input
                v-decorator="['relation_username']"
                allowClear
                placeholder="请输入用户名"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="分佣时间"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 0 }"
            >
              <a-range-picker
                v-decorator="['created_at']"
                style="width: 100%"
                :ranges="fastDate"
                show-time
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="5" :sm="24">
            <a-form-item
              label="用户ID"
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 17, offset: 1 }"
            >
              <a-input
                v-decorator="['user_id']"
                placeholder="请输入用户ID"
                allowClear
              />
            </a-form-item>
          </a-col> -->
          <a-col :md="5" :sm="24">
            <a-form-item
              label="申购类型"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 0 }"
            >
              <a-select placeholder="请选择申购类型" v-decorator="['type']">
                <a-select-option :value="1">涨跌</a-select-option>
                <a-select-option :value="2">交易</a-select-option>
                <a-select-option :value="3">挖矿</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
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
                  >{{ item.name }}</a-select-option
                >
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
      <a-row type="flex">
        <a-col>
          <span class="left-title">一级分佣总额:</span
          ><span class="right-title">{{ totalList.total_1 }}</span>
        </a-col>
        <a-col>
          <span class="left-title">二级分佣总额:</span
          ><span class="right-title">{{ totalList.total_2 }}</span>
        </a-col>
        <a-col>
          <span class="left-title">三级分佣总额:</span
          ><span class="right-title">{{ totalList.total_3 }}</span>
        </a-col>
        <a-col>
          <span class="left-title">四级分佣总额:</span
          ><span class="right-title">{{ totalList.total_4 }}</span>
        </a-col>
        <a-col>
          <span class="left-title">五级分佣总额:</span
          ><span class="right-title">{{ totalList.total_5 }}</span>
        </a-col>
        <a-col>
          <span class="left-title">总分佣总额:</span
          ><span class="right-title">{{ totalList.totalall }}</span>
        </a-col>
      </a-row>
      <a-tabs default-active-key="1" @change="handleTab">
        <a-tab-pane key="1" tab="一级分佣"></a-tab-pane>
        <a-tab-pane key="2" tab="二级分佣" force-render></a-tab-pane>
        <a-tab-pane key="3" tab="三级分佣" force-render></a-tab-pane>
        <a-tab-pane key="4" tab="四级分佣" force-render></a-tab-pane>
        <a-tab-pane key="5" tab="五级分佣" force-render></a-tab-pane>
      </a-tabs>
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="commissionList"
        :rowKey="(record) => record._id"
        bordered
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
        <div slot="userinfo" slot-scope="record">
          <!-- {{ item }} -->
          <div>用户ID:{{ record.user_id }}</div>
          <div>用户名：{{ record.username }}</div>
          <div>用户昵称：{{ record.nickname }}</div>
          <div>
            用户注册类型：<a-tag :color="record.reg_type | formDateUserColor">{{
              record.reg_type | formDateType
            }}</a-tag>
          </div>
        </div>

        <template slot="relation" slot-scope="record">
          <div>上级用户ID:{{ record.relation_id }}</div>
          <div>上级用户名：{{ record.relation_username }}</div>
          <!-- <div>用户昵称：{{ record.nickname }}</div> -->
        </template>
        <template slot="junior" slot-scope="record">
          <div>下级用户ID:{{ record.strid }}</div>
          <div>下级用户名:{{ record.strusername }}</div>
        </template>

        <template slot="agent" slot-scope="record">
          <div>员工代理ID:{{ record.agent_id }}</div>
          <div>员工代理用户名：{{ record.agent_username }}</div>
          <!-- <div>用户昵称：{{ record.nickname }}</div> -->
        </template>

        <template slot="all_agent" slot-scope="record">
          <div>总代理ID:{{ record.all_agent_id }}</div>
          <div>总代理用户名：{{ record.all_agent_username }}</div>
          <!-- <div>用户昵称：{{ record.nickname }}</div> -->
        </template>
        <span slot="createTime" slot-scope="created_at">{{
          created_at | formDate
        }}</span>
        <span slot="status" slot-scope="type">
          <a-tag :color="type | typeColor">
            {{ type | typeText }}
          </a-tag>
        </span>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import { financeService } from "@/services";
import { registerTypeList } from "@/utils/util";
import {
  // registerTypeList,
  formDateType,
  formDateUserColor,
} from "@/utils/filters";
const columns = [
  // {
  //   title: "用户ID",
  //   dataIndex: "user_id",
  //   align: "center",
  // },
  // {
  //   title: "用户昵称",
  //   dataIndex: "user_info.nickname",
  //   align: "center",
  // },
  // {
  //   title: "用户名",
  //   dataIndex: "user_info.username",
  //   align: "center",
  // },
  {
    title: "用户信息",
    align: "left",
    // dataIndex: "user_info",
    scopedSlots: { customRender: "userinfo" },
  },
  {
    title: "上级用户信息",
    align: "center",
    scopedSlots: { customRender: "relation" },
  },
  {
    title: "下级用户信息",
    align: "center",
    scopedSlots: { customRender: "junior" },
  },
  {
    title: "员工代理信息",
    align: "center",
    scopedSlots: { customRender: "agent" },
  },
  {
    title: "总代理信息",
    align: "center",
    scopedSlots: { customRender: "all_agent" },
  },
  {
    title: "类型",
    dataIndex: "type",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "申购金额",
    align: "center",
    dataIndex: "bet_amount",
  },
  {
    title: "分佣比例",
    align: "center",
    dataIndex: "rebate_rate",
  },
  {
    title: "当前层级分佣比例",
    align: "center",
    dataIndex: "level_rebate_rate",
  },
  {
    title: "层级",
    align: "center",
    dataIndex: "level",
  },
  {
    title: "层级佣金",
    align: "center",
    dataIndex: "commission",
  },
  {
    title: "分佣时间",
    dataIndex: "created_at",
    scopedSlots: { customRender: "createTime" },
    align: "center",
  },
];
export default {
  name: "Commission",
  filters: {
    formDateType,
    formDateUserColor,
    typeSwithc(val) {
      switch (val) {
        case 0:
          return "系统收益";
        case 1:
          return "分佣";
        default:
          return "未知";
      }
    },
    typeColor(val) {
      switch (val) {
        case 1:
          return "#A554b1";
        case 2:
          return "#7B00EC";
        case 3:
          return "#ea580c";
        default:
          return "未知";
      }
    },
    typeText(val) {
      switch (val) {
        case 1:
          return "涨跌";
        case 2:
          return "交易";
        case 3:
          return "挖矿";
        default:
          return "未知";
      }
    },
  },
  data() {
    this.registerTypeList = registerTypeList;
    return {
      spinning: false,
      columns: columns,
      loading: false,
      commissionList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      status: 1,
      paginationType: 1,
      totalList: {
        total_1: 0,
        total_2: 0,
        total_3: 0,
        total_4: 0,
        total_5: 0,
        totalall: 0,
      },
    };
  },
  activated() {
    this._commission();
    this._commissionTotal();
  },
  methods: {
    // 获取分佣统计
    _commissionTotal() {
      this.form.validateFields((err, values) => {
        // console.log("==================>values", values);
        if (!values.relation_username) {
          values.relation_username = "";
        }
        financeService
          .getCommissionTotal({
            relation_username: values.relation_username,
          })
          .then((res) => {
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            // console.log("==================>data", data);
            this.totalList.total_1 = data.total_1;
            this.totalList.total_2 = data.total_2;
            this.totalList.total_3 = data.total_3;
            this.totalList.total_4 = data.total_4;
            this.totalList.total_5 = data.total_5;
            this.totalList.totalall = data.totalall;
          })
          .catch((err) => {
            // this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 分佣列表
    _commission() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.created_at = this.config.timeFormat(values.created_at);
        financeService
          .getCommissionList({
            page: this.pageIndex,
            limit: this.pageSize,
            level: this.status,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.commissionList = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._commission();
      this._commissionTotal();
    },
    handleReset() {
      this.paginationType = 1;
      this.$refs.searchRef.form.resetFields();
      this._commission();
      this._commissionTotal();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._commission();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._commission();
    },
    handleTab(item) {
      this.status = +item;
      this._commission();
    },
  },
};
</script>

<style lang="scss" scoped></style>
