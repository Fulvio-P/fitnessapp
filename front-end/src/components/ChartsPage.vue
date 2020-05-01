<template>
    <div>
        <TimeLineChart
            ref="weightchart"
            :chartdata="weightdata"
            :options="weightoptions"
            :suggymin="0"
            :suggymax="80"
            :dataurls="[{
                url: 'http://localhost:5000/api/weight/'+loggedId,
                onDatasets: [{
                    index: 0,
                    xprop: 'data',
                    yprop: 'peso',
                }]
            }]"
        />
        <CalorieChart
            ref="calchart"
            :chartdata="caldata"
            :options="caloptions"
            :suggymin="0"
            :suggymax="80"
            :stacked="true"
            :dataurls="[{
                url: 'http://localhost:5000/api/calories/'+loggedId,
                onDatasets: [
                    {
                        index: 0,
                        xprop: 'data',
                        yprop: 'calin',
                    },
                    {
                        index: 1,
                        xprop: 'data',
                        yprop: 'calout',
                        applyToAllData: v=>v.y*=-1,
                    },
                    {
                        index: 2,
                        xprop: 'data',
                        yprop: 'bilancio',
                    },
                ]
            }]"
        />
        <b-button @click="calchart.mostraBilancio();">Mostra Bilancio</b-button>
        <b-button @click="calchart.mostraInOut();">Mostra totale ingerite e bruciate</b-button>
    </div>
</template>

<script>
import TimeLineChart from "@/components/TimeLineChart.vue";
import CalorieChart from "@/components/CalorieChart.vue";

var weightdata = {
    datasets: [
        {
            label: 'Peso',
            backgroundColor: '#f87979',
            data: [],
        }
    ]
};

var caldata = {
    datasets: [
        {
            label: "Calorie Ingerite",
            backgroundColor: "red",
            data: [],
            hidden: true,
        },
        {
            label: "Calorie Bruciate",
            backgroundColor: "green",
            data: [],
            type: 'bar',
            hidden: true,
        },
        {
            label: 'Bilancio Calorie',
            backgroundColor: 'blue',
            data: [],
            type: 'bar',
            hidden: false,
        },
    ]
}

var weightoptions = {
    responsive: true,
    maintainAspectRatio: false
}

var caloptions = {
    responsive: true,
    maintainAspectRatio: false
}   //oggetti diversi per evitare che si facciano side-effect a vicenda

export default {
  name: "ChartsPage",
  components: {
      TimeLineChart,
      CalorieChart
  },
  data: () => ({weightdata, caldata, weightoptions, caloptions}),
                //le parentesi tonde servono a far interpretare le graffe come Object, e non come blocco di istruzioni
  computed: {
      loggedId() {
        return this.$store.state.loggedId
      },
      calchart() {
          return this.$refs.calchart;
      }
  },
};
</script>
