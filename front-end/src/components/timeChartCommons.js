/*
Il capostipite dei "grafici temporali", vale a dire i grafici che usano il tempo
(specificamente, i giorni) sull'asse x
Gestisce i comportamenti comuni a tutti i grafici di questo tipo
*/

import chartUtils from "@/components/chartUtils.js";

export default {
    extends: chartUtils,
    methods: {
        /**
         * Chiama tutte le funzioni necessarie a preparare un grafico temporale
         */
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
        /**
         * Rende l'asse x temporale con una granularità di giorni
         */
        xAxisTimeSetup() {
            this.options.scales = this.options.scales || {};   //crea this.options.scales se non esiste già
            this.options.scales.xAxes = this.options.scales.xAxes || [{
                type: "time",
                time: {unit: 'day'},
            }];
        },
    },
    /**
     * Esegue il setup una volta che il DOM è pronto
     */
    mounted() {
        this.timeChartSetup();
    },
}