<template>
  <a-spin :spinning="spinning">
    <a-card>
      <slot name="title">
        <a-button
          type="primary"
          style="margin-bottom: 10px"
          @click="handleCreate"
        >
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </slot>
      <a-table
        :columns="columns"
        :data-source="cityLists"
        :loading="loading"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id"
        bordered
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
        <span slot="agentType" slot-scope="agent">
          <a-tag color="blue" v-if="agent === 2">城市邦代理</a-tag>
          <a-tag color="green" v-else-if="agent === 3">城市市代理</a-tag>
          <a-tag color="purple" v-else>城市区代理</a-tag>
        </span>
        <span slot="isCanShipment" slot-scope="isCanShipment">
          <a-tag :color="isCanShipment === 0 ? 'red' : 'green'">{{
            isCanShipment === 0 ? "否" : "是"
          }}</a-tag>
        </span>
        <span slot="shoppingCommissionType" slot-scope="shoppingCommissionType">
          <a-tag color="blue" v-if="shoppingCommissionType === 0">
            按比例
          </a-tag>
          <a-tag color="green" v-else-if="shoppingCommissionType === 1">
            固定金额
          </a-tag>
        </span>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
            status === 0 ? "禁用" : "启用"
          }}</a-tag>
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleUpdate(item)">
              <a-icon type="edit"></a-icon>
              编辑
            </a>
            <a-popconfirm
              :title="`你确定要${item.status === 1 ? '封禁' : '解封'}吗?`"
              ok-text="确定"
              cancel-text="取消"
              @confirm="banRecord(item)"
            >
              <a>
                {{ item.status === 1 ? "封禁" : "解封" }}
              </a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>

      <city-form
        :isVisible="isVisible"
        :loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :isStatus="isStatus"
        ref="cityRef"
        :modules="modules"
        :message="message"
        @updateStatus="updateStatus"
        :showCity="showCity"
      />
    </a-card>
  </a-spin>
</template>

<script>
import CityForm from "./components/CityForm.vue";
import { actingService } from "@/services";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "代理类型",
    dataIndex: "agent_type",
    scopedSlots: { customRender: "agentType" },
    align: "center",
  },
  {
    title: "是否可发货",
    dataIndex: "city_agent_detail.is_can_shipment",
    scopedSlots: { customRender: "isCanShipment" },
    align: "center",
  },
  {
    title: "每笔发货佣金类型",
    dataIndex: "city_agent_detail.shopping_commission_type",
    align: "center",
    scopedSlots: { customRender: "shoppingCommissionType" },
  },
  {
    title: "额外佣金",
    dataIndex: "city_agent_detail.commission_rate",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "所属邦代理",
    dataIndex: "city_agent_detail.city_one_id",
    align: "center",
  },
  {
    title: "所属市代理",
    dataIndex: "city_agent_detail.city_two_id",
    align: "center",
  },
  {
    title: "所属区代理",
    dataIndex: "city_agent_detail.city_three_id",
    align: "center",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  components: { CityForm },
  name: "CityAgent",
  data() {
    return {
      confirmLoading: false,
      isVisible: false,
      isStatus: 1,
      modules: null,
      loading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      cityLists: [],
      columns,
      message: "",
      showCity: true,
      spinning: false,
    };
  },
  created() {
    this._getCityList();
  },
  methods: {
    _getCityList() {
      actingService
        .getCityList({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.cityLists = data.list;
            this.total = data.total;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error);
        });
    },
    handleCreate() {
      this.isVisible = true;
      this.isStatus = 1;
      this.showCity = true;
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.cityRef.form.resetFields();
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.cityRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          const {
            nickname,
            password,
            username,
            agent_type,
            commission_rate,
            shopping_commission_type,
            is_can_shipment,
            agent_type_type,
            // Add
            city_one_id,
            city_two_id,
            city_three_id,
            id,
          } = values;
          if (this.isStatus === 1) {
            const cityFormDate = [
              values.cityId1,
              values.cityId2,
              values.cityId3,
            ];
            const result = cityFormDate.filter(Boolean);
            const city_id = result[result.length - 1];
            const params = {
              nickname,
              password,
              username,
              agent_type,
              commission_rate,
              shopping_commission_type,
              is_can_shipment,
              agent_type_type,
              // Add
              city_one_id,
              city_two_id,
              city_three_id,
              city_id,
            };
            actingService
              .createCity(params)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  this.confirmLoading = false;
                  this, this._getCityList();
                  form.resetFields();
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          } else {
            const cityFormDate = [
              values.cityId1,
              values.cityId2,
              values.cityId3,
            ];
            const result = cityFormDate.filter(Boolean);
            const city_id = result[result.length - 1];
            const params = {
              id,
              nickname,
              password,
              username,
              agent_type,
              commission_rate,
              shopping_commission_type,
              is_can_shipment,
              agent_type_type,
              // Add
              city_one_id,
              city_two_id,
              city_three_id,
              city_id,
            };
            password ? password : delete params.password;
            actingService
              .updateCity(params)
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");

                  this, this._getCityList();
                  this.isVisible = false;
                  this.confirmLoading = false;
                  form.resetFields();
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getCityList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getCityList();
    },
    handleUpdate(item) {
      this.loading = true;
      this.isStatus = 2;
      this.showCity = false;
      const {
        id,
        nickname,
        username,
        agent_type,
        city_agent_detail,
        agent_type_type,
      } = item;
      actingService
        .getCityDetails({
          id,
        })
        .then((res) => {
          this.loading = false;
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.isVisible = true;
            this.message = data;
            this.modules = {
              id,
              nickname,
              password: "",
              username,
              agent_type,
              commission_rate: city_agent_detail?.commission_rate,
              shopping_commission_type:
                city_agent_detail?.shopping_commission_type,
              is_can_shipment: city_agent_detail?.is_can_shipment,
              agent_type_type,
            };
            this.$refs.cityRef.cityType = agent_type;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error);
        });
    },
    updateStatus() {
      console.log("===========>123", 123);
      this.showCity = true;
    },
    banRecord(item) {
      this.spinning = true;
      actingService
        .banCity({
          id: item.id,
          status: item?.status === 1 ? 0 : 1,
        })
        .then((res) => {
          const { code, msg } = res.data;
          this.spinning = false;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("操作成功");
            this._getCityList();
          }
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
