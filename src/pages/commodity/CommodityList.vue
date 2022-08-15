<template>
  <a-spin :spinning="spinning">
    <a-card>
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="商品名称"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    v-decorator="['name']"
                    allowClear
                    placeholder="请输入商品名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="商品类别"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="商品类别" v-decorator="['cid']">
                    <a-select-option
                      :value="item.id"
                      v-for="item in categoryList"
                      :key="item.id"
                      >{{ item.category_zh }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="商品价格"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input
                    placeholder="请输入商品价格"
                    allowClear
                    v-decorator="['price']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="状态"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-select placeholder="状态 " v-decorator="['status']">
                    <a-select-option value="0">禁用</a-select-option>
                    <a-select-option value="1">启用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
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
      <a-space size="large">
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </a-space>
      <div style="height: 10px"></div>
      <a-table
        :columns="columns"
        :dataSource="commodityList"
        :loading="loading"
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
        <template slot="images" slot-scope="images">
          <img
            :src="baseUrl + '/' + images"
            alt=""
            srcset=""
            style="width: 40px; height: 40px"
            @click="blackImage(baseUrl + '/' + images)"
          />
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'red' : 'green'">{{
            status === 1 ? "启用" : "禁用"
          }}</a-tag>
        </span>
        <span slot="createdTime" slot-scope="time">
          {{ time | formDate }}
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="middle">
            <a @click="handleUpdate(item)">
              <a-icon type="edit"></a-icon>
              编辑
            </a>
            <a-popconfirm
              title="你确认要删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirm(item)"
              @cancel="cancel(item)"
            >
              <a href="#"><a-icon type="delete" />删除</a>
            </a-popconfirm>

            <!-- <a @click="handleRelease(item)">发布</a>
            <a @click="handleNewcomers(item)">新人专享</a> -->
          </a-space>
        </template>
        <template slot="categoryType" slot-scope="item">
          <span>{{ item.category }}[{{ item.category_zh }}]</span>
        </template>
      </a-table>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previImages" />
      </a-modal>
      <release-form
        :isVisible="isVisible"
        :loading="confirmLoading"
        @cancel="handleCancels"
        @ok="handleSubmit"
        ref="releaseRef"
        :modules="modules"
        :totalMoney="totalMoney"
        :cTypeId="cTypeId"
      />
      <!-- 新人专享 -->
      <create-exclusively
        :exclusivelyVisible="exclusivelyVisible"
        :exclusivelyLoading="exclusivelyLoading"
        :exclusivelyModules="exclusivelyModules"
        @cancel="exclusivelyHandleCancels"
        @ok="exclusivelyHandleSubmit"
        ref="exclusRef"
        :goodMoneys="goodMoneys"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { commodityService } from "@/services";
import ReleaseForm from "./components/ReleaseForm.vue";
import CreateExclusively from "./components/CreateExclusively.vue";

