<!--
 * @Author: Fuyi002 2669702453@qq.com
 * @Date: 2022-05-18 10:31:07
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @LastEditTime: 2022-05-23 17:34:11
 * @FilePath: \lottery-admin\src\pages\mining\MiningCode.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-card>
    <a-page-header
      title="矿机"
      sub-title="矿机激活码列表"
      @back="() => this.$router.go(-1)"
    />

    <a-table
      :columns="columns"
      :dataSource="miningCodeList"
      :loading="loading"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
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
      <template slot="title">
        <div style="display: flex">
          <div style="flex-grow: 1">
            <a-form layout="horizontal" :form="form" ref="searchRef">
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item
                    label="用户名"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 17, offset: 0 }"
                  >
                    <a-input
                      v-decorator="['username']"
                      allowClear
                      placeholder="请输入用户名"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item
                    label="矿机"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 17, offset: 0 }"
                  >
                    <a-select
                      placeholder="请选择矿机"
                      v-decorator="['project_id']"
                    >
                      <a-select-option
                        :key="item.id"
                        :value="item.id"
                        v-for="item in MiningList"
                        >{{ item.name }}</a-select-option
                      >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <span style=" margin-top: 3px">
                    <a-button type="primary" @click="handleSearch"
                      >查询</a-button
                    >
                    <a-button style="margin-left: 8px" @click="handleReset"
                      >重置</a-button
                    >
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div style="display: flex">
            <div>
              <a-button type="primary" @click="handleCreate"
                ><a-icon type="plus"></a-icon>新增</a-button
              >
            </div>
            <div style="margin-left: 16px">
              <a-button
                type="primary"
                :disabled="!hasSelected"
                :loading="loading"
                @click="handleDelete"
              >
                删除
              </a-button>
              <span style="margin-left: 8px">
                <template v-if="hasSelected">
                  {{ `已选择${selectedRowKeys.length}项` }}
                </template>
              </span>
            </div>
          </div>
        </div>
      </template>
      <!--  -->
      <template slot="project" slot-scope="item">
        <div style="display: flex;align-items: center">
          <div style="margin-right:15px;">
            <img
              :src="baseUrl + '/' + item.project.image"
              alt=""
              srcset=""
              style="width: 40px"
            />
          </div>
          <div>
            <div>矿机ID：{{ item.project.id }}</div>
            <div>矿机名称：{{ item.project.name }}</div>
            <div>
              收入方式：<a-tag
                :color="item.project.income_way == 0 ? 'blue' : 'cyan'"
              >
                {{
                  item.project.income_way == 0
                    ? "每日结息到期还本"
                    : "到期还本还息"
                }}
              </a-tag>
            </div>
            <div>
              收益类型：<a-tag
                :color="item.project.income_type == 1 ? '#F97316' : '#22C55E'"
                >{{
                  item.project.income_type == 1 ? "按比例" : "按等级"
                }}</a-tag
              >
            </div>
          </div>
        </div>
      </template>
      <!--  -->
      <!-- <template slot="images" slot-scope="images">
        <img
          :src="baseUrl + '/' + images"
          alt=""
          srcset=""
          style="width: 40px"
        />
      </template> -->
      <template slot="user" slot-scope="item" v-if="item.user_id != 0">
        <div>ID：{{ item.user.id }}</div>
        <div>用户名：{{ item.user.username }}</div>
        <div>昵称：{{ item.user.nickname }}</div>
        <div>
          注册类型：<a-tag :color="item.user.reg_type | formDateUserColor">
            {{ item.user.reg_type | formDateType }}
          </a-tag>
        </div>
      </template>
      <template slot="status" slot-scope="item">
        <a-tag :color="item.user_id == 0 ? '#EF4444' : '#EAB308'">{{
          item.user_id == 0 ? "未使用" : "已使用"
        }}</a-tag>
      </template>

      <template slot="created_at" slot-scope="created_at">
        <div>{{ created_at | formDate }}</div>
      </template>
      <template slot="updated_at" slot-scope="updated_at">
        <div>{{ updated_at | formDate }}</div>
      </template>
    </a-table>
    <MiningCodeForm
      ref="MiningCodeFormRef"
      :confirmLoading="confirmLoading"
      :isVisible="isVisible"
      :allMiningList="allMiningList"
      @ok="handleOk"
      @cancel="handleCancel"
    />
  </a-card>
