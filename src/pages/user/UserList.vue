<template>
  <a-spin :spinning="spinning">
    <a-card>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-decorator="['username']" allowClear placeholder="请输入用户名" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="账号状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select placeholder="账号" v-decorator="['status']">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="2">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="用户昵称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input placeholder="请输入" allowClear v-decorator="['nickname']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-show="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="注册日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker v-decorator="['create_time']" style="width: 100%" :ranges="fastDate" show-time />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item label="注册来源" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select placeholder="请选择" v-decorator="['reg_type']">
                    <a-select-option :value="item.id" :key="item.id" v-for="item in registerTypeList">{{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="员工代理用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 100%" placeholder="请输入" allowClear v-decorator="['agent_username']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-show="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="上级推荐人" :labelCol="{ span: 6 }" :wrapperCol="{ span: 17, offset: 1 }">
                  <a-input-group compact>
                    <a-select style="width: 30%" v-decorator="['invite_level']" placeholder="请选择">
                      <a-select-option value="1">一级推荐人</a-select-option>
                      <a-select-option value="2">二级推荐人</a-select-option>
                      <a-select-option value="3">三级推荐人</a-select-option>
                      <a-select-option value="4">四级推荐人</a-select-option>
                      <a-select-option value="5">五级推荐人</a-select-option>
                    </a-select>
                    <a-input v-decorator="['invite_username']" style="width: 70%" placeholder="请输入用户名" />
                  </a-input-group>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="用户在线状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select placeholder="用户在线状态" v-decorator="['online']">
                    <a-select-option :value="0">离线</a-select-option>
                    <a-select-option :value="1">在线</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
      <a-space size="large">
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
        <a-button type="dashed" @click="handleBulkUser">
          批量新增测试会员
        </a-button>
        <a-button type="primary" @click="handleAgent">
          批量修改代理线
        </a-button>
      </a-space>
      <div style="height: 10px"></div>
      <a-table :columns="columns" :dataSource="userList" :loading="loading" bordered :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id" :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }" :pagination="{
            current: pageIndex,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showLessItems: true,
            showQuickJumper: true,
            onChange: onPageChange,
            onShowSizeChange: onSizeChange,
          }">
        <!-- 用户信息 -->
        <template slot="userinfo" slot-scope="item">
          <div>国际电话区号：{{ item.country && item.country.area_code }}</div>
          <div>
            注册类型：<a-tag :color="item.reg_type | formDateUserColor">
              {{ item.reg_type | formDateType }}
            </a-tag>
          </div>
          <div>昵称：{{ item.nickname }}</div>
          <div>用户名：{{ item.username }}</div>
          <!-- <div>用户提现打码限制：{{ item.withdrawal_limit }}</div> -->
          <!-- <div>注册时间：{{ item.create_time | formDate }}</div> -->
        </template>
        <!-- 店铺信息 -->
        <template slot="shop_info" slot-scope="item">

          <div>是否开店：<a-tag :color="item.shop_info ? item.shop_info.status === 1 ? 'green' : 'red' : 'red'"> 
            {{ item.shop_info ? item.shop_info.status === 1 ? '是' : '否' : '否' }} 
            </a-tag>
          </div>
          <div>店铺等级：{{ item.shop_info ? item.shop_info.shop_level_id : '' }}</div>
        </template>

        <!-- 上级推荐人信息 -->
        <template slot="superior_user" slot-scope="item">
          <div>上级推荐人ID：{{ item && item.id }}</div>
          <div>上级推荐人昵称：{{ item && item.nickname }}</div>
          <div>上级推荐人用户名：{{ item && item.username }}</div>
        </template>

        <!-- 员工代理信息 -->
        <template slot="agentinfo" slot-scope="item">
          <div>代理昵称：{{ item.agent_nickname }}</div>
          <div>代理用户名：{{ item.agent_username }}</div>
        </template>
        <!-- 推荐人手机号 -->
        <template slot="relationPhone" slot-scope="item">
          <div>一级推荐人手机号：{{ item.relation? item.relation.one_username? item.relation.one_username : '' :''}}</div>
          <div>二级推荐人手机号：{{ item.relation? item.relation.two_username? item.relation.two_username : '' :''}}</div>
          <div>三级推荐人手机号：{{ item.relation? item.relation.three_username? item.relation.three_username : '' :'' }}</div>
          <div>四级推荐人手机号：{{ item.relation? item.relation.four_username? item.relation.four_username : '' :''}}</div>
          <div>五级推荐人手机号：{{ item.relation? item.relation.five_username? item.relation.five_username : '' :''}}</div>
        </template>
        <!-- 推荐人数 -->
        <template slot="relation" slot-scope="item">
          <div>一级推荐人数：{{ item.relation? item.relation.one_number? item.relation.one_number : '' :''}}</div>
          <div>二级推荐人数：{{ item.relation? item.relation.two_number? item.relation.two_number : '' :''}}</div>
          <div>三级推荐人数：{{ item.relation? item.relation.three_number? item.relation.three_number : '' :'' }}</div>
          <div>四级推荐人数：{{ item.relation? item.relation.four_number? item.relation.four_number : '' :''}}</div>
          <div>五级推荐人数：{{ item.relation? item.relation.five_number? item.relation.five_number : '' :''}}</div>
        </template>

        <!-- 用户权限 -->
        <template slot="userPermission" slot-scope="item">
          <div>
            是否可充值：<a-tag :color="item.is_recharge === 1 ? 'green' : 'red'">{{ item.is_recharge === 1 ? "是" : "否" }}
            </a-tag>
          </div>
          <div>
            是否可登录：<a-tag :color="item.is_login === 1 ? 'green' : 'red'">{{
                item.is_login === 1 ? "是" : "否"
            }}</a-tag>
          </div>
          <div>
            是否可提现：<a-tag :color="item.is_withdrawal === 1 ? 'green' : 'red'">{{ item.is_withdrawal === 1 ? "是" : "否" }}
            </a-tag>
          </div>
          <div>
            是否可购买：<a-tag :color="item.is_buy === 1 ? 'green' : 'red'">{{
                item.is_buy === 1 ? "是" : "否"
            }}</a-tag>
          </div>
        </template>
        <!-- 用户累计 -->
        <template slot="grandTotal" slot-scope="item">
          <div>用户累计充值金额：{{ item.cl_recharge }}</div>
          <div>用户累计提现金额：{{ item.cl_withdrawal }}</div>
          <div>购买总额：{{ item.cl_buy }}</div>
        </template>
        <!-- 时间 -->
        <template slot="time" slot-scope="item">
          <div>上次登录时间：{{ item.last_time | formDate }}</div>
          <div>注册时间：{{ item.create_time | formDate }}</div>
        </template>
        <!-- <template slot="betnum" slot-scope="item">
          <div>当前打码量:{{ item.wcl_betting }}</div>
          <div>提现打码量:{{ item.withdrawal_limit }}</div>
        </template> -->
        <!-- 在线状态 -->
        <template slot="online" slot-scope="online">
          <div>
            <a-tag :color="online == 0 ? '#EF1111' : '#22C55E'">
              {{ online == 0 ? "离线" : "在线" }}
            </a-tag>
          </div>
        </template>

        <!-- <span slot="createTime" slot-scope="time">
          {{ time | formDate }}
        </span> -->
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleUpdate(item)">
              <a-icon type="edit"></a-icon>
              编辑
            </a>
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="banUser(item)">
                    {{ item.status === 0 ? "启用" : "禁用" }}
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleFunding(item.id)">资金详情</a>
                </a-menu-item>

                <!-- <a-menu-item>
                  <a @click="handleIntegral(item.id)">积分详情</a>
                </a-menu-item> -->
                <a-menu-item>
                  <a @click="handleCommission(item.id)">佣金详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleKick(item.id)">踢下线</a>
                </a-menu-item>
                <!-- 派单 -->
                <a-menu-item v-if="item.shop_info ? item.shop_info.status === 1 : false">
                  <a @click="handleDistribute(item)">派单</a>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
              status === 1 ? "启用" : "禁用"
          }}</a-tag>
        </span>

        <template slot="inCode" slot-scope="text">
          <a-space size="small">
            <span>{{ text }}</span>
            <a>
              <a-icon type="copy" v-copy="text" theme="twoTone" />
            </a>
          </a-space>
        </template>
      </a-table>
      <!-- ======================Form======================= -->
      <user-form :loading="confirmLoading" :status="isStatus" :visible="isVisible" ref="staffForm" :modules="modules"
        @cancel="handleCancel" @ok="handleOk" :agentAllList="agentAllList" />
      <bulk-user-form :loading="bulkLoading" :visible="isBulkVisible" ref="bulkRef" :modules="bulkModules"
        @cancel="bulkCancel" @ok="bulkOk" />
      <modify-agent :agentLoading="agentLoading" :agentVisible="agentVisible" ref="agentRef"
        :agentAllList="agentAllList" :agentModules="agentModules" @cancel="bulkCancelAgent" @ok="bulkOkAgent">
      </modify-agent>
      <!-- 派单 -->
      <distribute-leaflets style="position:relative;z-index:99;" ref="distributeRef" :visible="leafletsVisible"
        :modules="leafletsModules" @handelClose="handelClose" />
    </a-card>
  </a-spin>
