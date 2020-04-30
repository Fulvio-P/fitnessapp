<!--
NON mettere <template> nei grafici, per indicazione della documentazione:
https://vue-chartjs.org/guide/#vue-single-file-components
-->

<script>
import { Line } from 'vue-chartjs';
import chartUtils from "@/components/chartUtils.js";

export default {
    extends: Line,
    mixins: [chartUtils],
    props: ["chartdata", "options", "suggymin", "suggymax", "dataurl", "xprop", "yprop"],
    mounted() {
        this.xAxisTimeSetup();
        this.yAxisSetSuggestedLimits(this.suggymin, this.suggymax);
        if (this.dataurl) {
            this.pullDataFromOurServer(this.dataurl, this.xprop, this.yprop, true);
        }
        this.renderChart(this.chartdata, this.options)
    },
}
</script>

<style scoped>
</style>