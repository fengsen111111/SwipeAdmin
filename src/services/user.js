import {
  LOGIN,
  ROUTES,
  USER_CREATE,
  USER_LIST,
  USER_BAN,
  USER_UPDATE,
  VERIFIED_LIST,
  VERIFIED_REVIEW,
  ADDRESS_LIST,
  ADDRESS_UPDATE,
  ADDRESS_DELETE,
  BANK_DELETE,
  BANK_LIST,
  BANK_TYPE,
  BANK_UPDATE,
  PROXY_USER_LIST,
  UP_POINTS,
  DOWN_POINTS,
  GIFT_MONEY,
  FUNDING_DETAILS,
  IP_LIST,
  BAN_USER_IP,
  POST_SINGLE_DETAILS,
  POST_SINGLE_LIST,
  POST_SINGLE_REVIEW,
  PURCHASE_LIST,
  FIRST_RECHARGES,
  DASHBOARD_LIST,
  BULK_USER,
  AVATAR_UPDATE,
  AVATAR_CREATE,
  AVATAR_LIST,
  AVATAR_DELETE,
  TEST_USER_CREATE,
  TEST_USER_LIST,
  TEST_USER_DELETE,
  TEST_USER_UPDATE,
  RANDOMLY_NAME,
  AVATAR_ALL,
  KICK_USER,
  MODIFY_AGENT,
  GET_ADDRESS_LIST,
  EDIT_ADDRESS,
  USER_CURRENCY_WALLET,
  EDIT_NUMBER_OF_GOLD_COINS,
  BACKGROUND_CURRENCY_OPERATION,
  USER_WALLET_FLASH_CASH_RECORD,
  USER_ADD_PLATFORM_CURRENCY,

  USER_LOGISTICS_TEMPLATE,// 物流模板列表
  USER_ADD_LOGISTICS,// 新增物流模板
  LOGISTICS_TEMPLATE_DETAILS,//物流模板详情列表
  COUNRTY_SELECT,//国家--下拉选择
  ADD_LOGISTICS_TEMPLATE,//新增物流模板详情
  EDIT_LOGISTICS_TEMPLATE,//物流模板详情----编辑

  LIST_OF_COMMISSION_DETAILS,

} from "./api";
import { request, METHOD, removeAuthorization } from "@/utils/request";

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password, code) {
  return request(LOGIN, METHOD.POST, {
    username: name,
    password: password,
    code: code,
  });
}
export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET);
}

// 用户
export const getUserList = (params) => {
  return request(USER_LIST, METHOD.POST, params);
};
export const banUser = (params) => {
  return request(USER_BAN, METHOD.POST, params);
};
export const createUser = (params) => {
  return request(USER_CREATE, METHOD.POST, params);
};
export const updateUser = (params) => {
  return request(USER_UPDATE, METHOD.POST, params);
};
export const getCommissionList = (params) => {
  return request(LIST_OF_COMMISSION_DETAILS, METHOD.POST, params);
};

// 提币地址列表
export const walletAddressList = (params) => {
  return request(GET_ADDRESS_LIST, METHOD.POST, params);
};
export const editWalletAddress = (params) => {
  return request(EDIT_ADDRESS, METHOD.POST, params);
};
// 实名认证

export const getVerifiedList = (params) => {
  return request(VERIFIED_LIST, METHOD.POST, params);
};
export const reviewVerified = (params) => {
  return request(VERIFIED_REVIEW, METHOD.POST, params);
};
// 地址列表
export const getAddressList = (params) => {
  return request(ADDRESS_LIST, METHOD.POST, params);
};
export const addressUpdate = (params) => {
  return request(ADDRESS_UPDATE, METHOD.POST, params);
};
export const addressDelete = (params) => {
  return request(ADDRESS_DELETE, METHOD.POST, params);
};
// 银行卡列表
export const getBankList = (params) => {
  return request(BANK_LIST, METHOD.POST, params);
};
export const bankUpdate = (params) => {
  return request(BANK_UPDATE, METHOD.POST, params);
};
export const bankDelete = (params) => {
  return request(BANK_DELETE, METHOD.POST, params);
};
export const getBankType = (params) => {
  return request(BANK_TYPE, METHOD.POST, params);
};
// 获取所有员工代理
export const getProxyUserList = (params) => {
  return request(PROXY_USER_LIST, METHOD.POST, params);
};
// 上下分
export const upPoints = (params) => {
  return request(UP_POINTS, METHOD.POST, params);
};
export const downPoints = (params) => {
  return request(DOWN_POINTS, METHOD.POST, params);
};
export const giftMoney = (params) => {
  return request(GIFT_MONEY, METHOD.POST, params);
};
export const getFundingDetails = (params) => {
  return request(FUNDING_DETAILS, METHOD.POST, params);
};

