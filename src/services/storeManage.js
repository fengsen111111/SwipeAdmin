import {
    request,
    METHOD
} from "@/utils/request";
import {
    // 店铺等级
    LIST_OF_GRADES,
    ADD_STORE_LEVEL,
    SET_STORE_LEVEL,
    ALL_TYPES_OF_PRODUCTS,//所有类型
    // 店铺审核
    STORE_AUDIT_LIST,
    STORE_AUDIT,
    AUDIT_CONFIGURATION,
    SHOP_LIST,//店铺列表
    SHOP_DETAILS,//店铺详情
    SHOP_TOP_SHELF,//已上架商品
    // 派单
    DISTRIBUTE_LEAFLETS,
    GENERATE_ORDER,
    DELIVER_GOODS,
    LOGISTICS_TEMPLATE,//物流模板
} from "./api";


//店铺等级管理
// export const getStoreLevel = (limit, page) => {
//     return request(`${LIST_OF_GRADES}?limit=${limit}&page=${page}`, METHOD.GET);
// };
export const getStoreLevel = (params) => {
    return request(`${LIST_OF_GRADES}`, METHOD.GET,params);
};
export const addStoreLevel = (params) => {
    return request(`${ADD_STORE_LEVEL}`, METHOD.POST, params);
};
export const setStoreLevel = (params) => {
    return request(`${SET_STORE_LEVEL}`, METHOD.POST, params);
};
export const allTypeProducts = () => {
    return request(`${ALL_TYPES_OF_PRODUCTS}`, METHOD.POST);
};
// 店铺审核管理
export const getStoreList = (params) => {
    return request(`${STORE_AUDIT_LIST}`, METHOD.GET, params);
};
export const auditStore = (params) => {
    return request(`${STORE_AUDIT}`, METHOD.POST, params);
};
export const operationStoreAudit = (params) => {
    return request(`${AUDIT_CONFIGURATION}`, METHOD.POST, params);
};
export const getShopList = (params) => {
    return request(`${SHOP_LIST}`, METHOD.GET, params);
};//店铺列表
export const getShopDetails = (params) => {
    return request(`${SHOP_DETAILS}`, METHOD.GET, params);
};//店铺详情
export const getShopTopShelf = (params) => {
    return request(`${SHOP_TOP_SHELF}`, METHOD.GET, params);
};//已上架商品

// 派单
export const getDistributeList = (params) => {
    return request(`${DISTRIBUTE_LEAFLETS}`, METHOD.POST, params);
};
export const caretDistribute = (params) => {
    return request(`${GENERATE_ORDER}`, METHOD.POST, params);
};
export const deliverGoods = (params) => {
    return request(`${DELIVER_GOODS}`, METHOD.POST, params);
};
export const getLogisticsTemplate = (params) => {
    return request(`${LOGISTICS_TEMPLATE}`, METHOD.POST, params);
};