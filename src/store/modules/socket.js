/*
 * @Author: your name
 * @Date: 2022-02-23 14:43:16
 * @LastEditTime: 2022-03-30 14:04:09
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\store\modules\socket.js
 */
import Socket from "@/utils/websocket.js";
export default {
  namespaced: true,
  state: {
    ws: null,
    newOrderData: null,
    refreshNum: {},
    withdrawList: {},
    // 涨跌交易推送 10004
    postListData: {},
    // 法币充值 10003
    fiatRecharge: {},
    // 法币提现 10008
    fiatWithdraw: {},
    // USDT充值 10009
    usdtRecharge: {},
    // USDT提现 10010
    usdtWithdraw: {},
    // 充值tabs值
    rechargeNum: "1",
    // 提现tabs值
    withdrawNum: "1",
    // 彩票开奖  10007
    lotteryDraw: {},
    // 交易投注    10014
    tradeBet: {},
  },
  getters: {},
  mutations: {
    contentSocket(state, { commit }) {
      state.ws = new Socket(commit);
    },
    // 接收socket消息
    subscribe_socket(state, { code, data }) {
      console.log("==================>code,data", code, data);
      switch (Number(code)) {
        case 10003: // 法币充值
          state.fiatRecharge = data;
          state.rechargeNum = "1";
          return;
        case 10009: // USDT 充值
          state.usdtRecharge = data;
          state.rechargeNum = "2";
          return;
        case 10008: // 法币提现
          state.fiatWithdraw = data;
          state.withdrawNum = "1";
          return;
        case 10010: //USDT 提现
          state.usdtWithdraw = data;
          state.withdrawNum = "2";
          return;
        case 10007: // 彩票开奖
          state.lotteryDraw = data;
          return;
        case 10004: // 涨跌交易记录
          return (state.postListData = data);
        case 10014: // 交易投注
          console.log("==================>data", data);
          return (state.tradeBet = data);
        default:
          break;
      }
    },
    SET_REFRESH(state, payload) {
      state.refreshNum = payload;
    },
    SET_WITHDRAW_NUM(state, payload) {
      state.withdrawNum = payload;
    },
    SET_RECHARGE_NUM(state, payload) {
      state.rechargeNum = payload;
    },
  },
  actions: {
    // 创建实例
    socketInit({ commit }) {
      commit("contentSocket", {
        commit,
      }); // 把commit作为参数
    },
  },
};
