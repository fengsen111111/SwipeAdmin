<template>
  <a-modal
    :visible="isVisible"
    :title="`发布活动-总价格（${totalMoney}）`"
    :confirmLoading="loading"
    width="700px"
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
        <!-- <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item> -->
        <template v-if="cTypeId === 12">
          <a-row>
            <a-col :span="12">
              <a-form-item label="最大购买">
                <a-input
                  placeholder="请输入最大购买限制"
                  v-decorator="[
                    'limited',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入最大购买限制',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="状态">
                <a-radio-group
                  name="radioGroup"
                  defaultChecked
                  v-decorator="[
                    'status',
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
                  <a-radio :value="0">预售 </a-radio>
                  <a-radio :value="1">立即进行</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template v-else>
          <a-row>
            <a-col :span="12">
              <a-form-item label="总数">
                <a-input
                  placeholder="请输入总数"
                  @change="changeTotal"
                  v-decorator="[
                    'amount',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入总数',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="最大购买">
                <a-input
                  placeholder="请输入最大购买限制"
                  v-decorator="[
                    'limited',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入最大购买限制',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- ======================2======================= -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="每份价格">
                <a-input
                  placeholder="请输入"
                  disabled
                  v-decorator="[
                    'per_price',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                        {
                          pattern: /^(\d+)(.\d{0,2})?$/,
                          message: '不能大于两位小数',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="状态">
                <a-radio-group
                  name="radioGroup"
                  defaultChecked
                  v-decorator="[
                    'status',
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
                  <a-radio :value="0">预售 </a-radio>
                  <a-radio :value="1">立即进行</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- ======================3======================= -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="是否控奖">
                <a-radio-group
                  name="radioGroup"
                  defaultChecked
                  @change="handleRadio"
                  :disabled="isGame"
                  v-decorator="[
                    'is_control',
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
                  <a-radio :value="0">否 </a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="控奖序号">
                <a-input-number
                  id="inputNumber"
                  :min="0"
                  :max="maxNum"
                  :disabled="awardDialled"
                  v-decorator="[
                    'control_number',
                    {
                      rules: [
                        {
                          required: !awardDialled,
                          message: '请输入控奖序号',
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
              <a-form-item label="专区名称">
                <a-select
                  placeholder="请选择专区"
                  v-decorator="[
                    'zone_id',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择专区',
                        },
                      ],
                    },
                  ]"
                >
                  <a-select-option
                    :key="item.id"
                    :value="item.id"
                    v-for="item in specialList"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="热门">
                <a-radio-group
                  name="radioGroup"
                  defaultChecked
                  v-decorator="[
                    'hot',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择热门',
                        },
                      ],
                    },
                  ]"
                >
                  <a-radio :value="0">否 </a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
// import { commodityService } from "@/services";
const fields = [
  "per_price",
  "limited",
  "amount",
  "is_control",
  "control_number",
  "status",
  "zone_id",
  "hot",
];
export default {
  name: "ReleaseForm",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modules: {
      type: Object,
      default: () => {},
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    cTypeId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    this.formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return {
      form: this.$form.createForm(this),
      info: 10,
      awardDialled: true,
      maxNum: 0,
      specialList: [],
      isGame: false,
    };
  },
  created() {
    // 防止表单未注册
    this._specialAll();
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.$nextTick(() => {
        this.modules && this.form.setFieldsValue(this.modules);
      });
    });
  },
  computed: {
    // 获取表单值
    formValues() {
      return this.form.getFieldsValue();
    },
  },
  methods: {
    changeTotal(val) {
      const total = this.totalMoney / Number(val.target.value);
      const { limited } = this.form.getFieldsValue();

      this.maxNum = val.target.value - Number(limited);
      // 判断总数为1时不能进行控奖
      if (+val?.target?.value === 1) {
        this.isGame = true;
        this.form.setFieldsValue({
          is_control: 0,
        });
      } else {
        this.isGame = false;
      }
      const reg = /^(\d+)(.\d{0,2})?$/;
      if (!reg.test(total)) {
        this.$message.error("每份不能大于两位小数");
      }
      this.form.setFieldsValue({
        per_price: total,
      });
    },
    handleRadio(item) {
      if (item.target.value == 1) {
        this.awardDialled = false;
        const { limited, amount } = this.form.getFieldsValue();
        this.maxNum = amount - Number(limited);
      } else {
        this.awardDialled = true;
      }
    },
    _specialAll() {
      // commodityService
      //   .specialAll()
      //   .then((res) => {
      //     const { code, msg, data } = res.data;
      //     if (code !== 200) {
      //       this.$message.error(msg);
      //     } else {
      //       console.log("===========>data", data);
      //       this.specialList = data;
      //     }
      //   })
      //   .catch((error) => {
      //     this.$message.error(error);
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
