<template>
  <a-modal
    :title="status === 1 ? '新增' : '修改'"
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
        <a-form-item label="地区名称">
          <a-input
            placeholder="请输入地区名称"
            allowClear
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入名称',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            placeholder="请选择类型"
            style="width: 100%"
            @change="changeType"
            v-decorator="[
              'type',
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
            <a-select-option
              v-for="item in areaTypeList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上级代理">
          <a-select
            placeholder="请选择上级代理"
            style="width: 100%"
            v-decorator="['parent_id']"
          >
            <a-select-option
              v-for="item in parentList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="允许代理人数">
          <a-input
            placeholder="请输入允许代理人数"
            allowClear
            v-decorator="[
              'allow_num',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入允许代理人数',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="已存在代理人数">
          <a-input
            placeholder="请输入已存在代理人数"
            allowClear
            v-decorator="[
              'exist_num',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入已存在代理人数',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// 表单字段
const fields = ["id", "exist_num", "allow_num", "parent_id", "type", "name"];
import { actingService } from "@/services";
export default {
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
      areaTypeList: [
        {
          id: 0,
          label: "邦",
        },
        {
          id: 1,
          label: "市",
        },
        {
          id: 2,
          label: "区",
        },
      ],
      parentList: [],
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    changeType(val) {
      this._actingService(val);
    },
    _actingService(val) {
      actingService
        .findArea({
          type: val,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.parentList = data;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>
