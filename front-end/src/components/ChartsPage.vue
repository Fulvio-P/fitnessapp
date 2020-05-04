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
      borderColor: getComputedStyle(document.documentElement).getPropertyValue("--nord8"), //nord8
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--nord8")+"80", //nord8 ma trasparente
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
      borderColor: getComputedStyle(document.documentElement).getPropertyValue("--nord12"), //nord12
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--nord12")+"c0", //nord12 ma trasparente
      borderWidth: 2,
      data: [],
      hidden: true
    },
    {
      label: "Bruciate",
      borderColor: getComputedStyle(document.documentElement).getPropertyValue("--nord14"), //nord14
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--nord14")+"c0", //nord14 ma trasparente
      borderWidth: 2,
      data: [],
      hidden: true
    },
    {
      label: "Bilancio",
      borderColor: getComputedStyle(document.documentElement).getPropertyValue("--nord15"), //nord15
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--nord15")+"c0", //nord15 ma trasparente
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
  background-color: var(--nord13);
  color: var(--nord0);
}
</style>
