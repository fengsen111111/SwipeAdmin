<template>
    <a-card>
        <a-button
        type="primary"
        @click="handleCreate"
        style="margin-bottom: 10px"
      >
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    
        <a-table
            :columns="columns"
            :data-source="partnerList"
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
            <img
                style="width: 100%; height: 100%"
                :src="baseUrl + '/' + item"
            />
            </div>
        </div>
        <!-- 状态插槽处理 -->
        <span slot="status" slot-scope="status">
            <a-tag v-if="status === 0" color="red">不显示</a-tag>
            <a-tag v-else-if="status === 1" color="green">显示</a-tag>
            <a-tag v-else color="#87d068">默认</a-tag>
        </span>
        <!-- 操作 -->
        <div slot="actions" slot-scope="item">
            <a @click="handleUpdate(item)">
                <a-icon type="edit"></a-icon>
                编辑
            </a>

            <a-popconfirm
                :title="`你确定要删除吗?`"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(item)"
            >
                <a> <a-icon type="delete" />删除 </a>
            </a-popconfirm>
        </div>
      
    </a-table>
    <partner-list-form
        ref="partnerRef" 
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
import PartnerListForm from './components/PartnerListForm.vue';
const columns = [
    {
        title: "id",
        dataIndex: "id",
        align: "center",
    },
    {
        title: "合作伙伴名称",
        dataIndex: "companion_name",
        align: "center",
    },
    {
        title: "图片",
        dataIndex: "img",
        align: "center",
        scopedSlots: { customRender: "icon" },
    },
    {
        title: "链接",
        dataIndex: "url",
        align: "center",
    },
    {
        title: "权重",
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
    },
]
export default {
  components: { PartnerListForm },
  name: "CooperativePartner",
  data(){
      return {
        columns : columns, 
        partnerList: [],
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        baseUrl: "",
        visible: false,
        confirmLoading: false,
        modules: null,
        isStatus: 1 ,
      }
  },
  created() {
    this._getPartnerList();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    // 获取合作伙伴列表
    _getPartnerList() {
        this.loading = true;
        operationService
            .getPartnerList({
                limit: this.pageSize,
                page: this.pageIndex,
            })
            .then((res) => {
                this.loading = false;
                const { code, msg, data } = res.data;
                if (code !== 200) {
                    this.$message.error(msg);
                } else {
                    this.partnerList = data.list;
                    this.total = data.total;
                }
            })
            .catch((err) => {
                this.loading = false;
                this.$message.error(err);
            })
        
    },
    // 新增点击事件
    handleCreate(){
        this.$refs.partnerRef.form.resetFields();
        this.$refs.partnerRef.imageUrl = "";
        this.isStatus = 1;
        this.visible = true;
    },
    // 删除
    handleDelete(item){
        operationService
            .deletePartner({
                id:item.id
            })
            .then((res) => {
                const { code , msg } = res.data
                console.log(res.data);
                if( code !== 200 ){
                    this.$message.error(msg);
                } else {
                    this.$message.success("删除成功");
                    this._getPartnerList()
                }
            })
            .catch((error) => {
                this.$message.error(error);
            });
    },
    // 编辑
    handleUpdate(item) {
        this.isStatus = 2;
        delete item.created_at;
        delete item.updated_at;
        this.modules = {
            ...item,
        };
        this.$refs.partnerRef.imageUrl = this.baseUrl + "/" + item.img;
        this.imageUrl = item.img;
        this.visible = true;
    },
    // 点击新增之后弹出表单的--取消
    handleCancel() {
      this.visible = false;
      this.$refs.partnerRef.form.resetFields();
      this.$refs.partnerRef.imageUrl = "";
    },
    // 点击新增之后弹出表单--确认
    handleOk() {
        this.confirmLoading = true;
        const form = this.$refs.partnerRef.form;
        form.validateFields((error,values) => {
            if(!error) {
                if (typeof values?.img !== "string") {
                    values.img = values?.img.file
                    ? values?.img?.file?.response?.data?.img_path
                    : this.imageUrl;
                }
                //=== 1 为新增
                if(this.isStatus === 1) {
                    operationService
                        .getAddPartner({...values})
                        .then((res) => {
                            this.confirmLoading = false;
                            const { code, msg } = res.data;
                            if(code !== 200){
                                this.$message.error(msg);
                            } else {
                                this.$message.success("添加成功");
                                form.resetFields();
                                this.visible = false;
                                this._getPartnerList()
                            }
                        })
                } else {
                    // 为编辑
                    operationService
                        .setEditPartner({...values})
                        .then((res) => {
                            this.confirmLoading = false;
                            const { code, msg } = res.data;
                            if(code !== 200){
                                this.$message.error(msg);
                            } else {
                                this.$message.success("添加成功");
                                form.resetFields();
                                this.visible = false;
                                this._getPartnerList()
                            }
                        })
                }
            } else {
                this.confirmLoading = false;
            }
        })
    },
    // 分页处理
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getPartnerList();
    },
    // 分页处理
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getPartnerList();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>