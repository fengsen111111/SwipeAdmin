<template>
  <a-modal title="操作记录" :visible="visible" :confirmLoading="loading" @ok="
    () => {
      $emit('ok');
    }
  " @cancel="
  () => {
    $emit('cancel');
  }
" width="1200px">
    <a-spin :spinning="loading">
      <a-table :columns="columns" :row-key="(record) => record._id" :data-source="backgroundRecord" bordered
        :scroll="{ x: 'max-content' }" :pagination="{
          current: pageData.pageIndex,
          pageSize: pageData.pageSize,
          total: total,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: true,
          onChange: onPageChange,
          onShowSizeChange: onSizeChange,
        }">
        <template #title>
          <span>币种：</span>
          <a-select v-model="currentId" style="width:220px" placeholder="请选择币种">
            <a-select-option :key="item.id" :value="item.symbol" v-for="item in currenList">{{ item.symbol }}
            </a-select-option>
          </a-select>
          <a-button type="primary" style="margin-left: 10px;" @click="handleSearch">搜索</a-button>
          <a-button type="danger" style="margin-left: 10px;" @click="handleReset">重置</a-button>
        </template>
        <span slot="createTime" slot-scope="time">
          {{ time | formDate }}
        </span>
        <div slot="reg_type" slot-scope="item">
          <a-tag :color="item | formDateUserColor">
            {{ item | formDateType }}
          </a-tag>
        </div>
        <span slot="type" slot-scope="item">
          <a-tag color="green">
            {{ item === 1 ? '币数量' : '锁定' }}
          </a-tag>
        </span>
        <span slot="edit_type" slot-scope="item">
          <a-tag v-if="item === 1" color="red">
            减扣
          </a-tag>
          <a-tag v-else-if="item === 2" color="green">
            增加
          </a-tag>
          <a-tag v-else color="blue">
            锁定/解锁
          </a-tag>
        </span>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { formDateType, formDateUserColor } from "@/utils/filters";
const columns = [
  {
    title: "管理员名称",
    align: "center",
    dataIndex: "admin_nickname",
  },
  // {
  //   title: "注册类型",
  //   align: "center",
  //   dataIndex: "reg_type",
  //   scopedSlots: {
  //     customRender: "reg_type",
  //   },
  // },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'type',
    scopedSlots: {
      customRender: "type",
    }
  },

  {
    title: '操作类型',
    align: 'center',
    dataIndex: 'edit_type',
    scopedSlots: {
      customRender: "edit_type",
    }
  },


  {
    title: "币种名称",
    align: "center",
    dataIndex: "symbol",
  },
  {
    title: "修改的币金额",
    align: "center",
    dataIndex: "amount",
  },

  {
    title: "操作前币数量",
    align: "center",
    dataIndex: "before_wallet",
  },
  {
    title: "操作后币数量",
    align: "center",
    dataIndex: "after_wallet",
  },
  {
    title: "操作前锁定币数量",
    align: "center",
    dataIndex: "before_locked",
  },
  {
    title: "操作后锁定币数量",
    align: "center",
    dataIndex: "after_locked",
  },
  {
    title: "记录时间",
    align: "center",
    dataIndex: "create_at",
    scopedSlots: {
      customRender: "createTime",
    },
  },
];
export default {
  name: "WalletRecord",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    backgroundRecord: {
      type: Array,
      default: () => {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    pageData: {
      type: Object,
      default: () => {
        return {
          pageSize: 10,
          pageIndex: 1,
        };
      },
    },
    currenList: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    formDateType,
    formDateUserColor,
  },
  data() {
    return {
      columns,
      userName: "",
      currentId: null
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.$emit("page-change", {
        pageIndex: page,
        pageSize: pageSize,
      });
    },
    // 分页器函数
    onSizeChange(current, size) {

      this.$emit("pageSize-change", {
        pageIndex: 1,
        pageSize: size,
      });
    },
    handleSearch() {
      this.$emit("search", this.currentId);

    },
    handleReset() {
      this.currentId = null;
      this.$emit("search", '');
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
