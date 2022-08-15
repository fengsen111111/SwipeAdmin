<template>
  <a-card>
    <!-- 新增按钮 -->
    <a-button type="primary" @click="handleCreate" style="margin-bottom: 10px">
      <a-icon type="plus"></a-icon>
      新增
    </a-button>
    <!-- 列表 -->
    <a-table
      :columns="columns"
      :data-source="popularList"
      :rowKey="(record) => record.id"
      :scroll="{ x: 'max-content' }"
      bordered
      :loading="loading"
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
      <!-- 图片插槽处理 -->
      <div
        slot="icon"
        slot-scope="item"
        style="display: flex; justify-content: center"
      >
        <div style="width: 40px; height: 40px">
          <img style="width: 100%; height: 100%" alt="" srcset="" :src="baseUrl + '/' + item" />
        </div>
      </div>
      <!-- 状态 -->
      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 0" color="red">不显示</a-tag>
        <a-tag v-else-if="status === 1" color="green">显示</a-tag>
      </span>
      <!-- 操作 -->
      <div slot="actions" slot-scope="item">
        <a @click="handleUpdate(item)"> <a-icon type="edit"></a-icon>编辑</a>
        <a-popconfirm
          :title="`你确定要删除吗?`"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDelete(item)"
        >
          <a><a-icon type="delete" />删除</a>
        </a-popconfirm>
      </div>
    </a-table>
    <!-- 增加修改弹出表单 -->
    <popular-stores-form 
        ref="popularRef" 
        :isVisible="visible"
        :loading="confirmLoading"
        :modules="modules"
        @cancel="handleCancel"
        @ok="handleOk"
        :isStatus="isStatus"
    />
  </a-card>
</template>

<script>
import { operationService } from "@/services";
import PopularStoresForm from './components/PopularStoresForm.vue';
const columns = [
        {
            title: "id",
            dataIndex: "id",
            align: "center",
        },
        {
            title: "店铺名字",
            dataIndex: "name",
            align: "center",
        },
        {
            title: "店铺等级",
            dataIndex: "grade",
            align: "center",
        },
        {
            title: "店铺LOGO",
            dataIndex: "img",
            align: "center",
            scopedSlots: { customRender: "icon" },
        },
        {
            title: "24小时收益",
            dataIndex: "profit",
            align: "center",
        },
        {
            title: "24小时订单数",
            dataIndex: "order_num",
            align: "center",
        },
        {
            title: "发货及时率",
            dataIndex: "promptness",
            align: "center",
        },
        {
            title: "好评率",
            dataIndex: "praise",
            align: "center",
        },
        {
            title: "排序权重",
            dataIndex: "sort",
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
            dataIndex: "",
            align: "center",
            scopedSlots: { customRender: "actions" },
            fixed: "right",
        },
        ];
export default {
    components: { PopularStoresForm },
    name: "PopularStores",
    data() {
        return {
        columns: columns,
        popularList: [],
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        baseUrl: "",
        visible: false,
        confirmLoading: false,
        modules: null,
        isStatus: 1 ,
        };
    },
    created() {
        this._getStoreList();
    },
    methods: {
        // 获取店铺列表
        _getStoreList() {
        this.loading = true;
        operationService
            .getStoreList({
            page: this.pageIndex,
            limit: this.pageSize,
            })
            .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            
            if (code !== 200) {
                this.$message.error(msg);
            } else {
                this.popularList = data.list;
                this.total = data.total;
            }
            })
            .catch((err) => {
            this.loading = false;
            this.$message.error(err);
            });
        },
        //新增
        handleCreate() {
            this.$refs.popularRef.form.resetFields();
            this.$refs.popularRef.imageUrl = "";
            this.visible = true
            this.isStatus = 1;

        },
        // 取消
        handleCancel() {
            this.visible = false;
            this.$refs.popularRef.form.resetFields();
            this.$refs.popularRef.imageUrl = "";
        },
        // 确定
        handleOk() {
            this.confirmLoading = true;
            const form = this.$refs.popularRef.form;
            form.validateFields((error,values) => {
                if(!error) {
                    if(values.img){
                        if (typeof values?.img !== "string") {
                            values.img = values?.img.file
                            ? values?.img?.file?.response?.data?.img_path
                            : this.imageUrl;
                        }
                    }
                    // 为新增时候
                    if(this.isStatus === 1){
                        operationService
                            .createNewStore({
                                ...values
                            })
                            .then((res) => {
                                this.confirmLoading = false;
                                const { code, msg } = res.data;
                                if(code !== 200){
                                    this.$message.error(msg);
                                } else {
                                    this.$message.success("添加成功");
                                    form.resetFields();
                                    this.visible = false;
                                    this._getStoreList()
                                }
                            })
                    } else {
                        // 为修改时候
                        operationService
                            .setEditStore({
                                ...values
                            })
                            .then((res) => {
                                this.confirmLoading = false;
                                const { code, msg } = res.data;
                                if(code !== 200){
                                    this.$message.error(msg);
                                } else {
                                    this.$message.success("修改成功");
                                    form.resetFields();
                                    this.visible = false;
                                    this._getStoreList()
                                }
                            })
                    }
                } else {
                    this.confirmLoading = false;
                }    
            })
        },
        // 编辑
        handleUpdate(item) {
            this.isStatus = 2;
            delete item.created_at;
            delete item.updated_at;
            this.modules = {
            ...item,
            };
            this.$refs.popularRef.imageUrl = this.baseUrl + "/" + item.img;
            this.imageUrl = item.img;
            this.visible = true;
        },
        // 删除
        handleDelete(item) {
            operationService
                .deleteStore({
                    id:item.id
                })
                .then((res) => {
                    const { code , msg } = res.data
                    if(code !== 200){
                        this.$message.error(msg);
                    } else {
                        this.$message.success("删除成功");
                        this._getStoreList()
                    }
                })
                .catch((error) => {
                    this.$message.error(error);
                });
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

    <style lang="scss" scoped></style>
