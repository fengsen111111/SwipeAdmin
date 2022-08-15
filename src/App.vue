<template>
  <div>
    <a-config-provider :locale="locale" :get-popup-container="popContainer">
      <router-view />
    </a-config-provider>
    <audio
      webkit-playsinline="true"
      playsinline="true"
      controls="controls"
      hidden
      src="./assets/mp3/hint.mp3"
      ref="audio"
    ></audio>
  </div>
</template>

<script>
import { enquireScreen } from "./utils/util";
import { mapState, mapMutations } from "vuex";
import themeUtil from "@/utils/themeUtil";
import { getI18nKey } from "@/utils/routerUtil";
import { notification } from "ant-design-vue";
import Cookie from "js-cookie";
// import config from "./config";

export default {
  name: "App",
  data() {
    return {
      locale: {},
    };
  },
  created() {
    this.setHtmlTitle();
    this.setLanguage(this.lang);
    enquireScreen((isMobile) => this.setDevice(isMobile));
    const token = Cookie.get("token");
    if (token) {
      this.$store.dispatch("socket/socketInit");
    }
  },
  mounted() {
    this.setWeekModeTheme(this.weekMode);
    // console.log("==================>config", this.bettingTips);
    // admin.coinnmbtc.net
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val);
    },
    lang(val) {
      this.setLanguage(val);
      this.setHtmlTitle();
    },
    $route() {
      this.setHtmlTitle();
    },
    "theme.mode": function(val) {
      let closeMessage = this.$message.loading(
        `您选择了主题模式 ${val}, 正在切换...`
      );
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage);
    },
    "theme.color": function(val) {
      let closeMessage = this.$message.loading(
        `您选择了主题色 ${val}, 正在切换...`
      );
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage);
    },
    layout: function() {
      window.dispatchEvent(new Event("resize"));
    },
    // 弹出全局提示  配置点击事件
    newFiatWithdraw: function(val) {
      if (JSON.stringify(val) !== "{}") {
        this.$refs.audio.play();
        notification.info({
          duration: 10,
          message: "法币提现订单",
          description: `【${val.user.nickname}】法币提现【${val.usdt_money}】`,
          onClick: () => {
            this.$store.commit("socket/SET_WITHDRAW_NUM", "1");
            if (window.location.hash !== "#/withdraw/list") {
              this.$router.push({
                path: "/withdraw/list",
              });
            }
          },
        });
      }
    },
    newUsdtWithdraw: function(val) {
      if (JSON.stringify(val) !== "{}") {
        this.$refs.audio.play();
        notification.info({
          duration: 10,
          message: "USDT提现订单",
          description: `【${val.user.nickname}】USDT提现【${val.money}】`,
          onClick: () => {
            this.$store.commit("socket/SET_WITHDRAW_NUM", "2");
            if (window.location.hash !== "#/withdraw/list") {
              this.$router.push({
                path: "/withdraw/list",
              });
            }
          },
        });
      }
    },
    newUsdtRecharge: function(val) {
      if (JSON.stringify(val) !== "{}") {
        this.$refs.audio.play();
        notification.info({
          duration: 10,
          message: "USDT充值订单",
          description: `【${val.user.nickname}】USDT充值【${val.money}】`,
          onClick: () => {
            this.$store.commit("socket/SET_RECHARGE_NUM", "2");
            if (window.location.hash !== "#/recharge/list") {
              this.$router.push({
                path: "/recharge/list",
              });
            }
          },
        });
      }
    },
    newFiatRecharge: function(val) {
      // console.log("==================>val", val);
      // debugger
      if (JSON.stringify(val) !== "{}") {
        this.$refs.audio.play();
        notification.info({
          duration: 10,
          message: "法币充值订单",
          description: `【${val.user.nickname}】法币充值【${val.usdt_money}】`,
          onClick: () => {
            this.$store.commit("socket/SET_RECHARGE_NUM", "1");
            if (window.location.hash !== "#/recharge/list") {
              this.$router.push({
                path: "/recharge/list",
              });
            }
          },
        });
      }
    },
    // 弹出全局提示  配置点击事件
    takeOverPost: function(val) {
      console.log(this.bettingTips);
      if (JSON.stringify(val) !== "{}" && this.bettingTips) {
        this.$refs.audio.play();
        notification.info({
          duration: 10,
          message: "涨跌交易申购",
          description: `【${val.user.nickname}】【${
            val.symbol
          }】【${val.amount + " USDT"}】【${val.deadline + "s"}】`,
          onClick: () => {
            if (window.location.hash !== "#/risefall/trading-record") {
              this.$router.push({
                path: "/risefall/trading-record",
              });
            }
          },
        });
      }
    },

    // 交易投注提示
    bettingTipsResult: function(val) {
      console.log("==================>this.tradeBetTips", this.tradeBetTips);
      if (JSON.stringify(val) !== "{}" && this.tradeBetTips) {
        this.$refs.audio.play();
        notification.info({
          duration: 10,
          message: "交易投注",
          description: `你有新的交易投注订单`,
          onClick: () => {
            if (window.location.hash !== "#/deal/record") {
              this.$router.push({
                path: "/deal/record",
              });
            }
          },
        });
      }
    },
  },
  computed: {
    ...mapState("setting", [
      "layout",
      "theme",
      "weekMode",
      "lang",
      "bettingTips",
      "tradeBetTips",
    ]),
    // 法币充值
    newFiatRecharge() {
      return this.$store.state.socket.fiatRecharge;
    },
    // USDT 充值
    newUsdtRecharge() {
      return this.$store.state.socket.usdtRecharge;
    },
    // 法币提现
    newFiatWithdraw() {
      return this.$store.state.socket.fiatWithdraw;
    },
    //USDT 提现
    newUsdtWithdraw() {
      return this.$store.state.socket.usdtWithdraw;
    },

    // 提现记录
    // newWithdraw() {
    //   return this.$store.state.socket.withdrawList;
    // },
    // 涨跌交易记录
    takeOverPost() {
      return this.$store.state.socket.postListData;
    },
    // 交易投注
    bettingTipsResult() {
      console.log("==================>ths.", this.$store.state.socket.tradeBet);
      return this.$store.state.socket.tradeBet;
    },
  },
  methods: {
    ...mapMutations("setting", ["setDevice"]),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add("week-mode");
      } else {
        document.body.classList.remove("week-mode");
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang;
      switch (lang) {
        case "CN":
          this.locale = require("ant-design-vue/es/locale-provider/zh_CN").default;
          break;
        case "HK":
          this.locale = require("ant-design-vue/es/locale-provider/zh_TW").default;
          break;
        case "US":
        default:
          this.locale = require("ant-design-vue/es/locale-provider/en_US").default;
          break;
      }
    },
    setHtmlTitle() {
      const route = this.$route;
      const key =
        route.path === "/"
          ? "home.name"
          : getI18nKey(route.matched[route.matched.length - 1].path);
      document.title = process.env.VUE_APP_NAME + " | " + this.$t(key);
    },
    popContainer() {
      return document.getElementById("popContainer");
    },
  },
};
</script>

<style lang="less" scoped></style>
