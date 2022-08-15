// **********************************************
// 创建时间: 2021-11-26 13:22:04
// description:'活动管理'
// **********************************************
import { request, METHOD } from "@/utils/request";

import {
  ACTIVITY_BAN,
  ACTIVITY_LIST,
  ACTIVITY_UPDATE,
  ACTIVITY_CREATE,
  RECHARGE_GIFT_BAN,
  RECHARGE_GIFT_CREATE,
  RECHARGE_GIFT_LIST,
  RECHARGE_GIFT_UPDATE,
  INVITE_LIST,
  INVITE_UPDATE,
  FIRST_RECHARGE_LIST,
  FIRST_RECHARGE_CREATE,
  FIRST_RECHARGE_DELETE,
  FIRST_RECHARGE_UPDATE,
  GROUP_LIST,
  REVIEW_GROUP,
  SIGN_LIST,
  SIGN_UPDATE,
  SIGN_ADD,
  SIGN_BAN,
  SIGN_RULES_LIST,
  ADD_SIGN_RULES,
  EDIT_SIGN_RULES,
} from "./api";

// 签到配置
export const signRulesList = () => {
  return request(SIGN_RULES_LIST, METHOD.POST);
};
export const addSignRules = (params) => {
  return request(ADD_SIGN_RULES, METHOD.POST, params);
};
export const editSignRules = (params) => {
  return request(EDIT_SIGN_RULES, METHOD.POST, params);
};

// 活动管理
export const activityList = (params) => {
  return request(ACTIVITY_LIST, METHOD.POST, params);
};
export const activityUpdate = (params) => {
  return request(ACTIVITY_UPDATE, METHOD.POST, params);
};
export const activityBan = (params) => {
  return request(ACTIVITY_BAN, METHOD.POST, params);
};
export const activityCreate = (params) => {
  return request(ACTIVITY_CREATE, METHOD.POST, params);
};

// 充值赠送
export const rechargeGiftBan = (params) => {
  return request(RECHARGE_GIFT_BAN, METHOD.POST, params);
};
export const rechargeGiftCreate = (params) => {
  return request(RECHARGE_GIFT_CREATE, METHOD.POST, params);
};
export const rechargeGiftList = (params) => {
  return request(RECHARGE_GIFT_LIST, METHOD.POST, params);
};
export const rechargeGiftUpdate = (params) => {
  return request(RECHARGE_GIFT_UPDATE, METHOD.POST, params);
};

// 邀请返佣
export const inviteList = (params) => {
  return request(INVITE_LIST, METHOD.POST, params);
};
export const inviteUpdate = (params) => {
  return request(INVITE_UPDATE, METHOD.POST, params);
};

// 邀请首充
export const firstRechargeList = (params) => {
  return request(FIRST_RECHARGE_LIST, METHOD.POST, params);
};
export const firstRechargeCreate = (params) => {
  return request(FIRST_RECHARGE_CREATE, METHOD.POST, params);
};
export const firstRechargeDelete = (params) => {
  return request(FIRST_RECHARGE_DELETE, METHOD.POST, params);
};
export const firstRechargeUpdate = (params) => {
  return request(FIRST_RECHARGE_UPDATE, METHOD.POST, params);
};

// 进群奖励
export const groupList = (params) => {
  return request(GROUP_LIST, METHOD.POST, params);
};
export const reviewGroup = (params) => {
  return request(REVIEW_GROUP, METHOD.POST, params);
};

// 签到礼包
export function getEvent() {
  return request(SIGN_LIST, METHOD.POST);
}
export function createPack(params) {
  return request(SIGN_ADD, METHOD.POST, params);
}
export function updatePack(params) {
  return request(SIGN_UPDATE, METHOD.POST, params);
}
export function banPack(params) {
  return request(SIGN_BAN, METHOD.POST, params);
}
