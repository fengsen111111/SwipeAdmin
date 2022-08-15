<!--
 * @Author: your name
 * @Date: 2022-02-23 14:43:15
 * @LastEditTime: 2022-03-29 17:22:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\Withdraw.vue
-->
<template>
  <a-spin :spinning="false">
    <a-card>
      <a-tabs :default-active-key="$store.state.socket.withdrawNum">
        <a-tab-pane key="1" tab="法币提现" forceRender>
          <fiat-currency-withdraw />
        </a-tab-pane>
        <a-tab-pane key="2" tab="USDT提现" forceRender>
          <usdt-withdraw />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>

<script>
import FiatCurrencyWithdraw from "./components/FiatCurrencyWithdraw.vue";
import UsdtWithdraw from "./components/UsdtWithdraw.vue";
export default {
  name: "Withdraw",
  components: { FiatCurrencyWithdraw, UsdtWithdraw },
  created() {
    // this._getAisle();
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
</style>
