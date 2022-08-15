<template>
  <a-card>
    <!-- 新增按钮 -->
    <a-button type="primary" @click="handleCreate" style="margin-bottom: 10px">
      <a-icon type="plus"></a-icon>
      添加
    </a-button>
    <!-- 等级列表 -->
    <a-table :columns="columns" :data-source="storeLevelList" :rowKey="(record) => record.id"
      :scroll="{ x: 'max-content' }" bordered :loading="loading" :pagination="{
        current: pageIndex,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }">
      <!-- 图片 -->
      <!-- <div
        slot="logo"
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
      </div> -->
      <!-- 图片 -->
      <template slot="images" slot-scope="item">
        <div style=" width:40px;height:40px;">
          <img :src="item" @click="previewImg(item)" style="width: 100%; height: 100%;" />
        </div>
      </template>

      <!-- 段位 -->
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 1" color="Black">黑铁</a-tag>
        <a-tag v-else-if="type === 2" color="Cyan">钻石</a-tag>
        <a-tag v-else-if="type === 3" color="Gold">皇冠</a-tag>
      </span>
      <!-- 时间 -->
      <span slot="create_time" slot-scope="create_time">
        {{ create_time | formDate }}
      </span>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a @click="handleUpdate(item)">
          <a-icon type="edit"></a-icon>修改
        </a>
        <!-- <a-popconfirm
          :title="`你确定要删除吗?`"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDelete(item)"
        >
          <a><a-icon type="delete" />删除</a>
        </a-popconfirm> -->
      </div>
    </a-table>

    <!-- 弹窗表单 -->
    <store-level-form ref="storeLevelRrf" :isVisible="visible" :loading="confirmLoading" :modules="modules"
      @cancel="handleCancel" @ok="handleOk" :isStatus="isStatus" />
  </a-card>
</template>

<script>
import { storeManageService } from "@/services";
import StoreLevelForm from "./components/StoreLevelForm.vue";
const columns = [
  {
    title: "id",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "LOGO",
    dataIndex: "logo",
    align: "center",
    scopedSlots: { customRender: "images" },
  },
  {
    title: "订单数量",
    dataIndex: "order_num",
    align: "center",
  },
  {
    title: "发货率",
    dataIndex: "shipment_rate",
    align: "center",
  },
  {
    title: "营业额",
    dataIndex: "operate_amount",
    align: "center",
  },
  {
    title: "体验时间",
    dataIndex: "experience_time",
    align: "center",
  },
  {
    title: "佣金比例",
    dataIndex: "commission_rate",
    align: "center",
  },
  {
    title: "保证金",
    dataIndex: "security_deposit",
    align: "center",
  },
  {
    title: "段位",
    dataIndex: "type",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "等级",
    dataIndex: "level",
    align: "center",
  },
  {
    title: "可选商品数量",
    dataIndex: "goods_num",
    align: "center",
  },
  {
    title: "可选商品id",
    dataIndex: "goods_info",
    align: "center",
    // scopedSlots: { customRender: "storeId" },
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "修改时间",
    dataIndex: "update_time",
    align: "center",
    scopedSlots: { customRender: "create_time" },
  },
  // {
  //   title: "删除时间",
  //   dataIndex: "delete_time",
  //   align: "center",
  // },
  {
    title: "操作",
    dataIndex: "",
    align: "center",
    scopedSlots: { customRender: "actions" },
    fixed: "right",
  },
];
export default {
  components: { StoreLevelForm },
  name: "StoreLevel",
  data() {
    return {
      columns: columns,
      storeLevelList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      baseUrl: "",
      visible: false,
      confirmLoading: false,
      modules: null,
      isStatus: 1,
      idArray: [],
      previImages: "",
      previewVisible: false,
    };
  },
  created() {
    this._getStoreLevelList();
    // this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    // 获取店铺等级列表
    _getStoreLevelList() {
      this.loading = true;
      storeManageService
        .getStoreLevel({
          page: this.pageIndex,
          limit: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            // 处理括号
            data.list.map((item) => {
              item.goods_info = item.goods_info.replace(/^\[+|\]+$/g, "");
              return item;
            });
            this.storeLevelList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    // 新增事件
    handleCreate() {
      this.$refs.storeLevelRrf.form.resetFields();
      this.$refs.storeLevelRrf.imageUrl = "";
      this.visible = true;
      this.isStatus = 1;
    },
    strToArray(str) {
      return eval(str);
    },
    // 修改
    handleUpdate(item) {
      delete item.create_time;
      delete item.delete_time;
      delete item.update_time;
      this.isStatus = 2;
      const resultList = []
      item.goods_info.replace(/\[|\]/g, '').split(',').map(item => {
        resultList.push(parseInt(item))
        return parseInt(item);
      });
      item.goods_info = resultList;
      this.modules = {
        ...item,
      };
      this.$refs.storeLevelRrf.imageUrl = this.baseUrl + "/" + item.logo;
      this.imageUrl = item.logo;
      this.visible = true;
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.$refs.storeLevelRrf.form.resetFields();
      this.$refs.storeLevelRrf.imageUrl = "";
    },
    // 确认
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.storeLevelRrf.form;
      form.validateFields((error, values) => {
        console.log(values);
        // 给可选id添加[]后端接口需要
        values.goods_info = `[${values.goods_info}]`;
        if (!error) {
          // 判断img的地址
          if (values.logo) {
            if (typeof values?.logo !== "string") {
              values.logo = values?.logo.file
                ? values?.logo?.file?.response?.data?.img_path
                : this.imageUrl;
            }
          }
          //为新增时候
          if (this.isStatus === 1) {
            // values.goods_info = values.goods_info.split(',');
            // values.goods_info = `[${values.goods_info}]`
            storeManageService
              .addStoreLevel({
                ...values,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  form.resetFields();
                  this.visible = false;
                  this._getStoreLevelList();
                }
              })
              .catch((err) => {
                this.$message.error(err);
              });
          } else {
            // 为修改
            storeManageService
              .setStoreLevel({
                ...values,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  form.resetFields();
                  this.visible = false;
                  this._getStoreLevelList();
                }
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 放大图片
    previewImg(url) {
      this.$hevueImgPreview(url);
    },
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getStoreLevelList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getStoreLevelList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
