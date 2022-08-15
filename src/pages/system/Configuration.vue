<!--
 * @Author: your name
 * @Date: 2022-02-23 14:43:15
 * @LastEditTime: 2022-03-24 14:03:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \lottery-admin\src\pages\system\Configuration.vue
-->
<template>
  <a-tabs default-active-key="1" tab-position="left" type="card">
    <a-tab-pane key="1" tab="系统配置">
      <config-card
        :configData="configData"
        :modules="modules"
        ref="configRef"
        @configRefresh="configRefresh"
      />
    </a-tab-pane>
    <a-tab-pane key="2" tab="谷歌验证器">
      <template v-if="user.google_code">
        <unbind />
      </template>
      <template v-else>
        <google-bind />
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { systemService } from "@/services";
import ConfigCard from "./components/ConfigCard.vue";
import GoogleBind from "./components/GoogleBind.vue";
import Unbind from "./components/Unbind.vue";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: { ConfigCard, GoogleBind, Unbind },
  name: "Configuration",
  data() {
    return {
      configData: [],
      modules: {},
    };
  },
  created() {
    this._getConfigList();
    // console.log("==================>this.user", this.user);
  },
  computed: {
    ...mapGetters("account", ["user"]),
  },
  methods: {
    _getConfigList() {
      systemService.getConfigList().then((res) => {
        const { code, data, msg } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              // this.configData = [];
              const element = data[key];
              this.configData.push({
                name: key,
                value: this.formDate(element),
              });
            }
          }
          const result = [...this.configData];
          // console.log("==================>result", result);
          const resultObj = {};
          result.forEach((item) => {
            item.value.list.forEach((items) => {
              if (items.type === "radio") {
                items.value = Number(items.value);
              }
              if (items.type === "time") {
                items.value = moment(items.value, "HH:mm");
              }
              this.$refs.configRef.form.getFieldDecorator(items.name);
              resultObj[items.name] = items.value;
            });
          });
          this.modules = resultObj;
          // console.log("==================>modules", this.modules);
        }
      });
    },
    configRefresh() {
      // console.log("===========>更新", "更新");
      this.configData = [];
      this._getConfigList();
    },
    formDate(item) {
      return {
        title: item.title,
        list: item.list.map((item) => {
          return {
            ...item,

            content: JSON.parse(item.content),
          };
        }),
      };
    },
    // fir,
  },
};
</script>

<style lang="scss" scoped>
</style>
