<template>
    <div>
        <WeightChart :chartdata="chartdata" :options="options"/>
    </div>
</template>

<script>
import WeightChart from "@/components/WeightChart.vue";

var chartdata = {
    labels: ['January', 'February'],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20]
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
  data: () => ({chartdata, options})   //le parentesi tonde servono a far interpretare le graffe come Object, e non come blocco di istruzioni
};
</script>
