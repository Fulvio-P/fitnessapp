<!--
Per una documentazione sul significato di tutte le proprietà delle componenti *Chart,
vedere chartUtils.js (e il resto dei file relativi ai grafici).
-->

<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col sm>
                    <TimeLineChart
                        ref="weightchart"
                        class="chart"
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
                </b-col>
                <b-col sm>
                    <CalorieChart
                        ref="calchart"
                        class="chart"
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
                </b-col>
            </b-row>
        </b-container>
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
            backgroundColor: '#88c0d0',   //nord8
            data: [],
        }
    ]
};

var caldata = {
    datasets: [
        {
            label: "Calorie Ingerite",
            backgroundColor: "#d08770",   //nord12
            data: [],
            hidden: true,
        },
        {
            label: "Calorie Bruciate",
            backgroundColor: "#a3be8c",   //nord14
            data: [],
            hidden: true,
        },
        {
            label: 'Bilancio Calorie',
            backgroundColor: '#b48ead',    //nord15
            data: [],
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

<style scoped>
</style>