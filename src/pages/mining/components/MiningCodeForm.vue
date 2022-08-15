<!--
 * @Author: Fuyi002 2669702453@qq.com
 * @Date: 2022-05-18 13:31:44
 * @LastEditors: Fuyi002 2669702453@qq.com
 * @LastEditTime: 2022-05-19 11:50:51
 * @FilePath: \lottery-admin\src\pages\mining\components\MiningCodeForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-modal
    ref="formRef"
    :visible="isVisible"
    title="新增激活码"
    :confirm-loading="confirmLoading"
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
    <a-form :form="form" v-bind="formLayout">
      <a-form-item label="矿机ID">
        <a-select
          placeholder="请选择矿机ID"
          v-decorator="[
            'project_id',
            {
              rules: [{ required: true, message: '请选择矿机ID' }],
            },
          ]"
        >
          <a-select-option
            :key="item.id"
            :value="item.id"
            v-for="item in allMiningList"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="数量">
        <a-input
          allowClear
          placeholder="请输入生成数量，最小1"
          v-decorator="[
            'number',
            {
              rules: [{ required: true, message: '请输入生成数量，最小1' }],
            },
          ]"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const fields = ["project_id", "number"];
export default {
  name: "MiningCodeForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    allMiningList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return {
      form: this.$form.createForm(this),
    };
  },
  created() {
    // this._getProxyUserList();
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    // this.$watch("modules", () => {
    //   this.modules && this.form.setFieldsValue(this.modules);
    // });
  },
};
</script>

<style></style>
