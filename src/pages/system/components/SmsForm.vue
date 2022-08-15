<template>
  <a-modal
    :title="status === 1 ? '新增短信服务商' : '修改短息服务商'"
    :visible="visible"
    :confirmLoading="loading"
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
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="服务商名称">
          <a-input
            placeholder="请输入服务商名称"
            allowClear
            v-decorator="[
              'service_provider',
              {
                rules: [
                  {
                    required: true,
                    min: 2,
                    message: '请输入服务商名称',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="失效时间">
          <a-select
            v-decorator="[
              'expire',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              },
            ]"
            placeholder="请选择失效时间(分钟)"
          >
            <a-select-option v-for="item in timeLists" :key="item.id">
              {{ item.time }}
            </a-select-option>
          </a-select>
          <!-- <a-input
            placeholder="请输入失效时间"
            v-decorator="[
              'expire',
              {
                rules: [{ required: true, message: '请输入失效时间' }],
              },
            ]"
          >
            <a-tooltip slot="suffix" title="时间秒"> S </a-tooltip>
          </a-input> -->
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group
            name="radioGroup"
            v-decorator="[
              'state',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              },
            ]"
          >
            <a-radio :value="3">禁用 </a-radio>
            <a-radio :value="2">使用中 </a-radio>
            <a-radio :value="1"> 启用 </a-radio>
          </a-radio-group>
        </a-form-item>
        <dynamic-form
          v-if="visible"
          title="partOne"
          :arr="detailsArr"
          :wrapHeight="300"
          ref="dynaFormRef"
        />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import DynamicForm from "../../../components/dynamic/DynamicForm.vue";
// 表单字段
const fields = ["service_provider", "expire", "state", "id"];
import { timeLists } from "@/utils/util";

export default {
  components: { DynamicForm },
  name: "StaffForm",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    modules: {
      type: Object,
      default: () => null,
    },

    status: {
      type: Number,
      default: 1,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    return {
      form: this.$form.createForm(this),
      detailsArr: [],
      timeLists,
    };
  },
  created() {
    // 防止表单未注册
    console.log("===========>this.datailsArr", this.datailsArr);
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    resetForm() {
      this.$refs.dynaFormRef.form.resetFields();
    },
  },
};
</script>