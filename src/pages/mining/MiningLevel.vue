<!--
 * @Author: Fuyi002 2669702453@qq.com
 * @Date: 2022-05-13 15:01:19
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @LastEditTime: 2022-06-08 15:44:08
 * @FilePath: \lottery-admin\src\pages\mining\MiningLevel.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-card>
    <a-page-header
      title="矿机"
      sub-title="矿机等级列表"
      @back="() => this.$router.go(-1)"
    />

    <a-table
      :columns="columns"
      :dataSource="miningLevelList"
      :loading="loading"
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
                    label="平台币"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 17, offset: 0 }"
                  >
                    <a-select
                      placeholder="请选择平台币"
                      v-decorator="['issued_currency_id']"
                    >
                      <a-select-option :key="0" :value="0">无</a-select-option>
                      <a-select-option
                        :key="item.id"
                        :value="item.id"
                        v-for="item in PlatformCurrencyList"
                        >{{ item.symbol }}</a-select-option
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
            <a-button type="primary" @click="handleCreate"
              ><a-icon type="plus"></a-icon>新增</a-button
            >
          </div>
        </div>
      </template>
      <!--  -->
      <template slot="image" slot-scope="image">
        <img
          :src="baseUrl + '/' + image"
          alt=""
          srcset=""
          style="width: 40px"
        />
        <!-- @click="blackImage(baseUrl + '/' + image)" -->
      </template>
      <!--  -->
      <template slot="status" slot-scope="item">
        <a-switch
          :checked="item.status == 1 ? true : false"
          @change="handleChange(item)"
        />
      </template>
      <template slot="created_at" slot-scope="created_at">
        <div>{{ created_at | formDate }}</div>
      </template>
      <template slot="updated_at" slot-scope="updated_at">
        <div>{{ updated_at | formDate }}</div>
      </template>
      <!--  -->
      <template slot="actions" slot-scope="item">
        <a-space size="middle">
          <a @click="handleUpdate(item)">
            <a-icon type="edit"></a-icon>
            编辑
          </a>
        </a-space>
      </template>
    </a-table>
    <MiningLevelForm
      ref="MiningLevelFormRef"
      :isVisible="isVisible"
      :confirmLoading="confirmLoading"
      :titleStatus="titleStatus"
      :modules="modules"
      @ok="handleOk"
      @cancel="handleCancel"
      :AllPlatformCurrencyList="AllPlatformCurrencyList"
    />
  </a-card>
</template>

<script>
import MiningLevelForm from "./components/MiningLevelForm.vue";
import { miningService, gameService } from "@/services";
const columns = [
  {
    title: "#",
    align: "center",
    dataIndex: "id",
  },
  {
    title: "等级名称",
    align: "center",
    dataIndex: "level",
  },
  {
    title: "平台币名称",
    align: "center",
    dataIndex: "issued_currency.symbol",
  },
  {
    title: "平台币图片",
    align: "center",
    dataIndex: "issued_currency.logo",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "赠送比例(‰)",
    align: "center",
    dataIndex: "gift_ratio",
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
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  name: "MiningLevel",
  components: {
    MiningLevelForm,
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
      miningLevelList: [],
      total: 0,
      pageIndex: 1,

      pageSize: 10,
      columns,
      userType: 1,
      //
      modules: null,
      isVisible: false,
      confirmLoading: false,
      titleStatus: 1,
      form: this.$form.createForm(this),
      AllPlatformCurrencyList: [],
      PlatformCurrencyList: [],
      baseUrl: "",
    };
  },
  activated() {
    this.getMiningLevelList();
    this.getAllPlatformCurrency();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    // 重置事件
    handleReset() {
      this.pageIndex = 1;
      this.form.resetFields();
      this.getMiningLevelList();
    },
    // 查询事件
    handleSearch() {
      this.pageIndex = 1;
      this.getMiningLevelList();
    },
    // 编辑
    handleUpdate(item) {
      this.modules = {
        id: item.id,
        level: item.level,
        issued_currency_id: item.issued_currency_id,
        gift_ratio: item.gift_ratio,
      };
      this.$refs.MiningLevelFormRef.issued = item.issued_currency_id;
      this.titleStatus = 2;
      this.isVisible = true;
    },
    // 取消
    handleCancel() {
      console.log("==================>xiaos");
      this.isVisible = false;
      this.$refs.MiningLevelFormRef.issued = 0;
      this.$refs.MiningLevelFormRef.form.resetFields();
    },
    // 确认按钮事件
    handleOk() {
      this.confirmLoading = true;
      // form=this.
      const form = this.$refs.MiningLevelFormRef.form;
      form.validateFields((error, values) => {
        // console.log("==================>values", values);
        if (!error) {
          if (this.titleStatus == 1) {
            delete values.id;
            miningService
              .addMiningLevel({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) return this.$message.error(msg);
                // this.isVisible = false;
                // this.form.resetFields();
                this.handleCancel();
                this.$message.success("新增成功");
                this.getMiningLevelList();
              })
              .catch((error) => this.$message.error(error.message))
              .finally(() => (this.confirmLoading = false));
          } else {
            miningService
              .editMiningLevel({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) return this.$message.error(msg);
                // this.isVisible = false;
                // this.form.resetFields();
                this.handleCancel();
                this.$message.success("修改成功");
                this.getMiningLevelList();
              })
              .catch((error) => this.$message.error(error.message))
              .finally(() => (this.confirmLoading = false));
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 新增按钮
    handleCreate() {
      this.isVisible = true;
      this.titleStatus = 1;
    },
    // 状态开关
    handleChange(item) {
      this.loading = true;
      miningService
        .miningLevelStatus({
          id: item.id,
          status: item.status == 0 ? 1 : 0,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg } = res.data;
          if (code !== 200) return this.$message.error(msg);
          this.getMiningLevelList();
        })
        .catch((error) => {
          this.$message.error(error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 分页器函数
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.getMiningLevelList();
    },
    // 分页器函数
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getMiningLevelList();
    },
    // 获取列表接口
    getMiningLevelList() {
      this.loading = true;
      this.form.validateFields().then((values) => {
        miningService
          .miningLevelList({
            page: this.pageIndex,
            limit: this.pageSize,
            ...values,
          })
          .then((res) => {
            const { code, msg, data } = res.data;
            this.loading = false;
            if (code !== 200) return this.$message.error(msg);
            this.miningLevelList = data.list;
            this.total = data.total;
          })
          .catch((error) => {
            this.$message.error(error.message);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 获取平台币列表
    getAllPlatformCurrency() {
      gameService.allPlatformCurrency().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) return this.$message.error(msg);
        this.PlatformCurrencyList = data;
        this.AllPlatformCurrencyList = data.filter(
          (item) => item.is_subscribe == 1
        );
      });
    },
  },
};
</script>

<style></style>
