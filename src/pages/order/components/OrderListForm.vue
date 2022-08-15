<template>
  <!-- <a-spin :spinning="spinning"> -->
  <a-modal
    v-drag-modal
    :visible="isVisible"
    title="订单详情"
    :confirmLoading="loading"
    :width="1200"
    :footer="null"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <!-- 操作 -->
    <a-dropdown :disabled="!hasSelected" style="margin-bottom:10px">
      <a-menu slot="overlay">
        <a-menu-item key="1">
          <a-popconfirm
            :title="`你确定需要返本吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleReturnOfMultipleProducts"
          >
            <a>返本</a>
          </a-popconfirm>
        </a-menu-item>
        <a-menu-item key="2">
          <a-popconfirm
            :title="`你确定需要返佣吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleReturnOfMultipleCommodities"
          >
            <a>返佣</a>
          </a-popconfirm>
        </a-menu-item>
        <a-menu-item key="3">
          <a-popconfirm
            :title="`是否确认收货?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleConfirmReceiptOfMultipleProducts"
          >
            <a>确认收货</a>
          </a-popconfirm>
        </a-menu-item>
      </a-menu>
      <a-button> 操作 <a-icon type="down" /> </a-button>
    </a-dropdown>

    <a-table
      :columns="columns"
      :data-source="orderList"
      :rowKey="(record) => record.id"
      bordered
      :row-selection="rowSelection"
      :scroll="{ x: 'max-content' }"
      :loading="loadings"
      :pagination="false"
    >
      <!-- 图片插槽处理 -->
      <div
        slot="img"
        slot-scope="item"
        style="display: flex; justify-content: center"
      >
        <div style="width: 40px; height: 40px">
          <img
            style="width: 100%; height: 100%"
            alt=""
            srcset=""
            :src="baseUrl + '/' + item"
          />
        </div>
      </div>
      <!-- 状态 -->
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 1" color="red">待发货</a-tag>
        <a-tag v-else-if="type === 2" color="Cyan">已发货</a-tag>
        <a-tag v-else-if="type === 3" color="green">已完成</a-tag>
        <a-tag v-else-if="type === 4" color="Black">已失效</a-tag>
      </span>
      <!-- 商品名字 -->
      <template slot="goodsName" slot-scope="item">
        <div class="text-overflow event-name">{{ item }}</div>
      </template>
      <!-- 是否返本 -->
      <template slot="is_return_commission" slot-scope="item">
        <div>
          <a-tag :color="item === 1 ? 'green' : 'red'"
            >{{ item === 1 ? "是" : "否" }}
          </a-tag>
        </div>
      </template>
      <!-- 是否返佣 -->
      <template slot="is_return_commission" slot-scope="item">
        <div>
          <a-tag :color="item === 1 ? 'green' : 'red'"
            >{{ item === 1 ? "是" : "否" }}
          </a-tag>
        </div>
      </template>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <template v-if="item.status !== 3">
          <a-space size="large">
            <!-- 确认收货 -->
            <template>
              <a-popconfirm
                :title="`是否确定收货?`"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleConfirmReceiptOfIndividualGoods(item)"
              >
                <a>确定收货</a>
              </a-popconfirm>
            </template>
            <!-- 更多 -->
            <a-dropdown
              v-if="
                item.is_return_original !== 1 && item.is_return_commission !== 1
              "
            >
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                更多 <a-icon type="down"
              /></a>

              <a-menu slot="overlay">
                <!-- 返本 -->
                <a-menu-item v-if="item.is_return_original !== 1">
                  <a-popconfirm
                    :title="`你确定需要返本吗?`"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleReturnOfSingleCommodity(item)"
                  >
                    <a>返本</a>
                  </a-popconfirm>
                </a-menu-item>
                <!-- 返佣 -->
                <a-menu-item v-if="item.is_return_commission !== 1">
                  <a-popconfirm
                    :title="`你确定需要返佣吗?`"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleRebateOfSingleOrder(item)"
                  >
                    <a>返佣</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </div>
    </a-table>
  </a-modal>
  <!-- </a-spin> -->
</template>

<script>
import { orderService } from "@/services";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "amount",
    align: "center",
  },
  {
    title: "单价",
    dataIndex: "price",
    align: "center",
  },
  {
    title: "商品总金额",
    dataIndex: "total_price",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "是否返本",
    dataIndex: "is_return_original",
    align: "center",
    scopedSlots: { customRender: "is_return_commission" },
  },
  {
    title: "是否返佣",
    dataIndex: "is_return_commission",
    align: "center",
    scopedSlots: { customRender: "is_return_commission" },
  },
  {
    title: "商品图片",
    dataIndex: "product_picture",
    align: "center",
    scopedSlots: { customRender: "img" },
  },
  {
    title: "商品名称",
    dataIndex: "product_name",
    align: "center",
    // scopedSlots: { customRender: "goodsName" },
  },

  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  name: "OrderListForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return {
      loadings: false,
      columns,
      orderList: [],
      baseUrl: "",
      selectedRowKeys: [],
      selectedRows: null,
    };
  },
  created() {
    this.$watch("visible", () => {
      if (!this.visible) {
        this.selectedRowKeys = [];
      }
    });
    this.$watch("modules", () => {
      this.orderList = this.modules ? this.modules : [];
    });
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.status === 3,
          },
        }),
      };
    },
    /* 选中是否大于0 */
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    //单个商品返本
    handleReturnOfSingleCommodity(item) {
      this.loadings = true;
      orderService
        .returnOfSingleCommodity({
          id: item.id,
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$emit("updateGoods", this.modules.id);
            this.$message.success("设置返本成功");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //单个订单返佣
    handleRebateOfSingleOrder(item) {
      this.loadings = true;
      orderService
        .rebateOfSingleOrder({
          id: item.id,
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$emit("updateGoods", this.modules.id);
            this.$message.success("设置返佣成功");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //单个商品确认收货
    handleConfirmReceiptOfIndividualGoods(item) {
      this.loadings = true;
      orderService
        .confirmReceiptOfIndividualGoods({
          id: item.id,
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$emit("updateGoods", this.modules.id);
            this.$message.success("确认收货成功");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //多个商品返本
    handleReturnOfMultipleProducts() {
      this.loadings = true;
      orderService
        .returnOfMultipleProducts({
          ids: this.selectedRowKeys.map((it) => {
            return it;
          }),
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$emit("updateGoods", this.modules.id);
            this.$message.success("返本成功");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //多个商品返佣
    handleReturnOfMultipleCommodities() {
      this.loadings = true;
      orderService
        .returnOfMultipleCommodities({
          ids: this.selectedRowKeys.map((it) => {
            return it;
          }),
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$emit("updateGoods", this.modules.id);
            this.$message.success("设置返佣成功");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //多个商品确认收货
    handleConfirmReceiptOfMultipleProducts() {
      this.loadings = true;
      orderService
        .confirmReceiptOfMultipleProducts({
          ids: this.selectedRowKeys.map((it) => {
            return it;
          }),
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$emit("updateGoods", this.modules.id);
            this.$message.success("确认收货成功");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>
0
<style lang="less" scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-name {
  width: 90px;
}
</style>
