//跨域代理前缀
const API_PROXY_PREFIX = "/admin";
const BASE_URL =
  process.env.NODE_ENV === "production" ?
  process.env.VUE_APP_API_BASE_URL :
  API_PROXY_PREFIX;
module.exports = {
  LOGIN: `${BASE_URL}/admin_login`,
  ROUTES: `${BASE_URL}/routes`,
  // Admin
  ANIMALIST: `${BASE_URL}/admin/findAll`,
  ADD_ADMIN: `${BASE_URL}/admin/add`,
  UPDATE_ADMIN: `${BASE_URL}/admin/edit`,
  DELETE_ADMIN: `${BASE_URL}/admin/del`,
  BAN_ADMIN: `${BASE_URL}/admin/prohibition`,

  // 订单列表
  ORDER_LIST_USER: `${BASE_URL}/brushorder/index`,

  // ! 游戏管理
  ALL_CURRENCY: `${BASE_URL}/game/currency`, //所有货币列表
  CURRENCY_LIST: `${BASE_URL}/game/list`, // 货币管理
  CURRENCY_SORT: `${BASE_URL}/game/sort`, //
  CURRENCY_STATUS: `${BASE_URL}/game/status`, //
  HOME_CURRENCY_LIST: `${BASE_URL}/game/getHomeCentralCurrency`, //首页固定币种列表
  UPDATE_HOME_CURRENCY: `${BASE_URL}/game/editHomeCentralCurrency`, //更新币种
  ISSUED_VOLUME: `${BASE_URL}/game/issued/volume`, // 交易量
  //
  ALL_PLATFORM_CURRENCY: `${BASE_URL}/game/issued/currency`, // 所有平台币种
  PLATFORM_CURRENCY_LIST: `${BASE_URL}/game/issued/list`, // 列表
  PLATFORM_CURRENCY_SORT: `${BASE_URL}/game/issued/sort`, // 排序
  PLATFORM_CURRENCY_STATUS: `${BASE_URL}/game/issued/status`, // 状态
  ADD_PLATFORM_CURRENCY: `${BASE_URL}/game/issued/add`, // 新增
  EDIT_PLATFORM_CURRENCY: `${BASE_URL}/game/issued/edit`, // 编辑
  // 模块管理
  MODULE_LIST: `${BASE_URL}/module/list`, //列表
  ADD_MODULE: `${BASE_URL}/module/add`, // 新增
  EDIT_MODULE: `${BASE_URL}/module/edit`, // 编辑
  DELETE_MODULE: `${BASE_URL}/module/del`, // 删除
  DETAILS_MODULE: `${BASE_URL}/module/details`, //详情
  SORT_MODULE: `${BASE_URL}/module/sort`, // 排序
  STATUS_MODULE: `${BASE_URL}/module/status`, // 状态

  // !挖矿管理
  // ?虚拟货币项目管理
  ADD_VIRTUAL_CURRENCY: `${BASE_URL}/cproject/add`, // 添加虚拟货币接口
  EDIT_VIRTUAL_CURRENCY: `${BASE_URL}/cproject/edit`, // 编辑虚拟货币接口
  VIRTUAL_CURRENCY_LIST: `${BASE_URL}/cproject/index`, // 虚拟货币接口
  DELETE_VIRTUAL_CURRENCY: `${BASE_URL}/cproject/delete`, // 删除虚拟货币接口
  // ?矿机项目管理
  MINING_MACHINE_LIST: `${BASE_URL}/mproject/index`, //查询矿机项目接口
  ADD_MINING_MACHINE: `${BASE_URL}/mproject/add`, //添加矿机项目接口
  EDIT_MINING_MACHINE: `${BASE_URL}/mproject/edit`, //编辑矿机项目接口
  DELETE_MINING_MACHINE: `${BASE_URL}/mproject/delete`, //删除矿机项目接口
  ALL_VIRTUAL_CURRENCY: `${BASE_URL}/mproject/currency`, //查询所有虚拟币项目接口
  IMG_UPLOAD: `${BASE_URL}/mproject/upload`, // 图片上传
  ACTIVSTATUS: `${BASE_URL}/mproject/activStatus`, // 矿机激活码
  // /mproject/level/add
  // ?矿机等级列表
  EDIT_MINING_LEVEL: `${BASE_URL}/mproject/level/edit`, // 编辑矿机等级
  ADD_MINING_LEVEL: `${BASE_URL}/mproject/level/add`, // 添加矿机等级
  MINING_LEVEL_LIST: `${BASE_URL}/mproject/level/index`, // 矿机等级列表
  MINING_LEVEL_STATUS: `${BASE_URL}/mproject/level/status`, // 矿机等级状态
  ALL_MINING_LEVEL: `${BASE_URL}/mproject/level/all`, // 所有等级列表
  // ? 矿机激活码
  MINING_CODE_LIST: `${BASE_URL}/mproject/code/index`, // 激活码列表
  ADD_MINING_CODE: `${BASE_URL}/mproject/code/add`, // 添加激活码
  DELETE_MINING_CODE: `${BASE_URL}/mproject/code/delete`, // 删除激活码
  ALL_MINING_CODE: `${BASE_URL}/mproject/code/all`, // 所有矿机

  // ?购买记录列表
  MINING_BUY_RECORD: `${BASE_URL}/mBuy/index`,
  DIVIDEND_DETAILS: `${BASE_URL}/mBuy/dividend`,
  SETTLEMENT: `${BASE_URL}/mBuy/settleAccounts`, // 结算
  GET_GIFT_LIST: `${BASE_URL}/mBuy/getGiftCurrencyLogs`, // 用户理财赠送平台币记录

  // ! 涨跌管理
  // ? 手动开奖
  MANUAL_DRAW: `${BASE_URL}/risefall/handleDraw`,
  // ? 今日累计
  TODAY_TOTAL: `${BASE_URL}/risefall/todayTotal`,
  // ? 杀率配置
  GET_KILL_RATE: `${BASE_URL}/risefall/getKillRate`, //获取杀率
  EDIT_KILL_RETE: `${BASE_URL}/risefall/editKillRate`, // 更新杀率
  // ? 用户统计
  RISEFALL_USERTOTAL: `${BASE_URL}/risefall/userTotal`, // 用户统计
  // ? 货币列表
  ALL_RISEFALL_CURRENCY: `${BASE_URL}/risefall/all`, // 所有货币
  RISEFALL_CURRENCY_LIST: `${BASE_URL}/risefall/list`, // 列表
  ADD_RISEFALL_CURRENCY: `${BASE_URL}/risefall/add`, //新增
  EDIT_RISEFALL_CURRENCY: `${BASE_URL}/risefall/edit`, // 编辑
  EDIT_BATCH_WIN_RATE: `${BASE_URL}/risefall/batchWinRateEdit`, // 批量更新用户胜率
  RISEFALL_CURRENCY: `${BASE_URL}/risefall/currency`,
  // ? 涨跌配置

  CONTROL_AWARD: `${BASE_URL}/risefall/controlAward`, // 控奖
  RISEFALL_RECORD: `${BASE_URL}/risefall/record`, // 交易记录
  RISEFALL_CONFIG_LIST: `${BASE_URL}/risefall/incomeList`, // 列表
  ADD_RISEFALL_CONFIG: `${BASE_URL}/risefall/incomeAdd`, // 新增
  EDIT_RISEFALL_CONFIG: `${BASE_URL}/risefall/incomeEdit`, // 编辑

  // ! 营运管理
  // ? 榜单配置
  TRANSACTION_LIST: `${BASE_URL}/system/transaction`, // 榜单列表
  ADD_TRANSACTION: `${BASE_URL}/system/transactionAdd`, // 新增榜单
  DELETE_TRANSACTION: `${BASE_URL}/system/transactionDel`, // 删除
  // ? 入款账户配置
  RECEIVE_ACCOUNT_LIST: `${BASE_URL}/ReceiveAccount/list`, // 入款账户－列表
  ADD_RECEIVE_ACCOUNT: `${BASE_URL}/ReceiveAccount/add`, // 入款账户－新增
  EDIT_RECEIVE_ACCOUNT: `${BASE_URL}/ReceiveAccount/edit`, // 入款账户－编辑
  DELETE_RECEIVE_ACCOUNT: `${BASE_URL}/ReceiveAccount/del`, //入款账户－删除

  // ! 银行卡类型列表
  BANKTYPE_LIST: `${BASE_URL}/banktype/index`, // 银行列表
  BANKTYPE_SWITCH: `${BASE_URL}/banktype/switch`, //银行-状态更新
  ADD_BANKTYPE: `${BASE_URL}/banktype/add`, //银行 新增
  EDIT_BANKTYPE: `${BASE_URL}/banktype/edit`, // 银行 编辑

  // ! 国家 /country/index
  COUNTRY_LIST: `${BASE_URL}/country/index`, // 国家列表
  COUNRTY_SWITCH: `${BASE_URL}/country/switch`, // 国家-状态
  COUNRTY_SELECT: `${BASE_URL}/country/select`, // 国家 下拉选择
  EDIT_COUNTRY: `${BASE_URL}/country/edit`, //国家编辑
  LANGUAGE_ALL: `${BASE_URL}/language/all`, // 所有启用的语言
  // ￥ 合作伙伴
  PARTNER_LIST: `${BASE_URL}/companion/findAll`, //合作伙伴列表
  ADD_PARTNER: `${BASE_URL}/companion/add`, //添加合作伙伴
  EDIT_PARTNER: `${BASE_URL}/companion/edit`, //编辑合作伙伴
  DELETE_PARTNER: `${BASE_URL}/companion/del`, //删除合作伙伴
  // ￥ 热门店铺
  STORE_LIST: `${BASE_URL}/transaction/findAll`, // 热门店铺列表
  NEW_STORE: `${BASE_URL}/transaction/add`, // 新增店铺
  EDIT_STORE: `${BASE_URL}/transaction/edit`, // 编辑店铺
  DELETE_STORE: `${BASE_URL}/transaction/del`, // 删除店铺
  // ￥ 安全问题
  SAFETY_PROBLEM: `${BASE_URL}/safeAsk/findAll`, // 安全问题列表
  ADD_SAFETY_PROBLEM: `${BASE_URL}/safeAsk/add`, // 添加安全问题
  EDIT_SECURITY_ISSUES: `${BASE_URL}/safeAsk/edit`, // 编辑安全问题
  DEL_SECURITY_ISSUE: `${BASE_URL}/safeAsk/del`, // 删除安全问题
  // ￥ 站内信
  CLASSIFICATION_LIST: `${BASE_URL}/messageCategory/list`, // 分类列表
  ADD_CLASSIFICATION: `${BASE_URL}/messageCategory/add`, // 新增分类
  UPDATE_CLASSIFICATION: `${BASE_URL}/messageCategory/edit`, // 新增分类
  DEL_CLASSIFICATION: `${BASE_URL}/messageCategory/del`, // 删除分类
  SEND_IN_STATION_LETTER: `${BASE_URL}/message/add`, // 发送站内信
  //￥ 邮箱模板
  FINDALL_LIST: `${BASE_URL}/email_template/findAll`, // 模板列表
  FINDALL_LIST_ADD: `${BASE_URL}/email_template/add`, // 新增
  FINDALL_LIST_REVISE: `${BASE_URL}/email_template/edit`, // 修改
  FINDALL_LIST_DELETE: `${BASE_URL}/email_template/del`, // 删除
  //￥ 城市列表
  CITIES_LIST: `${BASE_URL}/city/list`, // 城市列表
  CITY_ADDITION: `${BASE_URL}/city/addCity`, // 城市添加
  CITY_MODIFICATION: `${BASE_URL}/city/editCity`, // 城市修改
  //￥ 街道列表
  STREET_LIST: `${BASE_URL}/city/StreetAll`, // 街道列表
  STREET_ADD: `${BASE_URL}/city/addStreet`, // 街道添加
  STREET_EDITOR: `${BASE_URL}/city/editStreet`, // 街道编辑
  NATIONAL_CITY: `${BASE_URL}/city/getCountryCity`, // 获取国家城市
  // ! 交易管理
  ALL_LOTTERY: `${BASE_URL}/lottery/all`, // 所有货币
  LOTTERY_LIST: `${BASE_URL}/lottery/list`, // 货币列表
  ADD_LOTTERY: `${BASE_URL}/lottery/add`, // 新增
  EDIT_LOTTERY: `${BASE_URL}/lottery/edit`, // 编辑
  // ? 玩法配置
  All_PLAY_CONFIG: `${BASE_URL}/lottery/configAll`, // 所有玩法
  PLAY_LOTTERY_CONFIG: `${BASE_URL}/lottery/configList`, // 玩法配置列表
  PLAY_SWITCH: `${BASE_URL}/lottery/configStatus`, // 状态开关
  EDIT_PLAY_LOTTERY: `${BASE_URL}/lottery/configEdit`, // 编辑玩法
  // ? 杀率配置
  LOTTERY_KILL_RATE: `${BASE_URL}/lottery/getKillRate`, // 获取杀率
  EDIT_LOTTERY_KILL_RATE: `${BASE_URL}/lottery/editKillRate`, // 更新杀率
  // ? 下注记录
  LOTTERY_RECORD: `${BASE_URL}/lottery/record`, // 下注记录
  // ? 开奖结果
  LOTTERY_RESULT: `${BASE_URL}/lottery/result`, // 开奖结果
  LOTTERY_DETAILS: `${BASE_URL}/lottery/termfindById`, //某期详情
  LOTTERY_MANUAL_DRAW_DETAIL: `${BASE_URL}/lottery/termBuyDetail`, //手动开奖(显示本期购买详情)
  LOTTERY_MANUAL_DRAW: `${BASE_URL}/lottery/controlAward`, // 执行手动开奖
  // ! 法币管理
  FIATCURRENCY: `${BASE_URL}/fiatCurrency/list`, // 法币管理列表
  ADD_FIAT_CURRENCY: `${BASE_URL}/fiatCurrency/add`, // 新增法币
  EDIT_FIAT_CURRENCY: `${BASE_URL}/fiatCurrency/edit`, //编辑法币
  ALL_FIAT_CURRENCY: `${BASE_URL}/fiatCurrency/all`, // 所有法币

  // ! USDT充值
  USDT_RECHARGE_LIST: `${BASE_URL}/recharge/usdtRecord`, // USDT 充值列表
  USDT_RECHARGE_AUDIT: `${BASE_URL}/recharge/usdtRecordAudit`, // USDT 充值审核

  // ! USDT 提现
  USDT_WITHDRAW_LIST: `${BASE_URL}/withdrawal/usdtRecord`, // USDT 提现列表
  USDT_WITHDRAW_AUDIT: `${BASE_URL}/withdrawal/usdtRecordAudit`, // USDT 提现审核

  // ! 打码量记录  /betnumRecord/index
  BETNUM_RECORD: `${BASE_URL}/betnumRecord/index`, // 打码量记录

  // ￥ 用户提佣
  COMMISSION_LIST_SEARCH: `${BASE_URL}/commissions/findAll`, // 提佣列表 包括搜索
  COMMISSION_DETAILS: `${BASE_URL}/commissions/findById`, // 提佣详情
  AUDIT_COMMISSION: `${BASE_URL}/commissions/audit`, // 审核提佣
  // end 交易管理

  // ! 会员榜单
  MEMBER_LIST: `${BASE_URL}/member/list`,
  // 权限管理
  // AUTH_LIST: `${BASE_URL}/menu/findAll`,
  // ADD_AUTH: `${BASE_URL}/right/add`,
  // FIND_AUTH: `${BASE_URL}/right/findById`,
  // AUTH_ALL: `${BASE_URL}/menu/tree`,
  // UPDATE_AUTH: `${BASE_URL}/right/edit`,
  AUTH_LIST: `${BASE_URL}/menu/findAll`,
  ADD_AUTH: `${BASE_URL}/menu/add`,
  FIND_AUTH: `${BASE_URL}/menu/findById`,
  AUTH_ALL: `${BASE_URL}/menu/tree`,
  UPDATE_AUTH: `${BASE_URL}/menu/edit`,
  // 角色管理
  LAST_FIVE: `${BASE_URL}/role/findAll`,
  ADD_LAST_FIVE: `${BASE_URL}/role/add`,
  UPDATE_LAST_FIVE: `${BASE_URL}/role/edit`,
  DELETE_LAST_FIVE: `${BASE_URL}/role/del`,
  RIGHT_ALL: `${BASE_URL}/right_all`,
  FIND_LAST_FIVE: `${BASE_URL}/role/findById`,

  // 用户列表
  USER_LIST: `${BASE_URL}/user/index`,
  USER_UPDATE: `${BASE_URL}/user/update`,
  USER_BAN: `${BASE_URL}/user/modify`,
  USER_CREATE: `${BASE_URL}/user/store`,
  UP_POINTS: `${BASE_URL}/user/upper`,
  DOWN_POINTS: `${BASE_URL}/user/down`,
  GIFT_MONEY: `${BASE_URL}/user/gift`,
  FUNDING_DETAILS: `${BASE_URL}/user/funds/details`,
  IP_LIST: `${BASE_URL}/signIp/index`,
  BAN_USER_IP: `${BASE_URL}/signIp/modify`,
  FIRST_RECHARGES: `${BASE_URL}/firstCharge/findAll`,
  EDIT_ADDRESS: `${BASE_URL}/wallet/editAddress`, // 编辑用户提币地址
  GET_ADDRESS_LIST: `${BASE_URL}/wallet/getAddressList`, // 用户提币地址
  LIST_OF_COMMISSION_DETAILS: `${BASE_URL}/user/funds/commissionDetails`, // 佣金详情
  // 购买统计
  PURCHASE_LIST: `${BASE_URL}/user/userBuyTotal`,

  // 晒单列表
  POST_SINGLE_LIST: `${BASE_URL}/shareOrder/list`,
  POST_SINGLE_REVIEW: `${BASE_URL}/shareOrder/edit`,
  POST_SINGLE_DETAILS: `${BASE_URL}/shareOrder/detail`,
  // 获取员工代理

  PROXY_USER_LIST: `${BASE_URL}/user/staff`,
  // 实名认证
  VERIFIED_LIST: `${BASE_URL}/verified/index`,
  VERIFIED_REVIEW: `${BASE_URL}/verified/check`,
  //地址list
  ADDRESS_LIST: `${BASE_URL}/address/index`,
  ADDRESS_UPDATE: `${BASE_URL}/address/update`,
  ADDRESS_DELETE: `${BASE_URL}/address/delete`,
  // 银行卡
  BANK_LIST: `${BASE_URL}/Bank/index`,
  BANK_UPDATE: `${BASE_URL}/Bank/update`,
  BANK_DELETE: `${BASE_URL}/Bank/delete`,
  BANK_TYPE: `${BASE_URL}/bank/getBanks`,
  // 银行卡类型
  BANK_TYPE_LIST: `${BASE_URL}/cards/index`,
  BANK_TYPE_CREATE: `${BASE_URL}/cards/store`,
  BANK_TYPE_UPDATE: `${BASE_URL}/cards/update`,
  // 代理管理
  STAFF_LIST: `${BASE_URL}/staff/index`,
  CREATE_STAFF: `${BASE_URL}/staff/store`,
  UPDATE_STAFF: `${BASE_URL}/staff/update`,
  BAN_STAFF: `${BASE_URL}/staff/modify`,
  // 系统配置
  SMS_LIST: `${BASE_URL}/sms/list`,
  CREATE_SMS: `${BASE_URL}/sms/add`,
  UPDATE_SMS: `${BASE_URL}/sms/edit`,
  DELETE_SMS: `${BASE_URL}/sms/del`,
  // 系统配置
  CONFIG_LIST: `${BASE_URL}/system/configList`,
  CONFIG_UPDATE: `${BASE_URL}/system/editSystemConfig`,
  // 总代理
  AGENT_LIST: `${BASE_URL}/master/list`,
  GENERAL_LIST: `${BASE_URL}/master/index`,
  GENERAL_ADD: `${BASE_URL}/master/store`,
  GENERAL_EDIT: `${BASE_URL}/master/update`,
  GENERAL_BAN: `${BASE_URL}/master/modify`,
  // 城市代理
  CITY_ALL: `${BASE_URL}/cityAgent/area`,
  CITY_USER: `${BASE_URL}/cityAgent/aUsers`,
  CITY_CREATE: `${BASE_URL}/cityAgent/store`,
  CITY_UPDATE: `${BASE_URL}/cityAgent/update`,
  CITY_BAN: `${BASE_URL}/cityAgent/modify`,
  CITY_LIST: `${BASE_URL}/cityAgent/index`,
  CITY_DETAILS: `${BASE_URL}/cityAgent/reply`,
  // 地区列表
  AREA_LIST: `${BASE_URL}/area/index`,
  AREA_CREATE: `${BASE_URL}/area/store`,
  AREA_UPDATE: `${BASE_URL}/area/update`,
  AREA_DELETE: `${BASE_URL}/area/delete`,
  AREA_FIND: `${BASE_URL}/area/getArea`,
  // 多语言列表
  LANGUAGE_LIST: `${BASE_URL}/language/index`,
  LANGUAGE_ADD: `${BASE_URL}/language/store`,
  LANGUAGE_EDIT: `${BASE_URL}/language/update`,
  LANGUAGE_BAN: `${BASE_URL}/language/modify`,
  LANGUAGE_SYSTEM: `${BASE_URL}/language/system`,
  // 敏感词
  SENSITIVE_LIST: `${BASE_URL}/sensitiveWords/list`,
  SENSITIVE_CREATE: `${BASE_URL}/sensitiveWords/add`,
  SENSITIVE_UPDATE: `${BASE_URL}/sensitiveWords/edit`,
  SENSITIVE_DELETE: `${BASE_URL}/sensitiveWords/del`,

  // 商品类别
  CATEGORY_LIST: `${BASE_URL}/goodsCategory/list`,
  CATEGORY_CREATE: `${BASE_URL}/goodsCategory/add`,
  CATEGORY_UPDATE: `${BASE_URL}/goodsCategory/edit`,
  CATEGORY_DELETE: `${BASE_URL}/goodsCategory/del`,
  // 商品列表
  COMMODITY_LIST: `${BASE_URL}/goodsStorehouses/list`,
  COMMODITY_CREATE: `${BASE_URL}/goodsStorehouses/add`,
  COMMODITY_UPDATE: `${BASE_URL}/goodsStorehouses/edit`,
  COMMODITY_DELETE: `${BASE_URL}/goodsStorehouses/del`,
  DELETE_IMAGE: `${BASE_URL}/delImg`,
  ADD_IMAGE: `${BASE_URL}/uploadImg`,
  COMMODITY_FIND: `${BASE_URL}/goodsStorehouses/details`,
  COMMODITY_ALL: `${BASE_URL}/goodsStorehouses/all`,
  // 发布
  RELEASE: `${BASE_URL}/goods/add`,

  // 专区列表
  SPECIAL_LIST: `${BASE_URL}/zone/list`,
  SPECIAL_CREATE: `${BASE_URL}/zone/add`,
  SPECIAL_UPDATE: `${BASE_URL}/zone/edit`,
  SPECIAL_DELETE: `${BASE_URL}/zone/del`,
  TEMPLATE_LIST: `${BASE_URL}/zoneTemplate/all`,
  SPECIAL_ALL: `${BASE_URL}/zone/all`,
  // 专区模板
  TEMPLATE_LISTS: `${BASE_URL}/zoneTemplate/list`,
  TEMPLATE_CREATE: `${BASE_URL}/zoneTemplate/add`,
  TEMPLATE_UPDATE: `${BASE_URL}/zoneTemplate/edit`,
  TEMPLATE_DELETE: `${BASE_URL}/zoneTemplate/del`,
  TEMPLATE_DETAILS: `${BASE_URL}/zoneTemplateOptional/list`,
  TEMPLATE_DETAILS_UPDATE: `${BASE_URL}/zoneTemplateOptional/edit`,
  TEMPLATE_DETAILS_DELETE: `${BASE_URL}/zoneTemplateOptional/del`,
  // 商品活动
  COMM_ACTIVITY_LIST: `${BASE_URL}/goods/list`,
  COMM_ACTIVITY_UPDATE: `${BASE_URL}/goods/edit`,

  // 活动管理
  ACTIVITY_LIST: `${BASE_URL}/activity/index`,
  ACTIVITY_UPDATE: `${BASE_URL}/activity/update`,
  ACTIVITY_BAN: `${BASE_URL}/activity/modify`,
  ACTIVITY_CREATE: `${BASE_URL}/activity/store`,

  // 充值赠送
  RECHARGE_GIFT_LIST: `${BASE_URL}/activity/recharge/index`,
  RECHARGE_GIFT_CREATE: `${BASE_URL}/activity/recharge/store`,
  RECHARGE_GIFT_UPDATE: `${BASE_URL}/activity/recharge/update`,
  RECHARGE_GIFT_BAN: `${BASE_URL}/activity/recharge/modify`,
  // 邀请返佣
  INVITE_LIST: `${BASE_URL}/activity/invite/index`,
  INVITE_UPDATE: `${BASE_URL}/activity/invite/update`,
  // 邀请首充
  FIRST_RECHARGE_LIST: `${BASE_URL}/activity/first_recharge/index`,
  FIRST_RECHARGE_UPDATE: `${BASE_URL}/activity/first_recharge/update`,
  FIRST_RECHARGE_DELETE: `${BASE_URL}/activity/first_recharge/delete`,
  FIRST_RECHARGE_CREATE: `${BASE_URL}/activity/first_recharge/store`,
  // 文章 类型-列表
  ARTICLE_TYPE_LIST: `${BASE_URL}/helpCenterCategory/list`,
  ARTICLE_TYPE_UPDATE: `${BASE_URL}/helpCenterCategory/edit`,
  ARTICLE_TYPE_CREATE: `${BASE_URL}/helpCenterCategory/add`,
  ARTICLE_TYPE_DELETE: `${BASE_URL}/helpCenterCategory/del`,
  ARTICLE_LIST: `${BASE_URL}/helpCenter/list`,
  ARTICLE_CREATE: `${BASE_URL}/helpCenter/add`,
  ARTICLE_UPDATE: `${BASE_URL}/helpCenter/edit`,
  ARTICLE_DELETE: `${BASE_URL}/helpCenter/del`,
  // advertise-type类型 -列表
  ADVERTISING_LIST: `${BASE_URL}/bannerCategory/list`,
  ADVERTISING_UPDATE: `${BASE_URL}/bannerCategory/edit`,
  ADVERTISING_DELETE: `${BASE_URL}/bannerCategory/del`,
  ADVERTISING_CREATE: `${BASE_URL}/bannerCategory/add`,
  // bank -Page页链接
  JUMP_LIST: `${BASE_URL}/bannerLink/list`,
  JUMP_UPDATE: `${BASE_URL}/bannerLink/edit`,
  JUMP_CREATE: `${BASE_URL}/bannerLink/add`,
  // Banner 列表
  BANNER_LIST: `${BASE_URL}/banner/list`,
  BANNER_CREATE: `${BASE_URL}/banner/add`,
  BANNER_UPDATE: `${BASE_URL}/banner/edit`,
  BANNER_DELETE: `${BASE_URL}/banner/del`,
  // ip白名单
  IP_SYSTEM_LIST: `${BASE_URL}/whitelist/list`,
  IP_SYSTEM_UPDATE: `${BASE_URL}/whitelist/edit`,
  IP_SYSTEM_DELETE: `${BASE_URL}/whitelist/del`,
  IP_SYSTEM_CREATE: `${BASE_URL}/whitelist/add`,
  // 管理员日志
  ADMIN_LOG_LIST: `${BASE_URL}/operation-log/list`,
  // 赠金记录
  BONUS_LIST: `${BASE_URL}/bonus/index`,
  UP_DOWN_RECORDS: `${BASE_URL}/upAndDown/index`,
  // 充值列表
  RECHARGE_LIST: `${BASE_URL}/recharge/fiatCurrencyRecord`,
  MANUAL_RECHARGE: `${BASE_URL}/recharge/fiatCurrencyExerecharge`,
  FIAT_CURRENCY_LIST: `${BASE_URL}/recharge/fiatCurrency`,

  // 提现列表
  WITHDRAW_LIST: `${BASE_URL}/withdrawal/fiatCurrencyRecord`,
  WITHDRAW_SEARCH: `${BASE_URL}/withdrawal/search`,
  USER_ID: `${BASE_URL}/withdrawal/fiatCurrencyRecordDetails`,
  PAY_AISLE: `${BASE_URL}/pay/actives`,
  WITHDRAW_AUDIT: `${BASE_URL}/withdrawal/fiatCurrencyAudit`,
  WITHDRAW_LOCK: `${BASE_URL}/withdrawal/is_locking`,
  WITHDRAW_BATCH: `${BASE_URL}/withdrawal/batch`,
  // 代理业绩报表
  AGENT_PERFORMANCE: `${BASE_URL}/performance/index`,
  // 所有总代理
  TOTAL_AGENT: `${BASE_URL}/performance/master`,
  // 订单列表
  ORDER_LIST: `${BASE_URL}/order/list`,
  ORDER_DETAILS: `${BASE_URL}/order/detail`,
  // 支付配置
  PAY_ADD: `${BASE_URL}/pay/add`,
  PAY_BAN: `${BASE_URL}/pay/switch`,
  PAY_LIST: `${BASE_URL}/pay/index`,
  PAY_UPDATE: `${BASE_URL}/pay/update`,
  PAY_RECHARGE: `${BASE_URL}/recharge/paymentChannel`,
  // 支付渠道统计
  PAY_CHANEL: `${BASE_URL}/pay/statistics`,
  DASHBOARD_LIST: `${BASE_URL}/dashboard/total`,
  // 分佣列表
  COMMISSION_LIST: `${BASE_URL}/activity/invite/record`,
  // 分佣统计
  COMMISSION_TOTAL: `${BASE_URL}/activity/invite/levelTotal`,
  // 手动出款
  MANUAL_WITHDRAW: `${BASE_URL}/withdrawal/fiatCurrencyManual`,
  // 配送类型
  DELIVERY_LIST: `${BASE_URL}/delivery/index`,
  DELIVERY_UPDATE: `${BASE_URL}/delivery/update`,
  // 自提点列表
  SELZNICK_LIST: `${BASE_URL}/proxy_site/list`,
  SELZNICK_CREATE: `${BASE_URL}/proxy_site/add`,
  SELZNICK_UPDATE: `${BASE_URL}/proxy_site/edit`,
  SELZNICK_DELETE: `${BASE_URL}/proxy_site/del`,
  // 获取一级区域
  FIRST_LEVEL: `${BASE_URL}/proxy_site/region`,
  // google 绑定
  GOOGLE_LIST: `${BASE_URL}/system/bind`,
  GOOGLE_BIND: `${BASE_URL}/system/unbind`,
  // 模拟购买
  SIMULATED_PURCHASE: `${BASE_URL}/goods/robotBuy`,
  // 订单
  CANCEL_ORDER: `${BASE_URL}/order/cancel`,
  ORDER_SHIP: `${BASE_URL}/order/ship`,
  ORDER_FINISH: `${BASE_URL}/order/completed`,
  ORDER_DETAILS_GOODS: `${BASE_URL}/brushorder/orderDetails`, //订单详情
  // 订单 --单个商品返本返佣确认收货
  RETURN_OF_SINGLE_COMMODITY: `${BASE_URL}/brushorder/returnOriginal`, //单个商品返本
  REBATE_OF_SINGLE_ORDER: `${BASE_URL}/brushorder/returnCommission`, //单个商品返本
  CONFIRM_RECEIPT_OF_INDIVIDUAL_GOODS: `${BASE_URL}/brushorder/goodsConfirmationReceipt`, //单个商品确认收货
  // 订单 --多个商品返本返佣确认收货
  RETURN_OF_MULTIPLE_PRODUCTS: `${BASE_URL}/brushorder/multiReturnOriginal`, //多个商品返本
  REBATE_OF_MULTIPLE_COMMODITIES: `${BASE_URL}/brushorder/multiReturnCommission`, //多个商品返佣
  CONFIRM_RECEIPT_OF_MULTIPLE_PRODUCTS: `${BASE_URL}/brushorder/manyGoodsConfirmationReceipt`, //多个商品确认收货
  // 订单 --订单一键确认收货
  ONE_CLICK_RETURN_OF_ORDER: `${BASE_URL}/brushorder/orderOneKeyReturn`, //订单一键返本
  ONE_CLICK_REBATE_FOR_ORDERS: `${BASE_URL}/brushorder/orderOneKeyRebate`, //订单一键返佣
  ONE_CLICK_TO_CONFIRM_RECEIPT: `${BASE_URL}/brushorder/OneClickToConfirmReceipt`, //订单一键确认收货

  // 预设模板统计

  TOTAL_STATISTICS: `${BASE_URL}/zoneTemplateOptional/statistics`,
  BULK_USER: `${BASE_URL}/robot/batchAddRobot`,
  // 头像库
  AVATAR_LIST: `${BASE_URL}/avatars/list`,
  AVATAR_CREATE: `${BASE_URL}/avatars/add`,
  AVATAR_UPDATE: `${BASE_URL}/avatars/edit`,
  AVATAR_DELETE: `${BASE_URL}/avatars/del`,
  AVATAR_ALL: `${BASE_URL}/avatars/all`,
  // ----
  TEST_USER_LIST: `${BASE_URL}/robot/list`,
  TEST_USER_UPDATE: `${BASE_URL}/robot/edit`,
  TEST_USER_CREATE: `${BASE_URL}/robot/add`,
  TEST_USER_DELETE: `${BASE_URL}/robot/del`,
  // 随机生成昵称
  RANDOMLY_NAME: `${BASE_URL}/robot/getRandomNickname`,
  // 手动抽奖
  MANUAL_DRA: `${BASE_URL}/goods/luckDraw`,
  // 专区统计
  STATISTICS_SPE: `${BASE_URL}/special/index`,
  KICK_USER: `${BASE_URL}/user/offline`,
  // 进群奖励
  GROUP_LIST: `${BASE_URL}/groupChat/list`,
  REVIEW_GROUP: `${BASE_URL}/groupChat/editStatus`,
  //中奖记录列表
  WINNING_LIST: `${BASE_URL}/goods/luckyDogList`,
  // 验证码发送记录
  CODE_SMS_LIST: `${BASE_URL}/sms/sendCodeList`,
  // 购买订单详情
  PURCHASE_DETAILS: `${BASE_URL}/order/detailsList`,
  LOGISTICS_UPDATE: `${BASE_URL}/order/edit_ship`,
  // 批量修改代理线
  MODIFY_AGENT: `${BASE_URL}/user/batch`,
  // ? 签到配置
  SIGN_RULES_LIST: `${BASE_URL}/SignRules/list`, // 获取签到规则列表
  ADD_SIGN_RULES: `${BASE_URL}/SignRules/add`, // 添加签到规则列表
  EDIT_SIGN_RULES: `${BASE_URL}/SignRules/update`, // 修改签到规则列表
  // SIGN_LIST: `${BASE_URL}/activity/sign/packages`,
  // SIGN_ADD: `${BASE_URL}/activity/sign/packadd`,
  // SIGN_UPDATE: `${BASE_URL}/activity/sign/packupdate`,
  // SIGN_BAN: `${BASE_URL}/activity/sign/updatestatus`,
  // 邀请赠送
  // 任务进度
  TASK_PROGRESS: `${BASE_URL}/activity/turntable/record`,
  BIG_TURNTABLE_LIST: `${BASE_URL}/activity/turntable/list`,
  BIG_TURNTABLE_ADD: `${BASE_URL}/activity/turntable/add`,
  BIG_TURNTABLE_UPDATE: `${BASE_URL}/activity/turntable/edit`,
  // 任务配置
  TASK_CONFIGURATION_LIST: `${BASE_URL}/activity/promote/list`,
  TASK_CONFIGURATION_ADD: `${BASE_URL}/activity/promote/add`,
  TASK_CONFIGURATION_UPDATE: `${BASE_URL}/activity/promote/edit`,
  // 增加新人专享
  CREATE_EXCLUSIVELY_NEWCOMERS: `${BASE_URL}/goods/addNovice`,
  UPdate_EXCLUSIVELY_NEWCOMERS: `${BASE_URL}/goods/editNovice`,
  // 用户管理--用户钱包列表
  USER_CURRENCY_WALLET: `${BASE_URL}/walletCurrency/getWalletList`, //用户货币钱包列表
  EDIT_NUMBER_OF_GOLD_COINS: `${BASE_URL}/walletCurrency/editWallet`, //编辑金币数量
  BACKGROUND_CURRENCY_OPERATION: `${BASE_URL}/walletCurrency/getOperationLogs`, //后台币操作记录
  USER_WALLET_FLASH_CASH_RECORD: `${BASE_URL}/walletCurrency/getUserConvertLogs`, //用户钱包闪兑记录
  // 用户钱包添加平台币
  USER_ADD_PLATFORM_CURRENCY: `${BASE_URL}/walletCurrency/addWalletCurrency`,
  //用户管理--物流模板列表  Logistics template
  USER_LOGISTICS_TEMPLATE: `${BASE_URL}/user/logistics/template/list`, //物流模板列表
  //新增物流模板  
  USER_ADD_LOGISTICS: `${BASE_URL}/user/logistics/template/add`, //新增物流模板 
  //  物流模板详情列表  Logistics Template Details List
  LOGISTICS_TEMPLATE_DETAILS: `${BASE_URL}/user/logistics/template/detail/list`, //物流模板详情列表 
  //  新增物流模板详情  
  ADD_LOGISTICS_TEMPLATE: `${BASE_URL}/user/logistics/template/detail/add`, //新增物流模板详情
  //  物流模板详情----编辑  
  EDIT_LOGISTICS_TEMPLATE: `${BASE_URL}/user/logistics/template/detail/edit`, //物流模板详情----编辑


  // ￥店铺管理
  // 等级
  LIST_OF_GRADES: `${BASE_URL}/shopLevel/list`, //等级列表
  ADD_STORE_LEVEL: `${BASE_URL}/shopLevel/add`, //添加等级
  SET_STORE_LEVEL: `${BASE_URL}/shopLevel/edit`, //修改等级
  ALL_TYPES_OF_PRODUCTS: `${BASE_URL}/goodsCategory/findAll`, //所有类型
  // 审核
  STORE_AUDIT_LIST: `${BASE_URL}/store/examine`, //店铺审核列表
  STORE_AUDIT: `${BASE_URL}/store/edit`, //审核店铺
  AUDIT_CONFIGURATION: `${BASE_URL}/store/set`, //自动审核
  SHOP_LIST: `${BASE_URL}/store/list`, //店铺列表
  SHOP_DETAILS: `${BASE_URL}/store/detail`, //店铺详情
  SHOP_TOP_SHELF: `${BASE_URL}/store/goodList`, //已上架商品

  // 派单
  DISTRIBUTE_LEAFLETS: `${BASE_URL}/brushorder/delivery`, //派单
  GENERATE_ORDER: `${BASE_URL}/brushorder/createShopOrder`, //生成订单
  DELIVER_GOODS: `${BASE_URL}/brushorder/deliver`, //发货
  LOGISTICS_TEMPLATE: `${BASE_URL}/brushorder/logistics`, //物流模板


};