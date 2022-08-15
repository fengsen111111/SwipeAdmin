import Mock from "mockjs";

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/routes`, "get", () => {
  let result = {};
  result.code = 0;
  result.data = [
    {
      router: "root",
      children: [
        "dashboard",
        {
          router: "administrator",
          children: [
            {
              router: "/administrator/list",
              name: "管理员列表",
            },
            {
              router: "/authority/list",
              name: "权限列表",
            },
            {
              router: "/role/list",
              name: "角色列表",
            },
          ],
        },
        {
          router: "user",
          children: [
            {
              router: "/user/list",
              name: "用户列表",
            },
            {
              router: "/first/charge",
              name: "首充列表",
            },
            {
              router: "/user/updown",
              name: "用户上下分",
            },
            {
              router: "/member/purchase",
              name: "会员购买统计",
            },
            {
              router: "/user/bank-list",
              name: "用户银行卡列表",
            },
            {
              router: "/user/ip-list",
              name: "会员IP检测",
            },
          ],
        },
        {
          router: "/financial",
          name: "财务管理",
          children: [
            {
              router: "/recharge/list",
              name: "充值列表",
            },
            {
              router: "/withdraw/list",
              name: "提现列表",
            },
            {
              router: "/sub/commission",
              name: "分佣列表",
            },
            {
              router: "/bonus/record",
              name: "赠金记录",
            },
          ],
        },
        {
          router: "statistics",
          name: "统计报表",
          children: [
            {
              router: "/agency/performance",
              name: "代理业绩",
            },
            {
              router: "/payment/channel",
              name: "支付渠道",
            },
            {
              router: "/member/list",
              name: "会员榜单",
            },
            {
              router: "/platform/revenue",
              name: "平台营收",
            },
          ],
        },
        {
          router: "platform",
          name: "代理管理",
          children: [
            {
              router: "/general/agent",
              name: "总代理",
            },
            {
              router: "/staff/list",
              name: "员工代理",
            },
          ],
        },
        {
          router: "commodity",
          name: "商品管理",
          children: [
            {
              router: "/special/area",
              name: "专区列表",
            },
            {
              router: "/commodity/library",
              name: "商品库",
            },
            {
              router: "/commodity/category",
              name: "商品类别",
            },
            {
              router: "/commodity/list",
              name: "商品列表",
            },
          ],
        },
        {
          router: "operation",
          name: "营运管理",
          children: [
            {
              router: "/article/type",
              name: "文章类型",
            },
            {
              router: "/article/list",
              name: "文章类别",
            },
            {
              router: "/advertise/type",
              name: "广告图类型",
            },
            {
              router: "/advertise/list",
              name: "广告图列表",
            },
            {
              router: "/language",
              name: "语言配置",
            },
            {
              router: "/bank/type",
              name: "银行卡类型",
            },
            {
              router: "/delivery/type",
              name: "配送类型列表",
            },
          ],
        },
        {
          router: "/activity",
          name: "活动管理",
          children: [
            {
              router: "/activity/list",
              name: "活动列表",
            },
            {
              router: "/invite/rebate",
              name: "邀请返佣",
            },
            {
              router: "/invite/charge",
              name: "邀请首充",
            },
            {
              router: "/KYC/activity",
              name: "KYC活动",
            },
          ],
        },
        {
          router: "/system",
          name: "系统管理",
          children: [
            {
              router: "/system/configuration",
              name: "系统配置",
            },
            {
              router: "/ip/whitelist",
              name: "IP白名单",
            },
            {
              router: "/payment",
              name: "支付配置",
            },
            {
              router: "/admin/log",
              name: "管理员日志",
            },
          ],
        },
      ],
    },
  ];
  return result;
});
