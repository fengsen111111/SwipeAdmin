<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal" :form="form" ref="searchRef">
                <div :class="advanced ? null : 'fold'">
                    <a-row>
                        <!-- 用户名 -->
                        <a-col :md="8" :sm="24">
                            <a-form-item label="用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-decorator="['username']" allowClear placeholder="请输入用户名" />
                            </a-form-item>
                        </a-col>
                        <!-- 代理手机号 -->
                        <a-col :md="8" :sm="24">
                            <a-form-item label="代理手机号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-decorator="['agent_username']" allowClear placeholder="请输入代理手机号" />
                            </a-form-item>
                        </a-col>
                        <!-- 代理名称 -->
                        <a-col :md="8" :sm="24">
                            <a-form-item label="代理名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-decorator="['agent_nickname']" allowClear placeholder="请输入代理名称" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <!-- 二排 -->
                    <a-row v-show="advanced">
                        <!-- 店铺名称 -->
                        <a-col :md="8" :sm="24">
                            <a-form-item label="店铺名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-decorator="['shop_name']" allowClear placeholder="请输入店铺名称" />
                            </a-form-item>
                        </a-col>
                        <!-- 店铺状态 -->
                        <a-col :md="8" :sm="24">
                            <a-form-item label="店铺状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="店铺状态" v-decorator="['status']">
                                    <a-select-option value="0"> 审核中</a-select-option>
                                    <a-select-option value="1"> 审核通过</a-select-option>
                                    <a-select-option value="-1"> 驳回审核</a-select-option>
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

        <a-table :columns="columns" :data-source="storeAuditList" :rowKey="(record) => record.shop_id"
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
            <div slot="img" slot-scope="item" style="display: flex; justify-content: center;width: 40px">
                <div style="width: 40px; height: 40px">
                    <img :src="baseUrl + '/' + item" @click="previewImg(baseUrl + '/' + item)"
                        style="width: 100%; height: 100%" />

                </div>
            </div>
            <!-- 身份证 -->
            <div slot="id_card" slot-scope="item" style="display: flex; justify-content: center;width: 40px">
                <div style="width: 40px; height: 40px">
                    <img :src="baseUrl + '/' + item" @click="previewImg(baseUrl + '/' + item)"
                        style="width: 100%; height: 100%" />
                </div>
            </div>
            <!-- 用户信息 -->
            <template slot="userinfo" slot-scope="item">
                <div>
                    <a-tag :color="item | formDateUserColor">
                        {{ item | formDateType }}
                    </a-tag>
                </div>
            </template>
            <!-- 状态 -->
            <span slot="status" slot-scope="status">
                <a-tag v-if="status === 0" color="orange">审核中</a-tag>
                <a-tag v-else-if="status === 1" color="green">审核通过</a-tag>
                <a-tag v-else-if="status === -1" color="red">驳回审核</a-tag>
            </span>
            <!-- 操作 -->
            <div slot="actions" slot-scope="item">
                <a-space size="large">
                    <a @click="handleDetails(item)">
                        <a-icon type="edit"></a-icon>详情
                    </a>
                    <a @click="handleTopShelf(item)">
                        已上架</a>
                </a-space>
            </div>
            <!-- 时间 -->
            <span slot="create_time" slot-scope="create_time">
                {{ create_time | formDate }}
            </span>
        </a-table>
        <!-- 店铺详情 -->
        <div>
            <a-drawer title="店铺详情" :placement="placement" :closable="false" :visible="is_visible" @close="onClose"
                width="300px">
                <div v-if="modules">
                    <img style="width: 80px;height: 80px;margin-left: 90px;" alt="" srcset=""
                        :src="baseUrl + '/' + modules.shop_logo" />
                    <p class="title"><b>店铺名称：</b>{{ modules.shop_name }}</p>
                    <p><b>店铺待发货订单数：</b>{{ modules.to_be_shipped_order_number }}</p>
                    <p><b>店铺已发货订单数：</b>{{ modules.shipped_order_number }}</p>
                    <p><b>店铺已完成订单数：</b>{{ modules.completed_order_number }}</p>
                    <p><b>店铺已失效订单数：</b>{{ modules.expired_order_number }}</p>
                    <p><b>店铺发货率：</b>{{ modules.shipment_rate }}</p>
                    <p><b>店铺等级：</b>{{ modules.level }}</p>
                    <p><b>店铺总营业额：</b>{{ modules.cl_buy }}</p>
                    <p><b>店铺总佣金：</b>{{ modules.cl_commission }}</p>
                </div>
            </a-drawer>
        </div>
        <!-- 店铺详情 end -->
        <StoreListForm :visible="visible" :loading="confirmLoading" @cancel="handleCancel" :modules_two="modules_two" />
    </a-card>
</template>