</template>

<script>
import MiningCodeForm from "./components/MiningCodeForm";
import { formDateType, formDateUserColor } from "@/utils/filters";
import { miningService } from "@/services";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "激活码",
    align: "center",
    dataIndex: "code",
  },
  {
    title: "矿机信息",
    align: "left",
    scopedSlots: { customRender: "project" },
  },
  // {
  //   title: "矿机图片",
  //   align: "center",
  //   dataIndex: "project.image",
  //   scopedSlots: { customRender: "images" },
  // },
  {
    title: "用户使用信息",
    align: "left",
    scopedSlots: { customRender: "user" },
  },
  {
    title: "记录时间",
    align: "center",
    dataIndex: "created_at",
    scopedSlots: { customRender: "created_at" },
  },
  {
    title: "更新时间",
    align: "center",
    dataIndex: "updated_at",
    scopedSlots: { customRender: "updated_at" },
  },
  {
    title: "状态",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
];
export default {
  name: "MiningCode",
  components: {
    MiningCodeForm,
  },
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return {
      loading: false,
      miningCodeList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      columns,
      allMiningList: [],
      MiningList: [],
      baseUrl: "",
      //
      isVisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      selectedRowKeys: [],
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  activated() {
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    this.getMiningCodeList();
    this.getAllMiningList();
  },
  methods: {
    // 重置事件
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this.getMiningCodeList();
    },
    // 查询事件
    handleSearch() {
      this.pageIndex = 1;
      this.getMiningCodeList();
    },
    // 删除事件
    handleDelete() {
      this.loading = true;
      const ids = this.selectedRowKeys.join(",");
      // console.log("==================>ids", ids);
      miningService
        .deleteMiningCode({ ids })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success("删除成功");
          this.selectedRowKeys = [];
          this.getMiningCodeList();
        })
        .catch((err) => {
          this.$message.error(err);
        })
        .finally(() => (this.loading = false));
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("selectedRowKeys changed: ", selectedRowKeys, selectedRows);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 获取所有矿机列表
    getAllMiningList() {
      miningService.allMiningCode().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.MiningList = data;
        this.allMiningList = data.filter((item) => item.is_activation == 1);
      });
    },
    // 确定按钮
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.MiningCodeFormRef.form;
      form.validateFields((error, values) => {
        // console.log("==================>values", values);
        if (!error) {
          miningService
            .addMiningCode({ ...values })
            .then((res) => {
              this.confirmLoading = false;
              const { code, msg } = res.data;
              if (code !== 200) return this.$message.error(msg);
              this.isVisible = false;
              form.resetFields();
              this.$message.success("新增成功");
              this.getMiningCodeList();
            })
            .catch((error) => this.$message.error(error.message))
            .finally(() => (this.confirmLoading = false));
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 取消
    handleCancel() {
      // console.log("==================>xiaos");
      this.isVisible = false;
      this.$refs.MiningCodeFormRef.form.resetFields();
    },
    // 新增激活码
    handleCreate() {
      this.isVisible = true;
    },
    // 获取列表
    getMiningCodeList() {
      this.loading = true;
      this.form.validateFields().then((values) => {
        miningService
          .miningCodeList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) return this.$message.error(msg);
            this.miningCodeList = data.list;
            this.total = data.total;
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => (this.loading = false));
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getMiningCodeList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getMiningCodeList();
    },
  },
};
</script>

<style></style>
