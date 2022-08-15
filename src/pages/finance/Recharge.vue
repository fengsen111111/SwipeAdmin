<!--
 * @Author: your name
 * @Date: 2022-03-24 17:31:59
 * @LastEditTime: 2022-03-30 10:55:32
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\finance\Recharge.vue
-->
<template>
  <a-spin :spinning="false">
    <a-card>
      <!-- {{ $store.state.socket.rechargeNum }} -->
      <a-tabs :default-active-key="$store.state.socket.rechargeNum">
        <a-tab-pane key="1" tab="法币充值" forceRender>
          <fiat-currency-recharge />
        </a-tab-pane>
        <a-tab-pane key="2" tab="USDT充值" forceRender>
          <usdt-recharge />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>

<script>
import FiatCurrencyRecharge from "./components/FiatCurrencyRecharge.vue";
import UsdtRecharge from "./components/UsdtRecharge.vue";

export default {
  name: "Recharge",
  components: { FiatCurrencyRecharge, UsdtRecharge },
  data() {
    return {
      tabnum: 1,
    };
  },

  activated() {},
  mounted() {
    // let timer = null;
    // this.$on("hook:activated", () => {
    //   if (timer === null) {
    //     timer = setInterval(() => {
    //       this._getRecharge();
    //     }, this.timeNum);
    //   }
    // });
    // this.$on("hook:deactivated", () => {
    //   console.log("clearInterval");
    //   clearInterval(timer);
    //   timer = null;
    // });
  },
  methods: {},
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
