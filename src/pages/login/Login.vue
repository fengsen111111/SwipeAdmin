<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">后台管理系统</span>
      </div>
      <div class="desc"></div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <!-- <a-tabs
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px"
        >
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert
              type="error"
              :closable="true"
              v-if="error"
              :message="error"
              @close="onClose"
              showIcon
              style="margin-bottom: 24px"
            />
          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input size="large" placeholder="mobile number">
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="captcha">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button
                    style="width: 100%"
                    class="captcha-button"
                    size="large"
                    >获取验证码</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs> -->
        <a-form-item>
          <a-input
            autocomplete="autocomplete"
            size="large"
            placeholder="账号"
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入账户名',
                    whitespace: true,
                  },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            size="large"
            placeholder="密码"
            autocomplete="autocomplete"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                    whitespace: true,
                  },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        <div>
          <a-checkbox :checked="true">自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
      </a-form>

      <a-modal
        title="谷歌验证码"
        :visible="isVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <div style="display: flex; align-items: center">
          <label style="width: 200px">谷歌验证器验证码</label>
          <a-input
            placeholder="请输入谷歌验证器验证码"
            v-model="googleCode"
          ></a-input>
        </div>
      </a-modal>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { userService } from "@/services";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      isVisible: false,
      confirmLoading: false,
      googleCode: "",
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          userService.login(name, password).then(this.afterLogin);
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      console.log("==================>loginRes", loginRes);
      if (Number(loginRes.code) === 200) {
        const { data, token, routes } = loginRes.data;
        this.setUser(data);
        // this.setPermissions(permissions);
        // this.setRoles(roles);
        setAuthorization({
          token: token,
        });
        // expireAt: new Date(loginRes.data.expireAt),
        // 获取路由配置

        const routesConfig = [
          {
            router: "root",
            children: [{ router: "admin" }, ...routes],
          },
        ];

        loadRoutes(routesConfig);
        this.$router.push("/admin");
        this.$message.success("登录成功", 3);
        this.$store.dispatch("socket/socketInit");
      } else if (Number(loginRes.code) === 201) {
        this.isVisible = true;
      } else {
        this.error = loginRes.message;
        this.$message.error(loginRes.msg);
      }
    },
    onClose() {
      this.error = false;
    },
    handleOk() {
      this.confirmLoading = true;
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          userService
            .login(name, password, this.googleCode)
            .then(this.afterLogin);
        }
      });
    },
    handleCancel() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;

    .header {
      height: 44px;
      line-height: 44px;

      a {
        text-decoration: none;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }

      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }

    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .login {
    width: 368px;
    margin: 0 auto;

    @media screen and (max-width: 576px) {
      width: 95%;
    }

    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
