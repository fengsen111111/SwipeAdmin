/*
 * @Author: your name
 * @Date: 2022-02-23 14:43:16
 * @LastEditTime: 2022-03-30 11:33:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\services\system.js
 */
import { request, METHOD } from "@/utils/request";
import {
  SMS_LIST,
  CREATE_SMS,
  UPDATE_SMS,
  DELETE_SMS,
  CONFIG_LIST,
  CONFIG_UPDATE,
  IP_SYSTEM_CREATE,
  IP_SYSTEM_UPDATE,
  IP_SYSTEM_DELETE,
  IP_SYSTEM_LIST,
  ADMIN_LOG_LIST,
  PAY_ADD,
  PAY_LIST,
  PAY_UPDATE,
  PAY_BAN,
  GOOGLE_LIST,
  GOOGLE_BIND,
  CODE_SMS_LIST,
  BANKTYPE_LIST,
  BANKTYPE_SWITCH,
  ADD_BANKTYPE,
  EDIT_BANKTYPE,
} from "./api";

// 银行卡列表
export const bankTypeList = (params) => {
  return request(BANKTYPE_LIST, METHOD.POST, params);
};
export const bankTypeSwitch = (params) => {
  return request(BANKTYPE_SWITCH, METHOD.POST, params);
};
export const addBankType = (params) => {
  return request(ADD_BANKTYPE, METHOD.POST, params);
};
export const editBanktype = (params) => {
  return request(EDIT_BANKTYPE, METHOD.POST, params);
};

export const getSmsCode = (params) => {
  return request(SMS_LIST, METHOD.GET, params);
};
export const createSms = (params) => {
  return request(CREATE_SMS, METHOD.POST, params);
};
export const updateSms = (params) => {
  return request(UPDATE_SMS, METHOD.POST, params);
};
export const deleteSms = (params) => {
  return request(DELETE_SMS, METHOD.POST, params);
};

// 系统配置
export const getConfigList = () => {
  return request(CONFIG_LIST, METHOD.POST);
};
export const updateConfig = (params) => {
  return request(CONFIG_UPDATE, METHOD.POST, params);
};

// IP白名单
export const createIpSystem = (params) => {
  return request(IP_SYSTEM_CREATE, METHOD.POST, params);
};
export const updateIpSystem = (params) => {
  return request(IP_SYSTEM_UPDATE, METHOD.POST, params);
};
export const deleteIpSystem = (params) => {
  return request(IP_SYSTEM_DELETE, METHOD.POST, params);
};
export const getIpSystemList = (params) => {
  return request(IP_SYSTEM_LIST, METHOD.POST, params);
};
export const getAdminLogList = (params) => {
  return request(ADMIN_LOG_LIST, METHOD.POST, params);
};

// 支付配置
export const payAdd = (params) => {
  return request(PAY_ADD, METHOD.POST, params);
};
export function getPay(params) {
  return request(PAY_LIST, METHOD.POST, params);
}
export function updatePay(params) {
  return request(PAY_UPDATE, METHOD.POST, params);
}
export function payBan(params) {
  return request(PAY_BAN, METHOD.POST, params);
}

export function getGoogle(params) {
  return request(GOOGLE_LIST, METHOD.POST, params);
}
export function unBindGoogle(params) {
  return request(GOOGLE_BIND, METHOD.POST, params);
}
export function getCodeSms(params) {
  return request(CODE_SMS_LIST, METHOD.POST, params);
}
