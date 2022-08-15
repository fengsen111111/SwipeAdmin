import {
  request,
  METHOD
} from "@/utils/request";
import {
  LANGUAGE_ADD,
  LANGUAGE_LIST,
  LANGUAGE_BAN,
  LANGUAGE_EDIT,
  LANGUAGE_SYSTEM,
  ARTICLE_LIST,
  ARTICLE_DELETE,
  ARTICLE_CREATE,
  ARTICLE_UPDATE,
  ARTICLE_TYPE_CREATE,
  ARTICLE_TYPE_DELETE,
  ARTICLE_TYPE_LIST,
  ARTICLE_TYPE_UPDATE,
  ADVERTISING_CREATE,
  ADVERTISING_DELETE,
  ADVERTISING_LIST,
  ADVERTISING_UPDATE,
  JUMP_CREATE,
  JUMP_LIST,
  JUMP_UPDATE,
  BANNER_CREATE,
  BANNER_DELETE,
  BANNER_LIST,
  BANNER_UPDATE,
  SENSITIVE_CREATE,
  SENSITIVE_DELETE,
  SENSITIVE_LIST,
  SENSITIVE_UPDATE,
  BANK_TYPE_LIST,
  BANK_TYPE_CREATE,
  BANK_TYPE_UPDATE,
  DELIVERY_LIST,
  DELIVERY_UPDATE,
  SELZNICK_CREATE,
  SELZNICK_DELETE,
  SELZNICK_UPDATE,
  SELZNICK_LIST,
  FIRST_LEVEL,
  //
  TRANSACTION_LIST,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  //
  RECEIVE_ACCOUNT_LIST,
  ADD_RECEIVE_ACCOUNT,
  EDIT_RECEIVE_ACCOUNT,
  DELETE_RECEIVE_ACCOUNT,
  //
  //
  COUNTRY_LIST,
  COUNRTY_SWITCH,
  COUNRTY_SELECT,
  EDIT_COUNTRY,
  LANGUAGE_ALL,
  //
  FIATCURRENCY,
  ADD_FIAT_CURRENCY,
  EDIT_FIAT_CURRENCY,
  ALL_FIAT_CURRENCY,
  //合作伙伴
  PARTNER_LIST,
  ADD_PARTNER,
  EDIT_PARTNER,
  DELETE_PARTNER,
  // 热门店铺
  STORE_LIST,
  NEW_STORE,
  EDIT_STORE,
  DELETE_STORE,
  // 安全问题
  SAFETY_PROBLEM,
  ADD_SAFETY_PROBLEM,
  EDIT_SECURITY_ISSUES,
  DEL_SECURITY_ISSUE,
  // 站内信
  CLASSIFICATION_LIST,
  ADD_CLASSIFICATION,
  UPDATE_CLASSIFICATION,
  DEL_CLASSIFICATION,
  SEND_IN_STATION_LETTER,
  //邮箱模板
  FINDALL_LIST, //模板列表
  FINDALL_LIST_ADD, //新增
  FINDALL_LIST_REVISE, //修改
  FINDALL_LIST_DELETE, //删除
  // 城市列表
  CITIES_LIST,
  CITY_ADDITION,
  CITY_MODIFICATION,
  //街道列表
  STREET_LIST,
  STREET_ADD,
  STREET_EDITOR,
  NATIONAL_CITY,
} from "./api";

// 法币管理
export const fiatCurrency = (params) => {
  return request(FIATCURRENCY, METHOD.POST, params);
};
export const addFiatCurrency = (params) => {
  return request(ADD_FIAT_CURRENCY, METHOD.POST, params);
};
export const editFiatCurrency = (params) => {
  return request(EDIT_FIAT_CURRENCY, METHOD.POST, params);
};
export const allFiatCurrency = () => {
  return request(ALL_FIAT_CURRENCY, METHOD.POST);
};

// 国家
export const countryList = (params) => {
  return request(COUNTRY_LIST, METHOD.GET, params);
};
export const countrySwitch = (params) => {
  return request(COUNRTY_SWITCH, METHOD.POST, params);
};
export const countrySelect = () => {
  return request(COUNRTY_SELECT, METHOD.GET);
};
export const countryEdit = (params) => {
  return request(EDIT_COUNTRY, METHOD.POST, params);
};

// 所有启用语言
export const allLanguage = () => {
  return request(LANGUAGE_ALL, METHOD.POST);
};

