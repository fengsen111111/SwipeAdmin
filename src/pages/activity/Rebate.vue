<template>
  <div>
    <a-row>
      <a-col :span="9">
        <a-card title="购买返佣" :loading="loading">
          <a-button
            type="primary"
            slot="extra"
            :loading="loading"
            @click="handleUpdate"
            >修改</a-button
          >
          <a-form v-bind="formLayout" :form="form" ref="rebateRef">
            <a-form-item v-show="false" label="ID">
              <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
            </a-form-item>
            <a-form-item label="使用购买金额百分比分佣">
              <a-input v-decorator="['recharge_scale']" />
            </a-form-item>
            <a-form-item label="开启层级">
              <a-select placeholder="请选择" v-decorator="['is_invite_level']">
                <a-select-option value="1">1级</a-select-option>
                <a-select-option value="2">2级</a-select-option>
                <a-select-option value="3">3级</a-select-option>
                <a-select-option value="4">4级</a-select-option>
                <a-select-option value="5">5级</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="1级推荐人获取的积分佣金比例">
              <a-input v-decorator="['one_invite_scale']" />
            </a-form-item>
            <a-form-item label="2级推荐人获取的积分佣金比例">
              <a-input v-decorator="['two_invite_scale']" />
            </a-form-item>
            <a-form-item label="3级推荐人获取的积分佣金比例">
              <a-input v-decorator="['three_invite_scale']" />
            </a-form-item>
            <a-form-item label="4级推荐人获取的积分佣金比例">
              <a-input v-decorator="['four_invite_scale']" />
            </a-form-item>
            <a-form-item label="5级推荐人获取的积分佣金比例">
              <a-input v-decorator="['five_invite_scale']" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { activityService } from "@/services";
export default {
  name: "rebate",
  data() {
    this.formLayout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 15,
      },
    };
    return {
      form: this.$form.createForm(this),
      loading: false,
      inviteList: {},
    };
  },
  created() {
    this._inviteList();
  },
  methods: {
    _inviteList() {
      this.loading = false;
      activityService
        .inviteList()
        .then((res) => {
          this.loading = false;
          const {
            id,
            recharge_scale,
            one_invite_scale,
            two_invite_scale,
            three_invite_scale,
            four_invite_scale,
            five_invite_scale,
            is_invite_level,
          } = res.data.data;
          this.form.setFieldsValue({
            id,
            recharge_scale,
            one_invite_scale,
            two_invite_scale,
            three_invite_scale,
            four_invite_scale,
            five_invite_scale,
            is_invite_level,
          });
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error);
        });
    },
    handleUpdate() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        activityService
          .inviteUpdate(values)
          .then((res) => {
            this.loading = false;
            const { code, msg } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.$message.success("修改成功");
              this._inviteList();
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
