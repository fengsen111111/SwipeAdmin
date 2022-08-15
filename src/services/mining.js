/*
 * @Author: your name
 * @Date: 2022-02-28 16:05:33
 * @LastEditTime: 2022-06-20 15:14:02
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\services\mining.js
 */
import { request, METHOD } from "@/utils/request";

import {
  ADD_VIRTUAL_CURRENCY,
  EDIT_VIRTUAL_CURRENCY,
  VIRTUAL_CURRENCY_LIST,
  DELETE_VIRTUAL_CURRENCY,
  //
  MINING_MACHINE_LIST,
  ADD_MINING_MACHINE,
  EDIT_MINING_MACHINE,
  DELETE_MINING_MACHINE,
  ALL_VIRTUAL_CURRENCY,
  // !图片上传
  IMG_UPLOAD,
  //
  MINING_BUY_RECORD,
  DIVIDEND_DETAILS,
  SETTLEMENT,
  ACTIVSTATUS,
  // 矿机等级
  EDIT_MINING_LEVEL,
  ADD_MINING_LEVEL,
  MINING_LEVEL_LIST,
  MINING_LEVEL_STATUS,
  ALL_MINING_LEVEL,
  // 矿机激活码
  MINING_CODE_LIST,
  ADD_MINING_CODE,
  DELETE_MINING_CODE,
  ALL_MINING_CODE,
  // 用户理财赠送平台币记录
  GET_GIFT_LIST,
} from "./api";

// 挖矿管理
// 虚拟币项目管理
export const addVirtualCurrency = (params) => {
  return request(ADD_VIRTUAL_CURRENCY, METHOD.POST, params);
};
export const editVirtualCurrency = (params) => {
  return request(EDIT_VIRTUAL_CURRENCY, METHOD.POST, params);
};
export const VirtualCurrencyList = (params) => {
  return request(VIRTUAL_CURRENCY_LIST, METHOD.POST, params);
};
export const deleteVirtualCurrency = (params) => {
  return request(DELETE_VIRTUAL_CURRENCY, METHOD.POST, params);
};

// 矿机项目管理
export const miningMachineList = (params) => {
  return request(MINING_MACHINE_LIST, METHOD.POST, params);
};
export const addMiningMachine = (params) => {
  return request(ADD_MINING_MACHINE, METHOD.POST, params);
};
export const editMiningMachine = (params) => {
  return request(EDIT_MINING_MACHINE, METHOD.POST, params);
};
export const deleteMiningMachine = (params) => {
  return request(DELETE_MINING_MACHINE, METHOD.POST, params);
};
export const allVirtualCurrency = () => {
  return request(ALL_VIRTUAL_CURRENCY, METHOD.POST);
};
export const imgUpload = (params) => {
  return request(IMG_UPLOAD, METHOD.POST, params);
};
export const activStatus = (params) => {
  return request(ACTIVSTATUS, METHOD.POST, params);
};
// 购买记录列表
export const miningBuyRecord = (params) => {
  return request(MINING_BUY_RECORD, METHOD.POST, params);
};
export const dividendDetails = (params) => {
  return request(DIVIDEND_DETAILS, METHOD.POST, params);
};
export const settlement = (params) => {
  return request(SETTLEMENT, METHOD.POST, params);
};
// 矿机等级
export const editMiningLevel = (params) => {
  return request(EDIT_MINING_LEVEL, METHOD.POST, params);
};
export const addMiningLevel = (params) => {
  return request(ADD_MINING_LEVEL, METHOD.POST, params);
};
export const miningLevelList = (params) => {
  return request(MINING_LEVEL_LIST, METHOD.POST, params);
};
export const miningLevelStatus = (params) => {
  return request(MINING_LEVEL_STATUS, METHOD.POST, params);
};
export const allMiningLevel = () => {
  return request(ALL_MINING_LEVEL, METHOD.POST);
};
// 矿机激活码
export const miningCodeList = (params) => {
  return request(MINING_CODE_LIST, METHOD.POST, params);
};
export const addMiningCode = (params) => {
  return request(ADD_MINING_CODE, METHOD.POST, params);
};
export const deleteMiningCode = (params) => {
  return request(DELETE_MINING_CODE, METHOD.POST, params);
};
export const allMiningCode = () => {
  return request(ALL_MINING_CODE, METHOD.POST);
};
//
export const getGiftList = (params) => {
  return request(GET_GIFT_LIST, METHOD.POST, params);
};
