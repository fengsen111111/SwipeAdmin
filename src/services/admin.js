import { request, METHOD } from "@/utils/request";
import {
  ADD_ADMIN,
  UPDATE_ADMIN,
  DELETE_ADMIN,
  BAN_ADMIN,
  ANIMALIST,
  AUTH_ALL,
  ADD_AUTH,
  AUTH_LIST,
  FIND_AUTH,
  UPDATE_AUTH,
  RIGHT_ALL,
  LAST_FIVE,
  ADD_LAST_FIVE,
  FIND_LAST_FIVE,
  UPDATE_LAST_FIVE,
  DELETE_LAST_FIVE,
} from "./api";

export const getAdminList = (limit, page) => {
  return request(`${ANIMALIST}?limit=${limit}&page=${page}`, METHOD.GET);
};
export const addAdmin = (params) => {
  return request(ADD_ADMIN, METHOD.POST, params);
};
export const updateAdmin = (params) => {
  return request(UPDATE_ADMIN, METHOD.POST, params);
};
export const deleteAdmin = (params) => {
  return request(DELETE_ADMIN, METHOD.POST, params);
};
export const bindAdmin = (params) => {
  return request(BAN_ADMIN, METHOD.POST, params);
};

// Auth
export const authList = () => {
  return request(AUTH_LIST, METHOD.GET);
};
export const fundAuth = (id) => {
  return request(`${FIND_AUTH}?id=${id}`, METHOD.GET);
};
export const authAll = () => {
  return request(AUTH_ALL, METHOD.GET);
};
export const authAdd = (params) => {
  return request(ADD_AUTH, METHOD.POST, params);
};
export const updateAuth = (params) => {
  return request(UPDATE_AUTH, METHOD.POST, params);
};
// Role
export const getLastFive = (limit, page) => {
  return request(`${LAST_FIVE}?limit=${limit}&page=${page}`, METHOD.GET);
};

export const getRight = () => {
  return request(RIGHT_ALL, METHOD.GET);
};
export const addLastFive = (params) => {
  return request(ADD_LAST_FIVE, METHOD.POST, params);
};
export const getInquire = (id) => {
  return request(`${FIND_LAST_FIVE}?id=${id}`, METHOD.GET);
};
export const updateLast = (params) => {
  return request(UPDATE_LAST_FIVE, METHOD.POST, params);
};

export const deleteLast = (params) => {
  return request(DELETE_LAST_FIVE, METHOD.POST, params);
};
