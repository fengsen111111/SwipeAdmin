import Vue from "vue";
import App from "./App.vue";
import { initRouter } from "./router";
import "./theme/index.less";
import Antd from "ant-design-vue";
import Viser from "viser-vue";
import "@/mock";
/* 可拖动 */
import '@/directives/dragModal';

import store from "./store";
import "animate.css/source/animate.css";
import Plugins from "@/plugins";
import { initI18n } from "@/utils/i18n";
import bootstrap from "@/bootstrap";
import "moment/locale/zh-cn";
import { formDate } from "@/utils/filters";
import { fastDate } from "@/utils/util";
// 图片预览功能
import hevueImgPreview from "hevue-img-preview";
Vue.use(hevueImgPreview);
// formate params time
import { timeFormat } from "@/utils/util";
// ===========================绑定在THIS上面=================================
Vue.prototype.config = {
  timeFormat,
};

const router = initRouter(store.state.setting.asyncRoutes);
const i18n = initI18n("CN", "US");

import Directives from "./directives";
Vue.prototype.fastDate = fastDate;
// Vue.prototype.itemsPageList = itemsPageList;
Vue.use(Directives);
Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(Viser);
Vue.use(Plugins);
Vue.filter("formDate", formDate);
bootstrap({ router, store, i18n, message: Vue.prototype.$message });

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