</template>

<script>
import { userService } from "@/services";
import UserForm from "./components/UserForm.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
import { registerTypeList } from "@/utils/util";
import BulkUserForm from "./components/BulkUserForm.vue";
import ModifyAgent from "./components/ModifyAgent.vue";
import DistributeLeaflets from './components/DistributeLeaflets.vue';
const columns = [
  {
    title: '#',
    align: 'center',
    dataIndex: 'id',
  },
  {
    title: "用户信息",
    align: "left",
    scopedSlots: { customRender: "userinfo" },
  },
  {
    title: "店铺信息",
    align: "left",
    scopedSlots: { customRender: "shop_info" },
  },
  {
    title: "员工代理信息",
    align: "left",
    scopedSlots: { customRender: "agentinfo" },
  },
  {
    title: "邀请码",
    dataIndex: "in_code",
    align: "center",
    scopedSlots: { customRender: "inCode" },
  },
  {
    title: "余额",
    dataIndex: "balance",
    align: "center",
    customCell: () => {
      return { style: { color: "red" } };
    },
  },
  // {
  //   title: "打码量",
  //   align: "left",
  //   // dataIndex: "wcl_betting",
  //   scopedSlots: { customRender: "betnum" },
  // },
  {
    title: "用户累计",
    align: "left",
    scopedSlots: { customRender: "grandTotal" },
  },
  {
    title: "推荐人数",
    align: "left",
    dataIndex: "",
    scopedSlots: { customRender: "relation" },
  },
  {
    title: "推荐人手机号",
    align: "left",
    dataIndex: "",
    scopedSlots: { customRender: "relationPhone" },
  },
  {
    title: "备注",
    align: "center",
    dataIndex: "remarks",
  },
  {
    title: "用户权限",
    align: "left",
    scopedSlots: { customRender: "userPermission" },
  },
  {
    title: "时间",
    align: "left",
    scopedSlots: { customRender: "time" },
  },
  {
    title: "状态",
    align: "center",
    dataIndex: "status",
    fixed: "right",
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "在线状态",
    align: "center",
    dataIndex: "online",
    fixed: "right",
    scopedSlots: {
      customRender: "online",
    },
  },
  {
    title: "上级推荐人信息",
    align: "left",
    dataIndex: "relation.superior_user",
    scopedSlots: { customRender: "superior_user" },
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    width: 140,
    scopedSlots: {
      customRender: "actions",
    },
  },
];
export default {
  name: "UserList",
  components: { UserForm, BulkUserForm, ModifyAgent, DistributeLeaflets },
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    this.registerTypeList = registerTypeList;
    return {
      spinning: false,
      columns,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      userList: [],
      total: 0,
      modules: null,
      confirmLoading: false,
      isStatus: 1,
      isVisible: false,
      advanced: false,
      bulkLoading: false,
      isBulkVisible: false,
      bulkModules: null,
      agentAllList: [],
      // agetn
      agentModules: null,
      agentVisible: false,
      agentLoading: false,
      selectedRowKeys: [], // Check here to configure the default column
      // 派单
      leafletsVisible: false,
      leafletsModules: null,
      orderInformation: [],
      shopInfoId: 0
    };
  },
  activated() {
    this._getUserList();
    this.initAgent();
  },
  methods: {
    // 关闭派单弹框
    handelClose() {
      this.leafletsVisible = false;
    },
    // 派单
    handleDistribute(item) {
      this.loading = true
      this.$refs.distributeRef.shopInfoId = item.shop_info.id;
      this.$refs.distributeRef._getStoreList()
      setTimeout(() => {
        this.leafletsVisible = true;
        this.loading = false
      }, 1000)
      // this.leafletsVisible = true
    },
    // 取消派单
    handleLeafletsCancel() {
      this.leafletsVisible = false;
    },

    initAgent() {
      userService.getProxyUserList().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.agentAllList = data.map((item) => {
          return {
            ...item,
            nickname: `昵称：${item.nickname}用户名：${item.username}`,
          };
        });
      });
    },
    handleCreate() {
      this.isVisible = true;
      this.isStatus = 1;
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getUserList();
    },
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this._getUserList();
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getUserList();
    },

    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getUserList();
    },
    _getUserList() {
      this.loading = true;
      this.form.validateFields().then((values) => {
        console.log("==================>values", values);
        values.create_time = this.config?.timeFormat(values.create_time);
        userService
          .getUserList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code === 200) {
              this.userList = data?.list;
              this.total = data?.total;
              setTimeout(() => {
                this.$forceUpdate();
              }, 500);
            } else {
              this.$message.error(msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    handleUpdate(item) {
      this.isStatus = 2;
      this.modules = {
        id: item.id,
        nickname: item.nickname,
        username: item.username,
        reg_type: item.reg_type,
        is_recharge: item.is_recharge,
        is_login: item.is_login,
        is_withdrawal: item.is_withdrawal,
        is_buy: item.is_buy,
        remarks: item.remarks,
        password: "",
        agent_id: item?.relation?.agent_id,
        withdrawal_limit: item.withdrawal_limit,
      };
      this.isVisible = true;
    },
    banUser(item) {
      this.loading = true;
      userService
        .banUser({
          id: item.id,
          status: item.status === 0 ? 1 : 0,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code === 200) {
            this.$message.success(`${item.status === 1 ? "禁用" : "启用"}成功`);
            this._getUserList();
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.staffForm.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs?.staffForm?.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            delete values.id;
            userService
              .createUser({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code === 200) {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getUserList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            userService
              .updateUser({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code === 200) {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getUserList();
                } else {
                  this.$message.error(msg);
                }
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
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleFunding(id) {
      this.$router.push({
        path: `/funding/details?id=${id}&type=1`,
      });
    },
    handleIntegral(id) {
      this.$router.push({
        path: `/funding/details?id=${id}&type=2`,
      });
    },
    // 佣金详情
    handleCommission(id){
      this.$router.push({
        path: `/commission/details?id=${id}`,
      });
    },
    handleBulkUser() {
      this.isBulkVisible = true;
      // bulkUser
    },
    bulkCancel() {
      this.isBulkVisible = false;
      this.$refs?.bulkRef?.form.resetFields();
    },
    bulkOk() {
      const form = this.$refs?.bulkRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          this.bulkLoading = true;
          userService
            .bulkUser({ ...values })
            .then((res) => {
              this.bulkLoading = false;
              const { code, msg } = res.data;
              if (code === 200) {
                this.$message.success("批量操作成功");
                this.isBulkVisible = false;
                form.resetFields();
                this._getUserList();
              } else {
                this.$message.error(msg);
              }
            })
            .catch((err) => {
              this.$message.error(err);
              this.bulkLoading = false;
            });
        } else {
          this.bulkLoading = false;
        }
      });
    },
    handleKick(id) {
      userService
        .kickUser({
          id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success("踢出成功");
          this._getUserList();
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    
    handleAgent() {
      if (this.selectedRowKeys.length === 0)
        return this.$message.info("请先选择用户");
      this.agentVisible = true;
    },
    bulkCancelAgent() {
      this.agentVisible = false;
      this.$refs?.agentRef?.form.resetFields();
    },
    bulkOkAgent() {
      this.agentLoading = true;
      const form = this.$refs.agentRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          userService
            .modifyAgent({ ...values, ids: this.selectedRowKeys })
            .then((res) => {
              this.agentLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) return this.$message.error(msg);
              this.$message.success("批量修改成功");
              this.agentVisible = false;
              this.selectedRowKeys = [];
              this._getUserList();
              form.resetFields();
            })
            .catch((err) => {
              this.$message.error(err);
              this.agentLoading = false;
            });
        } else {
          this.agentLoading = false;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
