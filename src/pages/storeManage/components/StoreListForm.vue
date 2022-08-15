<template>
    <div>
        <!-- visible显示与否  title标题判断 $emit绑定外部传递方法  width定义弹框宽度 -->
        <a-modal v-drag-modal :visible="visible" title="已上架商品" width="1400px" footer @cancel="
            () => {
                $emit('cancel');
            }
        ">
            <!-- spinning加载动画 -->
            <a-spin :spinning="loading">
                <a-table :columns="columns" :data-source="modules_two" :rowKey="(record, index) => index"
                    :scroll="{ x: 'max-content' }" bordered>
                    <!-- 图片 -->
                    <div slot="good_picture" slot-scope="item" style="display: flex; justify-content: center">
                        <div style="width: 40px; height: 40px">
                            <img style="width: 100%; height: 100%" alt="" srcset="" :src="baseUrl + '/' + item" />
                        </div>
                    </div>
                    <!-- 零售价  大于指导价标红 小于标绿 -->
                    <span slot="retail_price" slot-scope="item">
                        <a-tag :color="item.guide_price>item.guide_price?'red':'green'">
                        {{ item.retail_price}}
                        </a-tag>
                    </span>
                </a-table>

            </a-spin>

        </a-modal>
    </div>
</template>

<script>
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
        scopedSlots: { customRender: "guide_price" },
    },
    {
        title: "零售价",
        dataIndex: "",
        align: "center",
        scopedSlots: { customRender: "retail_price" },
    },
    {
        title: "商品首图",
        dataIndex: "good_picture",
        align: "center",
        scopedSlots: { customRender: "good_picture" },
    },
    {
        title: "商品名称",
        dataIndex: "good_name",
        align: "center",
    },
];

export default {
    // visible 隐藏显示 isTitle标题内容  modules点击编辑传过来的默认值  loading动画
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        modules_two: {
            type: Array,
            default: () => { },
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            columns: columns,
            storeAuditList: [],
            orderList: {},
            baseUrl:""
        };
    },
    created() {
        // this.$watch("modules", (newData,oldData) => {
        //     console.log("yi",newData,"er",oldData);
        // });
    },
    methods: {

    },
};
</script>