<template>
  <a-spin :spinning="spinning">
    <a-card>
      <!-- 搜索栏 -->
      <!-- <div :class="advanced ? 'search' : null">
                <a-form layout="horizontal" :form="form" ref="searchRef">
                    <div :class="advanced ? null : 'fold'">
                        <a-row>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="订单ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input v-decorator="['id']" allowClear placeholder="请输入ID名称" />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="订单总金额" :labelCol="{ span: 5 }"
                                    :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input placeholder="订单总金额" allowClear v-decorator="['cid']" />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="支付时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input placeholder="支付时间" allowClear v-decorator="['price']" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row v-if="advanced">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-select placeholder="状态 " v-decorator="['status']">
                                        <a-select-option value="1">待发货</a-select-option>
                                        <a-select-option value="2">已发货</a-select-option>
                                        <a-select-option value="3">已完成</a-select-option>
                                        <a-select-option value="4">已失效</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                    <span style="float: right; margin-top: 3px">
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                        <a @click="toggleAdvanced" style="margin-left: 8px">
                            {{ advanced ? "收起" : "展开" }}
                            <a-icon :type="advanced ? 'up' : 'down'" />
                        </a>
                    </span>
                </a-form>
            </div> -->

      <a-space size="large">
        <a-button type="primary" @click="handleCreate">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </a-space>

      <div style="height: 10px"></div>
      <!-- 表格 columns表头 data-source数据 rowKey键 bordered显示边框 scroll宽度自适应 loading动画 pagination分页  -->
      <a-table
        :columns="columns"
        :data-source="data"
        :rowKey="(record, index) => index"
        bordered
        :scroll="{ x: 'max-content' }"
        :loading="loading"
        :pagination="{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: true,
          onChange: onPageChange,
        }"
      >
        <!-- 类型 -->
        <span slot="type" slot-scope="item">
          <a-tag v-if="item === 1" color="orange">{{ "绑定邮箱" }}</a-tag>
          <a-tag v-else-if="item === 2" color="#00BFFF">{{ "修改密码" }}</a-tag>
          <a-tag v-else-if="item === 3" color="green">{{
            "店铺审核通过"
          }}</a-tag>
          <a-tag v-else-if="item === 4" color="#6495ED">{{ "派单提醒" }}</a-tag>
          <a-tag v-else-if="item === 5" color="#00FF00">{{
            "完成订单提醒"
          }}</a-tag>
          <a-tag v-else-if="item === 6" color="red">{{ "订单撤单" }}</a-tag>
        </span>

        <!-- 操作 -->
        <a slot="action" slot-scope="item">
          <a-button type="link" size="small" @click="handEdit(item)">
            <a-icon type="edit"></a-icon>编辑
          </a-button>
          <a-popconfirm
            title="你确认要删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm(item)"
            @cancel="cancel(item)"
          >
            <a href="#"> <a-icon type="delete" />删除 </a>
          </a-popconfirm>
        </a>
      </a-table>

      <!-- 点击新增修改弹出表单  visible打开关闭  isTitle标题内容 ref新增表单数据  cancel点击取消 ok 点击确定  modules列表行数据 -->
      <MaliboxForm
        :visible="visible"
        :isTitle="isTitle"
        ref="articleRef"
        @cancel="handleCancel"
        :loading="confirmLoading"
        @ok="handleOk"
        :modules="modules"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { operationService } from "@/services";
