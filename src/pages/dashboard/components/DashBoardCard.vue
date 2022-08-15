<!--
 * @Author: your name
 * @Date: 2022-02-23 14:43:15
 * @LastEditTime: 2022-03-30 15:57:52
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\dashboard\components\DashBoardCard.vue
-->
<template>
  <a-row :gutter="[30, 24]">
    <a-col
      :xxl="6"
      :xl="6"
      :lg="12"
      :md="12"
      :sm="24"
      v-for="(item, index) in dashList"
      :key="index"
    >
      <chart-card :loading="loading" :title="item.name" :total="item.value">
        <a-tooltip
          :title="item.describe ? item.describe : item.name"
          slot="action"
        >
          <a-icon type="info-circle-o" />
        </a-tooltip>
      </chart-card>
    </a-col>
  </a-row>
</template>

<script>
import ChartCard from "../../../components/card/ChartCard.vue";
export default {
  components: { ChartCard },
  name: "DashBoardCard",
  props: {
    dashList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>