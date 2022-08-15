<template>
  <a-card>
    <a-row>
      <a-col :md="12" :sm="24">
        <div>
          <!-- card body -->
          <div class="code-item">
            <div class="code-item-header">
              <i class="el-icon-warning code-item-header-icon"></i>
              <p>
                谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录、提现、修改安全设置等操作的安全验证。
              </p>
            </div>
            <div class="code-item-body">
              <div class="code-item-body-header">
                <span>1</span>
                <h4>下载谷歌验证器APP</h4>
              </div>
              <div>
                <p></p>
                <p>
                  iOS用户登录App
                  Store搜索“Authenticator”下载。安卓用户登录应用商店或使用手机浏览器搜索“谷歌验证器”下载。
                  App StoreGoogle Play
                </p>
              </div>
              <div class="code-item-footer">
                <a-button type="primary" @click="handleStore"
                  >App Store</a-button
                >
                <a-button type="primary" @click="handleGoogle"
                  >Google Play</a-button
                >
              </div>
              <div class="code-item-body-header">
                <span>2</span>
                <h4>在谷歌验证器中添加密钥并备份</h4>
              </div>
              <div style="displey: flex">
                <p style="width: 120px"></p>
                <p>
                  打开谷歌验证器，扫描下方二维码或手动输入下述密钥添加验证令牌。
                </p>
              </div>
            </div>
            <div class="content">
              <div class="content-header">
                <div id="qrcode"></div>
                <div class="content-header-text">
                  <p ref="copy" prop="appId">{{ secret }}</p>
                  <a-button type="primary" v-copy="secret">复制密匙</a-button>
                </div>
              </div>
              <a-alert
                message="密钥用于手机更换或遗失找回谷歌验证器，绑定前请务必将上述密钥备份保存。"
                style="margin-top: 20px"
              >
              </a-alert>
            </div>
            <div class="google-box">
              <div class="google-box-header">
                <span>3</span>
                <h4 style="margin-bottom: 0">输入谷歌验证器中6位验证码</h4>
              </div>
            </div>
            <a-row type="flex" justify="start">
              <a-col> </a-col>
            </a-row>
            <div class="footer-box">
              <div style="width: 100%; margin: 20px 0">
                <a-alert message="绑定或解绑成功后需重新登陆生效" banner />
                <a-input
                  placeholder="请输入谷歌验证码"
                  v-model="codes"
                ></a-input>
              </div>
              <a-button type="primary" @click="handleBind" :loading="loading"
                >绑定</a-button
              >
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import QRCode from "qrcodejs2";
import { systemService } from "@/services";
export default {
  name: "GoogleDetails",
  data() {
    return {
      secret: "",
      codeUrl: "",
      codes: "",
      loading: false,
    };
  },
  created() {
    this._getGoogle();
  },
  methods: {
    _getGoogle() {
      systemService.getGoogle().then((res) => {
        const { code, msg, data } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.codeUrl = data.codeurl;
          this.secret = data.secret;
          new QRCode("qrcode", {
            width: 132,
            height: 132,
            text: data.codeurl, // 二维码地址
            colorDark: "#000",
            colorLight: "#fff",
          });
          console.log(data);
        }
      });
    },
    handleGoogle() {
      window.open(
        "https://apps.apple.com/us/app/google-authenticator/id388497605"
      );
    },
    handleStore() {
      window.open(
        "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
      );
    },
    handleBind() {
      this.loading = true;
      systemService
        .getGoogle({ code: this.codes, secret: this.secret })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.success(msg);
          } else {
            this.$notification["success"]({
              message: "谷歌验证器绑定",
              description: "绑定成功/请重新登录",
            });
            this.$emit("handleBind", false);
            localStorage.setItem("googleCode", data.secret);
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.code-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  &-header {
    color: #8d8a8a;
    display: flex;
    align-items: center;
    &-icon {
      font-size: 20px;
      margin-right: 10px;
    }
  }
  &-body {
    margin: 20px 0;
    &-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      & > span {
        display: inline-block;
        background: #238383;

        width: 20px;
        height: 20px;
        padding: 6px;
        line-height: 10px;
        color: white;
        text-align: center;

        border-radius: 50%;
        margin-right: 10px;
      }
      & > h4 {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 0;
      }
    }
  }
  &-footer {
    margin: 30px 0;
    display: flex;
    justify-content: space-around;
  }
  .content {
    /* margin: 0 30px; */
    border: 1px solid #eeeeee;
    widows: 100%;
    padding: 30px 70px;
    width: 92%;
    &-header {
      display: flex;
      justify-content: space-between;
      &-text {
        margin-left: 30px;
        & > p {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
.google-box {
  display: flex;
  margin-top: 10px;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    & > span {
      display: inline-block;
      background: #238383;
      width: 20px;
      height: 20px;
      padding: 6px;
      line-height: 10px;
      color: white;
      text-align: center;

      border-radius: 50%;
      margin-right: 10px;
    }
    & > h4 {
      font-size: 15px;
      font-weight: bold;
    }
  }
}
.footer-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}
.goddamn {
  display: flex;
  align-items: center;
  > span {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 15px;
  }
}
.bound-box {
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}
</style>
