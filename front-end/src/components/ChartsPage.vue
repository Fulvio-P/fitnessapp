<template>
    <div>
        <TimeLineChart
            ref="weightchart"
            :chartdata="chartdata"
            :options="options"
            :suggymin="0"
            :suggymax="80"
            :dataurl="'http://localhost:5000/api/weight/'+loggedId"
            :xprop="'data'"
            :yprop="'peso'"
        />
    </div>
</template>

<script>
import TimeLineChart from "@/components/TimeLineChart.vue";

var chartdata = {
    datasets: [
        {
            label: 'Peso',
            backgroundColor: '#f87979',
            data: [],
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
      TimeLineChart
  },
  data: () => ({chartdata, options}),   //le parentesi tonde servono a far interpretare le graffe come Object, e non come blocco di istruzioni
  computed: {
      loggedId() {
        return this.$store.state.loggedId
      },
  },
};
</script>
