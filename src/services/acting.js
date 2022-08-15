// **********************************************
// 创建时间: 2021-11-20 10:17:47
// description:'代理管理'
// **********************************************

import { request, METHOD } from "@/utils/request";
import {
  STAFF_LIST,
  CREATE_STAFF,
  UPDATE_STAFF,
  BAN_STAFF,
  GENERAL_ADD,
  GENERAL_BAN,
  GENERAL_EDIT,
  GENERAL_LIST,
  AGENT_LIST,
  CITY_ALL,
  CITY_USER,
  CITY_CREATE,
  CITY_UPDATE,
  CITY_BAN,
  CITY_LIST,
  CITY_DETAILS,
  AREA_CREATE,
  AREA_DELETE,
  AREA_FIND,
  AREA_LIST,
  AREA_UPDATE,
} from "./api";

// 员工代理
export const getStaff = (params) => {
  return request(STAFF_LIST, METHOD.POST, params);
};

export const createStaff = (params) => {
  return request(CREATE_STAFF, METHOD.POST, params);
};

export const updateStaff = (params) => {
  return request(UPDATE_STAFF, METHOD.POST, params);
};

export const banStaff = (params) => {
  return request(BAN_STAFF, METHOD.POST, params);
};

// 总代理
export const getGeneral = (params) => {
  return request(GENERAL_LIST, METHOD.POST, params);
};
export const createGeneral = (params) => {
  return request(GENERAL_ADD, METHOD.POST, params);
};
export const banGeneral = (params) => {
  return request(GENERAL_BAN, METHOD.POST, params);
};
export const updateGeneral = (params) => {
  return request(GENERAL_EDIT, METHOD.POST, params);
};
export const getAgent = (params) => {
  return request(AGENT_LIST, METHOD.POST, params);
};
// 城市代理
export const getCityAll = (params) => {
  return request(CITY_ALL, METHOD.POST, params);
};
export const getCityUser = (params) => {
  return request(CITY_USER, METHOD.POST, params);
};
export const getCityList = (params) => {
  return request(CITY_LIST, METHOD.POST, params);
};

export const createCity = (params) => {
  return request(CITY_CREATE, METHOD.POST, params);
};
export const updateCity = (params) => {
  return request(CITY_UPDATE, METHOD.POST, params);
};
export const banCity = (params) => {
  return request(CITY_BAN, METHOD.POST, params);
};

export const getCityDetails = (params) => {
  return request(CITY_DETAILS, METHOD.POST, params);
};

// 地区管理
export const createArea = (params) => {
  return request(AREA_CREATE, METHOD.POST, params);
};
export const deleteArea = (params) => {
  return request(AREA_DELETE, METHOD.POST, params);
};
export const findArea = (params) => {
  return request(AREA_FIND, METHOD.POST, params);
};
export const getAreaList = (params) => {
  return request(AREA_LIST, METHOD.POST, params);
};
export const updateArea = (params) => {
  return request(AREA_UPDATE, METHOD.POST, params);
};
