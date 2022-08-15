<!--
 * @Author: your name
 * @Date: 2022-03-01 13:13:51
 * @LastEditTime: 2022-05-23 17:24:07
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\mining\MiningMachine.vue
-->
<template>
  <a-card>
    <!-- <template slot="title">
      <a-button type="primary" @click="handleCreate">
        <a-icon type="plus"></a-icon>
        新增
      </a-button>
    </template> -->
    <a-form :form="form" ref="searchRef">
      <a-row>
        <a-col :md="5" :sm="24">
          <a-form-item
            label="项目名称"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 0 }"
          >
            <a-input
              v-decorator="['name']"
              allowClear
              placeholder="请输入项目名称"
            />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item
            label="收入方式"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 15, offset: 0 }"
          >
            <a-select v-decorator="['income_way']" placeholder="请选择收入方式">
              <a-select-option :value="0">每日结息到期还本</a-select-option>
              <a-select-option :value="1">到期还本还息</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item
            label="虚拟币项目名称"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 15, offset: 0 }"
          >
            <a-select
              v-decorator="['project']"
              placeholder="请选择虚拟币项目名称"
            >
              <a-select-option
                v-for="item in allVirtualCurrency"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-item>
            <span style="float: right">
              <a-button type="primary" @click="handleCreate">
                <a-icon type="plus"></a-icon>
                新增
              </a-button>
              <a-button
                style="margin-left: 8px"
                type="primary"
                @click="handleSearch"
                >查询</a-button
              >
              <a-button style="margin-left: 8px" @click="handleReset"
                >重置</a-button
              >
              <a-button
                style="margin-left: 8px"
                type="primary"
                ghost
                @click="$router.push({ path: '/miningLevel/list' })"
                >等级配置</a-button
              >
              <a-button
                style="margin-left: 8px"
                type="primary"
                ghost
                @click="$router.push({ path: '/miningCode/list' })"
                >激活码</a-button
              >
            </span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="miningMachineList"
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
      <!-- ! -->
      <!-- <a slot="operation" slot-scope="text">Publish</a> -->
      <!-- slot-scope="record" -->

      <a-table
        slot="expandedRowRender"
        :columns="innerColumns"
        slot-scope="record"
        :data-source="record.configure"
        :pagination="false"
        :width="200"
      >
        <span slot="level" slot-scope="item">
          {{ item.level }}
        </span>
        <div slot="model" slot-scope="item">
          <div>
            收益方式：
            {{ item.model == 1 ? "按比例收益" : "固定收益" }}
          </div>
          <div>
            日收益：{{ item.model == 1 ? `${item.income}‰` : item.income }}
          </div>
        </div>
        <div slot="income" slot-scope="item">
          <div>名称：{{ item.symbol }}</div>
          <div>赠送：{{ item.gift_ratio }}‰</div>
        </div>
      </a-table>
      <!-- ! -->
      <!--  -->
      <template slot="purchase_num" slot-scope="purchase_num">
        {{ purchase_num == 0 ? "不限购" : purchase_num }}
      </template>
      <!--  -->
      <template slot="daily_return" slot-scope="item">
        <div>{{ item.income_type == 1 ? item.daily_return : "" }}</div>
      </template>
      <!--  -->
      <template slot="income_type" slot-scope="income_type">
        <a-tag :color="income_type == 1 ? '#A855F7' : '#F97316'">{{
          income_type == 1 ? "按比例" : "按等级"
        }}</a-tag>
      </template>
      <!--  -->
      <template slot="image" slot-scope="image">
        <img
          :src="baseUrl + '/' + image"
          alt=""
          srcset=""
          style="width: 40px"
          @click="blackImage(baseUrl + '/' + image)"
        />
        <!-- @click="blackImage(baseUrl + '/' + image)" -->
      </template>
      <span slot="income_way" slot-scope="item">
        <a-tag :color="item.income_way == 0 ? 'blue' : 'cyan'">
          {{ item.income_way == 0 ? "每日结息到期还本" : "到期还本还息" }}
        </a-tag>
      </span>
      <template slot="activation" slot-scope="item">
        <a-switch
          :checked="item.is_activation == 1 ? true : false"
          @change="ActivationStatus(item)"
        />
      </template>
      <template slot="action" slot-scope="item">
        <!-- <a @click="handleCompile(item)"><a-icon type="edit" /> 编辑</a> -->
        <a-space size="large">
          <a @click="handleUpdate(item)"> <a-icon type="edit" />编辑 </a>
          <a-popconfirm
            :title="`你确定要删除吗?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(item)"
          >
            <a> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <MiningMachineForm
      ref="miningMachineFormRef"
      :status="isStatus"
      :isVisible="visible"
      :loading="confirmLoading"
      :modules="modules"
      @cancel="handleCancelFrom"
      @ok="handleOk"
      :allVirtualCurrency="allVirtualCurrency"
      :allMiningLevelList="allMiningLevelList"
      :configure="configure"
    />
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previImages" />
    </a-modal>
  </a-card>