import MaliboxForm from "./components/MaliboxForm.vue";
export default {
  components: { MaliboxForm },
  data() {
    return {
      visible: false, // 对话框显示隐藏
      //表头
      columns: [
        {
          title: "#",
          dataIndex: "id",
          align: "center",
        },
        {
          title: "模板类型",
          dataIndex: "type",
          align: "center",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "邮箱发件人",
          dataIndex: "form",
          align: "center",
        },
        {
          title: "发件人邮箱前缀",
          dataIndex: "prefix",
          align: "center",
        },
        {
          title: "邮件主题",
          dataIndex: "title",
          align: "center",
        },
        {
          title: "邮件内容",
          dataIndex: "content",
          align: "center",
        },
        {
          title: "模板语言",
          dataIndex: "language.name",
          align: "center",
          // scopedSlots: { customRender: "language_id" },
        },
        {
          title: "有效时间(秒)",
          dataIndex: "effective_time",
          align: "center",
        },
        {
          title: "操作",
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      data: [],
      spinning: false,
      form: this.$form.createForm(this),
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      advanced: false,

      //新增修改
      isTitle: 1, // 对话框标题类型  1：新增 2：修改
      confirmLoading: false, //加载动画
      modules: null, //数据
      agentAllList: [],
      // languageList: [],
      articleTypeData: [],
      id: "",
    };
  },
  activated() {
    this.formlist();
  },
  methods: {
    confirm(item) {
      this.confirmLoading = true;
      operationService
        .findDelete({
          id: item.id,
        })
        .then((res) => {
          const { code, msg } = res.data;
          this.confirmLoading = false;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.$message.success("删除成功");
            this.formlist();
          }
        })
        .catch((error) => {
          this.confirmLoading = false;
          this.$message.error(error);
        });
    },
    cancel(item) {
      console.log("item删除取消", item);
    },
    // 取消
    handleCancel() {
      this.visible = !this.visible;
      const form = this.$refs.articleRef.form;
      form.resetFields();
    },
    // 确定
    handleOk() {
      // 拿到ref里面的值
      const articleRef = this.$refs.articleRef;
      const form = articleRef.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        console.log("==================>", values);
        // 转换数据格式调接口
        values.effective_time = values.effective_time * 1;
        values.type = values.type * 1;
        if (!errors) {
          if (this.isTitle === 1) {
            // 新增
            operationService
              .findAdd({
                ...values,
              })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) {
                  this.$message.error(msg);
                  return;
                } else {
                  this.$message.success("新增成功");
                  this.visible = !this.visible;
                  // 重置表单数据
                  form.resetFields();
                  this.formlist();
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
              });
          } else {
            // 修改
            operationService
              .findRevise({
                ...values,
                id: this.id,
              })
              .then((res) => {
                const { code, msg } = res.data;
                this.confirmLoading = false;
                if (code !== 200) {
                  console.log("修改失败");
                  this.$message.error(msg);
                  return;
                } else {
                  this.$message.success("修改成功");
                  this.visible = !this.visible;
                  // 重置表单数据
                  form.resetFields();
                  this.formlist();
                  return;
                }
              })
              .catch((error) => {
                this.confirmLoading = false;
                this.$message.error(error);
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 数据列表
    formlist() {
      this.form.validateFields((err, values) => {
        this.loading = true;
        operationService
          .findAlllist({
            limit: this.pageSize,
            page: this.pageIndex,
            ...values,
          })
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.data = data.list;
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err);
          });
      });
    },
    // 收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 页数发生变化
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this.formlist();
    },
    //新增
    handleCreate() {
      this.isTitle = 1;
      // 打开对话框
      this.visible = !this.visible;
    },
    //编辑
    handEdit(item) {
      const {
        // 拿到当前项数据
        content,
        effective_time,
        form,
        id,
        language_id,
        // language,
        prefix,
        title,
        type,
      } = item;
      // 拿到当前项id
      this.id = id;
      // 改变标题
      this.isTitle = 2;
      // 弹框开启关闭
      this.visible = !this.visible;
      // 赋值给modules并传递到弹框组件
      this.modules = {
        content,
        effective_time,
        form,
        language_id,
        // language,
        prefix,
        title,
        type,
      };
    },
    //查询
    handleSearch() {
      this.formlist();
    },
    //重置
    handleReset() {
      this.form.resetFields();
      this.pageIndex = 1;
      this.formlist();
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.title-text {
  max-width: 200px;
  text-align: center;
  // overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
