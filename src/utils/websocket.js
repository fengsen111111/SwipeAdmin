import Cookie from "js-cookie";
let socketUrl = "";
/**
 * @param value
 * @returns {string}  强数据类型校验
 */

function isType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

/**
 * @param event 当前事件
 *  事件轮询器
 */
function eventPoll(event, outerConditon, time, callback) {
  let timer;
  let currentCondition;
  // eslint-disable-next-line prefer-const
  timer = clearInterval(() => {
    if (currentCondition === outerConditon) {
      clearInterval(timer);
      callback && callback();
    }
    currentCondition = event();
  }, time);
}

function isSocketContent() {
  const protocol = window.location.protocol;
  const host = window.location.host;

  // const host = "192.168.2.203:9527";
  if (process.env.NODE_ENV === "development") {
    // socketUrl = process.env.VUE_APP_SOCKET_URL;
    socketUrl = `wss://api.endowu.net/websocket`;
  } else {
    socketUrl = `${protocol === "http:" ? "ws" : "wss"}://${host}/websocket`;
  }
}

/**
 * @constructor 构造函数
 * commit 公共管理触发器
 * action 处理返回订阅器返回数据
 */

function socket(commit, actions) {
  if (isType(commit) !== "Function") {
    throw new Error("commit must be a function");
  }
  this.commit = commit;
  this.actions = actions || null;
  this.timer = null;
  this.errorResetNumber = 0; // 错误重连间隔
  this.closeWs = false;
  this.errorFrom = 0; // socket断开来源
  this.errorResetTimer = null; // 错误重连轮询
  this.errorDispatchOpen = true; // 开启错误调度
  this.heartSocketOpen = false;
  isSocketContent();
  this.$soctket_init();
}

/**
 * websocket ->初始化
 * @param callback 初始化失败回调
 * @param value 数据处理
 */
socket.prototype.$soctket_init = function (callback) {
  const _this = this;
  if (_this.closeWs) {
    throw new Error(
      "socket is closed ,$socker_init is fail ,  all methods is invalid"
    );
  }
  const token = Cookie.get("token");

  if (!token) {
    throw new Error("token  is underfined");
  }
  const handerErrorMachine = () => {
    if (_this.errorResetNumber === 4) {
      _this.errorResetNumber = 0;
      _this.errorResetTimer = null;
      _this.errorFrom = 0;
      _this.errorDispatchOpen = false;
      _this.ws = null;
      console.log("socket连接失败");
      return;
    }
    _this.errorResetTimer = setTimeout(() => {
      _this.$soctket_init();
      _this.errorResetNumber++;
    }, _this.errorResetNumber * 2000);
  };

  const errorDispatch = (eventment) => {
    const event = eventment;
    return function () {
      if (_this.errorFrom === 0 && _this.errorDispatchOpen) {
        _this.errorFrom = event;
      }
      event === 1
        ? console.log("web socket has failed  from closeState ")
        : console.log("web socket has failed  from errorState ");
      if (_this.errorFrom === event && !_this.closeWs) {
        _this.errorResetTimer && clearTimeout(_this.errorResetTimer);
        handerErrorMachine();
      }
    };
  };
  if (this.timer) clearTimeout(this.timer);

  _this.ws = new WebSocket(socketUrl + "?token=" + token + "&type=backstage");

  // _this.ws = new WebSocket(socketUrl) // 不带token
  _this.ws.onopen = function () {
    callback && callback();
    _this.errorResetNumber = 0;
    _this.errorResetTimer = null;
    _this.errorFrom = 0;
    _this.errorDispatchOpen = true;
    _this.$soctket_subscribe();
    _this.$soctket_heartSoctket();
    console.log("web socket has connected ");
  };

  _this.ws.onclose = errorDispatch(1);
  _this.ws.onerror = errorDispatch(2);
};

/**
 * 触发器->发布信息
 * @param callback 状态处理
 * @param value 数据处理
 */
socket.prototype.$soctket_emit = function (value, callback) {
  const _this = this;
  const poll = function () {
    return _this.ws.readyState;
  };
  if (callback && isType(callback) !== "Function") {
    throw new Error("$socket_emit arugment[1] must be a function");
  }
  if (!_this.ws) {
    throw new Error("$socket dispatch is fail please use $socket_open method");
  }
  console.log(_this.ws.readyState);
  if (_this.ws.readyState === 1) {
    // 连接成功状态
    _this.ws.send(value);
    _this.$soctket_heartSoctket();
    callback && callback();
  } else if (_this.ws.readyState === 0) {
    // 连接中状态 ，轮询查询连接
    eventPoll(poll, 1, 500, () => {
      _this.ws.send(value);
      _this.$soctket_heartSoctket();
      callback && callback();
    });
  } else {
    // 失败重新连接
    _this.$soctket_init(() => {
      _this.$soctket_emit(value, callback);
    });
  }
};

/**
 * 订阅器->接受广播
 */

socket.prototype.$soctket_subscribe = function () {
  const _this = this;
  _this.ws.onmessage = function (res) {
    const result = JSON.parse(res.data);
    // console.log(result);
    if (_this.actions) {
      if (isType(_this.actions) !== "Function") {
        throw new Error("actions");
      } else {
        _this.commit(..._this.actions(result));
      }
    } else {
      _this.commit("subscribe_socket", result);
    }
    _this.$soctket_heartSoctket();
  };
};
/**
 * 心脏搏动机制->防止断开连接
 */

socket.prototype.$soctket_heartSoctket = function () {
  if (this.timer) clearTimeout(this.timer);

  this.timer = setTimeout(() => {
    if (this.ws.readyState === 1 || this.ws.readyState === 0) {
      //
      const params = {
        router: "Backstage/heartBeat",
        args: {},
      };
      this.ws.send(JSON.stringify(params));
      this.$soctket_heartSoctket();
    } else {
      this.$soctket_init();
    }
  }, 15000);
};
/**
 * 关闭socket连接
 */
socket.prototype.$soctket_close = function () {
  console.log("==================>结束");
  if (this.timer) clearTimeout(this.timer);
  if (this.errorResetTimer) clearTimeout(this.errorResetTimer);
  this.closeWs = true;
  this.ws.close();
};
/**
 * 重启socket连接
 */
socket.prototype.$soctket_open = function () {
  if (!this.closeWs) {
    throw new Error("socket is connected");
  }
  this.timer = null;
  this.errorResetNumber = 0;
  this.closeWs = false;
  this.errorFrom = 0;
  this.errorResetTimer = null;
  this.errorDispatchOpen = true;
  this.heartSocketOpen = false;
  this.closeWs = false;
  this.$soctket_init();
};
export default socket;
