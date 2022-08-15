<template>
  <a-spin :spinning="spinning">
    <a-card>
      <div>
        <a-form layout="horizontal" :form="form" ref="searchRef">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="用户名"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['username']"
                  allowClear
                  placeholder="请输入用户名"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <a-space class="operator">
                  <a-button @click="handleCreateGeneral" type="primary">
                    <a-icon type="plus"></a-icon>
                    新增</a-button
                  >
                  <a-button type="primary" @click="handleSearch">查询</a-button>
                  <a-button style="margin-left: 8px" @click="handleReset"
                    >重置</a-button
                  >
                </a-space></a-form-item
              >
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :data-source="generaList"
        :loading="loading"
        :scroll="{ x: 'max-content' }"
        :rowKey="(record) => record.id"
        bordered
        :pagination="{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: true,
          onChange: onPageChange,
          onShowSizeChange: onSizeChange,
        }"
      >
        <template slot="agents" slot-scope="agents">
          <div style="display: flex">
            <a-tag v-for="item in agents" :key="item.id" color="#108ee9">{{
              item.user.nickname
            }}</a-tag>
          </div>
        </template>
        <span slot="status" slot-scope="status">
          <a-tag :color="status === 0 ? 'green' : 'red'">{{
            status === 0 ? "启用" : "禁用"
          }}</a-tag>
        </span>
        <template slot="actions" slot-scope="item">
          <a-space size="large">
            <a @click="handleUpdate(item)">
              <a-icon type="edit"></a-icon>
              修改
            </a>

            <a-popconfirm
              :title="`你确定要${item.status === 0 ? '封禁' : '解封'}吗?`"
              ok-text="确定"
              cancel-text="取消"
              @confirm="banRecord(item)"
            >
              <a>
                {{ item.status === 0 ? "封禁" : "解封" }}
              </a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
      <general-form
        :isVisible="isVisible"
        :loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :isStatus="isStatus"
        ref="generalRef"
        :mockData="agentAllList"
        :modules="modules"
      />
    </a-card>
  </a-spin>
</template>

<script>
import { actingService } from "@/services";
import GeneralForm from "./components/GeneralForm";
const columns = [
  {
    title: "#",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "代理详情",
    dataIndex: "relation",
    align: "center",
    scopedSlots: { customRender: "agents" },
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    fixed: "right",
    width: 100,
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "操作",
    align: "center",
    width: 140,
    fixed: "right",
    scopedSlots: { customRender: "actions" },
  },
];
export default {
  name: "Generalagent",
  components: {
    GeneralForm,
  },
  data() {
    return {
      spinning: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      form: this.$form.createForm(this),
      generaList: [],
      loading: false,
      columns,
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      agentAllList: [],
      modules: null,
    };
  },
  activated() {
    this._getGeneral();
    // this._getAllAgent();
  },
  methods: {
    _getGeneral() {
      this.loading = true;
      this.form.validateFields((error, values) => {
        const params = {
          ...values,
          limit: this.pageSize,
          page: this.pageIndex,
        };
        actingService
          .getGeneral(params)
          .then((res) => {
            this.loading = false;
            const { code, msg, data } = res.data;
            if (code !== 200) {
              this.$message.error(msg);
            } else {
              this.total = data.total;
              data.list.forEach((item) => {
                if (item.agents === null) {
                  item.agents = [];
                }
              });
              this.generaList = data.list;
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message.error(error);
          });
      });
    },
    onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
      this._getGeneral();
    },
    onSizeChange(current, size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this._getGeneral();
    },
    handleOk() {
      const form = this.$refs.generalRef.form;
      this.confirmLoading = true;
      const selectDataList = this.$refs.generalRef.targetKeys;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            actingService
              .createGeneral({ ...values, staff_ids: selectDataList })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getGeneral();
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          } else {
            values.password === "" ? delete values.password : null;
            actingService
              .updateGeneral({ ...values, staff_ids: selectDataList })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getGeneral();
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.isVisible = false;
      this.$refs.generalRef.form.resetFields();
    },
    handleCreateGeneral() {
      this.loading = true;
      actingService
        .getAgent()
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            const result = [];
            data.forEach((item) => {
              const data = {
                key: item.id.toString(),
                title:
                  "用户名：" + String(item.username) + "昵称:" + item.nickname,
              };
              result.push(data);
            });
            this.agentAllList = result;
            this.isVisible = true;
            this.isStatus = 1;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    handleSearch() {
      this.pageIndex = 1;
      this._getGeneral();
    },
    handleReset() {
      this.form.resetFields();
      this.pageIndex = 1;
      this._getGeneral();
    },
    handleUpdate(item) {
      const { id, nickname, remark, username } = item;
      this.modules = {
        id,
        nickname,
        password: "",
        remark,
        username,
      };
      this.loading = true;
      this.isStatus = 2;
      actingService
        .getAgent({
          master_id: item.id,
        })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            const result = data?.map((item) => {
              return {
                key: item?.id.toString(),
                title:
                  "用户名：" +
                  String(item?.username) +
                  "昵称:" +
                  item?.nickname,
              };
            });
            this.agentAllList = result;
            this.$refs.generalRef.targetKeys = item?.relation.map((item) => {
              return item?.user?.id.toString();
            });
            this.isVisible = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    banRecord(item) {
      this.spinning = true;
      actingService
        .banGeneral({
          id: item.id,
          status: item?.status === 1 ? 0 : 1,
        })
        .then((res) => {
          const { code, msg } = res.data;
          this.spinning = false;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("操作成功");
            this._getGeneral();
          }
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
