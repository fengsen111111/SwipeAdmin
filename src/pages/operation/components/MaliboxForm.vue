<template>
  <div>
    <!-- visible显示与否  title标题判断 $emit绑定外部传递方法  width定义弹框宽度 -->
    <a-modal
      :visible="visible"
      :title="isTitle === 1 ? '新增' : '编辑'"
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
      width="800px"
    >
      <!-- spinning加载动画 -->
      <a-spin :spinning="loading">
        <!-- 绑定form  label-col + wrapper-col ==> 总共24份  -->
        <a-form
          :form="form"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 17 }"
        >
          <!-- 模板类型   -->
          <a-row>
            <!-- span 每个a-col占多宽 -->
            <a-col :span="12">
              <!-- label 名称 -->
              <a-form-item label="模板类型">
                <!-- v-decorator两个参数 一个属性名  一个验证规则 -->
                <a-select
                  v-decorator="[
                    'type',
                    { rules: [{ required: true, message: '请选择类型' }] },
                  ]"
                  placeholder="选择类型"
                >
                  <!-- 循环出语言列表 -->
                  <a-select-option
                    :value="parseInt(index)"
                    v-for="(item, index) in mailboxList"
                    :key="parseInt(index)"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <!-- 邮箱发件人   -->
              <a-form-item label="邮箱发件人">
                <a-input
                  allowClear
                  placeholder="邮箱发件人"
                  v-decorator="[
                    'form',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入邮箱发件人',
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
              <!-- 发件人邮箱前缀   -->
              <a-form-item label="发件人邮箱前缀">
                <a-input
                  allowClear
                  placeholder="发件人邮箱前缀"
                  v-decorator="[
                    'prefix',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入发件人邮箱前缀',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <!-- 邮件主题   -->
              <a-form-item label="邮件主题">
                <a-input
                  allowClear
                  placeholder="邮件主题"
                  v-decorator="[
                    'title',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入发件人邮件主题',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 模板语言 -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="模板语言">
                <a-select
                  :disabled="isTitle === 1 ? false : true"
                  v-decorator="[
                    'language_id',
                    { rules: [{ required: true, message: '请选择类型' }] },
                  ]"
                  placeholder="模板语言"
                >
                  <!-- 循环出语言列表 -->
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
            <a-col :span="12">
              <!-- 有效时间   -->
              <a-form-item label="有效时间">
                <a-input
                  placeholder="有效时间"
                  suffix="秒"
                  v-decorator="[
                    'effective_time',
                    {
                      rules: [
                        {
                          required: false,
                          message: '请输入有效时间',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <!-- 邮件内容   -->
              <a-form-item label="邮件内容" style="margin-left: -155px;">
                <a-textarea
                  style="height: 100px;"
                  placeholder="邮件内容"
                  v-decorator="[
                    'content',
                    {
                      rules: [
                        {
                          required: true,
                          message: '邮件内容',
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
import { operationService } from "@/services";

const fields = [
  "content",
  // "created_at",
  "effective_time",
  "form",
  // "id",
  "language_id",
  "prefix",
  "title",
  "type",
  // "updated_at"
];

export default {
  // visible 隐藏显示 isTitle标题内容  modules点击编辑传过来的默认值  loading动画
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isTitle: {
      type: Number,
      default: 1,
    },
    modules: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      languageList: [], //语言
      mailboxList: [], //邮箱
    };
  },
  created() {
    this._getLanguages();
    this._getMailboxTemplate();
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 modules 发生改变时，为表单设置值
    this.$watch("modules", () => {
      this.modules && this.form.setFieldsValue(this.modules);
    });
  },
  methods: {
    // 语言列表
    _getLanguages() {
      operationService
        .getLanguages({
          page: 1,
          limit: 100,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.languageList = data.list;
            this.total = data.total;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 模板列表
    _getMailboxTemplate() {
      operationService
        .findAlllist({
          page: 1,
          limit: 100,
        })
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.mailboxList = data.types;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>