</template>

<script>
import { miningService } from "@/services";
import MiningMachineForm from "./components/MiningMachineForm.vue";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "项目名称",
    align: "center",
    dataIndex: "name",
  },
  {
    title: "项目图片",
    align: "center",
    dataIndex: "image",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "收益类型",
    align: "center",
    dataIndex: "income_type",
    scopedSlots: { customRender: "income_type" },
  },
  {
    title: "项目总额",
    align: "center",
    dataIndex: "can_buy_balance",
  },
  {
    title: "已购余额",
    align: "center",
    dataIndex: "already_bought_balance",
  },
  {
    title: "日收益率",
    align: "center",

    scopedSlots: { customRender: "daily_return" },
  },
  {
    title: "申请天数",
    align: "center",
    dataIndex: "explain_days",
  },
  {
    title: "最小购买",
    align: "center",
    dataIndex: "minimum",
  },
  {
    title: "最大购买",
    align: "center",
    dataIndex: "biggest",
  },
  {
    title: "限购次数",
    align: "center",
    dataIndex: "purchase_num",
    scopedSlots: { customRender: "purchase_num" },
  },
  {
    title: "虚拟货币项目ID",
    align: "center",
    dataIndex: "project_id",
  },
  {
    title: "权重",
    align: "center",
    dataIndex: "weight",
  },
  {
    title: "收入方式",
    align: "center",
    scopedSlots: { customRender: "income_way" },
  },
  {
    title: "虚拟币项目名称",
    align: "center",
    dataIndex: "currency_project.name",
  },
  {
    title: "项目进度(%)",
    align: "center",
    dataIndex: "progress",
  },
  {
    title: "激活码",
    align: "center",
    scopedSlots: { customRender: "activation" },
    fixed: "right",
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    scopedSlots: { customRender: "action" },
  },
];
const innerColumns = [
  {
    title: "等级名称",
    key: "level",
    width: 50,
    scopedSlots: { customRender: "level" },
  },
  {
    title: "最小购买",
    key: "min",
    dataIndex: "min",
    width: 50,
  },
  {
    title: "最大购买",
    key: "max",
    dataIndex: "max",
    width: 50,
  },
  {
    title: "矿机收益",
    key: "model",
    scopedSlots: { customRender: "model" },
    width: 50,
  },
  {
    title: "平台币赠送",
    key: "income",
    scopedSlots: { customRender: "income" },
    width: 50,
  },
];
export default {
  name: "MiningMachine",
  components: { MiningMachineForm },
  data() {
    return {
      form: this.$form.createForm(this),
      spinning: false,
      columns: columns,
      innerColumns,
      loading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      miningMachineList: [],
      baseUrl: "",
      //
      allVirtualCurrency: [],
      modules: null, //给对话框传内容
      confirmLoading: false, // 对话框loading
      visible: false, // 对话框显示隐藏
      isStatus: 1, //状态判断新增还是修改
      imageUrl: "",
      //
      previewVisible: false,
      previImages: "",
      //
      allMiningLevelList: [],
      configure: [
        {
          level: null,
          model: null,
          income: null,
          min: null,
          max: null,
        },
      ],
    };
  },
  activated() {
    this.getMiningMachineList();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
    this.getAllVirtualCurrency();
    this.getAllMiningLevelList();
  },
  methods: {
    // 获取等级列表
    getAllMiningLevelList() {
      miningService.allMiningLevel().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.allMiningLevelList = data.filter((item) => item.status == 1);
      });
    },
    // 点击查看图片详情
    handleCancel() {
      this.previewVisible = false;
    },
    blackImage(images) {
      this.previImages = images;
      this.previewVisible = true;
    },
    // 改变激活码状态
    ActivationStatus(item) {
      this.loading = true;
      //   console.log(item);
      miningService
        .activStatus({
          id: item.id,
          is_activation: item.is_activation == 0 ? 1 : 0,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.$message.success("操作成功");
          this.getMiningMachineList();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.loading = false));
    },
    //   新增事件
    handleCreate() {
      this.isStatus = 1;
      this.visible = true;
      this.$refs.miningMachineFormRef.initWangeEditor();
    },
    // 编辑按钮事件
    handleUpdate(item) {
      this.isStatus = 2;
      console.log("==================>item", item);
      this.modules = {
        id: item.id,
        name: item.name,
        image: item.image,
        can_buy_balance: item.can_buy_balance,
        daily_return: item.daily_return,
        explain_days: item.explain_days,
        minimum: item.minimum,
        biggest: item.biggest,
        project_id: item.currency_project?.id,
        weight: item.weight,
        income_way: item.income_way,
        purchase_num: item.purchase_num,
        progress: item.progress,
        income_type: item.income_type,
        // configure: item.configure,
      };
      this.$refs.miningMachineFormRef.initWangeEditor();
      this.configure = item.configure;
      this.$refs.miningMachineFormRef.selectedValue = item.income_type;
      this.$refs.miningMachineFormRef.imageUrl =
        this.baseUrl + "/" + item.image;
      this.imageUrl = item.image;
      this.visible = true;
      this.$refs.miningMachineFormRef.context = item.rules;
    },
    // 确认删除按钮事件
    handleDelete(item) {
      //   console.log("==================>item", item);
      miningService
        .deleteMiningMachine({ id: item.id })
        .then((res) => {
          // this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this.getMiningMachineList();
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 对话框组件确认按钮
    handleOk(item) {
      // console.log("==================>ok", item);
      const miningMachineFormRef = this.$refs.miningMachineFormRef;
      this.confirmLoading = true;
      const form = this.$refs?.miningMachineFormRef?.form;
      form.validateFields((error, values) => {
        if (!error) {
          values.image = values?.image.file
            ? values?.image?.file?.response?.data?.img_path
            : this.imageUrl;

          if (values.income_type == 2) {
            values.configure = [...item];
          }
          if (this.isStatus === 1) {
            delete values.id;
            miningService
              .addMiningMachine({
                ...values,
                rules: miningMachineFormRef.editor.txt.html(),
              })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code === 200) {
                  this.$message.success("添加成功");
                  this.handleCancelFrom();
                  // this.visible = false;
                  // form.resetFields();
                  // this.$refs.miningMachineFormRef.imageUrl = "";
                  this.getMiningMachineList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            miningService
              .editMiningMachine({
                ...values,
                rules: miningMachineFormRef.editor.txt.html(),
              })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code === 200) {
                  this.$message.success("修改成功");
                  // this.visible = false;
                  // form.resetFields();
                  this.handleCancelFrom();
                  this.getMiningMachineList();
                } else {
                  this.$message.error(msg);
                }
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
    // 对话框组件取消按钮
    handleCancelFrom() {
      this.visible = false;
      this.$refs.miningMachineFormRef.imageUrl = "";
      this.$refs.miningMachineFormRef.form.resetFields();
      this.configure = [
        {
          level: null,
          model: null,
          income: null,
          min: null,
          max: null,
        },
      ];
      // console.log("==================>this.configure", this.configure);
    },
    // 查询
    handleSearch() {
      this.pageIndex = 1;
      this.getMiningMachineList();
    },
    // 重置
    handleReset() {
      this.$refs.searchRef.form.resetFields();
      this.pageIndex = 1;
      this.getMiningMachineList();
    },
    // 获取矿机列表
    getMiningMachineList() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        miningService
          .miningMachineList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            const { code, msg, data } = res.data;
            // console.log("==================>res.data", res.data);
            if (code !== 200) return this.$message.error(msg);
            this.miningMachineList = data.list;
            this.total = data.total;
            this.loading = false;
            setTimeout(() => {
              this.$forceUpdate();
            }, 500);
          });
      });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getMiningMachineList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getMiningMachineList();
    },
    // 获取所有虚拟币项目接口
    getAllVirtualCurrency() {
      miningService.allVirtualCurrency().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.allVirtualCurrency = data;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
