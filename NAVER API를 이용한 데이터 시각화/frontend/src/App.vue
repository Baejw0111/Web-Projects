<template>
  <div id="app">
    <!-- ReactiveBarChart -->
    <reactive-bar-chart
      style="width: 40vw"
      :chart-data="$store.state.chartData"
    ></reactive-bar-chart>

    <Form></Form>
  </div>
</template>

<script>
import ReactiveBarChart from "./components/ReactiveBarChart.js";
import Form from "./components/Form.vue";

export default {
  components: {
    ReactiveBarChart,
    Form,
  },
  data() {
    return {
      chartData: null,
    };
  },
  mounted() {
    this.generateData();

    // setInterval(this.generateData, 1500);

    // $store.dispatch
    this.$store.dispatch("generateChartData");
  },
  methods: {
    generateData() {
      let newArray = [];
      let newArray2 = [];
      for (let i = 0; i < 10; i++) {
        let randomValue = Math.floor(Math.random() * 10);
        newArray.push(randomValue);
      }

      for (let i = 0; i < 10; i++) {
        let randomValue = Math.floor(Math.random() * 10);
        newArray2.push(randomValue);
      }

      this.chartData = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: newArray,
            fill: false,
          },
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: newArray2,
            fill: false,
          },
        ],
      };
    },
  },
};
</script>

<style></style>
