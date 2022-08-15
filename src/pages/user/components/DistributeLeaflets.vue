<template>
  <a-modal
    :visible="visible"
    :width="1200"
    :footer="null"
    @cancel="
      () => {
        $emit('handelClose');
      }
    "
  >
    <template #title>
      <a-row>
        <a-col :md="2" :sm="24">
          <a-button type="primary" @click="handleDispatch" :disabled="!hasSelected" style="margin-top:4px;">
            执行派单
          </a-button>
        </a-col>

        <a-col :md="8" :sm="24">
          <a-form layout="horizontal" :form="form" ref="searchRef">
              <a-form-item label="物流模板" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15, offset: 0 }">
                  <a-select placeholder="请选择" v-decorator="['logistics_id']">
                      <a-select-option :value="item.id" :key="item.id" v-for="item in registerTypeList">{{ item.title }}
                      </a-select-option>
                  </a-select>
              </a-form-item>
          </a-form>  
        </a-col>

      

      </a-row>
    </template>

    

    <a-table
      :columns="columns"
      :data-source="dispatchList"
      :rowKey="(record) => record.id"
      bordered
      :scroll="{ x: 'max-content' }"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :loading="loadings"
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
      <!-- 商品名字 -->
      <template slot="goodsName" slot-scope="item">
        <div class="text-overflow event-name">{{ item }}</div>
      </template>
      <!-- 零售价 -->
      <template slot="retail" slot-scope="item">
        <div style="color:red" v-if="item.retail_price > item.guide_price">
          {{ item.retail_price }}
        </div>
        <div style="color:green" v-else>{{ item.retail_price }}</div>
      </template>
      <!-- 图片 -->
      <template
        slot="images"
        slot-scope="item"
        style="position:relative;z-index:999;"
      >
        <div style=" width:40px;height:40px;">
          <img
            :src="item"
            @click="previewImg(item)"
            style="width: 100%; height: 100%; "
          />
        </div>
      </template>
      <!-- 输入框 -->
      <template slot="amount" slot-scope="text, record, index">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChangeIndex(e.target.value, index, 'amount')"
        />
        <template v-else>{{ text }}</template>
      </template>
      <!-- 操作 -->
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a-space size="middle">
              <a @click="() => save(index)">保存</a>
              <a-popconfirm
                title="确定取消吗?"
                @confirm="() => delRowIndex(index)"
              >
                <a>取消</a>
              </a-popconfirm>
            </a-space>
          </span>

          <span v-else>
            <a @click="() => editRowIndex(index)">编辑</a>
          </span>
        </div>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { storeManageService } from "@/services";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "进货价",
    dataIndex: "cost_price",
    align: "center",
  },
  {
    title: "官方指导价",
    dataIndex: "guide_price",
    align: "center",
  },
  {
    title: "零售价",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "retail" },
  },
  {
    title: "输入商品数量",
    dataIndex: "amount",
    align: "center",
    scopedSlots: { customRender: "amount" },
  },

  {
    title: "状态",
    dataIndex: "status",
    align: "center",
  },

  {
    title: "商品首图",
    dataIndex: "picture",
    align: "center",
    scopedSlots: { customRender: "images" },
  },
  {
    title: "商品名称",
    dataIndex: "name",
    align: "center",
    width: "120px",
    scopedSlots: { customRender: "goodsName" },
  },
  {
    title: "商品库存",
    dataIndex: "stock",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "operation" },
    fixed: "right",
  },
];
export default {
  name: "DistributeLeaflets",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      dispatchList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      loadings: false,
      selectedRowKeys: [],
      selectedRows: null,
      editingKey: "",
      form: this.$form.createForm(this),
      shopInfoId: 0,
      retailColor: "red",
      registerTypeList:[],
    };
  },
  activated() {
    if (this.shopInfoId) {
      this._getStoreList();
    }
  },
  created() {
    this.$watch("visible", () => {
      if (!this.visible) {
        this.selectedRowKeys = [];
      }
    });
  },
  computed: {
    /* 选中是否大于0 */
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    // 获取任务列表
    _getStoreList() {
      this.loadings = true;
      storeManageService
        .getDistributeList({
          id: this.shopInfoId,
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loadings = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.dispatchList = data.list;
            this.total = data.total;
            this._getLogisticsTemplate(this.shopInfoId)
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    // 物流模板
    _getLogisticsTemplate(item){
        storeManageService
            .getLogisticsTemplate({
              id:item
            })
            .then((res) => {
              const { code, msg, data } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.registerTypeList = data;
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error(err);
            });
    },
    /* 执行派单 */
    handleDispatch() {
      this.form.validateFields((_,value) => {
        
        storeManageService
          .caretDistribute({
            order_list: this.selectedRows.map((item) => {
              return {
                product_id: item.id,
                amount: item.amount,
              };
            }),
            shop_id: this.shopInfoId,
            logistics_id:value.logistics_id,
          })
          .then((res) => {
            const { code, msg } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.$message.success("派单成功");
              this.form.resetFields();
              this.selectedRowKeys = [];
              this._getStoreList();
              this.$emit("handelClose");
            }
          });

      })
      
    },
    // 输入框事件
    handleChangeIndex(value, key, column) {
      const dataSource = [...this.dispatchList];
      const target = dataSource[key];
      if (target) {
        target[column] = value;
        this.dispatchList = dataSource;
      }
    },
    // 保存
    save(key) {
      console.log(key);
      const newData = [...this.dispatchList];
      const target = newData[key];
      if (target) {
        target.editable = false;
        delete target.editable;
        delete target.isAdd;
        this.dispatchList = newData;
      }
    },
    // 取消
    delRowIndex(key) {
      const newData = [...this.dispatchList];
      const target = newData[key];
      console.log(newData[key]);
      if (target) {
        // newData.splice(key, 0);
        newData[key].editable = false;
        delete target.editable;
      }
      this.dispatchList = newData;
    },
    // 查询
    handleSearch() {},
    // 重置
    handleReset() {},
    // 编辑
    editRowIndex(key) {
      const newData = [...this.dispatchList];
      const target = newData[key];
      if (target) {
        target.editable = true;
        this.dispatchList = newData;
      }
    },
    // 选中勾线之后信息
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    // 放大图片
    previewImg(url) {
      this.$hevueImgPreview(url);
    },
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getStoreList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getStoreList();
    },
  },
};
</script>

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
