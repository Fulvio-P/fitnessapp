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
            this.tooltipTitleFormatSetup();
            this.yAxisSetSuggestedLimits(this.suggymin, this.suggymax);
            if (this.dataurls) {
                this.pullAllData(this.dataurls).then(()=>{
                    this.turnAllXValuesToDates();   //la chiamiamo solo se abbiamo dati da scaricare perché assumiamo che i dati che inseriamo manualmente siano già oggetti Date
                    this.renderChart(this.chartdata, this.options);
                });
            }
            if (this.stacked==true) {
                this.activateStacking();
            }
            //disattiviamo la funzione di nascondere o mostrare i dati cliccando sulla legenda perché (di default) non è una cosa che vogliamo permettere all'utente di fare a piacimento
            this.options.legend = this.options.legend || {onClick: e=>e.stopPropagation()};
            this.renderChart(this.chartdata, this.options)
        },
        /**
         * Rende l'asse x temporale con una granularità di giorni
         */
        xAxisTimeSetup() {
            this.options.scales = this.options.scales || {};   //crea this.options.scales se non esiste già
            this.options.scales.xAxes = this.options.scales.xAxes || [{
                type: "time",
                time: {
                    unit: 'day',
                },
            }];
        },
        /**
         * Trasforma tutte le coordinate x di tutti i punti di tutti i dataset in oggetti Date,
         * poichè il nostro DB ce li manda come stringhe
         * Metto la funzione quaggiù per mantenere generica pullAllData e famiglia.
         */
        turnAllXValuesToDates() {
            const datasets = this.chartdata.datasets;
            for (let i=0; i<datasets.length; i++) {
                const data = datasets[i].data;
                for (let j=0; j<data.length; j++) {
                    data[j].x = new Date(data[j].x);
                }
            }
        },
        /**
         * Formatta il titolo della tooltip che appare passando il mouse su un punto o una barra,
         * cosicché mostri una data scritta in parole umane e non il Date.toString di default.
         */
        tooltipTitleFormatSetup() {
            this.options.tooltips = this.options.tooltips || {};
            this.options.tooltips.callbacks = this.options.tooltips.callbacks || {};
            this.options.tooltips.callbacks.title = function(tooltipItems, data) {
                const item = tooltipItems[0];   //PER QUALCHE MOTIVO title lavora con un array di tooltip (mentre label no)
                var xvalue = data.datasets[item.datasetIndex].data[item.index].x;
                return xvalue.toLocaleString('default', {
                    day: 'numeric',
                    month: 'long',
                });
            }
        }
    },
    /**
     * Esegue il setup una volta che il DOM è pronto
     */
    mounted() {
        this.timeChartSetup();
    },
}