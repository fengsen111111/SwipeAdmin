<template>
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
      :columns="columns"
      :dataSource="specialList"
      :loading="loading"
      bordered
      :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record.id"
    >
      <span slot="createTime" slot-scope="time">
        {{ time | formDate }}
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { statisticsService } from "@/services";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "专区名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "专区中文名",
    dataIndex: "name_zh",
    align: "center",
  },
  {
    title: "专区已结算总金额",
    dataIndex: "settlement_amount",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    align: "center",
    scopedSlots: {
      customRender: "createTime",
    },
  },
  {
    title: "H5会员购买人数",
    dataIndex: "h5_buy_num",
    align: "center",
  },
  {
    title: "H5会员购买金额",
    dataIndex: "h5_buy_amount",
    align: "center",
  },
  {
    title: "H5会员结算金额",
    dataIndex: "h5_settlement_amount",
    align: "center",
  },
  {
    title: "测试会员购买人数",
    dataIndex: "backstage_buy_num",
    align: "center",
  },
  {
    title: "测试会员购买金额",
    dataIndex: "backstage_buy_amount",
    align: "center",
  },
  {
    title: "测试会员结算金额",
    dataIndex: "backstage_settlement_amount",
    align: "center",
  },
];
export default {
  name: "SpecialArea",
  data() {
    return {
      loading: false,
      columns: columns,
      form: this.$form.createForm(this),
      spinning: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      specialList: [],
    };
  },
  activated() {
    this._getStatisticsSpe();
  },
  methods: {
    _getStatisticsSpe() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        statisticsService
          .getStatisticsSpe({
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.specialList = data;
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    handleReset() {
      this.form.resetFields();
      this._getStatisticsSpe();
    },
    handleSearch() {
      this.pageIndex = 1;
      this.spinning = true;
      this._getStatisticsSpe();
    },

    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getStatisticsSpe();
    },

    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getStatisticsSpe();
    },
  },
};
</script>

<style lang="scss" scoped></style>
