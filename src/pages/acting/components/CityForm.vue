<template>
  <a-modal
    :visible="isVisible"
    :title="isStatus === 1 ? '新增城市代理' : '修改城市代理'"
    :confirmLoading="loading"
    width="800px"
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
    <a-spin :spinning="loadingCity">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']" disabled />
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item label="昵称">
              <a-input
                placeholder="请输入昵称"
                allowClear
                v-decorator="[
                  'nickname',
                  {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        message: '请输入昵称',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="账号">
              <a-input
                placeholder="请输入账号"
                allowClear
                v-decorator="[
                  'username',
                  {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        message: '请输入账号',
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
            <a-form-item label="密码">
              <a-input-password
                :placeholder="
                  isStatus === 1 ? '请输入密码' : '不修改为默认密码'
                "
                v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: isStatus === 1, message: '请输入密码' },
                    ],
                  },
                ]"
              ></a-input-password>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否发货">
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'is_can_shipment',
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
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1"> 是 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="每笔佣金类型">
              <a-select
                placeholder="请选择类型"
                style="width: 100%"
                @change="handleCommission"
                v-decorator="[
                  'shopping_commission_type',
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
                  v-for="item in commissionList"
                  :value="item.id"
                  :key="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="commType == 0 ? '佣金比例' : '固定金额'">
              <a-input
                placeholder="请输入"
                allowClear
                v-decorator="[
                  'commission_rate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
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
            <a-form-item label="代理类型">
              <a-select
                placeholder="请选择类型"
                style="width: 100%"
                @change="handleCity"
                v-decorator="[
                  'agent_type',
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
                  v-for="item in cityList"
                  :value="item.id"
                  :key="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="代理明细">
              <a-radio-group
                name="radioGroup"
                v-decorator="['agent_type_type']"
              >
                <a-radio :value="0">不是代理</a-radio>
                <a-radio :value="1"> 全线 </a-radio>
                <a-radio :value="2">直推</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- ======================ISSHow======================= -->
        <template v-if="showCity">
          <!-- ======================邦======================= -->

          <template>
            <a-row>
              <a-col :span="12">
                <a-form-item label="邦">
                  <a-select
                    placeholder="请选择邦"
                    style="width: 100%"
                    @change="changeState"
                    v-decorator="[
                      'cityid1',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option
                      v-for="item in cityOptions"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="cityType !== 2">
                <a-form-item label="上级代理">
                  <a-select
                    placeholder="请选择邦"
                    style="width: 100%"
                    @change="changeUser"
                    v-decorator="[
                      'city_one_id',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option
                      v-for="item in userAgentList"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.city_agent.username }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <!-- ======================市======================= -->
          <template v-if="cityType === 3">
            <a-row>
              <a-col :span="12">
                <a-form-item label="市">
                  <a-select
                    placeholder="请选择邦"
                    style="width: 100%"
                    @change="changeCityAgent"
                    v-decorator="[
                      'cityId2',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option
                      v-for="item in cityAgentList"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <!-- ======================区======================= -->
          <template v-else-if="cityType === 4">
            <a-row>
              <a-col :span="12">
                <a-form-item label="市">
                  <a-select
                    placeholder="请选择邦"
                    style="width: 100%"
                    @change="changeCityAgent"
                    v-decorator="[
                      'cityId2',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option
                      v-for="item in cityAgentList"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="上级代理">
                  <a-select
                    placeholder="请选择邦"
                    style="width: 100%"
                    @change="changeAreaUser"
                    v-decorator="[
                      'city_two_id',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option
                      v-for="item in areaUserList"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.city_agent.username }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="区">
                  <a-select
                    placeholder="请选择邦"
                    style="width: 100%"
                    @change="changeAreaAgent"
                    v-decorator="[
                      'cityId3',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-select-option
                      v-for="item in areaList"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template v-else></template>
        </template>

        <template v-else>
          <a-alert :message="message" banner closable />
          <div style="height: 20px"></div>
          <a-button type="primary" block @click="handleUpdateStatus">
            修改
          </a-button>
        </template>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = [
  "id",
  "nickname",
  "password",
  "username",
  "agent_type",
  "commission_rate",
  "shopping_commission_type",
  "is_can_shipment",
  "agent_type_type",
  // Add
  "cityId1",
  "cityId2",
  "cityId3",
  "city_one_id",
  "city_two_id",
  "city_three_id",
];
import { actingService } from "@/services";
export default {
  name: "GeneralFrom",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isStatus: {
      type: Number,
      default: 1,
    },

    modules: {
      type: Object,
      default: () => {},
    },
    message: {
      type: String,
      default: "",
    },
    showCity: {
      type: Boolean,
      default: false,
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
      commType: 2,
      commissionList: [
        {
          id: 0,
          name: "按比例",
        },
        {
          id: 1,
          name: "固定金额",
        },
      ],
      cityList: [
        {
          id: 2,
          name: "邦",
        },
        {
          id: 3,
          name: "市",
        },
        {
          id: 4,
          name: "区",
        },
      ],
      cityOptions: [],
      userAgentList: [],
      cityAgentList: [],

      areaList: [],
      areaUserList: [],
      footerAgent: [],
      cityType: 3,
      loadingCity: false,
    };
  },
  created() {
    // 防止表单未注册
    this.handleCity();
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },

  methods: {
    handleCommission(val) {
      console.log("===========>val", val);
      this.commType = val;
    },
    onChange(value) {
      console.log(value);
    },
    handleCity(val) {
      this.cityType = val;
      actingService
        .getCityAll({
          type: 0,
        })
        .then((res) => {
          const { data, code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.cityOptions = this.mapTreeData(data.area);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    mapTreeData(data) {
      return data.map((item) => {
        return {
          name: item.name,
          id: item.id,
          children:
            item.children == null || item.children.length <= 0
              ? []
              : this.mapTreeData(item.children),
        };
      });
    },
    _getChangeService(val, type) {
      this.loadingCity = true;
      actingService
        .getCityUser({
          area_id: val,
        })
        .then((res) => {
          this.loadingCity = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            // if (this.cityType === 2) {
            console.log("===========>data", data);
            if (type === "city") {
              this.cityAgentList = data.areas;
              this.userAgentList = data.users;
            } else if (type === "area") {
              this.areaUserList = data.users;
              this.areaList = data.areas;
            } else {
              this.footerAgent = data.users;
            }
          }
        })
        .catch((error) => {
          this.$message.error(error);
          this.loadingCity = false;
        });
    },
    changeState(val) {
      // const data = ;
      this._getChangeService(val, "city");
      // console.log("===========>areas", data);
    },
    changeUser(val) {
      console.log("===========>val", val);
    },
    changeCityAgent(val) {
      this._getChangeService(val, "area");
    },
    // ------
    changeAreaAgent(val) {
      console.log("===========>val", val);
      this._getChangeService(val, "footer");
    },

    changeAreaUser(val) {
      this._getChangeService(val);
    },
    changeFooterUser(val) {
      this._getChangeService(val);
    },

    // 修改状态
    handleUpdateStatus() {
      this.$emit("updateStatus");
    },
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > label {
    width: 100px;
  }
  margin-bottom: 10px;
}
</style>