<!--
 * @Author: your name
 * @Date: 2022-03-18 14:12:11
 * @LastEditTime: 2022-03-18 17:08:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\activity\SignConfig.vue
-->
<template>
  <a-card>
    <template slot="title">
      <a-button type="primary" @click="handleCreate">
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </template>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="SignConfigList"
      bordered
      :scroll="{ x: 'max-content' }"
      :rowKey="(record) => record.id"
    >
      <template slot="createDate" slot-scope="createDate">
        {{ createDate | formDate }}
      </template>
      <template slot="action" slot-scope="item">
        <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
      </template>
      <template slot="updateDate" slot-scope="updateDate">
        {{ updateDate | formDate }}
      </template>
    </a-table>
    <SignConfigForm
      ref="SignConfigFormRef"
      :titleStatus="titleStatus"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { activityService } from "@/services";
import SignConfigForm from "./components/SignConfigForm.vue";
const columns = [
  { title: "#", align: "center", dataIndex: "id" },
  { title: "可领取金额", align: "center", dataIndex: "coinPerHour" },
  { title: "最低区间", align: "center", dataIndex: "downLimit" },
  { title: "最高区间", align: "center", dataIndex: "upLimit" },
  { title: "创建人员", align: "center", dataIndex: "createBy" },
  {
    title: "创建时间",
    align: "center",
    dataIndex: "createDate",
    scopedSlots: { customRender: "createDate" },
  },
  {
    title: "更新人员",
    align: "center",
    dataIndex: "updateBy",
  },
  {
    title: "更新时间",
    align: "center",
    dataIndex: "updateDate",
    scopedSlots: { customRender: "updateDate" },
  },
  {
    title: "备注",
    align: "center",
    dataIndex: "remark",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "SignConfig",
  components: {
    SignConfigForm,
  },
  data() {
    return {
      spinning: false,
      columns: columns,
      loading: false,
      SignConfigList: [],
      //
      modules: null,
      visible: false,
      confirmLoading: false,
      titleStatus: 1,
    };
  },
  created() {
    this.getSignRulesList();
  },
  methods: {
    // 对话框确认按钮
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.SignConfigFormRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.titleStatus == 1) {
            delete values.id;
            activityService
              .addSignRules({ ...values })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("添加成功");
                this.visible = false;
                form.resetFields();
                this.getSignRulesList();
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            const ruleId = values.id;
            values.upLimit = values.upLimit.toString();
            // const values = values.toString();
            delete values.id;
            activityService
              .editSignRules({ ...values, ruleId })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) return this.$message.error(msg);
                this.$message.success("修改成功");
                this.visible = false;
                form.resetFields();
                this.getSignRulesList();
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 对话框取消按钮
    handleCancel() {
      this.visible = false;
      this.$refs.SignConfigFormRef.form.resetFields();
    },
    // 新增按钮事件
    handleCreate() {
      // console.log("==================>xinzhen");
      this.visible = true;
      this.titleStatus = 1;
    },
    // 编辑按钮事件
    handleUpdate(item) {
      console.log("==================>item", item);
      this.titleStatus = 2;
      this.modules = {
        id: item.id,
        coinPerHour: item.coinPerHour,
        downLimit: item.downLimit,
        upLimit: item.upLimit,
        remark: item.remark,
      };
      this.visible = true;
    },
    // 获取配置列表
    getSignRulesList() {
      this.loading = true;
      activityService
        .signRulesList()
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.SignConfigList = data;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
  },
};
</script>

<style>
</style>