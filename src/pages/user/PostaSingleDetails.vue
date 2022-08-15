<template>
  <a-card :loading="loading">
    <a-page-header
      title="晒单"
      sub-title="用户晒单详情"
      @back="() => this.$router.go(-1)"
    />

    <a-descriptions
      bordered
      :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }"
    >
      <a-descriptions-item label="订单编号">
        {{ singleDetailsData.order_number }}
      </a-descriptions-item>
      <a-descriptions-item label="用户Id/昵称">
        ID:{{ singleDetailsData.user_id }} 用户昵称:{{
          singleDetailsData.nickname
        }}
      </a-descriptions-item>
      <a-descriptions-item label="晒单来源">
        {{ singleDetailsData.source === 1 ? "物流" : "收货" }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ singleDetailsData.created_at | formDate }}
      </a-descriptions-item>
      <a-descriptions-item label="评星">
        <a-rate :default-value="singleDetailsData.star" disabled />
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-badge
          status="processing"
          :text="singleDetailsData.status | formSingle"
        />
      </a-descriptions-item>
      <a-descriptions-item label="商品名称">
        {{ singleDetailsData.gods_name }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ singleDetailsData.remark }}
      </a-descriptions-item>
      <a-descriptions-item label="内容">
        {{ singleDetailsData.content }}
      </a-descriptions-item>
      <a-descriptions-item label="晒单图片">
        <ul style="display: flex">
          <li v-for="(item, index) in singleDetailsData.pictures" :key="index">
            <div style="width: 100px; height: 100px">
              <img
                :src="baseUrl + '/' + item"
                alt="商品图片"
                style="width: 100%; height: 100%; object-fit: contain"
              />
            </div>
          </li>
        </ul>
      </a-descriptions-item>
      <a-descriptions-item label="商品图片">
        <div style="width: 100px; height: 100px">
          <img
            :src="baseUrl + '/' + singleDetailsData.gods_images"
            alt="商品图片"
            style="width: 100%; height: 100%; object-fit: contain"
          />
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import { userService } from "@/services";
import { formSingle } from "@/utils/filters";
export default {
  name: "PostaSingleDetails",
  filters: {
    formSingle,
  },
  data() {
    return {
      singleDetailsData: {},
      loading: false,
      baseUrl: "",
    };
  },
  activated() {
    this._getPostSingleDetails();
    this.baseUrl = process.env.VUE_APP_IMAGE_URL;
  },
  methods: {
    _getPostSingleDetails() {
      this.loading = true;
      userService
        .getPostSingleDetails({ id: this.$route.query.id })
        .then((res) => {
          this.loading = false;
          const { code, msg, data } = res.data;

          if (code !== 200) return this.$message.error(msg);
          const result = {};
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key];

              result.gods_name = data?.store?.goods_name;
              result.gods_images = data?.store?.goods_picture;
              result.nickname = data?.users?.nickname;
              result.avatar = data?.users?.user_img;
              result[key] = element;
            }
          }
          console.log("==================>data", result);
          this.singleDetailsData = result;
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.message);
        });
    },
  },
};
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
</style>