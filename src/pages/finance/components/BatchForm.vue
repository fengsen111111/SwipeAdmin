<template>
  <a-modal
    :visible="isBatch"
    title="批量审核"
    :confirmLoading="bathcLoading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="bathcLoading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="代付通道">
          <a-select
            v-decorator="[
              'pay_type',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择通道',
                  },
                ],
              },
            ]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in aisleTypeList" :key="item.name">
              {{ item.alias }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: "BatchForm",
  props: {
    isBatch: {
      type: Boolean,
      default: false,
    },
    bathcLoading: {
      type: Boolean,
      default: false,
    },

    aisleTypeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 19,
      },
    };
    return { form: this.$form.createForm(this) };
  },
  created() {},
};
</script>

<style lang="scss" scoped>
</style>
