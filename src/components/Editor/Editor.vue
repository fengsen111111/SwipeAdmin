<template>
  <div>
    <div id="wangeditor">
      <div ref="editorElem" style="text-align: left"></div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import { commodityService } from "@/services";
export default {
  name: "Editor",
  data() {
    return { editorContent: "", editor: null };
  },
  props: ["catchData", "value"], //接收父组件的方法
  watch: {
    value(newVal) {
      this.setHtml(newVal);
    },
  },
  mounted() {
    const that = this;
    this.editor = new E(this.$refs.editorElem);
    //创建富文本实例

    this.editor.config.onchange = (html) => {
      // html  带P标签的文本
      // this.getText() 不带P标签的文本
      html = this.getHtml();
      this.editorContent = html;
      this.$emit("change");
      this.$emit("input", html);
    };
    // 隐藏“网络图片”tab
    this.editor.config.showLinkImg = false;
    this.editor.config.uploadImgServer = "你的上传图片的接口";
    this.editor.config.uploadFileName = "你自定义的文件名";
    this.editor.config.uploadImgHeaders = {
      Accept: "*/*",
      // 'Authorization':'Bearer ' + token    //头部token
    };

    //下面是最重要的的方法
    this.editor.config.customUploadImg = function (files, insert) {
      let formData = new FormData();
      formData.append("picture", files[0]);
      formData.append("type", "delivery");
      commodityService
        .addImage(formData)
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            that.$message.error(msg);
          } else {
            const imageUrl = `${process.env.VUE_APP_IMAGE_URL}/${data.img_path}`;

            insert(imageUrl);
          }
        })
        .catch((error) => {
          that.$message.error(error);
        });
    };
    this.editor.create();
    if (this.value) {
      this.setHtml(this.value);
    }
  },

  methods: {
    // 获取内容(html)
    getHtml() {
      return this.editor.txt.html();
    },
    // 获取内容(纯文本)
    getText() {
      return this.editor.txt.text();
    },
    // 设置内容(html)
    setHtml(text) {
      this.editor.txt.html(text);
    },
    // 追加内容(html)
    appendHtml(text) {
      this.editor.txt.append(text);
    },
    // 清空内容
    clear() {
      this.editor.txt.clear();
    },
    /**
     * 获取后缀名
     */
    getExtName(fileName) {
      let index = fileName.lastIndexOf(".");
      if (index > -1) {
        return fileName.substring(index + 1);
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.w-e-toolbar {
  flex-wrap: wrap !important;
}
.w-e-text {
  p {
    white-space: normal !important;
  }
}
</style>