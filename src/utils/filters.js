export const formDate = function(value) {
  if (!value) return "";
  let date = new Date(value * 1000);
  let year = date.getFullYear(); // 获取完整的年份(4位,1970)
  let month = date.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
  let day = date.getDate(); // 获取日(1-31)
  let hour = date.getHours(); // 获取小时数(0-23)
  let min = date.getMinutes(); //分
  let sec = date.getSeconds(); //秒
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
};

// 大小单双颜色
export const lotteryTypeColor = (val) => {
  switch (val) {
    case "Big":
      return "#F97316";
    case "Small":
      return "#22C55E";
    case "Single":
      return "#EF4444";
    case "Double":
      return "#3B82F6";
    case "SmallDouble":
      return "#EAB308";
    case "SmallSingle":
      return "#A855F7";
    case "BigDouble":
      return "#F97316";
    case "BigSingle":
      return "#1572A1";
    case "Lucky":
      return "#A855F7";
    default:
      break;
  }
};
export const lotteryTypeText = (val) => {
  switch (val) {
    case "Big":
      return "大";
    case "Small":
      return "小";
    case "Single":
      return "单";
    case "Double":
      return "双";
    case "SmallDouble":
      return "小双";
    case "SmallSingle":
      return "小单";
    case "BigDouble":
      return "大双";
    case "BigSingle":
      return "大单";
    case "Lucky":
      return "特殊";
    case "0":
      return "0";
    case "1":
      return "1";
    case "2":
      return "2";
    case "3":
      return "3";
    case "4":
      return "4";
    case "5":
      return "5";
    case "6":
      return "6";
    case "7":
      return "7";
    case "8":
      return "8";
    case "9":
      return "9";
    default:
      break;
  }
};

// 代理类型
export const formAgencyType = (val) => {
  switch (Number(val)) {
    case 0:
      return "不是代理";
    case 1:
      return "全线";
    case 2:
      return "直推";
    default:
      break;
  }
};

// 控奖类型
export const formControlType = (val) => {
  switch (Number(val)) {
    case 0:
      return "不控";
    case 1:
      return "控赢";
    case 2:
      return "控输";
    default:
      break;
  }
};
// 控将标签颜色
export const formControlColor = (val) => {
  switch (Number(val)) {
    case 0:
      return "";
    case 1:
      return "green";
    case 2:
      return "red";
    default:
      break;
  }
};

// 注册类型

export const formDateType = (val) => {
  switch (Number(val)) {
    case 0:
      return "H5注册";
    case 1:
      return "后台测试";
    case 2:
      return "PC注册";
    case 3:
      return "安卓APP注册";
    case 4:
      return "IOSAPP注册";
    default:
      break;
  }
};
export const formDateUserColor = (val) => {
  switch (Number(val)) {
    case 0:
      return "#009DAE";
    case 1:
      return "#3E8E7E";
    case 2:
      return "#519259 ";
    case 3:
      return "#064663";
    case 4:
      return "#4C3F91";
    default:
      break;
  }
};
// 资金详情类型
export const formDataTypeText = (text) => {
  switch (Number(text)) {
    case 1:
      return "后台上分";
    case 2:
      return "后台下分";
    case 3:
      return "后台赠送礼金";
    case 4:
      return "实名认证完成赠送礼金";
    case 5:
      return "法币充值";
    case 6:
      return "法币提现";
    case 7:
      return "涨跌交易申购";
    case 8:
      return "涨跌交易结算";
    case 9:
      return "邀请首充赠送金额";
    case 10:
      return "邀请返佣";
    case 11:
      return "购买签到包";
    case 12:
      return "每日点击领取签到包";
    case 13:
      return "理财分红";
    case 14:
      return "理财返本";
    case 15:
      return "购买矿机";
    case 16:
      return "购买彩票";
    case 17:
      return "彩票中奖";
    case 18:
      return "USDT充值";
    case 19:
      return "USDT提现";
    case 20:
      return "USDT提现金额驳回";
    case 21:
      return "法币提现金额驳回";
    case 22:
      return "闪兑进";
    case 23:
      return "闪兑出";
    default:
      return "未知";
  }
};

