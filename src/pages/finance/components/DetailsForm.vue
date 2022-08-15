<template>
  <div>
    <a-drawer
      :title="title"
      placement="right"
      :width="width"
      :closable="true"
      :visible="visible"
      @close="
        () => {
          $emit('onClose');
        }
      "
    >
      <slot name="body"></slot>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: "DetailsForm",
  props: {
    title: {
      type: String,
      default: "未知",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: 300,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>
