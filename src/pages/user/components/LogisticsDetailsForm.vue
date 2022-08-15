<template>
    <!-- isVisible -->
    <a-modal v-drag-modal :visible="isVisible" title="订单详情" :confirmLoading="details_loading" :width="1200"
        :footer="null" @cancel="
            () => {
                $emit('cancel_two');
            }
        ">
        <!-- 操作 -->
        <a-button type="primary" style="margin-bottom:10px" @click="addHandle">
            <a-icon type="plus"></a-icon>新增
        </a-button>

        <a-table :columns="columns" :data-source="modules" :rowKey="(record) => record.id" bordered
            :scroll="{ x: 'max-content' }" :loading="details_loading" :pagination="false">
            <!-- 国家id -->
            <!-- <span slot="country_id" slot-scope="item">
                {{ item|nation }}
            </span> -->
            <!-- 状态 -->
            <span slot="status" slot-scope="item">
                <a-tag :color="item | tag_color ">
                    {{ item | state }}
                </a-tag>
            </span>
            <!-- 操作 -->
                <a slot="action" slot-scope="item">
                    <a type="link" size="small" @click="handDetails(item)">
                        编辑
                    </a>
                </a>
        </a-table>
    </a-modal>
</template>

<script>
const columns = [
    {
        title: "#",
        dataIndex: "id",
        align: "center",
    },
    {
        title: "国家ID",
        dataIndex: "en_name",
        align: "center",
        // scopedSlots: { customRender: "country_id" },
    },
    {
        title: "物流信息",
        dataIndex: "information",
        align: "center",
    },
    {
        title: "物流信息生成秒数",
        dataIndex: "delay_time",
        align: "center",
    },
    {
        title: "物流商品状态",
        dataIndex: "status",
        align: "center",
        scopedSlots: { customRender: "status" },
    },
    {
        title: "操作",
        align: "center",
        fixed: "right",
        scopedSlots: { customRender: "action" },
    },
];
export default {
    name: "OrderListForm",
    filters: {
        //颜色
        tag_color(val){
            switch (val) {
                case 1:
                    return "#108ee9";
                case 2:
                    return "#eacd76";
                case 3:
                    return "#2edfa3";
                case 4:
                    return "#4b5cc4";
                case 5:
                    return "#3eede7";
                case 6:
                    return "#00e500";
                default:
                    return;
            }
        },
        // 国家
        // nation(val) {
        //     switch (val) {
        //         case 14:
        //             return "America";
        //         case 39:
        //             return "Colombia";
        //         case 89:
        //             return "India";
        //         case 115:
        //             return "Malaysia";
        //         case 124:
        //             return "Mexico";
        //         case 147:
        //             return "Philippines";
        //         case 152:
        //             return "Peru";
        //         case 189:
        //             return "Turkey";
        //         case 202:
        //             return "Vietnam";
        //         default:
        //             return "未定义";
        //     }
        // },
        // 状态
        state(val) {
            switch (val) {
                case 1:
                    return "打包中";
                case 2:
                    return "已派件";
                case 3:
                    return "待分拣";
                case 4:
                    return "待送达";
                case 5:
                    return "待签收";
                case 6:
                    return "已签收";
                default:
                    return;
            }
        }
    },
    props: {
        en_name:{
            type:String,
            default:""
        },
        modules: {
            type: Array,
            default: () => [],
        },
        isVisible: {
            type: Boolean,
            default: false,
        },
        details_loading: {
            type: Boolean,
            default: false,
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

    },
    computed: {
    },
    methods: {
        // 打开新增
        addHandle() {
            this.$emit('addHandle')
        },
        // 编辑
        handDetails(data){
            // console.log("编辑",data);
            this.$emit('editForm',data);
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
