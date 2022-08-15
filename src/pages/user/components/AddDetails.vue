<template>
  <div>
    <a-modal
      :visible="isVisibleTwo"
      v-drag-modal
      title="新增"
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
      <a-spin :spinning="add_loading">
        <a-form
          :form="form"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 17 }"
        >
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
          </a-row>

          <a-row>
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

export default {
  props: {
    isVisibleTwo: {
      type: Boolean,
      default: false,
    },
    add_loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
  },
  methods: {
  },
};
</script>
