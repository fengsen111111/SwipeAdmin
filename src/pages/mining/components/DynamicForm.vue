<template>
  <div class="dynamic">
    <!-- <a-card title="form-data" :bordered="true" style="width: 100%">
      <div> -->
    <a-form ref="form" layout="inline" :model="form" :rules="rules">
      <div v-for="(item, index) in form.dynamicItem" :key="index">
        <a-row type="flex">
          <a-col flex="300px">
            <a-form-item
              label="等级名称"
              :prop="'dynamicItem.' + index + '.level'"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              style="display:block"
            >
              <!-- <a-input v-model="item.level"></a-input> -->
              <a-select
                @change="handleChange"
                v-model="item.level"
                placeholder="请选择等级名称"
              >
                <a-select-option
                  :key="item.id"
                  :value="item.level"
                  v-for="item in $attrs.allMiningLevelList"
                  :disabled="formatLevel(item.level)"
                  >{{ LevelName(item) }}</a-select-option
                >
                <!-- <a-select-option key="2" value="2">2</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col flex="auto">
            <a-form-item label="购买区间">
              <a-input-group compact @change="handleGroupChange">
                <a-input-number
                  style=" width: 100px; text-align: center"
                  placeholder="最小购买"
                  v-model="item.min"
                  :min="1"
                />
                <!-- :disabled="index == 0 ? false : true" -->
                <a-input
                  style=" width: 35px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                  placeholder="~"
                  disabled
                />
                <a-input-number
                  :data-index="index"
                  style="width: 100px; text-align: center; border-left: 0"
                  placeholder="最大购买"
                  v-model="item.max"
                  :min="1"
                />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col flex="250px">
            <a-form-item
              label="收益方式"
              :prop="'dynamicItem.' + index + '.model'"
              :label-col="{ span: 11 }"
              :wrapper-col="{ span: 13 }"
              style="display:block"
            >
              <!-- <a-input v-model="item.model"></a-input> -->
              <a-select v-model="item.model">
                <a-select-option key="1" :value="1">按比例收益</a-select-option>
                <a-select-option key="2" :value="2">固定收益</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col flex="auto">
            <a-form-item
              :label="item.model == 2 ? '收益值' : '收益率'"
              :prop="'dynamicItem.' + index + '.income'"
            >
              <template v-if="item.model == 2">
                <a-input-number
                  :min="0.001"
                  :step="0.001"
                  v-model="item.income"
                ></a-input-number>
              </template>
              <template v-else>
                <a-input-number
                  :min="0.001"
                  :max="1"
                  :step="0.001"
                  v-model="item.income"
                ></a-input-number>
              </template>
            </a-form-item>
          </a-col>

          <a-col flex="50px" style="padding-left: 0px">
            <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
              <template v-if="form.dynamicItem.length > 1">
                <a-button
                  type="dashed"
                  icon="minus"
                  @click="deleteItem(item, index)"
                  class="minusRowBtn"
                ></a-button>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>

    <div style="display: flex; justify-content: center; ">
      <a-button type="dashed" @click="addItem" class="addRowBtn">
        <a-icon type="plus" /> 添加一行
      </a-button>
      <!-- <p>$attrs: {{ $attrs }}</p> -->
    </div>
    <!-- </div>
    </a-card> -->
  </div>
</template>

