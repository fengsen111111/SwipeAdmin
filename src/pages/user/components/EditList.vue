<template>
  <div>
    <a-modal
      :visible="editVisible"
      v-drag-modal
      title="编辑"
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
      <!-- spinning加载动画 -->
      <a-spin :spinning="edit_loading">
        <a-form
          :form="form"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-row>
            <a-col :span="12">
              <a-form-item label="ID">
                <a-input disabled
                  allowClear
                  placeholder="ID"
                  v-decorator="[
                    'id',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'ID',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            
            <!-- 国家id -->
            
            <a-col :span="12">
              <a-form-item label="国家id">
                <a-input disabled
                  allowClear
                  v-decorator="[
                    'en_name',
                    {
                      rules: [
                        {
                          required: true,
                          message: '国家id',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
          <a-col :span="12">
              <a-form-item label="生成秒数">
                <a-input
                  allowClear
                  placeholder="物流信息生成秒数"
                  suffix="秒"
                  v-decorator="[
                    'delay_time',
                    {
                      rules: [
                        {
                          required: true,
                          message: '物流信息生成秒数',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="商品状态">
                <a-select 
                  v-decorator="[
                    'status',
                    { rules: [{ required: true, message: '商品状态' }] },
                  ]"
                  placeholder="选择当前商品状态"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="item in languageList"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            
          </a-row>
          <a-row>
            <a-col :span="24">
              <!-- 邮件内容   -->
              <a-form-item label="物流信息" style="margin-left: -98px;">
                <a-textarea  style="height: 100px;"
                  placeholder="物流信息"
                  v-decorator="[
                    'information',
                    {
                      rules: [
                        {
                          required: true,
                          message: '物流信息',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const fields = [
  "id",
  // "country_id",
  "en_name",
  "status",
  "delay_time",
  "information",
];
export default {
  props: {
    editVisible: {
      type: Boolean,
      default: false,
    },
    modules:{
      type:Object,
      default: ()=>{}
    },
    edit_loading:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      EditList:[],//表单数据
      form: this.$form.createForm(this),
      languageList: [
        {
            id:1,
            name:"打包中"
        },
        {
            id:2,
            name:"已派件"
        },
        {
            id:3,
            name:"待分拣"
        },
        {
            id:4,
            name:"待送达"
        },
        {
            id:5,
            name:"待签收"
        },
        {
            id:6,
            name:"已签收"
        },
        
      ], 
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 modules 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
  },
};
</script>
