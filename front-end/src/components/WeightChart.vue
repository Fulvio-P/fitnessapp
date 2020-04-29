<!--
NON mettere <template> nei grafici, per indicazione della documentazione:
https://vue-chartjs.org/guide/#vue-single-file-components
-->

<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: ["chartdata", "options"],
    mounted() {
        this.options.scales = this.options.scales || {};
        this.options.scales.xAxes = this.options.scales.xAxes || [{
            type: "time",
            time: {unit: 'day'},
        }];
        this.options.scales.yAxes = this.options.scales.yAxes || [{
            ticks: {
                suggestedMin: 0,
                suggestedMax: 80
            }
        }];
        this.renderChart(this.chartdata, this.options)
    }
}
</script>

<style scoped>
</style>