// 积分详情
export const formDataTypeTextJiFen = (text) => {
  switch (Number(text)) {
    case 1:
      return "余额购买";
    case 2:
      return "积分提现";
    case 3:
      return "提现审核不通过";
    case 4:
      return "提现三方打款失败";
    case 5:
      return "分佣 ";
    case 6:
      return "活动商品转积分";
    case 7:
      return "点击领取邀请首充项";
    case 8:
      return "邀请赠送";
    default:
      return "未知";
  }
};
export const formDataTypeColor = (text) => {
  switch (Number(text)) {
    case 1:
      return "#009DAE";
    case 2:
      return "#71DFE7";
    case 3:
      return "#22577E";
    case 4:
      return "#368B85";
    case 5:
      return "#142F43";
    case 6:
      return "#FFAB4C";
    case 7:
      return "#FF5F7E";
    case 8:
      return "#B000B9";
    case 9:
      return "#2C2891";
    case 10:
      return "#39A388";
    case 11:
      return "#1C7947";
    case 12:
      return "#502064";
    case 13:
      return "#f97316";
    case 14:
      return "#78350f";
    case 15:
      return "#2563eb";
    case 16:
      return "#5eead4";
    case 17:
      return "#991b1b";
    case 18:
      return "#a5b4fc";
    case 19:
      return "#f5d0fe";
    case 20:
      return "#155e75";
    case 21:
      return "#FCA5A5";
    case 22:
      return "#FCD34D";
    case 23:
      return "#6EE7B7";
    default:
      break;
  }
};

// 晒单
export const formSingle = (text) => {
  switch (Number(text)) {
    case 0:
      return "待审核";
    case 1:
      return "通过";
    case 2:
      return "不通过";
    default:
      return "未知";
  }
};
// 晒单审核状态
export const formSingleColor = (text) => {
  switch (Number(text)) {
    case 0:
      return "#FFAB4C";
    case 1:
      return "#39A388";
    case 2:
      return "#FF5F7E";
    default:
      return "#FFAB4C";
  }
};

// 格式化敏感词类型
export const formateSensitiveWords = (value) => {
  switch (Number(value)) {
    case 0:
      return "其他";
    case 1:
      return "反动";
    case 2:
      return "暴恐";
    case 3:
      return "民生";
    case 4:
      return "色情";
    case 5:
      return "贪腐";
    case 6:
      return "辱骂";
    default:
      return "未知";
  }
};
export const formateSensitiveWordsColor = (value) => {
  switch (Number(value)) {
    case 0:
      return "#FFAB4C";
    case 1:
      return "#FF5F7E";
    case 2:
      return "#B000B9";
    case 3:
      return "#2C2891";
    case 4:
      return "#39A388";
    case 5:
      return "#1C7947";
    case 6:
      return "#368B85";
    default:
      return "#FFAB4C";
  }
};

// USDT 充值状态
export const formateUSDTRechargeStatus = (value) => {
  switch (Number(value)) {
    case 1:
      return "待审核";
    case 2:
      return "通过审核";
    case 3:
      return "未通过审核";
    default:
      return "未知";
  }
};

// 充值状态
export const formateRechargeStatus = (value) => {
  switch (Number(value)) {
    case 1:
      return "等待支付";
    case 2:
      return "充值成功";
    case 3:
      return "充值失败";
    default:
      return "未知";
  }
};
export const formateRechargeStatusColor = (value) => {
  switch (Number(value)) {
    case 1:
      return "#FFAB4C";
    case 2:
      return "#39A388";
    case 3:
      return "#FF5F7E";
    default:
      return "#FFAB4C";
  }
};
// 到账方式
export const formateRechargeType = (value) => {
  switch (Number(value)) {
    case 0:
      return "未到账";
    case 1:
      return "三方回调";
    case 2:
      return "手动补单";
    default:
      return "未知";
  }
};

