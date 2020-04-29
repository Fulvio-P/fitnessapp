<template>
    <div>
        <WeightChart :chartdata="chartdata" :options="options"/>
    </div>
</template>

<script>
import WeightChart from "@/components/WeightChart.vue";

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
  data: () => ({chartdata, options})   //le parentesi tonde servono a far interpretare le graffe come Object, e non come blocco di istruzioni
};
</script>