export const getIpList = (params) => {
  return request(IP_LIST, METHOD.POST, params);
};
export const banUserIp = (params) => {
  return request(BAN_USER_IP, METHOD.POST, params);
};
// 晒单信息
export const getPostSingleList = (params) => {
  return request(POST_SINGLE_LIST, METHOD.POST, params);
};
export const getPostSingleDetails = (params) => {
  return request(POST_SINGLE_DETAILS, METHOD.POST, params);
};
export const postSingleReview = (params) => {
  return request(POST_SINGLE_REVIEW, METHOD.POST, params);
};
// 购买统计
export const getPurchaseList = (params) => {
  return request(PURCHASE_LIST, METHOD.POST, params);
};
export const firstCharge = (params) => {
  return request(FIRST_RECHARGES, METHOD.POST, params);
};
// 统计
export const getDashboardList = (params) => {
  return request(DASHBOARD_LIST, METHOD.POST, params);
};
export const bulkUser = (params) => {
  return request(BULK_USER, METHOD.POST, params);
};
// 头像库
export const avatarCreate = (params) => {
  return request(AVATAR_CREATE, METHOD.POST, params);
};
export const avatarList = (params) => {
  return request(AVATAR_LIST, METHOD.POST, params);
};
export const avatarUpdate = (params) => {
  return request(AVATAR_UPDATE, METHOD.POST, params);
};
export const avatarDelete = (params) => {
  return request(AVATAR_DELETE, METHOD.POST, params);
};
// 测试用户
export const testUserCreate = (params) => {
  return request(TEST_USER_CREATE, METHOD.POST, params);
};
export const testUserList = (params) => {
  return request(TEST_USER_LIST, METHOD.POST, params);
};
export const testUserDelete = (params) => {
  return request(TEST_USER_DELETE, METHOD.POST, params);
};
export const testUserUpdate = (params) => {
  return request(TEST_USER_UPDATE, METHOD.POST, params);
};
export const randomlyName = (params) => {
  return request(RANDOMLY_NAME, METHOD.POST, params);
};
export const avatarAll = (params) => {
  return request(AVATAR_ALL, METHOD.POST, params);
};
export const kickUser = (params) => {
  return request(KICK_USER, METHOD.POST, params);
};
export const modifyAgent = (params) => {
  return request(MODIFY_AGENT, METHOD.POST, params);
};
// 用户货币钱包
export const userCurrencyWallet = (params) => {
  return request(USER_CURRENCY_WALLET, METHOD.POST, params)//用户货币钱包列表
}
export const editCurrencyQuantity = (params) => {
  return request(EDIT_NUMBER_OF_GOLD_COINS, METHOD.POST, params)//编辑币数量
}
export const backgroundCurrencyOperation = (params) => {
  return request(BACKGROUND_CURRENCY_OPERATION, METHOD.POST, params)//后台币操作记录
}
export const userWalletFlashCashRecord = (params) => {
  return request(USER_WALLET_FLASH_CASH_RECORD, METHOD.POST, params)//用户钱包闪兑记录
}
// 用户添加平台币
export const addPlatformCoin = (params) => {
  return request(USER_ADD_PLATFORM_CURRENCY, METHOD.POST, params)//用户添加平台币
}
//物流模板列表
export const userLogistics = (params) => {
  return request(USER_LOGISTICS_TEMPLATE, METHOD.POST, params)//物流模板列表
}
//新增物流模板
export const userAddLogistics = (params) => {
  return request(USER_ADD_LOGISTICS, METHOD.POST, params)//新增物流模板 
}
//物流模板详情列表
export const userLogisticsDetails = (params) => {
  return request(LOGISTICS_TEMPLATE_DETAILS, METHOD.POST, params)//物流模板详情列表 LOGISTICS_TEMPLATE_DETAILS
}
//国家--下拉选择
export const userCounritSelect = (params) => {
  return request(COUNRTY_SELECT, METHOD.GET, params)//国家--下拉选择 COUNRTY_SELECT
}
//新增物流模板详情
export const addLogisticsDetails = (params) => {
  return request(ADD_LOGISTICS_TEMPLATE, METHOD.POST, params)//新增物流模板详情
}
//物流模板详情----编辑
export const editLogisticsDetails = (params) => {
  return request(EDIT_LOGISTICS_TEMPLATE, METHOD.POST, params)//物流模板详情----编辑
}
/**
 * 退出登录   
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
  removeAuthorization();
}
export default {
  login,
  logout,
  getRoutesConfig,
};
