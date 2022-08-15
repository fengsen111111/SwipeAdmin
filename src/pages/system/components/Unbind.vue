<template>
  <a-card>
    <div class="bound-box">
      <p style="margin-right: 20px">已绑定谷歌验证器</p>
      <a-button type="primary" @click="handleUnbind" :loading="loading"
        >取消绑定</a-button
      >
    </div>
  </a-card>
</template>

<script>
import { systemService } from "@/services";
export default {
  name: "Unbind",
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleUnbind() {
      this.loading = true;
      systemService.unBindGoogle().then((res) => {
        this.loading = false;
        const { code, msg } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.$notification["success"]({
            message: "谷歌验证器解绑",
            description: "解绑成功 /请重新登录生效",
          });

          // this.$store.commit("account/REMOVE_GOOGLE");
          this.$emit("handleUbind", true);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>