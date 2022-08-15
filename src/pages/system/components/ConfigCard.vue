<template>
  <a-card :loading="configLoading">
    <a slot="extra">
      <a-button type="primary" @click="handleUpdate">修改</a-button>
    </a>
    <a-tabs default-active-key="1" tab-position="top">
      <a-tab-pane
        :tab="item.value.title"
        v-for="item in configData"
        :key="item.name"
        forceRender
      >
        <a-form v-bind="formLayout" :form="form">
          <a-row>
            <a-col
              :xs="20"
              :sm="20"
              :md="20"
              :lg="12"
              :xl="12"
              :xxl="6"
              v-for="itemChi in item.value.list"
              :key="itemChi.id"
            >
              <template v-if="itemChi.type === 'string'">
                <a-form-item :label="itemChi.title">
                  <a-input
                    :placeholder="itemChi.content.description"
                    v-decorator="[`${itemChi.name}`]"
                  ></a-input>
                </a-form-item>
              </template>
              <template v-else-if="itemChi.type === 'textarea'">
                <a-form-item :label="itemChi.title">
                  <a-textarea
                    :placeholder="itemChi.content.description"
                    v-decorator="[`${itemChi.name}`]"
                  ></a-textarea>
                </a-form-item>
              </template>
              <template v-else-if="itemChi.type === 'switch'">
                <a-form-item
                  :label="itemChi.title"
                  :labelCol="{
                    span: 10,
                  }"
                  :wrapperCol="{
                    span: 12,
                  }"
                >
                  <a-switch
                    v-decorator="[
                      `${itemChi.name}`,
                      {
                        initialValue: true,
                        valuePropName: 'checked',
                      },
                    ]"
                  />
                </a-form-item>
              </template>
              <template v-else-if="itemChi.type === 'number'">
                <a-form-item
                  :label="itemChi.title"
                  :labelCol="{
                    span: 10,
                  }"
                  :wrapperCol="{
                    span: 14,
                  }"
                >
                  <a-input-number
                    :min="0"
                    :max="1000000000000"
                    v-decorator="[`${itemChi.name}`]"
                  />
                </a-form-item>
              </template>
              <template v-else-if="itemChi.type === 'radio'">
                <a-form-item :label="itemChi.title">
                  <a-radio-group
                    name="radioGroup"
                    v-decorator="[`${itemChi.name}`]"
                  >
                    <!-- {{ itemChi.value }} -->
                    <a-radio
                      :value="indexd"
                      v-for="(radios, indexd) in itemChi.content.value"
                      :key="indexd"
                      >{{ radios }}</a-radio
                    >
                    <!-- <a-radio>{{ itemChi.content[1] }}</a-radio>
                    <a-radio>{{ itemChi.content[2] }}</a-radio>-->
                  </a-radio-group>
                </a-form-item>
              </template>
              <template v-else-if="itemChi.type === 'select'">
                <a-form-item :label="itemChi.title">
                  <a-select
                    :placeholder="itemChi.content.description"
                    v-decorator="[`${itemChi.name}`]"
                  >
                    <a-select-option
                      :value="selectVal.id"
                      v-for="(selectVal, index) in itemChi.content.value"
                      :key="index"
                      >{{ selectVal.title }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </template>
              <template v-else-if="itemChi.type === 'time'">
                <a-form-item :label="itemChi.title">
                  <a-time-picker
                    v-decorator="[`${itemChi.name}`]"
                    :format="itemChi.content.format"
                  />
                </a-form-item>
              </template>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { systemService } from "@/services";
import moment from "moment";
export default {
  name: "ConfigCard",
  props: {
    configData: {
      type: Array,
      default: () => [],
    },
    configFormDate: {
      type: Object,
    },
    modules: {
      type: Object,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    return {
      form: this.$form.createForm(this),
      configLoading: false,
    };
  },
  created() {
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    onChangewithdraw_start_time(time, timeString) {
      console.log(time, timeString);
    },
    handleUpdate() {
      this.configLoading = true;
      const results = [];
      this.form.validateFields((_, values) => {
        // 格式化时间
        values.withdraw_start_time = moment(values.withdraw_start_time).format(
          "HH:mm"
        );
        values.withdraw_end_time = moment(values.withdraw_end_time).format(
          "HH:mm"
        );

        const result = [...this.configData];
        result.forEach((item) => {
          item.value.list.forEach((items) => {
            results.push({
              id: items.id,
              name: items.name,
              value: values[items.name],
              type: items.type,
            });
          });
        });
      });
      systemService
        .updateConfig({
          settings: results,
        })
        .then((res) => {
          this.configLoading = false;
          const { code, msg } = res.data;
          if (code === 200) {
            this.$message.success("修改成功");
            this.$emit("configRefresh");
          } else {
            this.$message.error(msg);
            this.$emit("configRefresh");
          }
        })
        .catch((error) => {
          this.$message.error(error);
          this.configLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