<script>
import { storeManageService } from "@/services";
import StoreListForm from "./components/StoreListForm.vue";
import { formDateType, formDateUserColor } from "@/utils/filters";
const columns = [
    {
        title: "id",
        dataIndex: "shop_id",
        align: "center",
    },
    {
        title: "店铺名称",
        dataIndex: "shop_name",
        align: "center",
    },
    {
        title: "用户名",
        dataIndex: "username",
        align: "center",
    },
    {
        title: "代理名称",
        dataIndex: "agent_nickname",
        align: "center",
    },
    {
        title: "代理手机号",
        dataIndex: "agent_username",
        align: "center",
    },
    {
        title: "总代用户名",
        dataIndex: "master_agent_username",
        align: "center",
    },
    {
        title: "用户余额",
        dataIndex: "balance",
        align: "center",
    },
    {
        title: "店铺发货率",
        dataIndex: "shipment_rate",
        align: "center",
    },
    {
        title: "店铺等级",
        dataIndex: "shop_level",
        align: "center",
    },
    {
        title: "店铺已上架商品数",
        dataIndex: "shop_putaway_good_sum",
        align: "center",
    },
    {
        title: "店铺总佣金",
        dataIndex: "cl_commission",
        align: "center",
    },
    {
        title: "店铺logo",
        dataIndex: "shop_logo",
        align: "center",
        scopedSlots: { customRender: "img" },
    },
    {
        title: "身份证",
        dataIndex: "id_card",
        align: "center",
        scopedSlots: { customRender: "id_card" },
    },
    {
        title: "店铺状态",
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
    components: { StoreListForm },
    filters: {
        formDateType,
        formDateUserColor,
    },
    name: "StoreAudit",
    data() {
        return {
            // 图片点击放大
            previImages: "",
            img: "",

            // 抽屉
            is_visible: false,//店铺详情打开/关闭
            placement: 'right',//抽屉弹出方向
            columns: columns,//表头数据
            storeAuditList: [],//表单数据
            loading: false,//加载动画
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            baseUrl: "",//图片地址   ""
            confirmLoading: false,//店铺详情动画的开关
            visible: false,//店铺详情是否打开
            modules: null,
            is_auto_examine: false,
            form: this.$form.createForm(this),
            advanced: false,
            modules_two: null//已上架商品传值
        };
    },
    activated() {
        this._getStoreAuditList();
    },
    created() {
        this.$watch("is_auto_examine", () => { });
    },
    methods: {
        previewImg(url) {
            this.$hevueImgPreview(url)
        },
        //已上架
        handleTopShelf(item) {
            this.loading = true
            storeManageService
                .getShopTopShelf({
                    id: item.shop_id
                }).then((res) => {
                    this.loading = false
                    const { code, msg, data } = res.data;
                    if (code !== 200) {
                        this.$message.error(msg);
                    } else {
                        // console.log("已上架",data);
                        this.modules_two = data;
                        // console.log("判断",Object.prototype.toString.call(this.modules_two))
                        this.visible = true
                    }
                }).catch((err) => {
                    this.$message.error(err);
                });
        },
        // 抽屉
        onClose() {
            this.is_visible = false;
        },
        onChange(e) {
            this.placement = e.target.value;
        },
        // 审核列表
        _getStoreAuditList() {
            this.loading = true;
            this.form.validateFields((_, values) => {
                // values数据处理
                for (let item in values) {
                    if (values[item] === "") {
                        values[item] = undefined
                    }
                }
                // 
                storeManageService
                    .getShopList({
                        page: this.pageIndex,
                        limit: this.pageSize,
                        ...values,
                    })
                    .then((res) => {
                        this.loading = false;
                        const { code, msg, data } = res.data;
                        if (code !== 200) {
                            this.$message.error(msg);
                        } else {
                            console.log(data);
                            this.is_auto_examine = data.is_auto_examine == 1 ? true : false;
                            this.storeAuditList = data.list;
                            this.total = data.total;
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err);
                    });
            });
        },
        // 店铺详情
        handleDetails(item) {
            this.is_visible = true;
            storeManageService
                .getShopDetails({
                    id: item.shop_id
                }).then((res) => {
                    const { code, msg, data } = res.data;
                    if (code !== 200) {
                        this.$message.error(msg);
                    } else {
                        this.modules = data;
                    }
                }).catch((err) => {
                    this.$message.error(err);
                });
        },
        // 查询
        handleSearch() {
            this.pageIndex = 1;
            this._getStoreAuditList();
        },
        // 重置
        handleReset() {
            this.pageIndex = 1;
            this.form.resetFields();
            this._getStoreAuditList();
        },
        // 取消
        handleCancel() {
            this.visible = false;
            //   this.$refs.storeAuditRrf.form.resetFields();
        },
        // 搜索框展开
        toggleAdvanced() {
            this.advanced = !this.advanced;
        },
        // 分页处理
        onPageChange(page, pageSize) {
            this.pageIndex = page;
            this.pageSize = pageSize;
            this._getStoreAuditList();
        },
        // 分页处理
        onSizeChange(current, size) {
            this.pageIndex = 1;
            this.pageSize = size;
            this._getStoreAuditList();
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

.title {
    margin-top: 20px;

}
</style>
