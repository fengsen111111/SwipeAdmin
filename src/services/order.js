import { request, METHOD } from "@/utils/request";
import {
    ORDER_LIST_USER,
    ORDER_DETAILS_GOODS,//订单详情
    // 单个商品
    RETURN_OF_SINGLE_COMMODITY,
    REBATE_OF_SINGLE_ORDER,
    CONFIRM_RECEIPT_OF_INDIVIDUAL_GOODS,
    // 多个商品
    RETURN_OF_MULTIPLE_PRODUCTS,
    REBATE_OF_MULTIPLE_COMMODITIES,
    CONFIRM_RECEIPT_OF_MULTIPLE_PRODUCTS,
    // 订单一键
    ONE_CLICK_RETURN_OF_ORDER,
    ONE_CLICK_REBATE_FOR_ORDERS,
    ONE_CLICK_TO_CONFIRM_RECEIPT,
} from "./api";

// 订单列表
export const getOrderList = (params) => {
  return request(ORDER_LIST_USER, METHOD.POST, params);
};
export const getOrderDetails = (params) => {
  return request(ORDER_DETAILS_GOODS, METHOD.POST, params);//订单详情
};
// ---- 单个商品
export const returnOfSingleCommodity = (params) => {
  return request(RETURN_OF_SINGLE_COMMODITY, METHOD.POST, params);
};
export const rebateOfSingleOrder = (params) => {
  return request(REBATE_OF_SINGLE_ORDER, METHOD.POST, params);
};
export const confirmReceiptOfIndividualGoods = (params) => {
  return request(CONFIRM_RECEIPT_OF_INDIVIDUAL_GOODS, METHOD.POST, params);
};
// ----多个商品
export const returnOfMultipleProducts = (params) => {
  return request(RETURN_OF_MULTIPLE_PRODUCTS, METHOD.POST, params);
};
export const returnOfMultipleCommodities = (params) => {
  return request(REBATE_OF_MULTIPLE_COMMODITIES, METHOD.POST, params);
};
export const confirmReceiptOfMultipleProducts = (params) => {
  return request(CONFIRM_RECEIPT_OF_MULTIPLE_PRODUCTS, METHOD.POST, params);
};
// 一键
export const oneClickReturnOfOrder = (params) => {
  return request(ONE_CLICK_RETURN_OF_ORDER, METHOD.POST, params);
};
export const oneClickRebateForOrders = (params) => {
  return request(ONE_CLICK_REBATE_FOR_ORDERS, METHOD.POST, params);
};
export const oneClickToConfirmReceipt = (params) => {
  return request(ONE_CLICK_TO_CONFIRM_RECEIPT, METHOD.POST, params);
};


