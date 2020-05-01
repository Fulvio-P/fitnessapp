//Funzioni utili che gestiscono comportamenti comuni dei nostri grafici

const axios = require("axios").default;

export default {
    //le proprietà le metto qui perché uso le stesse in entrambi i tipi di grafici
    props: ["chartdata", "options", "suggymin", "suggymax", "dataurls", /*"xprop", "yprop"*/ "stacked"],
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
        activateStacking() {
            this.options.scales.xAxes.stacked=true;
            this.options.scales.yAxes.stacked=true;
            for (let i=0; i<this.chartdata.datasets.length; i++) {
                this.chartdata.datasets[i].stack = 0;
            }
        },
        pullAllData(dataurls, thenRender) {
            var promises = [];
            for (let i=0; i<dataurls.length; i++) {
                let record = dataurls[i];
                promises.push(this.pullDataFromOurServer(record.url, record.onDatasets));
            }
            Promise.all(promises).then(()=>{
                if (thenRender) this.renderChart(this.chartdata, this.options);
            })
        },
        pullDataFromOurServer(url, onDatasets) {
            return axios.get(url).then(resp => {
                var serverData = resp.data.dataPoints
                for (let j=0; j<onDatasets.length; j++) {
                    let record = onDatasets[j];
                    this.applyData(serverData, record.index, record.xprop, record.yprop, record.applyToAllData);
                }
            });
        },
        applyData(serverData, dsIndex, xprop, yprop, applyToAllData) {
            var chartDataset = this.chartdata.datasets[dsIndex];
            chartDataset.data = [];
            serverData.forEach(v => chartDataset.data.push({
                x: v[xprop],
                y: v[yprop]
            }));
            if (applyToAllData!=undefined) {
                chartDataset.data.forEach(applyToAllData);
            }
        }
    }
}