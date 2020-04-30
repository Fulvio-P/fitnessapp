//Funzioni utili che gestiscono comportamenti comuni dei nostri grafici

const axios = require("axios").default;

export default {
    //le proprietà le metto qui perché uso le stesse in entrambi i tipi di grafici
    props: ["chartdata", "options", "suggymin", "suggymax", "dataurl", "xprop", "yprop"],
    methods: {
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