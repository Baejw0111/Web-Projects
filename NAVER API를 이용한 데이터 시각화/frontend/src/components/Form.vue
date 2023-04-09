<template>
  <div>
    <!-- startDate -->
    <div>시작일: <input type="date" v-model="startDate" /></div>

    <!-- endDate -->
    <div>종료일: <input type="date" v-model="endDate" /></div>

    <!-- timeUnit -->
    <select v-model="timeUnit">
      <option value="date">일간</option>
      <option value="week">주간</option>
      <option value="month">월간</option>
    </select>

    <!-- keywordGroups -->

    <!--
    그룹안에 각자 groupName, keywords가 필요하다
    1차로 팀명을 만들고 그 안에 groupName, keywords
    -->

    <div>
      그룹명: <input v-model="userInputGroupName" />
      <button @click="tmpGroupAdd">추가</button>
      {{ tmpGroupName }}
    </div>
    <div>
      키워드: <input v-model="userInputKeyword" />
      <button @click="tmpKeywordAdd">추가</button>

      <!-- 배열 길이 0보다 클 때만 -->
      <div v-if="tmpKeywords.length">
        추가된 키워드
        <div v-for="tmp in tmpKeywords" :key="tmp">
          {{ tmp }}
        </div>
      </div>
    </div>

    <div>
      <button @click="makeGroup">그룹 확정</button>
    </div>

    <div>
      확정된 그룹

      <div v-for="keywordGroup in keywordGroups" :key="keywordGroup">
        <div>그룹 이름: {{ keywordGroup.groupName }}</div>
        <div>그룹 키워드: {{ keywordGroup.keywords }}</div>
      </div>
    </div>

    <div>
      <button @click="submitForm">제출</button>
    </div>
  </div>
</template>

<script>
import { dataLap } from "../utils/api";
export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      timeUnit: "",
      keywordGroups: [],
      userInputGroupName: "",
      userInputKeyword: "",
      tmpGroupName: "",
      tmpKeywords: [],
    };
  },
  methods: {
    tmpGroupAdd() {
      this.tmpGroupName = this.userInputGroupName;
    },
    tmpKeywordAdd() {
      this.tmpKeywords.push(this.userInputKeyword);
    },
    makeGroup() {
      this.keywordGroups.push({
        groupName: this.tmpGroupName,
        keywords: this.tmpKeywords,
      });
      this.tmpGroupName = "";
      this.tmpKeywords = [];
      (this.userInputGroupName = ""), (this.userInputKeyword = "");
    },
    async submitForm() {
      // api 요청을 보낸다 POST 요청
      const result = await dataLap.post({
        startDate: this.startDate,
        endDate: this.endDate,
        timeUnit: this.timeUnit,
        keywordGroups: this.keywordGroups,
      });
      console.log(result);
      this.$store.dispatch("generateChartData");
    },
  },
};
</script>

<style></style>
