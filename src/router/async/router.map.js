// 视图组件
const view = {
  tabs: () => import("@/layouts/tabs"),
  blank: () => import("@/layouts/BlankView"),
  page: () => import("@/layouts/PageView"),
};

// 路由组件注册
const routerMap = {
  login: {
    authority: "*",
    path: "/login",
    component: () => import("@/pages/login"),
  },
  admin: {
    name: "控制台",
    path: "/admin",
    icon: "dashboard",
    component: () => import("@/pages/dashboard/Dashboard"),
  },
  administrator: {
    name: "管理员管理",
    icon: "user",
    component: view.page,
  },
  "/administrator/list": {
    name: "管理员列表",
    component: () => import("@/pages/administrator/AdminList"),
  },
  "/authority/list": {
    name: "权限列表",
    component: () => import("@/pages/administrator/AuthList.vue"),
  },

  "/role/list": {
    name: "角色列表",
    component: () => import("@/pages/administrator/RoleList"),
  },
  // **********************************************

  //用户管理 --start
  user: {
    name: "用户管理",
    icon: "contacts",
    component: view.page,
  },
  "/user/list": {
    name: "用户列表",
    component: () => import("@/pages/user/UserList"),
  },
  "/funding/details": {
    name: "资金明细",
    component: () => import("@/pages/user/FundingDetails"),
    meta: {
      invisible: true,
    },
  },
  "/commission/details": {
    name: "佣金详情",
    component: () => import("@/pages/user/CommissionDetails"),
    meta: {
      invisible: true,
    },
  },
  "/first/charge": {
    name: "用户首充列表",
    component: () => import("@/pages/user/FirstChargeList"),
  },
  "/user/updown": {
    name: "用户上下分",
    component: () => import("@/pages/user/UpAndDown"),
  },
  "/user/giftmoney": {
    name: "赠送礼金",
    component: () => import("@/pages/user/GiftMoney"),
  },
  "/member/purchase": {
    name: "会员购买统计",
    component: () => import("@/pages/user/Purchase"),
  },
  "/user/bank-list": {
    name: "用户银行卡列表",
    component: () => import("@/pages/user/BankList"),
  },
  "/user/ip-list": {
    name: "会员IP检测",
    component: () => import("@/pages/user/IpList"),
  },
  "/verified/list": {
    name: "实名认证列表",
    component: () => import("@/pages/user/Verified"),
  },
  "/posta/single": {
    name: "晒单列表",
    component: () => import("@/pages/user/PostaSingle"),
  },
  "/single/details": {
    name: "晒单详情",
    component: () => import("@/pages/user/PostaSingleDetails"),
    meta: {
      invisible: true,
    },
  },
  "/avatar/library": {
    name: "头像库",
    component: () => import("@/pages/user/AvatarList"),
  },
  "/test/membership": {
    name: "测试会员库",
    component: () => import("@/pages/user/TestMembership"),
  },
  "/wallet/getAddressList": {
    name: "用户钱包地址列表",
    component: () => import("@/pages/user/GetAddressList"),
  },
  "/user/wallet-list": {
    name: "用户钱包列表",
    component: () => import("@/pages/user/UserWalletList"),
  },
  "/flash/exchange-record": {
    name: "闪兑记录",
    component: () => import("@/pages/user/FlashExchangeRecord"),
    meta: {
      invisible: true,
    },
  },
  "/logistics/template-list": {
    name: "物流模板列表",
    component: () => import("@/pages/user/LogisticsTemplateList"),
  },
  // **********************************************
  // user --end


  // **********************************************
  // 财务管理 --start

  financial: {
    name: "财务管理",
    icon: "transaction",
    component: view.page,
  },
  "/recharge/list": {
    name: "充值列表",
    component: () => import("@/pages/finance/Recharge"),
  },
  "/withdraw/list": {
    name: "提现列表",
    component: () => import("@/pages/finance/Withdraw"),
  },
  "/sub/commission": {
    name: "分佣列表",
    component: () => import("@/pages/finance/CommissionList"),
  },
  "/bonus/record": {
    name: "赠金记录",
    component: () => import("@/pages/finance/BonusRecord"),
  },
  "/updown/record": {
    name: "上下分记录",
    component: () => import("@/pages/finance/UpAndDownRecord"),
  },
  "/betnumRecord/index": {
    name: "打码量记录",
    component: () => import("@/pages/finance/BetnumRecord"),
  },
  "/user/commission": {
    name: "用户提佣",
    component: () => import("@/pages/finance/UserCommission"),
  },

  // **********************************************
  // 财务管理 --end

  // **********************************************
  // ! 商品管理 --start
  "commodity": {
    name: "商品管理",
    icon: "shopping-cart",
    component: view.page,
  },
  "/commodity/list": {
    name: "商品列表",
    component: () => import("@/pages/commodity/CommodityList"),
  },
  "/commodity/classification": {
    name: "商品分类",
    component: () => import("@/pages/commodity/Categories"),
  },
  "/add/commodity": {
    name: "新增商品",
    component: () => import("@/pages/commodity/CommodityAdd"),
    meta: {
      invisible: true,
    },
  },
  // **********************************************
  // 商品管理 --end


  // **********************************************
  // 统计报表 --start

  statistics: {
    name: "统计报表",
    icon: "area-chart",
    component: view.page,
  },
  "/agency/performance": {
    name: "代理业绩",
    component: () => import("@/pages/statistics/AgencyPerformance"),
  },
  "/payment/channel": {
    name: "支付渠道",
    component: () => import("@/pages/statistics/PaymentChannel"),
  },
  "/member/list": {
    name: "会员榜单",
    component: () => import("@/pages/statistics/MemberList"),
  },
  "/platform/revenue": {
    name: "平台营收",
    component: () => import("@/pages/statistics/PlatformRevenue"),
  },
  "/special/statistics": {
    name: "专区统计",
    component: () => import("@/pages/statistics/SpecialArea"),
  },
  // **********************************************
  // 统计报表 --end

  // **********************************************
  // 代理管理 --start
  platform: {
    name: "代理管理",
    icon: "apartment",
    component: view.page,
  },
  "/general/agent": {
    name: "总代理",
    component: () => import("@/pages/acting/GeneralAgent"),
  },
  "/staff/list": {
    name: "员工代理",
    component: () => import("@/pages/acting/StaffList"),
  },
  "/city/proxy": {
    name: "城市代理",
    component: () => import("@/pages/acting/CityAgent"),
  },
  "/area/list": {
    name: "地区列表",
    component: () => import("@/pages/acting/AreaList"),
  },
  // **********************************************

  // 代理管理 --end

  // **********************************************
  // 活动管理 --start
  activity: {
    name: "活动管理",
    icon: "gift",
    component: view.page,
  },
  "/activity/list": {
    name: "活动列表",
    component: () => import("@/pages/activity/ActivityList"),
  },
  "/invite/rebate": {
    name: "邀请返佣",
    component: () => import("@/pages/activity/Rebate"),
  },
  "/invite/charge": {
    name: "邀请首充",
    component: () => import("@/pages/activity/FirstCharge"),
  },
  "/KYC/activity": {
    name: "KYC活动",
    component: () => import("@/pages/dashboard/Dashboard"),
  },
  "/recharge/gift": {
    name: "充值赠送",
    component: () => import("@/pages/activity/RechargeGift"),
  },
  "/group/reward": {
    name: "进群奖励",
    component: () => import("@/pages/activity/GroupReward"),
  },
  "/signin/config": {
    name: "签到配置",
    component: () => import("@/pages/activity/SignConfig"),
  },
  // **********************************************

  // 活动管理 --end
  // **********************************************

  // **********************************************
  // 营运管理 --start
  operation: {
    name: "营运管理",
    icon: "solution",
    component: view.page,
  },
  "/article/type": {
    name: "文章类型",
    component: () => import("@/pages/operation/ArticleType"),
  },
  "/article/list": {
    name: "文章类别",
    component: () => import("@/pages/operation/ArticleList"),
  },
  "/advertise/type": {
    name: "广告图类型",
    component: () => import("@/pages/operation/Advertising"),
  },
  "/advertise/list": {
    name: "广告图列表",
    component: () => import("@/pages/operation/AdsPictures"),
  },
  "/language": {
    name: "语言配置",
    component: () => import("@/pages/operation/Language"),
  },
  "/jump/page": {
    name: "跳转页链接",
    component: () => import("@/pages/operation/JumpList"),
  },
  "/bank/type": {
    name: "银行卡类型",
    component: () => import("@/pages/operation/BankType"),
  },
  "/curlst/list": {
    name: "榜单配置",
    component: () => import("@/pages/operation/Curlst"),
  },
  "/receivingAccount/list": {
    name: "入款账户配置",
    component: () => import("@/pages/operation/ReceivingAccount"),
  },
  "/CountryList/index": {
    name: "国家配置",
    component: () => import("@/pages/operation/CountryList"),
  },
  "/FiatList/index": {
    name: "法币管理",
    component: () => import("@/pages/operation/FiatCurrency"),
  },
  "/cooperative/partner": {
    name: "合作伙伴",
    component: () => import("@/pages/operation/CooperativePartner"),
  },
  "/popular/stores": {
    name: "热门店铺",
    component: () => import("@/pages/operation/PopularStores"),
  },
  "/safety/problem": {
    name: "安全问题",
    component: () => import("@/pages/operation/SafetyProblem")
  },
  "/website/letter": {
    name: "站内信",
    component: () => import("@/pages/operation/WebsiteLetter")
  },
  "/mailbox/template": {
    name: "邮箱模板",
    component: () => import("@/pages/operation/MailboxTemplate")
  },
  "/cities/list": {
    name: "城市列表",
    component: () => import("@/pages/operation/CitiesList")
  },
  "/street/list": {
    name: "街道列表",
    component: () => import("@/pages/operation/StreetList")
  },

  // **********************************************
  // 营运管理 --end

  // **********************************************
  // 系统管理 --start
  system: {
    name: "系统管理",
    icon: "setting",
    component: view.page,
  },
  "/system/configuration": {
    name: "系统配置",
    component: () => import("@/pages/system/Configuration"),
  },
  "/ip/whitelist": {
    name: "IP白名单",
    component: () => import("@/pages/system/IpList"),
  },
  "/admin/log": {
    name: "管理员日志",
    component: () => import("@/pages/system/AdminLog"),
  },
  "/to/pay": {
    name: "支付配置",
    component: () => import("@/pages/system/PaymentConfig"),
  },
  "/SMS/provider": {
    name: "短信服务商",
    component: () => import("@/pages/system/SMS"),
  },
  "/sms/codelist": {
    name: "短信模板",
    component: () => import("@/pages/system/SMSCodeList"),
  },
  "/bankcard/type": {
    name: "银行卡类型",
    component: () => import("@/pages/system/BankcardType"),
  },

  // **********************************************
  // 系统管理 --end

  // **********************************************
  // ! 挖矿管理 --start

  mining: {
    name: "挖矿管理",
    icon: "gold",
    component: view.page,
  },
  "/virtualcurrency/list": {
    name: "虚拟货币列表",
    component: () => import("@/pages/mining/VirtualCurrencyList"),
  },
  "/miningMachine/list": {
    name: "矿机列表",
    component: () => import("@/pages/mining/MiningMachine"),
  },
  "/buyMining/record": {
    name: "购买记录列表",
    component: () => import("@/pages/mining/BuyMiningRecord"),
  },
  "/miningLevel/list": {
    name: "矿机等级",
    component: () => import("@/pages/mining/MiningLevel"),
    meta: {
      invisible: true,
    },
  },
  "/miningCode/list": {
    name: "矿机激活码",
    component: () => import("@/pages/mining/MiningCode"),
    meta: {
      invisible: true,
    },
  },
  "/buyMining/getGiftCurrencyLogs": {
    name: "赠送平台币记录",
    component: () => import("@/pages/mining/GetGiftCurrencyLogs"),
    meta: {
      invisible: true,
    },
  },

  // **********************************************
  // ? 挖矿管理 --end

  // **********************************************
  //  订单管理 --start    Order
  order: {
    name: "订单管理",
    icon: "setting",
    component: view.page,
  },
  "/order/list": {
    name: "订单列表",
    component: () => import("@/pages/order/List"),
  },
  // **********************************************
  //  订单管理 --end

  // **********************************************
  // 店铺管理 --start
  storeManage: {
    name: "店铺管理",
    icon: "shop",
    component: view.page,
  },
  "/store/level": {
    name: "店铺等级",
    component: () => import("@/pages/storeManage/StoreLevel"),
  },
  "/store/audit": {
    name: "店铺审核列表",
    component: () => import("@/pages/storeManage/StoreAudit"),
  },
  "/store/list": {
    name: "店铺列表",
    component: () => import("@/pages/storeManage/StoreList"),
  },

  // **********************************************
  // 店铺管理 --end


  exp403: {
    authority: "*",
    name: "exp403",
    path: "403",
    component: () => import("@/pages/exception/403"),
  },
  exp404: {
    name: "exp404",
    path: "404",
    component: () => import("@/pages/exception/404"),
  },
  exp500: {
    name: "exp500",
    path: "500",
    component: () => import("@/pages/exception/500"),
  },
  root: {
    path: "/",
    name: "首页",
    redirect: "/login",
    component: view.tabs,
  },
  parent1: {
    name: "父级路由1",
    icon: "dashboard",
    component: view.blank,
  },
  parent2: {
    name: "父级路由2",
    icon: "form",
    component: view.page,
  },
  exception: {
    name: "异常页",
    icon: "warning",
    component: view.blank,
  },
};
export default routerMap;