<script>
const columns = [
  {
    title: "Key",
    dataIndex: "Key",
    width: "10%",
    scopedSlots: { customRender: "Key" },
  },
  {
    title: "Value",
    dataIndex: "value",
    width: "10%",
    scopedSlots: { customRender: "value" },
  },
  {
    title: "desc",
    dataIndex: "desc",
    width: "20%",
    scopedSlots: { customRender: "desc" },
  },
  {
    title: "operation",
    width: "4%",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  name: "DynamicForm",
  props: {
    configure: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return {
      rules: {
        model: [{ required: true, message: "请输入", trigger: "blur" }],
        // region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
        // date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        // type: [
        //   {
        //     type: 'array',
        //     required: true,
        //     message: 'Please select at least one activity type',
        //     trigger: 'change',
        //   },
        // ],
        // resource: [
        //   { required: true, message: 'Please select activity resource', trigger: 'change' },
        // ],
        // desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
      },
      columns,
      // form: this.$form.createForm(this),
      form: {
        // index:0,
        dynamicItem: [
          {
            level: null,
            model: null,
            income: null,
            min: null,
            max: null,
          },
        ],
      },
      arr: [],
      MinNum: [],
      MaxNum: [],
    };
  },
  //methods
  created() {
    const testArr = [
      { level: null, model: null, income: null, min: null, max: null },
    ];
    this.form.dynamicItem = this.configure || testArr;
    // console.log("==================>this.configure", this.configure);
    if (this.configure) {
      const arr2 = this.configure?.map((item) => {
        // if (item) {
        return item.level;
        // }
      });
      this.arr = arr2;
      // console.log("==================>this.arr", this.arr, arr2);
    }
    // for (let i = 0; i < this.configure?.length; i++) {
    //   const element = this.configure[i];
    //   arr2.push(element.level);
    // }
  },
  methods: {
    //
    formatLevel(level) {
      if (this.arr && this.arr.length > 0) {
        return this.arr.includes(level);
      } else {
        return false;
      }
    },

    // change获取最大最小输入框的值
    handleGroupChange(input) {
      if (input.target.placeholder == "最小购买") {
        console.log("==================>最小购买", input.target.value);
        const minNumArr = this.form.dynamicItem.map((item) => {
          return item.min;
        });
        // for (let i = 0; i < this.form.dynamicItem.length; i++) {
        //   const element = this.form.dynamicItem[i];
        //   // console.log("==================>element", element.level);
        //   minNumArr.push(element.min);
        // }
        this.MinNum = minNumArr;
        // this.MinNum.push(Number(input.target.value));
        this.$emit("getMinNum", this.MinNum);
      } else {
        console.log("==================>最大购买", input.target.value);
        const maxNumArr = this.form.dynamicItem.map((item) => {
          return item.max;
        });
        // for (let i = 0; i < this.form.dynamicItem.length; i++) {
        //   const element = this.form.dynamicItem[i];
        //   // console.log("==================>element", element.level);
        //   maxNumArr.push(element.max);
        // }
        this.MaxNum = maxNumArr;
        // this.MaxNum.push(Number(input.target.value));
        this.$emit("getMaxNum", this.MaxNum);
      }
    },
    //
    LevelName(item) {
      if (item.issued_currency_id) {
        return `【${item.issued_currency && item.issued_currency.symbol}--${
          item.gift_ratio
        }‰】${item.level}`;
      } else {
        return `【--】${item.level}`;
      }
    },
    //
    handleChange() {
      const levelArr = this.form.dynamicItem.map((item) => {
        return item.level;
      });
      // for (let i = 0; i < this.form.dynamicItem.length; i++) {
      //   const element = this.form.dynamicItem[i];
      //   // console.log("==================>element", element.level);
      //   levelArr.push(element.level);
      // }
      this.arr = levelArr;
      console.log("==================>this.arr", this.arr);
    },
    //
    addItem() {
      const dynamicItem = this.form.dynamicItem;
      if (
        this.form.dynamicItem.length >= this.$attrs.allMiningLevelList.length
      ) {
        // return;
        this.$message.error("不能多于等级数量");
      } else {
        if (
          dynamicItem[dynamicItem.length - 1].level &&
          dynamicItem[dynamicItem.length - 1].model &&
          dynamicItem[dynamicItem.length - 1].income &&
          dynamicItem[dynamicItem.length - 1].min &&
          dynamicItem[dynamicItem.length - 1].max
        ) {
          // this.arr.push(dynamicItem[dynamicItem.length - 1].level);
          this.form.dynamicItem.push({
            level: null,
            model: null,
            income: null,
            min: dynamicItem[dynamicItem.length - 1].max,
            max: null,
          });
          // console.log(
          //   "==================>this.$refs.Max0",
          //   this.$refs[`Max${this.form.dynamicItem.length - 2}`]
          // );
        } else {
          this.$message.error("请输入完整再添加");
        }
        // console.log("==================>", this.form.dynamicItem);
      }
    },
    sure(form) {
      console.log(this.form.dynamicItem.length, "length");
      this.$refs[form].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除
    deleteItem(text, index) {
      const arr1 = this.arr.indexOf(text.level);
      arr1 != -1 ? this.arr.splice(arr1, 1) : null;
      this.form.dynamicItem.splice(index, 1);
      console.log(this.form.dynamicItem, "删除");
    },
  },
};
</script>

<style lang="less" scoped>
.dynamic {
  // display: flex;
  // justify-content: center;
  // padding-top: 10px;
  margin-bottom: 20px;
}
// .dynamic-wrap {
//   padding-top: 10px;
//   background-color: white;
//   overflow-y: scroll;
//   overflow-x: hidden;
//   &::-webkit-scrollbar {
//     width: 7px;
//   }
//   &::-webkit-scrollbar-thumb {
//     background: #d8d8d8;
//     border-radius: 10px;
//   }
//   &::-webkit-scrollbar-track-piece {
//     background: transparent;
//   }
// }
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
  margin: 20px 0px 20px 0px;
}
</style>
