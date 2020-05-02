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
            :suggymin="40"
            :suggymax="80"
            :dataurls="[
              {
                url: 'http://localhost:5000/api/weight/' + loggedId,
                onDatasets: [
                  {
                    index: 0,
                    xprop: 'data',
                    yprop: 'peso'
                  }
                ]
              }
            ]"
          />
        </b-col>
        <b-col sm>
          <CalorieChart
            ref="calchart"
            class="chart"
            :chartdata="caldata"
            :options="caloptions"
            :suggymin="-100"
            :suggymax="100"
            :stacked="true"
            :dataurls="[
              {
                url: 'http://localhost:5000/api/calories/' + loggedId,
                onDatasets: [
                  {
                    index: 0,
                    xprop: 'data',
                    yprop: 'calin'
                  },
                  {
                    index: 1,
                    xprop: 'data',
                    yprop: 'calout',
                    applyToAllData: v => (v.y *= -1)
                  },
                  {
                    index: 2,
                    xprop: 'data',
                    yprop: 'bilancio'
                  }
                ]
              }
            ]"
          />
          Modalità:
          <b-button
            @click="calchart.mostraBilancio()"
            v-bind:class="bilancioCondition"
            >Bilancio</b-button
          >
          <b-button
            @click="calchart.mostraInOut()"
            v-bind:class="inOutCondition"
            >Ingerite e Bruciate</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TimeLineChart from "@/components/TimeLineChart.vue";
import CalorieChart from "@/components/CalorieChart.vue";

var weightdata = {
  datasets: [
    {
      label: "Peso",
      borderColor: "#88c0d0", //nord8
      backgroundColor: "#88c0d080", //nord8 ma trasparente
      data: [],
      pointRadius: 5,
      pointHoverRadius: 7
    }
  ]
};

var caldata = {
  datasets: [
    {
      label: "Ingerite",
      borderColor: "#d08770", //nord12
      backgroundColor: "#d08770c0", //nord12 ma trasparente
      borderWidth: 2,
      data: [],
      hidden: true
    },
    {
      label: "Bruciate",
      borderColor: "#a3be8c", //nord14
      backgroundColor: "#a3be8cc0", //nord14 ma trasparente
      borderWidth: 2,
      data: [],
      hidden: true
    },
    {
      label: "Bilancio",
      borderColor: "#b48ead", //nord15
      backgroundColor: "#b48eadc0", //nord15 ma trasparente
      borderWidth: 2,
      data: [],
      hidden: false
    }
  ]
};

var weightoptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: "Peso"
  },
  legend: {
    display: false
  }
};

var caloptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: "Calorie"
  }
};

export default {
  name: "ChartsPage",
  components: {
    TimeLineChart,
    CalorieChart
  },
  data: () => ({ weightdata, caldata, weightoptions, caloptions }),
  //le parentesi tonde servono a far interpretare le graffe come Object, e non come blocco di istruzioni
  computed: {
    loggedId() {
      return this.$store.state.loggedId;
    },
    calchart() {
      return this.$refs.calchart;
    },
    //monitoriamo quale sia la modalità del grafico calorie in base allo stato del dataset "bilancio"
    bilancioCondition() {
      return { selectedmode: !caldata.datasets[2].hidden };
    },
    inOutCondition() {
      return { selectedmode: caldata.datasets[2].hidden };
    }
  }
};
</script>

<style scoped>
.selectedmode {
  background-color: #ebcb8b; /*nord13*/
  color: #2e3440; /*nord0*/
}
</style>
