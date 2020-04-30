<template>
    <div>
        <WeightChart ref="weightchart" :chartdata="chartdata" :options="options"/>
    </div>
</template>

<script>
import WeightChart from "@/components/WeightChart.vue";
const axios = require("axios").default;

function getPesi(chart, id) {
    axios.get("http://localhost:5000/api/weight/"+id)
        .then(resp => {
            var serverData = resp.data.dataPoints
            var chartDataset = chart.chartdata.datasets[0];
            chartDataset.data = [];
            serverData.forEach(v => chartDataset.data.push({
                x: v.data,
                y: v.peso
            }));
            chart.renderChart(chart.chartdata, chart.options);
        });
}

var chartdata = {
    datasets: [
        {
            label: 'Peso',
            backgroundColor: '#f87979',
            data: []
        }
    ]
};
var options = {
    responsive: true,
    maintainAspectRatio: false
}

export default {
  name: "ChartsPage",
  components: {
      WeightChart
  },
  data: () => ({chartdata, options}),   //le parentesi tonde servono a far interpretare le graffe come Object, e non come blocco di istruzioni
  computed: {
      loggedId() {
        return this.$store.state.loggedId
      },
      weightChart() {
        return this.$refs.weightchart
      }
  },
  mounted() {
    getPesi(this.weightChart, this.loggedId);
  }
};
</script>