// 入款账户
export const receiveAccountList = (params) => {
  return request(RECEIVE_ACCOUNT_LIST, METHOD.POST, params);
};
export const addReceiveAccount = (params) => {
  return request(ADD_RECEIVE_ACCOUNT, METHOD.POST, params);
};
export const editReceiveAccount = (params) => {
  return request(EDIT_RECEIVE_ACCOUNT, METHOD.POST, params);
};
export const deleteReceiveAccount = (params) => {
  return request(DELETE_RECEIVE_ACCOUNT, METHOD.POST, params);
};

// 榜单列表
export const transaction = (params) => {
  return request(TRANSACTION_LIST, METHOD.POST, params);
};
export const addTransaction = (params) => {
  return request(ADD_TRANSACTION, METHOD.POST, params);
};
export const deleteTransaction = (params) => {
  return request(DELETE_TRANSACTION, METHOD.POST, params);
};

// 多语言管理
export const getLanguages = (params) => {
  return request(LANGUAGE_LIST, METHOD.POST, params);
};

export const createLanguage = (params) => {
  return request(LANGUAGE_ADD, METHOD.POST, params);
};
export const banLanguage = (params) => {
  return request(LANGUAGE_BAN, METHOD.POST, params);
};
export const updateLanguage = (params) => {
  return request(LANGUAGE_EDIT, METHOD.POST, params);
};
export const systemLanguage = (params) => {
  return request(LANGUAGE_SYSTEM, METHOD.POST, params);
};

// 文章 类型列表
export const getArticleTypes = () => {
  return request(ARTICLE_TYPE_LIST, METHOD.POST);
};
export const createArticleType = (params) => {
  return request(ARTICLE_TYPE_CREATE, METHOD.POST, params);
};
export const deleteArticleType = (params) => {
  return request(ARTICLE_TYPE_DELETE, METHOD.POST, params);
};
export const updateArticleType = (params) => {
  return request(ARTICLE_TYPE_UPDATE, METHOD.POST, params);
};
// 文章列表
export const getArticles = (params) => {
  return request(ARTICLE_LIST, METHOD.POST, params);
};
export const createArticle = (params) => {
  return request(ARTICLE_CREATE, METHOD.POST, params);
};
export const deleteArticle = (params) => {
  return request(ARTICLE_DELETE, METHOD.POST, params);
};
export const updateArticle = (params) => {
  return request(ARTICLE_UPDATE, METHOD.POST, params);
};

// 广告类型
export const getAdvertisingTypes = () => {
  return request(ADVERTISING_LIST, METHOD.POST);
};
export const createAdvertisingType = (params) => {
  return request(ADVERTISING_CREATE, METHOD.POST, params);
};
export const deleteAdvertisingType = (params) => {
  return request(ADVERTISING_DELETE, METHOD.POST, params);
};
export const updateAdvertisingType = (params) => {
  return request(ADVERTISING_UPDATE, METHOD.POST, params);
};
// 跳转页配置
export const getJumpList = () => {
  return request(JUMP_LIST, METHOD.POST);
};
export const createJump = (params) => {
  return request(JUMP_CREATE, METHOD.POST, params);
};
export const updateJump = (params) => {
  return request(JUMP_UPDATE, METHOD.POST, params);
};

// 广告图列表
export const getBannerList = (params) => {
  return request(BANNER_LIST, METHOD.POST, params);
};
export const createBanner = (params) => {
  return request(BANNER_CREATE, METHOD.POST, params);
};
export const deleteBanner = (params) => {
  return request(BANNER_DELETE, METHOD.POST, params);
};
export const updateBanner = (params) => {
  return request(BANNER_UPDATE, METHOD.POST, params);
};

// 敏感词
export const getSensitiveList = (params) => {
  return request(SENSITIVE_LIST, METHOD.POST, params);
};
export const createSensitive = (params) => {
  return request(SENSITIVE_CREATE, METHOD.POST, params);
};
export const deleteSensitive = (params) => {
  return request(SENSITIVE_DELETE, METHOD.POST, params);
};
export const updateSensitive = (params) => {
  return request(SENSITIVE_UPDATE, METHOD.POST, params);
};
// 银行卡
export const getBankTypeList = (params) => {
  return request(BANK_TYPE_LIST, METHOD.POST, params);
};
export const createBankType = (params) => {
  return request(BANK_TYPE_CREATE, METHOD.POST, params);
};
export const updateBankType = (params) => {
  return request(BANK_TYPE_UPDATE, METHOD.POST, params);
};

