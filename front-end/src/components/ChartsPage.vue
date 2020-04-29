<template>
    <div>
        <WeightChart :chartdata="chartdata" :options="options"/>
    </div>
</template>

<script>
import WeightChart from "@/components/WeightChart.vue";
const axios = require("axios").default;

function getPesi(id) {
    axios.get("http://localhost:5000/api/weight/"+id)
        .then(resp => {
            var serverData = resp.data.dataPoints
            var chartData = chartdata.datasets[0].data = [];
            serverData.forEach(v => chartData.push({
                x: v.data,
                y: v.peso
            }));
            console.log(chartData);
        });
}

var chartdata = {
    datasets: [
        {
            label: 'Peso',
            backgroundColor: '#f87979',
            data: [
                {x: new Date("2020-03-27"), y:40},
                {x: new Date("2020-03-28"), y:20},
                {x: new Date("2020-03-29"), y:30},
            ]
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
      }
  },
  mounted() {
    getPesi(this.loggedId);
  }
};
</script>
