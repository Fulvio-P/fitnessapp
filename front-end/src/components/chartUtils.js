//Funzioni utili che gestiscono comportamenti comuni dei nostri grafici

const axios = require("axios").default;
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
        },
        pullDataFromOurServer(url, xprop, yprop, thenRender) {
            axios.get(url)
                .then(resp => {
                    var serverData = resp.data.dataPoints
                    var chartDataset = this.chartdata.datasets[0];
                    chartDataset.data = [];
                    serverData.forEach(v => chartDataset.data.push({
                        x: v[xprop],
                        y: v[yprop]
                    }));
                    if (thenRender) this.renderChart(this.chartdata, this.options);
                });
        }
    }
}