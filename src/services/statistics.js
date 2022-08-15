/*
 * @Author: Fuyi002 2669702453@qq.com
 * @Date: 2022-02-23 14:43:16
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @LastEditTime: 2022-06-09 14:01:47
 * @FilePath: \lottery-admin\src\services\statistics.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request, METHOD } from "@/utils/request";
import {
  AGENT_PERFORMANCE,
  TOTAL_AGENT,
  PAY_CHANEL,
  STATISTICS_SPE,
  MEMBER_LIST,
} from "./api";

export const getAgentPerformance = (params) => {
  return request(AGENT_PERFORMANCE, METHOD.POST, params);
};

export const getTotalAgent = (params) => {
  return request(TOTAL_AGENT, METHOD.POST, params);
};
export const getPayChanel = (params) => {
  return request(PAY_CHANEL, METHOD.POST, params);
};
// 专区统计
export const getStatisticsSpe = (params) => {
  return request(STATISTICS_SPE, METHOD.POST, params);
};

// 会员榜单
export const getMemberList = (params) => {
  return request(MEMBER_LIST, METHOD.POST, params);
};
