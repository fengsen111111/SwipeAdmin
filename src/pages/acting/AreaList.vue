<template>
  <div>
    <a-row>
      <!--部门模块-->
      <a-col :span="10" style="min-width: 380px; margin-right: 10px">
        <a-card>
          <a-row type="flex" justify="start">
            <a-col :span="2"> <span class="cu-line"></span> </a-col>
            <a-col :span="20">
              <span style="font-size: 17px">地区架构</span>
            </a-col>
            <a-col :span="2">
              <a-icon class="cu-icon" @click="addArea" type="plus-square" />
            </a-col>
          </a-row>
        </a-card>
        <!--部门树 TODO 后期优化为滚动列表-->
        <a-card style="min-height: 750px" :loading="spinning">
          <a-spin :spinning="spinning">
            <a-tree
              :tree-data="areaArr"
              :replaceFields="replaceFields"
              :expanded-keys="areaKeys"
              v-model="defaultCheckedKeys"
              @expand="onExpand"
            >
              <!--2.插槽-->
              <template #title="item">
                <a-row type="flex">
                  <a-col flex="auto">
                    <span>{{ item.title }} </span>
                  </a-col>
                  <a-col flex="100px" v-show="item.id !== '0'">
                    <a-icon
                      type="edit"
                      @click="editArea(item)"
                      style="margin-right: 10px"
                    />

                    <a-popconfirm
                      title="你确定要删除吗?"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="deleteArea(item.id)"
                    >
                      <a-icon type="delete" />
                    </a-popconfirm>
                  </a-col>
                </a-row>
              </template>
            </a-tree>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
    <area-form
      :visible="isVisible"
      :loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :status="isStatus"
      ref="areaRef"
      :modules="modules"
    />
  </div>
</template> 

<script>
import { actingService } from "@/services";
import AreaForm from "./components/AreaForm.vue";
export default {
  components: { AreaForm },
  name: "Area",
  data() {
    return {
      spinning: false,
      areaKeys: [],
      areaArr: [],
      replaceFields: { children: "children", title: "name", key: "id" },
      defaultCheckedKeys: [],
      // Add
      isVisible: false,
      confirmLoading: false,
      isStatus: 1,
      modules: null,
    };
  },
  activated() {
    this._getAreaList();
  },
  methods: {
    _getAreaList() {
      this.spinning = true;
      actingService
        .getAreaList()
        .then((res) => {
          this.spinning = false;
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.areaArr = this.cover(data);
            console.log("===========>data", data);
          }
        })
        .catch((error) => {
          this.$message.error(error);
          this.spinning = false;
        });
    },
    addArea() {
      this.isVisible = true;
      this.isStatus = 1;
    },
    deleteArea(id) {
      this.spinning = true;
      actingService
        .deleteArea({
          id,
        })
        .then((res) => {
          this.spinning = false;
          const { code, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.$message.success("删除成功");
            this._getAreaList();
          }
        })
        .catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
    },
    editArea(item) {
      console.log("===========>123", item);
      this.isStatus = 2;
      this.isVisible = true;
      this.modules = {
        id: item.id,
        type: item.type,
        name: item.name,
        allow_num: item.allow_num,
        exist_num: item.exist_num,
        parent_id: item.parent_id,
      };
      this.$refs.areaRef._actingService(item.type);
      this.isVisible = true;
    },
    onExpand(expandedKeys) {
      this.areaKeys = expandedKeys;
    },
    cover(arr) {
      arr.forEach((item) => {
        item.title = item.name;
        item.value = item.id;
        item.key = item.id;
        item.scopedSlots = { title: "title" };
        if (item.children && item.children.length) {
          item.children = this.cover(item.children);
        }
      });
      return arr;
    },
    handleOk() {
      this.confirmLoading = true;
      const form = this.$refs.areaRef.form;
      form.validateFields((error, values) => {
        if (!error) {
          if (this.isStatus === 1) {
            actingService
              .createArea({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code === 200) {
                  this.$message.success("添加成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getAreaList();
                } else {
                  this.$message.error(msg);
                }
              })
              .catch((error) => {
                this.$message.error(error);
                this.confirmLoading = false;
              });
          } else {
            actingService
              .updateArea({ ...values })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code === 200) {
                  this.$message.success("修改成功");
                  this.isVisible = false;
                  form.resetFields();
                  this._getAreaList();
                } else {
                  this.$message.error(msg);
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
      this.$refs.areaRef.form.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .ant-tree li .ant-tree-node-content-wrapper {
  width: 190px;
}
</style>
