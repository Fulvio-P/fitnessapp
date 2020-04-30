<!--Funzioni utili che gestiscono comportamenti comuni dei nostri grafici-->

<script>
export default {
    methods: {
        //sintassi abbreviata per "xAxisTimeSetup: function () {...}"
        xAxisTimeSetup() {
            this.options.scales = this.options.scales || {};
            this.options.scales.xAxes = this.options.scales.xAxes || [{
                type: "time",
                time: {unit: 'day'},
            }];
        },
        yAxisSetSuggestedLimits(suggmin, suggmax) {
            this.options.scales = this.options.scales || {};
            this.options.scales.yAxes = this.options.scales.yAxes || [{
                ticks: {
                    suggestedMin: suggmin,
                    suggestedMax: suggmax
                }
            }];
        }
    }
}
</script>