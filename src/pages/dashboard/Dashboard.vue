<template>
  <div class="analysis">
    <div
      v-if="$store.state.account.user.role_id != 1"
      style="margin: auto; margin-top: 100px; font-size: xxx-large"
    >
      欢迎登录
    </div>
    <div v-else>
      <a-card>
        <a-form layout="horizontal" :form="form" ref="searchRef">
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
            <a-col :md="7" :sm="24">
              <a-form-item
                label="注册来源"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
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
            <a-col :md="4" :sm="24" style="margin-left: 10px">
              <a-form-item>
                <a-space size="middle">
                  <a-button type="primary" @click="handleSearch">查询</a-button>
                  <a-button type="default" @click="handleReset">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <!-- <a-tabs
      default-active-key="1"
      :tab-position="mode"
      :tabBarStyle="tabBarStyle"
    >
      <a-tab-pane tab="总统计" key="1">
       
      </a-tab-pane>
      <a-tab-pane tab="报表统计" key="2"> 123123123</a-tab-pane>
    </a-tabs> -->
      <a-tabs default-active-key="0" @change="changeDash">
        <a-tab-pane key="0" tab="总统计" forceRender>
          <dash-board-card :dashList="dashboardList" :loading="loading" />
        </a-tab-pane>
        <a-tab-pane key="1" tab="店铺统计" forceRender>
          <dash-board-card :dashList="dashboardList" :loading="loading" />
        </a-tab-pane>
        <!-- <a-tab-pane key="1" tab="商品统计" forceRender>
        <dash-board-card :dashList="dashboardList" :loading="loading"
        /></a-tab-pane> -->
        <a-tab-pane key="2" tab="出入金统计" forceRender>
          <dash-board-card :dashList="dashboardList" :loading="loading" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="会员统计" forceRender>
          <dash-board-card :dashList="dashboardList" :loading="loading" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
// import ChartCard from "@/components/card/ChartCard";

import { userService } from "@/services";
import DashBoardCard from "./components/DashBoardCard.vue";
import { registerTypeList } from "@/utils/util";

export default {
  components: { DashBoardCard },
  name: "Analysis",
  data() {
    this.registerTypeList = registerTypeList;
    return {
      loading: true,
      form: this.$form.createForm(this),
      dashboardList: [],
      mode: "left",
      tabBarStyle: {
        padding: "20px 10px",
        backgroundColor: "white",
        width: "200px",
        height: "500px",
        textAlign: "center",
      },
      totalStatus: 0,
    };
  },
  activated() {
    this._getDashboard();
    console.log(
      "==================>$store.state.account.user.role_id",
      this.$store.state.account.user.role_id
    );
  },

  methods: {
    _getDashboard() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        values.create_time = this.config.timeFormat(values.create_time);
        userService
          .getDashboardList({
            statistics_status: this.totalStatus,
            ...values,
          })
          .then((res) => {
            const { code, msg, data } = res.data;
            this.loading = false;
            if (code !== 200) return this.$message.error(msg);
            this.dashboardList = data;
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
          });
      });
    },
    handleSearch() {
      this._getDashboard();
    },
    handleReset() {
      this.form.resetFields();
      this._getDashboard();
    },
    callback(val) {
      console.log(val);
    },
    changeDash(item) {
      this.totalStatus = +item;
      this._getDashboard();
    },
  },
};
</script>

<style lang="less" scoped>
.extra-wrap {
  .extra-item {
    display: inline-block;
    margin-right: 24px;
    a:not(:first-child) {
      margin-left: 24px;
    }
  }
}
.analysis {
  display: flex;
  flex-direction: column;
}
@media screen and (max-width: 992px) {
  .extra-wrap .extra-item {
    display: none;
  }
}
@media screen and (max-width: 576px) {
  .extra-wrap {
    display: none;
  }
}
.title {
  font-size: 20px;
  margin-top: 10px;
  text-align: center;
  color: #f43b86;
  font-weight: bold;
}
</style>
