<template>
  <a-card>
    <a-row>
      <a-col :span="2">
        <a-button type="primary" @click="handleAdd">
          <a-icon type="plus"></a-icon>
          新增</a-button
        >
      </a-col>
    </a-row>
    <a-spin :spinning="loding">
      <a-tree
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="authLists"
        @expand="onExpand"
        v-model="checkedKeys"
        @select="onSelect"
      >
        <template slot="title" slot-scope="{ title }">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </a-spin>
    <auth-form
      :roleList="roleList"
      ref="createModal"
      :isVisible="visible"
      :loading="confirmLoading"
      :modeles="authModule"
      @cancel="handleCancel"
      @ok="handleOk"
      :status="isStatus"
    />
  </a-card>
</template>

<script>
import { adminService } from "@/services";
import AuthForm from "./modules/AuthForm";

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
export default {
  name: "Authority",
  components: {
    AuthForm,
  },
  data() {
    return {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      authLists: [],
      checkedKeys: [],
      loding: false,
      roleList: [],
      visible: false,
      confirmLoading: false,
      authModule: null,
      isStatus: 1,
    };
  },
  created() {
    this._getAuth();
    this._authAll();
  },
  methods: {
    _authAll() {
      adminService
        .authAll()
        .then((res) => {
          const { code, msg, data } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
            return;
          } else {
            this.roleList = data.list;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    _getAuth() {
      this.loding = true;
      adminService
        .authList()
        .then((res) => {
          this.loding = false;
          const { code, data, msg } = res.data;
          if (code !== 200) {
            this.$message.error(msg);
          } else {
            this.authLists = this.mapTreeData(data.list);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loding = false;
        });
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    mapTreeData(data) {
      return data.map((item) => {
        return {
          title: item.name,
          key: item.id,
          router: item.router,
          children:
            item.children_list == null || item.children_list.length <= 0
              ? []
              : this.mapTreeData(item.children_list),
        };
      });
    },
    onChange(e) {
      const value = e.target.value;

      const expandedKeys = this.authLists
        .map((item) => {
          console.log(item.title.indexOf(value));
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.authLists);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    onSelect(selectedKeys) {
      this.isStatus = 2;
      this.loding = true;
      adminService
        .fundAuth(selectedKeys[0])
        .then((res) => {
          this.loding = false;
          this.visible = true;
          const { router, parent_id, name, id } = res.data.data;
          this.authModule = {
            id,
            address: router,
            parent_id,
            permission_name: name,
          };
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          const { permission_name, parent_id, address, id } = values;
          if (this.isStatus === 1) {
            adminService
              .authAdd({
                name: permission_name,
                parent_id: parent_id || 0,
                router: address,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("添加成功");
                  this.visible = false;
                  form.resetFields();
                  this._authAll();
                  this._getAuth();
                }
              })
              .catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
              });
          } else {
            console.log(123);
            adminService
              .updateAuth({
                name: permission_name,
                parent_id,
                router: address,
                id,
              })
              .then((res) => {
                this.confirmLoading = false;
                const { code, msg } = res.data;
                if (code !== 200) {
                  this.$message.error(msg);
                } else {
                  this.$message.success("修改成功");
                  this.visible = false;
                  form.resetFields();
                  this._authAll();
                  this._getAuth();
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
    handleAdd() {
      this.isStatus = 1;
      this.visible = true;
      this.$refs.createModal.form.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
</style>

