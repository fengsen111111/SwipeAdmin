/*
 * @Author: your name
 * @Date: 2022-03-24 17:31:59
 * @LastEditTime: 2022-04-27 19:37:13
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\services\finance.js
 */
import {
  BONUS_LIST,
  UP_DOWN_RECORDS,
  RECHARGE_LIST,
  WITHDRAW_LIST,
  PAY_AISLE,
  WITHDRAW_AUDIT,
  WITHDRAW_LOCK,
  WITHDRAW_BATCH,
  USER_ID,
  MANUAL_RECHARGE,
  COMMISSION_LIST,
  MANUAL_WITHDRAW,
  PAY_RECHARGE,
  FIAT_CURRENCY_LIST,
  USDT_RECHARGE_LIST,
  USDT_RECHARGE_AUDIT,
  USDT_WITHDRAW_LIST,
  USDT_WITHDRAW_AUDIT,
  BETNUM_RECORD,
  COMMISSION_TOTAL,
  COMMISSION_LIST_SEARCH,
  COMMISSION_DETAILS,
  AUDIT_COMMISSION,
} from "./api";
import { request, METHOD } from "@/utils/request";

// 打码量记录
export const betnumRecord = (params) => {
  return request(BETNUM_RECORD, METHOD.POST, params);
};

// USDT 充值
export const usdtRechargeList = (params) => {
  return request(USDT_RECHARGE_LIST, METHOD.POST, params);
};
export const usdtRechargeAudit = (params) => {
  return request(USDT_RECHARGE_AUDIT, METHOD.POST, params);
};

// USDT 提现
export const usdtWithdrawList = (params) => {
  return request(USDT_WITHDRAW_LIST, METHOD.POST, params);
};
export const usdtWithdrawAudit = (params) => {
  return request(USDT_WITHDRAW_AUDIT, METHOD.POST, params);
};

// 法币列表
export const fiatCurrencyList = () => {
  return request(FIAT_CURRENCY_LIST, METHOD.POST);
};

export const getBonusList = (params) =>
  request(BONUS_LIST, METHOD.POST, params);

export const getUpDownRecords = (params) => {
  return request(UP_DOWN_RECORDS, METHOD.POST, params);
};
// 充值
export const getRechargeList = (params) => {
  return request(RECHARGE_LIST, METHOD.POST, params);
};
export function manualRecharge(params) {
  return request(MANUAL_RECHARGE, METHOD.POST, params);
}

// 提现
export function getWithdraw(params) {
  return request(WITHDRAW_LIST, METHOD.POST, params);
}
export function userById(params) {
  return request(USER_ID, METHOD.POST, params);
}
export function getAisle() {
  return request(PAY_AISLE, METHOD.GET);
}
export function withdrawalAudit(params) {
  return request(WITHDRAW_AUDIT, METHOD.POST, params);
}
export function withdrawLock(params) {
  return request(WITHDRAW_LOCK, METHOD.POST, params);
}
export function withdrawBatch(params) {
  return request(WITHDRAW_BATCH, METHOD.POST, params);
}
export function manualWithdraw(params) {
  return request(MANUAL_WITHDRAW, METHOD.POST, params);
}

// TODO
export const getPay = (params) => {
  return request(PAY_AISLE, METHOD.GET, params);
};
export const getCommissionList = (params) => {
  return request(COMMISSION_LIST, METHOD.POST, params);
};
export const getCommissionTotal = (params) => {
  return request(COMMISSION_TOTAL, METHOD.POST, params);
};
// 充值渠道
export const getPayList = (params) => {
  return request(PAY_RECHARGE, METHOD.POST, params);
};
// 用户提佣
export const getCommissionListSearch = (params) => {
  return request(COMMISSION_LIST_SEARCH, METHOD.GET, params);
};
export const getCommissionDetails = (params) => {
  return request(COMMISSION_DETAILS, METHOD.POST, params);
};
export const AuditCommission = (params) => {
  return request(AUDIT_COMMISSION, METHOD.POST, params);
};
