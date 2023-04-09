<template>
  <div>
    <div>제품명: {{ data.title }}</div>
    <div>제품 이미지</div>
    <img :src="data.image" alt="" />
    <div>제품 설명: {{ data.description }}</div>
  </div>
</template>

<script>
import { api } from "../../utils/api";

export default {
  data() {
    return {
      data: {},
    };
  },
  async created() {
    // 로딩 활성화
    this.$store.commit("SET_LOADING", true);

    // this.$route.params.id
    const result = await api.jsonplaceholder.findOne(this.$route.params.id);
    console.log(result);

    this.data = result.data;

    this.$store.commit("SET_LOADING", false);
  },
};
</script>

<style>
img {
  width: 300px;
  height: 300px;
}
</style>