export default {
  components: { ReleaseForm, CreateExclusively },
  name: "CommodityList",
  data() {
    const columns = [
      {
        title: "#",
        dataIndex: "id",
        align: "center",
      },
      {
        title: "商品名称",
        dataIndex: "name",
        align: "center",
        ellipsis: true,
        customRender: (text) => {
          return {
            children: (
              <a-tooltip placement="top">
                <template slot="title">{text}</template>
                <div class="title-text">{text}</div>
              </a-tooltip>
            ),
          };
        },
      },
      {
        title: "商品类别",
        dataIndex: "category",
        align: "center",
        scopedSlots: {
          customRender: "categoryType",
        },
      },
      {
        title: "商品首图",
        dataIndex: "picture",
        align: "center",
        scopedSlots: { customRender: "images" },
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        align: "center",
        scopedSlots: { customRender: "createdTime" },
      },
      {
        title: "商品价格",
        dataIndex: "price",
        align: "center",
      },
      {
        title: "商品库存",
        dataIndex: "stock",
        align: "center",
      },

      {
        title: "状态",
        dataIndex: "status",
        align: "center",
        scopedSlots: { customRender: "status" },
      },
      {
        title: "操作",
        align: "center",
        scopedSlots: { customRender: "actions" },
      },
    ];
    return {
      spinning: false,
      columns,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      commodityList: [],
      total: 0,
      advanced: false,
      previewVisible: false,
      previImages: "",
      baseUrl: "",
      categoryList: [],

      isVisible: false,
      confirmLoading: false,
      modules: null,
      totalMoney: 0,
      goodsId: "",
      cTypeId: 0,
      // 新人专享
      exclusivelyVisible: false,
      exclusivelyLoading: false,
      exclusivelyModules: null,
      goodsIdNovice: "",
      goodMoneys: "",
    };
  },
  activated() {
    this._getCommodityList();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    this._getCategoryList();
  },
  methods: {
    confirm(item) {
      // console.log("点击确定",item);
      commodityService
        .deleteCommodity({
          id: item.id,
        })
        .then((res) => {
          this._getCommodityList();
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.error(msg);
          }
        });
    },
    cancel(item) {
      console.log("点击取消", item);
      this.$message.error("You clicked Cancel");
    },
    _getCategoryList() {
      commodityService
        .getCategoryList({
          page: 1,
          limit: 100,
        })
        .then((res) => {
          // console.log("================================================================>res", res);
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.categoryList = data;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    _getCommodityList() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        commodityService
          .getCommodityList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, data, msg } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.commodityList = data.list;
              this.total = data.total;
            }
          })
          .catch((err) => {
            this.$message.error(err);
            this.loading = false;
          });
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getCommodityList();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getCommodityList();
    },
    handleCreate() {
      this.$router.push({
        path: `/add/commodity?status=1`,
      });
    },
    handleSearch() {
      this._getCommodityList();
    },
    handleReset() {
      this.form.resetFields();
      this.pageIndex = 1;
      this._getCommodityList();
    },
    blackImage(url) {
      this.previImages = url;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handleUpdate(item) {
      this.$router.push({
        path: `/add/commodity?status=2&id=${item.id}`,
      });
    },
    // 发布
    // handleRelease(item) {
    //   console.log("==================>item", item);
    //   this.goodsId = item.id;
    //   this.totalMoney = Number(item?.price);
    //   this.cTypeId = item.cid;
    //   this.isVisible = true;
    // },
    handleSubmit() {
      this.confirmLoading = true;
      const form = this.$refs.releaseRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (values?.control_number === 1) {
            this.confirmLoading = false;
            return this.$message.error("控奖序号不能为1");
          }
          this.cTypeId === 12 ? (values.zone_id = 1) : null;
          commodityService
            .release({ ...values, goods_id: this.goodsId })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) {
                this.$message.error(msg);
              } else {
                this.$message.success("发布成功");
                this._getCommodityList();
                form.resetFields();
                this.isVisible = false;
              }
            })
            .catch((error) => {
              this.$message.error(error);
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancels() {
      this.isVisible = false;
      this.$refs.releaseRef.form.resetFields();
    },
    // 新人专享
    // handleNewcomers(item) {
    //   console.log("==================>item", item);
    //   // this.exclusivelyModules = {
    //   //   goods_id: item.id,
    //   // };
    //   this.goodMoneys = item?.price;
    //   this.goodsIdNovice = item.id;
    //   this.exclusivelyVisible = true;
    // },
    exclusivelyHandleCancels() {
      this.exclusivelyVisible = false;
      this.$refs.exclusRef.form.resetFields();
    },
    exclusivelyHandleSubmit() {
      const form = this.$refs.exclusRef.form;
      this.exclusivelyLoading = true;
      form.validateFields((error, values) => {
        if (!error) {
          commodityService
            .getCreateExclusivelyNewcomers({
              goods_id: this.goodsIdNovice,
              ...values,
            })
            .then((res) => {
              this.exclusivelyLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) return this.$message.error(msg);
              form.resetFields();
              this.$message.success("成功");
              this.exclusivelyVisible = false;
              this._getCommodityList();
            })
            .catch((err) => {
              this.$message.error(err);
              this.exclusivelyLoading = false;
            });
        } else {
          this.exclusivelyLoading = false;
        }
      });
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

.title-text {
  max-width: 200px;
  text-align: center;
  // overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
