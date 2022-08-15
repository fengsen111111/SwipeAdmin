<template>
  <a-modal
    :visible="isVisible"
    :title="
      status === 1
        ? '新增角色--添加完成需要重新登录'
        : '修改角色--修改完成需要重新登录'
    "
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
      <a-form :form="lastForm" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="角色名称">
          <a-input
            placeholder="请输入角色名称"
            v-decorator="[
              'rolename',
              {
                rules: [
                  {
                    required: true,
                    min: 2,
                    message: '角色名称必填',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="权限">
          <a-tree
            checkable
            :checkStrictly="true"
            v-model="checkedKeys"
            :tree-data="rightLists"
            :expanded-keys="expandedKeys"
            @expand="onExpand"
            key="id"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const fields = ["rolename", "id"];
import { adminService } from "@/services";
export default {
  name: "LastFiveCreate",
  props: {
    status: {
      type: Number,
      default: 1,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    modul: {
      type: Object,
      default: () => null,
    },
    rightLists: {
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
        span: 17,
      },
    };

    return {
      lastForm: this.$form.createForm(this),
      expandedKeys: [],
      checkedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.lastForm.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("modul", () => {
      this.modul && this.lastForm.setFieldsValue(this.modul);
      if (this.modul) {
        this._getInquire(this.modul.id);
      } else {
        this.expandedKeys = [];
        this.checkedKeys = [];
      }
    });
  },
  watch: {
    checkedKeys(val) {
      if (val.checked) {
        this.checkedKeys = val.checked;
      }
      console.log("onCheck", val);
    },
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    _getInquire(id) {
      adminService.getInquire(id).then((res) => {
        const { msg, code, data } = res.data;
        if (code !== 200) {
          this.$message.error(msg);
        } else {
          this.isStatus = 2;
          this.isVisible = true;
          const datas = data.jurisdiction.split(",");
          const roleList = datas.map((item) => Number(item));
          this.expandedKeys = roleList;
          this.checkedKeys = roleList;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
