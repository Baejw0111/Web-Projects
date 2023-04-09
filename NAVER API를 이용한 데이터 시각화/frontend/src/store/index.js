import Vue from "vue";
import Vuex from "vuex";
import { dataLap } from "../utils/api";

Vue.use(Vuex);

function makeColor() {
  return "#" + Math.round(Math.random() * 0xffffff).toString(16);
}

export default new Vuex.Store({
  state: {
    chartData: null,
  },
  getters: {},
  // 비동기요청을 행해야할 경우 action에서 비동기처리를 하고
  // mutations를 호출한다
  // this.$store.dispatch('함수명',전달인자)
  mutations: {
    CHANGE_CHART_DATA(state, data) {
      state.chartData = data;
    },
  },
  // 비동기 처리를 하면서 state를 변경하는 경우 action 사용
  // 차트의 데이터가 localhost:8081/api/data
  actions: {
    // mounted에서 이 action을 호출하면 비동기 처리 다 하고 차트 변경까지 할 거임
    async generateChartData({ commit }) {
      // labels에는 period 매핑
      // datsets에는 title을 매핑
      const result = await dataLap.get();
      console.log(result.data);

      const chartData = {
        labels: result.data[0].data.map((li) => li.period),
        datasets: result.data.reduce((acc, cur) => {
          //cur.label-> cur.title로 변경
          const label = cur.title;
          const data = cur.data.map((li) => li.ratio);
          acc.push({
            label: label,
            data: data,
            fill: false,
            backgroundColor: makeColor(),
            borderColor: makeColor(),
          });
          return acc;
        }, []),
      };

      // 아래 코드는 this.$store.commit 와 같음
      // -> mutation 호출
      commit("CHANGE_CHART_DATA", chartData);
    },
  },
  modules: {},
});
