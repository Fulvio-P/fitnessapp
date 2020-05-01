import chartUtils from "@/components/chartUtils.js";

export default {
    extends: chartUtils,
    methods: {
        timeChartSetup() {
            this.xAxisTimeSetup();
            this.yAxisSetSuggestedLimits(this.suggymin, this.suggymax);
            if (this.dataurls) {
                this.pullAllData(this.dataurls, true);
            }
            if (this.stacked==true) {
                this.activateStacking();
            }
            this.renderChart(this.chartdata, this.options)
        },
        //sintassi abbreviata per "xAxisTimeSetup: function () {...}"
        xAxisTimeSetup() {
            this.options.scales = this.options.scales || {};
            this.options.scales.xAxes = this.options.scales.xAxes || [{
                type: "time",
                time: {unit: 'day'},
            }];
        },
    },
    mounted() {
        this.timeChartSetup();
    },
}