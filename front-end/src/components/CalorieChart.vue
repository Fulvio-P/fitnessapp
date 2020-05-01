<!--
NON mettere <template> nei grafici, per indicazione della documentazione:
https://vue-chartjs.org/guide/#vue-single-file-components
-->

<script>
import TimeBarChart from '@/components/TimeBarChart.vue';

export default {
    extends: TimeBarChart,
    mounted() {
        this.mostraBilancio();
        this.options.legend = {display: false};
    },
    methods: {
        mostraBilancio() {
            this.chartdata.datasets[0].hidden=true;
            this.chartdata.datasets[1].hidden=true;
            this.chartdata.datasets[2].hidden=false;
            this.renderChart(this.chartdata, this.options);
        },
        mostraInOut() {
            this.chartdata.datasets[0].hidden=false;
            this.chartdata.datasets[1].hidden=false;
            this.chartdata.datasets[2].hidden=true;
            this.renderChart(this.chartdata, this.options);
        }
    }
}
</script>