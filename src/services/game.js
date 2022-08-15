/*
 * @Author: your name
 * @Date: 2022-02-28 11:19:29
 * @LastEditTime: 2022-06-14 17:14:19
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\services\game.js
 */
import { request, METHOD } from "@/utils/request";

import {
  ALL_CURRENCY,
  CURRENCY_LIST,
  CURRENCY_SORT,
  CURRENCY_STATUS,
  HOME_CURRENCY_LIST,
  UPDATE_HOME_CURRENCY,
  ALL_PLATFORM_CURRENCY,
  PLATFORM_CURRENCY_LIST,
  PLATFORM_CURRENCY_SORT,
  PLATFORM_CURRENCY_STATUS,
  ADD_PLATFORM_CURRENCY,
  EDIT_PLATFORM_CURRENCY,
  //
  MODULE_LIST,
  ADD_MODULE,
  EDIT_MODULE,
  DELETE_MODULE,
  DETAILS_MODULE,
  SORT_MODULE,
  STATUS_MODULE,
  ISSUED_VOLUME,
} from "./api";

// 币种列表
export const allCurrency = () => {
  return request(ALL_CURRENCY, METHOD.POST);
};
export const currencyList = (params) => {
  return request(CURRENCY_LIST, METHOD.POST, params);
};
export const currencySort = (params) => {
  return request(CURRENCY_SORT, METHOD.POST, params);
};
export const currencyStatus = (params) => {
  return request(CURRENCY_STATUS, METHOD.POST, params);
};
export const homeCurrencyList = () => {
  return request(HOME_CURRENCY_LIST, METHOD.POST);
};
export const updateHomeCurrency = (params) => {
  return request(UPDATE_HOME_CURRENCY, METHOD.POST, params);
};

// 平台币
export const allPlatformCurrency = () => {
  return request(ALL_PLATFORM_CURRENCY, METHOD.POST);
};
export const platformCurrencyList = (params) => {
  return request(PLATFORM_CURRENCY_LIST, METHOD.POST, params);
};
export const platformCurrencySort = (params) => {
  return request(PLATFORM_CURRENCY_SORT, METHOD.POST, params);
};
export const platformCurrencyStatus = (params) => {
  return request(PLATFORM_CURRENCY_STATUS, METHOD.POST, params);
};
export const addPlatformCurrency = (params) => {
  return request(ADD_PLATFORM_CURRENCY, METHOD.POST, params);
};
export const editPlatformCurrency = (params) => {
  return request(EDIT_PLATFORM_CURRENCY, METHOD.POST, params);
};
export const editIssuedVolume = (params) => {
  return request(ISSUED_VOLUME, METHOD.POST, params);
};
// 模块管理
export const getModuleList = () => {
  return request(MODULE_LIST, METHOD.GET);
};
export const addModule = (params) => {
  return request(ADD_MODULE, METHOD.POST, params);
};
export const editModule = (params) => {
  return request(EDIT_MODULE, METHOD.POST, params);
};
export const deleteModule = (params) => {
  return request(DELETE_MODULE, METHOD.POST, params);
};
export const detailsModule = (params) => {
  return request(DETAILS_MODULE, METHOD.POST, params);
};
export const sortModule = (params) => {
  return request(SORT_MODULE, METHOD.POST, params);
};
export const statusModule = (params) => {
  return request(STATUS_MODULE, METHOD.POST, params);
};
