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
        this.renderChart(this.chartdata, this.options)
    }
}
</script>

<style scoped>
</style>