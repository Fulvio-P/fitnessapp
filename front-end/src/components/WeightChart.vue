<!--
NON mettere <template> nei grafici, per indicazione della documentazione:
https://vue-chartjs.org/guide/#vue-single-file-components
-->

<script>
import { Line } from 'vue-chartjs';
import chartUtils from "@/components/chartUtils.vue";

export default {
    extends: Line,
    mixins: [chartUtils],
    props: ["chartdata", "options"],
    mounted() {
        this.xAxisTimeSetup();
        this.yAxisSetSuggestedLimits(0, 80);
        this.renderChart(this.chartdata, this.options)
    },
}
</script>

<style scoped>
</style>