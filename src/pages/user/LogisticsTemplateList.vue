<template>
    <a-spin :spinning="spinning">
        <a-card>
            <!-- 搜索栏 -->
            <div :class="advanced ? 'search' : null">
                <a-form layout="horizontal" :form="form" ref="searchRef">
                    <div :class="advanced ? null : 'fold'">
                        <a-row>
                            <!-- 标题 -->
                            <a-col :md="8" :sm="24">
                                <a-form-item label="标题" :labelCol="{ span: 2 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input v-decorator="['title']" allowClear placeholder="请输入要搜索的标题" />
                                </a-form-item>
                            </a-col>
                            <!-- 国家id -->
                            <a-col :md="8" :sm="24">
                                <a-form-item label="国家ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-select placeholder="选择国家ID" v-decorator="['country_id']">
                                        <a-select-option v-for="item in nation_list" :key="item.id" :value="item.id">
                                            {{item.name}}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-space size="large">
                <a-button type="primary" @click="handleCreate">
                    <a-icon type="plus"></a-icon>
                    新增
                </a-button>
            </a-space>
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

            <div style="height: 10px"></div>
            <a-table :columns="columns" :data-source="data" :rowKey="(record, index) => index" bordered
                :scroll="{ x: 'max-content' }" :loading="loading" :pagination="{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showLessItems: true,
                    showQuickJumper: true,
                    onChange: onPageChange,
                    onShowSizeChange: onSizeChange,
                }">

                <!-- 国家id -->
                <!-- <span slot="country_id" slot-scope="item">
                    {{ item | nation }}
                </span> -->
                <!-- 操作 -->
                <a slot="action" slot-scope="item">
                    <a type="link" size="small" @click="handDetails(item)">
                        详情列表
                    </a>
                </a>
            </a-table>
            <!-- 新增模板 -->
            <LogisticsTemplateListForm :visible="visible" @ok="handleOk" @cancel="handleCancel" ref="articleRefOne"
                :nation_list="nation_list" :loading="loading" />
            <!-- 详情列表模板 LogisticsDetailsForm-->
            <LogisticsDetailsForm :modules="modules" :isVisible="isVisible" @cancel_two="handleCancel_two"
                :details_loading="details_loading" @addHandle="addHandle" @editForm="editForm" />
            <!-- 新增详情 -->
            <AddDetails :isVisibleTwo="isVisibleTwo" @ok="DetailsOK" @cancel="detailsCancel" :add_loading="add_loading"
                ref="formRef" />
            <!-- 详情列表模板编辑 -->
            <EditList :editVisible="editVisible" @ok="EditOK" @cancel="EditCancel" :modules="edit_modules"
                :edit_loading="edit_loading" ref="articleRef" />
        </a-card>
    </a-spin>
</template>

