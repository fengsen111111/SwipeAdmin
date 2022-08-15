import enquireJs from "enquire.js";
import moment from "moment";
export function isDef(v) {
  return v !== undefined && v !== null;
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === "[object RegExp]";
}

export function enquireScreen(call) {
  const handler = {
    match: function() {
      call && call(true);
    },
    unmatch: function() {
      call && call(false);
    },
  };
  enquireJs.register("only screen and (max-width: 767.99px)", handler);
}

export const formatAryDate = (ary = []) => {
  if (ary.length > 0 && ary) {
    return ary.map((item) => moment(item / 1000).valueOf());
  } else {
    return [];
  }
};

export const timeLists = [
  {
    id: 1,
    time: "1分钟",
  },
  {
    id: 2,
    time: "2分钟",
  },
  {
    id: 3,
    time: "3分钟",
  },
  {
    id: 5,
    time: "5分钟",
  },
  {
    id: 10,
    time: "10分钟",
  },
  {
    id: 15,
    time: "15分钟",
  },
];
export const fastDate = {
  今天: [
    moment("00:00:00", "HH:mm:ss").startOf("day"),
    moment("23:59:59", "HH:mm:ss"),
  ],
  昨天: [
    moment("00:00:00", "HH:mm:ss")
      .startOf("day")
      .subtract(1, "days"),
    moment("23:59:59", "HH:mm:ss")
      .endOf("day")
      .subtract(1, "days"),
  ],
  一周: [
    moment("00:00:00", "HH:mm:ss")
      .startOf("day")
      .subtract(1, "weeks"),
    moment("23:59:59", "HH:mm:ss"),
  ],

  本月: [
    moment("00:00:00", "HH:mm:ss").startOf("month"),
    moment("23:59:59", "HH:mm:ss").endOf("month"),
  ],
  上月: [
    moment("00:00:00", "HH:mm:ss")
      .startOf("month")
      .subtract("month", 1),
    moment("23:59:59", "HH:mm:ss")
      .endOf("month")
      .subtract("month", 1)
      .endOf("month"),
  ],
  一个月: [
    moment("00:00:00", "HH:mm:ss")
      .startOf("day")
      .subtract(1, "months"),
    moment("23:59:59", "HH:mm:ss"),
  ],
  近三月: [
    moment("00:00:00", "HH:mm:ss")
      .startOf("day")
      .subtract(3, "month"),
    moment("23:59:59", "HH:mm:ss"),
  ],
  近六月: [
    moment("00:00:00", "HH:mm:ss")
      .startOf("day")
      .subtract(6, "month"),
    moment("23:59:59", "HH:mm:ss"),
  ],
};
export const itemsPageList = [
  "10",
  "20",
  "30",
  "40",
  "50",
  "100",
  "200",
  "300",
  "400",
];

export const lotteryTypeTwo = [
  {
    name: "0",
    zhName: "0",
  },
  {
    name: "1",
    zhName: "1",
  },
  {
    name: "2",
    zhName: "2",
  },
  {
    name: "3",
    zhName: "3",
  },
  {
    name: "4",
    zhName: "4",
  },
  {
    name: "5",
    zhName: "5",
  },
  {
    name: "6",
    zhName: "6",
  },
  {
    name: "7",
    zhName: "7",
  },
  {
    name: "8",
    zhName: "8",
  },
  {
    name: "9",
    zhName: "9",
  },
  {
    name: "Big",
    zhName: "大",
  },
  {
    name: "Small",
    zhName: "小",
  },
  {
    name: "Lucky",
    zhName: "特殊",
  },
];

export const lotteryType = [
  {
    name: "Big",
    zhName: "大",
  },
  {
    name: "Small",
    zhName: "小",
  },
  {
    name: "Single",
    zhName: "单",
  },
  {
    name: "Double",
    zhName: "双",
  },
  {
    name: "SmallDouble",
    zhName: "小双",
  },
  {
    name: "SmallSingle",
    zhName: "小单",
  },
  {
    name: "BigDouble",
    zhName: "大双",
  },
  {
    name: "BigSingle",
    zhName: "大单",
  },
];

// formate params date
export const timeFormat = (times) => {
  const result = times?.map((item) => {
    return item ? moment(item / 1000).valueOf() : null;
  });
  return result;
};

export const registerTypeList = [
  {
    id: 0,
    name: "H5注册会员",
  },
  {
    id: 1,
    name: "后台测试会员",
  },
  {
    id: 2,
    name: "PC注册会员",
  },
  {
    id: 3,
    name: "安卓APP",
  },
  {
    id: 4,
    name: "IOS注册",
  },
];

export const typelist = [
  {
    id: 1,
    name: "充值",
  },
  {
    id: 2,
    name: "上分",
  },
  {
    id: 3,
    name: "投注彩票",
  },
  {
    id: 4,
    name: "投注涨跌",
  },
  {
    id: 5,
    name: "购买矿机",
  },
  {
    id: 6,
    name: "提现",
  },
  {
    id: 7,
    name: "提款失败退回",
  },
];

const _toString = Object.prototype.toString;
