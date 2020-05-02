<!--
Questo grafico ha comportamenti speciali che esulano da quello di un normale grafico,
quindi ha una componente tutta sua che aggiunge un paio di metodi
che verranno usati come event handler e nuove operazioni di inizializzazione.
-->

<!--
NON mettere <template> nei grafici, per indicazione della documentazione:
https://vue-chartjs.org/guide/#vue-single-file-components
-->

<script>
import TimeBarChart from "@/components/TimeBarChart.vue";

export default {
  extends: TimeBarChart,
  //Queste operazioni vengono eseguite in aggiunta a quelle
  //definite nei mounted delle suoer-componenti.
  mounted() {
    this.mostraBilancio();
  },
  //direi che i metodi si spiegano da soli
  methods: {
    mostraBilancio() {
      this.chartdata.datasets[0].hidden = true;
      this.chartdata.datasets[1].hidden = true;
      this.chartdata.datasets[2].hidden = false;
      this.renderChart(this.chartdata, this.options);
    },
    mostraInOut() {
      this.chartdata.datasets[0].hidden = false;
      this.chartdata.datasets[1].hidden = false;
      this.chartdata.datasets[2].hidden = true;
      this.renderChart(this.chartdata, this.options);
    }
  }
};
</script>