export const formateRechargeTypeColor = (value) => {
  switch (Number(value)) {
    case 0:
      return "#FFAB4C";
    case 1:
      return "#39A388";
    case 2:
      return "#FF5F7E";
    default:
      return "#FFAB4C";
  }
};

// 提现状态
export const formateWithdrawStatus = (value) => {
  switch (Number(value)) {
    case 0:
      return "待审核";
    case 1:
      return "审核通过";
    case 2:
      return "未通过";
    case 3:
      return "进行中";
    case 4:
      return "失败";
    case 5:
      return "锁定中";
    case 6:
      return "驳回";
    default:
      return "未知";
  }
};
export const formateWithdrawStatusColor = (value) => {
  switch (Number(value)) {
    case 0:
      return "#FFAB4C";
    case 1:
      return "#39A388";
    case 2:
      return "#FF5F7E";
    case 3:
      return "#B000B9";
    case 4:
      return "#2C2891";
    case 5:
      return "#368B85";
    case 6:
      return "#142F43";
    default:
      return "#FFAB4C";
  }
};

// USDT提现
// export const formateUsdtWithdrawType = (value) => {
//   switch (Number(value)) {
//     case 0:
//       return "待审核";
//     case 1:
//       return "审核通过";
//     case 2:
//       return "审核未通过";
//     default:
//       return "未知";
//   }
// };

// 提现三方
export const formateWithdrawType = (value) => {
  switch (Number(value)) {
    case 0:
      return "未支付";
    case 1:
      return "已支付";
    case 2:
      return "已失效";
    case 3:
      return "订单异常";
    case 4:
      return "进行中";
    default:
      return "未知";
  }
};
export const formateWithdrawTypeColor = (value) => {
  switch (Number(value)) {
    case 0:
      return "#FFAB4C";
    case 1:
      return "#39A388";
    case 2:
      return "#FF5F7E";
    case 3:
      return "#EF4444";
    case 4:
      return "#2563eb";
    default:
      return "#FFAB4C";
  }
};

// 订单类型
export const formateOrderType = (value) => {
  switch (Number(value)) {
    case 1:
      return "商品";
    case 2:
      return "活动商品";
    case 3:
      return "活动积分商品";
    default:
      return "未知";
  }
};
export const formateOrderTypeColor = (value) => {
  switch (Number(value)) {
    case 1:
      return "#6E3CBC";
    case 2:
      return "#39A388";
    case 3:
      return "#22577E";
    default:
      return "#FFAB4C";
  }
};

// 支付方式
export const formatePayType = (value) => {
  switch (Number(value)) {
    case 1:
      return "银行卡";
    case 2:
      return "余额";
    case 3:
      return "积分";
    default:
      return "未知";
  }
};
// 收货方式
export const formateReceiveType = (value) => {
  switch (Number(value)) {
    case 1:
      return "平台发货";
    case 2:
      return "站点自提";
    case 3:
      return "兑换积分";
    default:
      return "";
  }
};
// 订单状态
export const formateOrderStatus = (value) => {
  switch (Number(value)) {
    case 1:
      return "待付款";
    case 2:
      return "已付款";
    case 3:
      return "发货中";
    case 4:
      return "已发货";
    case 5:
      return "已完成";
    case 6:
      return "已关闭";

    case 20:
      return "未开奖";
    case 21:
      return "未中奖";
    case 22:
      return "已中奖";
    case 31:
      return "未选择发货方式";
    case 32:
      return "已选择发货方式";
    default:
      return "";
  }
};
export const formateOrderStatusColor = (value) => {
  switch (Number(value)) {
    case 1:
      return "#FFAB4C";
    case 2:
      return "#39A388";
    case 3:
      return "#FF5F7E";
    case 4:
      return "#B000B9";
    case 5:
      return "#2C2891";
    case 6:
      return "#368B85";

    case 20:
      return "#502064";
    case 21:
      return "#FF5F7E";
    case 22:
      return "#3FA796";
    case 31:
      return "#FFBD35";
    case 32:
      return "#35589A";
    default:
      return "#FFAB4C";
  }
};
