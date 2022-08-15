<template>
  <div>
    <div class="dynamic-wrap" :style="{ maxHeight: wrapHeight + 'px' }">
      <div v-for="item in keysList" :key="item">
        <a-row :gutter="24">
          <a-col :span="10">
            <a-form-item
              label="名称"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-input
                placeholder="请填写名称"
                v-decorator="[
                  `${title}Name[${item}]`,
                  {
                    initialValue: arr[item] ? arr[item].name : undefined,
                    rules: [
                      { required: true, message: '请填写名称!' },
                      { pattern, message: '只能输入字母' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              label="内容"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-input
                placeholder="请填内容"
                v-decorator="[
                  `${title}Val[${item}]`,
                  {
                    initialValue: arr[item] ? arr[item].val : undefined,
                    rules: [{ required: true, message: '请填内容' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" style="padding-left: 0px">
            <a-form-item :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
              <template v-if="keysList.length > 1">
                <a-button
                  type="dashed"
                  icon="minus"
                  @click="removeRow(item)"
                  class="minusRowBtn"
                ></a-button>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <a-button type="dashed" icon="plus" @click="addRow" class="addRowBtn">
        新增一行
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DynamicForm",
  props: {
    title: {
      type: String,
      default: "",
    },
    wrapHeight: {
      // 表单容器的高度
      type: Number,
      default: 120,
    },
    arr: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      id: 0,
      keysList: [],
      pattern: /^[a-zA-Z_]{1,}$/,
    };
  },
  created() {
    this.form = this.$form.createForm(this);
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const arr = [0];
      if (this.arr.length !== 0) {
        for (let i = 1; i < this.arr.length; i++) {
          arr.push(i);
          this.id = this.id + 1;
        }
      }
      console.log("===========>arr", arr);
      this.keysList = arr;
    },
    // 移除某行
    removeRow(k) {
      if (this.keysList.length === 1) {
        // 如果存在可以移除所有行的情况，把条件改为this.keysList.length === 0即可
        return;
      }
      this.keysList = this.keysList.filter((item) => item !== k);
    },
    // 新增一行
    addRow() {
      this.id = this.id + 1;
      this.keysList = this.keysList.concat(this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.dynamic-wrap {
  padding-top: 10px;
  background-color: white;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
}
.minusRowBtn {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffa39e;
  padding-right: 7px;
  padding-left: 7px;
  height: 29px;
  margin-left: 10px;
}
.addRowBtn {
  width: 70%;
  color: #1890ff;
  border-color: #91d5ff;
  margin: 0px 0px 20px 70px;
}
</style>