<script>
import { userService } from "@/services";
//userLogisticsDetails  详情列表
import LogisticsTemplateListForm from "./components/LogisticsTemplateListForm.vue";
import LogisticsDetailsForm from "./components/LogisticsDetailsForm.vue";
import AddDetails from "./components/AddDetails.vue";
import EditList from "./components/EditList.vue";
export default {
    components: { LogisticsTemplateListForm, LogisticsDetailsForm, AddDetails, EditList },
    filters: {
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
        // }
    },
    data() {
        return {
            visible: false, // 对话框显示隐藏
            //表头
            columns: [
                {
                    title: "#",
                    dataIndex: "id",
                    align: "center",
                },
                {
                    title: "标题",
                    dataIndex: "title",
                    align: "center",
                },
                {
                    title: "国家ID",
                    dataIndex: "en_name",
                    align: "center",
                    // scopedSlots: { customRender: "country_id" },
                },
                {
                    title: "操作",
                    align: "center",
                    fixed: "right",
                    scopedSlots: { customRender: "action" },
                },
            ],

            data: [],
            spinning: false,
            form: this.$form.createForm(this),
            loading: false,
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            advanced: false,
            en_name:"",//国家id

            // 国家--下拉选择
            nation_list: [],
            isVisible: false,//详情开关
            isVisibleTwo: false,//详情新增开关
            id_template: 0,//模板id
            details_loading: false,//详情加载动画开关
            add_loading: false,//新增详情动画开关

            editVisible: false,//详情编辑开关
            edit_modules: {},//详情编辑数据
            edit_loading: false,//编辑详情动画开关

            modules: null, //数据
            id: "",
        };
    },
    activated() {
        this.formList();//数据列表
        this.nationChoose();//国家选择
    },
    methods: {
        EditCancel() {
            // console.log("编辑取消");
            this.editVisible = false;
        },
        EditOK() {
            // console.log("编辑确定");
            this.edit_loading = true;
            // 拿到ref里面的值   editLogisticsDetails
            const articleRef = this.$refs.articleRef;
            const form = articleRef.form;
            this.confirmLoading = true;
            form.validateFields((errors, values) => {
                values.en_name = undefined;
                if (!errors) {
                    userService
                        .editLogisticsDetails({
                            ...values,
                        }).then((res) => {
                            const { code, msg } = res.data;
                            this.edit_loading = false;
                            if (code !== 200) {
                                // console.log("编辑失败");
                                this.$message.error(msg);
                                return;
                            } else {
                                this.$message.success("编辑成功");
                                this.editVisible = false;
                                this.isVisible = false;
                                return;
                            }
                        })
                        .catch((error) => {
                            this.edit_loading = false;
                            this.$message.error(error);
                        });
                } else {
                    this.edit_loading = false;
                }
            })
        },
        editForm(data) {
            // console.log("详情列表编辑", data);
            this.editVisible = true;// 打开弹框
            const {
                // 拿到当前项数据
                id,
                en_name,
                // country_id,
                status,
                delay_time,
                information,
            } = data;
            this.edit_modules = {
                id,
                en_name,
                // country_id,
                status,
                delay_time,
                information,
            };
        },
        DetailsOK() {
            // console.log("详情列表新增确定");
            const formRef = this.$refs.formRef;
            const form = formRef.form;
            this.add_loading = true;
            form.validateFields((errors, values) => {
                console.log("==================>", values, this.id_template,errors);
                values.delay_time = values.delay_time * 1;
                if (!errors) {
                    userService
                        .addLogisticsDetails({
                            ...values,
                            id: this.id_template
                        }).then((res) => {
                            const { code, msg } = res.data;
                            this.add_loading = false;
                            if (code !== 200) {
                                this.$message.error(msg);
                            } else {
                                this.$message.success("新增成功");
                                this.$refs?.formRef?.form.resetFields();
                                this.isVisibleTwo = false;
                                this.isVisible = false;
                            }
                        })
                        .catch((err) => {
                            this.add_loading = false;
                            this.$message.error(err);
                        });
                } else {
                    this.add_loading = false;
                }
            })
        },
        detailsCancel() {
            this.isVisibleTwo = false;
            this.$refs?.formRef?.form.resetFields();
            // console.log("详情列表新增取消");
        },
        addHandle() {
            // console.log("详情列表新增按键");
            this.isVisibleTwo = true;
        },
        nationChoose() {
            // console.log("国家--下拉选择");
            userService
                .userCounritSelect({}).then((res) => {
                    const { code, msg, data } = res.data;
                    if (code !== 200) {
                        this.$message.error(msg);
                    } else {
                        this.nation_list = data;
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        // 详情列表 --取消
        handleCancel_two() {
            this.isVisible = false;
            this.modules = [];
        },
        // 详情列表
        handDetails(item) {
            this.details_loading = true;
            this.id_template = item.id;
            this.en_name=item.en_name;
            this.isVisible = true;
            userService
                .userLogisticsDetails({
                    id: item.id
                }).then((res) => {
                    const { code, msg, data } = res.data;
                    if (code !== 200) {
                        this.$message.error(msg);
                    } else {
                        this.details_loading = false;
                        this.modules = data;
                        if(this.modules.length > 0) {
                            this.modules.forEach(item => {
                                item.en_name=this.en_name;
                            });
                        }
                    }
                })
                .catch((err) => {
                    this.details_loading = false;
                    this.$message.error(err);
                });
        },
        // 新增》确定
        handleOk() {
            this.loading = true;
            const articleRef = this.$refs.articleRefOne;
            const form = articleRef.form;
            form.validateFields((errors, values) => {
                values.country_id = values.country_id * 1;
                if (!errors) {
                    userService
                        .userAddLogistics({
                            ...values
                        })
                        .then((res) => {
                            this.loading = false;
                            this.visible = false;
                            const { code, msg } = res.data;
                            if (code !== 200) {
                                this.$message.error(msg);
                            } else {
                                this.$message.success("新增成功");
                                form.resetFields();//清空数据
                                this.formList();
                            }
                        }).catch((err) => {
                            this.loading = false;
                            this.$message.error(err);
                        });
                } else {
                    this.loading = false;
                }
            });
        },
        // 新增》取消
        handleCancel() {
            this.visible = false;
            const form = this.$refs.articleRef.form;
            form.resetFields();//清楚数据
            // console.log("取消");
        },
        // 数据列表
        formList() {
            this.form.validateFields((err, values) => {
                this.loading = true;
                userService
                    .userLogistics({
                        limit: this.pageSize,
                        page: this.pageIndex,
                        ...values,
                    })
                    .then((res) => {
                        console.log(res);
                        this.loading = false;
                        const { code, msg, data } = res.data;
                        if (code !== 200) {
                            this.$message.error(msg);
                        } else {
                            this.data = data.list;
                            this.total=data.total;
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        this.$message.error(err);
                    });
            });
        },
        toggleAdvanced() {
            this.advanced = !this.advanced;
        },
        onPageChange(page, pageSize) {
            this.pageIndex = page;
            this.pageSize = pageSize;
            // console.log("页数发生变化");
            this.formList();
        },
        // 新增开关
        handleCreate() {
            this.visible = true;
        },
        //查询
        handleSearch() {
            this.pageIndex = 1;
            this.formList();
        },
        //重置
        handleReset() {
            this.pageIndex = 1;
            this.form.resetFields();
            this.formList();
        },
        // 分页处理
        onSizeChange(current, size) {
            this.pageIndex = 1;
            this.pageSize = size;
            this.formList();
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