// 配送类型
export const getDeliveryList = (params) => {
  return request(DELIVERY_LIST, METHOD.POST, params);
};
export const updateDelivery = (params) => {
  return request(DELIVERY_UPDATE, METHOD.POST, params);
};

// 自提点
export const getSelznickList = (params) => {
  return request(SELZNICK_LIST, METHOD.POST, params);
};
export const createSelznick = (params) => {
  return request(SELZNICK_CREATE, METHOD.POST, params);
};
export const deleteSelznick = (params) => {
  return request(SELZNICK_DELETE, METHOD.POST, params);
};
export const updateSelznick = (params) => {
  return request(SELZNICK_UPDATE, METHOD.POST, params);
};

export const getFirstLevel = () => {
  return request(FIRST_LEVEL, METHOD.POST);
};
// 合作伙伴
export const getPartnerList = (params) => {
  return request(PARTNER_LIST, METHOD.GET, params)
}
export const getAddPartner = (params) => {
  return request(ADD_PARTNER, METHOD.POST, params)
}
export const setEditPartner = (params) => {
  return request(EDIT_PARTNER, METHOD.POST, params)
}
export const deletePartner = (params) => {
  return request(DELETE_PARTNER, METHOD.POST, params)
}
// 热门店铺
export const getStoreList = (params) => {
  return request(STORE_LIST, METHOD.GET, params)
}
export const createNewStore = (params) => {
  return request(NEW_STORE, METHOD.POST, params)
}
export const setEditStore = (params) => {
  return request(EDIT_STORE, METHOD.POST, params)
}
export const deleteStore = (params) => {
  return request(DELETE_STORE, METHOD.POST, params)
}
// 安全问题
export const getSafetyProblemList = (params) => {
  return request(SAFETY_PROBLEM, METHOD.GET, params)
}
export const createSecurityIssues = (params) => {
  return request(ADD_SAFETY_PROBLEM, METHOD.POST, params)
}
export const setSecurityIssues = (params) => {
  return request(EDIT_SECURITY_ISSUES, METHOD.POST, params)
}
export const deleteSecurityIssues = (params) => {
  return request(DEL_SECURITY_ISSUE, METHOD.POST, params)
}
// 站内信
export const getClassificationList = (params) => {
  return request(CLASSIFICATION_LIST, METHOD.POST, params)
}
export const createClassification = (params) => {
  return request(ADD_CLASSIFICATION, METHOD.POST, params)
}
export const setClassification = (params) => {
  return request(UPDATE_CLASSIFICATION, METHOD.POST, params)
}
export const deleteClassification = (params) => {
  return request(DEL_CLASSIFICATION, METHOD.POST, params)
}
export const sendInStationLetter = (params) => {
  return request(SEND_IN_STATION_LETTER, METHOD.POST, params)
}
//邮箱模板
export const findAlllist = (params) => {
  return request(FINDALL_LIST, METHOD.GET, params)
}
//新增
export const findAdd = (params) => {
  return request(FINDALL_LIST_ADD, METHOD.POST, params)
}
// 修改
export const findRevise = (params) => {
  return request(FINDALL_LIST_REVISE, METHOD.POST, params)
}
// 删除
export const findDelete = (params) => {
  return request(FINDALL_LIST_DELETE, METHOD.POST, params)
}
// 城市列表
export const getCitiesList = (params) => {
  return request(CITIES_LIST, METHOD.POST, params)
}
export const addCityAddition = (params) => {
  return request(CITY_ADDITION, METHOD.POST, params)
}
export const setCityModification = (params) => {
  return request(CITY_MODIFICATION, METHOD.POST, params)
}

export const getCountrySelect = (params) => {
  return request(COUNRTY_SELECT, METHOD.GET, params)
}
// 街道列表
export const getStreetList = (params) => {
  return request(STREET_LIST, METHOD.POST, params)
}
export const addStreet = (params) => {
  return request(STREET_ADD, METHOD.POST, params)
}
export const editStreetEditor = (params) => {
  return request(STREET_EDITOR, METHOD.POST, params)
}
export const setNationalCity = (params) => {
  return request(NATIONAL_CITY, METHOD.GET, params)
}