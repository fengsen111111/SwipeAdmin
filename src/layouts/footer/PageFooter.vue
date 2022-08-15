<template>
  <div class="footer">
    <div class="links">
      <!-- <a
        target="_blank"
        :key="index"
        :href="item.link ? item.link : 'javascript: void(0)'"
        v-for="(item, index) in linkList"
      >
        <a-icon v-if="item.icon" :type="item.icon" />{{ item.name }}
      </a> -->
    </div>
    <div class="copyright">
      <!-- Copyright<a-icon type="copyright" />{{ copyright }} -->

      Technical Support:
      <!-- <div class="technical-logo" style="width: 10px; height: 10px">
          <img
            src="../../assets/img/gs.png"
            alt=""
            class="width:100%;height:100%"
          />
        </div> -->
      <span>
        <img
          src="../../assets/img/gs.png"
          alt=""
          style="width: 20px; height: 20px"
        />
        global-software</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "PageFooter",
  props: ["copyright", "linkList"],
};
</script>

<style lang="less" scoped>
.footer {
  padding: 48px 16px 24px;
  /*margin: 48px 0 24px;*/
  text-align: center;
  .copyright {
    color: @text-color-second;
    > span {
      cursor: pointer;
    }
    font-size: 14px;
    i {
      margin: 0 4px;
    }
  }

  .links {
    margin-bottom: 8px;
    a:not(:last-child) {
      margin-right: 40px;
    }
    a {
      color: @text-color-second;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }
  }
}
</style>
