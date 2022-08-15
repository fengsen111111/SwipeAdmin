import { request, METHOD } from "@/utils/request";
import {
  //商品类别
  CATEGORY_LIST,
  CATEGORY_CREATE,
  CATEGORY_UPDATE,
  CATEGORY_DELETE,
  //商品列表
  COMMODITY_LIST,
  COMMODITY_CREATE,
  COMMODITY_UPDATE,
  COMMODITY_DELETE,
  DELETE_IMAGE,
  ADD_IMAGE,
  COMMODITY_FIND,
  COMMODITY_ALL,
  RELEASE,
  ORDER_LIST_USER

} from "./api";

// 订单列表
export const getOrderList = (params) => {
  return request(ORDER_LIST_USER, METHOD.POST, params);
};

// 商品类别
export const getCategoryList = (params) => {
  return request(CATEGORY_LIST, METHOD.POST,params);
};
export const createCategory = (params) => {
  return request(CATEGORY_CREATE, METHOD.POST, params);
};
export const updateCategory = (params) => {
  return request(CATEGORY_UPDATE, METHOD.POST, params);
};
export const deleteCategory = (params) => {
  return request(CATEGORY_DELETE, METHOD.POST, params);
};

// 商品列表
export const getCommodityList = (params) => {
  return request(COMMODITY_LIST, METHOD.POST, params);
};
export const createCommodity = (params) => {
  return request(COMMODITY_CREATE, METHOD.POST, params);
};
export const updateCommodity = (params) => {
  return request(COMMODITY_UPDATE, METHOD.POST, params);
};
export const deleteCommodity = (params) => {
  return request(COMMODITY_DELETE, METHOD.POST, params);
};
export const commodityFind = (params) => {
  return request(COMMODITY_FIND, METHOD.POST, params);
};
export const commodityAll = () => {
  return request(COMMODITY_ALL, METHOD.POST);
};
export const release = (params) => {
  return request(RELEASE, METHOD.POST, params);
};//

// 删除图片
export const deleteImage = (params) => {
  return request(DELETE_IMAGE, METHOD.POST, params);
};

export const addImage = (params) => {
  return request(ADD_IMAGE, METHOD.POST, params);
};