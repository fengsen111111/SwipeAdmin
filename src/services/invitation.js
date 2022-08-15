import { request, METHOD } from "@/utils/request";
import {
  BIG_TURNTABLE_ADD,
  BIG_TURNTABLE_LIST,
  BIG_TURNTABLE_UPDATE,
  TASK_CONFIGURATION_ADD,
  TASK_CONFIGURATION_LIST,
  TASK_CONFIGURATION_UPDATE,
  TASK_PROGRESS,
} from "./api";

// 大转盘
export const bigTurnTableAdd = (params) => {
  return request(BIG_TURNTABLE_ADD, METHOD.POST, params);
};
export const bigTurnTableList = (params) => {
  return request(BIG_TURNTABLE_LIST, METHOD.POST, params);
};
export const bigTurnTableUpdate = (params) => {
  return request(BIG_TURNTABLE_UPDATE, METHOD.POST, params);
};

// 任务配置
export const taskConfigurationAdd = (params) => {
  return request(TASK_CONFIGURATION_ADD, METHOD.POST, params);
};
export const taskConfigurationList = (params) => {
  return request(TASK_CONFIGURATION_LIST, METHOD.POST, params);
};
export const taskConfigurationUpdate = (params) => {
  return request(TASK_CONFIGURATION_UPDATE, METHOD.POST, params);
};

// 任务进度
export const taskProgress = (params) => {
  return request(TASK_PROGRESS, METHOD.POST, params);
};
