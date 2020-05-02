/*
Il capostipite dei nostri grafici.
Contiene funzioni utili per gestire comportamenti comuni di tutti i grafici.
*/

const axios = require("axios").default;

export default {
  //le proprietà le metto qui perché uso le stesse in entrambi i tipi di grafici
  /**
   * chartdata: come richiesto da chart.js (può essere modificato da queste funzioni)
   * options: come richiesto da chart.js (può essere modificato da queste funzioni)
   * suggymin: il suggestedMin dell'asse y
   * suggymax: il suggestedMax dell'asse y
   * dataurls: un array di Object che contengono informazioni su quali dati debbano essere
   *           scaricati dal nostro server e in quali dataset debbano essere inseriti.
   * stacked: true se il grafico deve essere rappresentato come barre impilate.
   *          Non ha effetto su grafici non-Bar.
   */
  props: [
    "chartdata",
    "options",
    "suggymin",
    "suggymax",
    "dataurls",
    "stacked"
  ],
  methods: {
    /**
     * Imposta i "suggested limits" dell'asse y: il grafico mostrerà sempre
     * almeno quest'intervallo, anche se i valori sono più bassi.
     */
    yAxisSetSuggestedLimits(suggmin, suggmax) {
      this.options.scales = this.options.scales || {}; //crea this.options.scales se non esiste
      this.options.scales.yAxes = this.options.scales.yAxes || [
        {
          ticks: {
            suggestedMin: suggmin,
            suggestedMax: suggmax
          }
        }
      ];
    },
    /**
     * Assegna tutte le proprietà necessarie per avere un grafico a barre impilate:
     * attivare le pile sugli assi ed assegnare tutti i dataset alla stessa pila.
     */
    activateStacking() {
      this.options.scales.xAxes.stacked = true;
      this.options.scales.yAxes.stacked = true;
      for (let i = 0; i < this.chartdata.datasets.length; i++) {
        this.chartdata.datasets[i].stack = 0;
      }
    },
    /**
     * Restituisce una Promise che rappresenta l'operazione di:
     * Seguendo le indicazioni dell'array di Object dataurls, scarica tutti i dati necessari
     * dal nostro server e li mette nei dataset opportuni.
     * Ciascun elemento di dataurls deve contenere le proprietà:
     *  - url: la url da cui scaricare i dati
     *  - onDatasets: un array di Object contenenti informazioni sui datasets
     *                su cui andranno caricati questi dati
     * Ciascun elemento di onDatasets deve contenere le seguenti proprietà:
     *  - index: la posizione nell'array datasets in cui si trova il dataset interessato
     *  - xprop: indica quale prorprietà dall'oggetto JSON inviato dal server contiene
     *           il valore da usare come coordinata x dei dati
     *  - yprop: idem, ma per la coordinata y
     *  - applyToAllData (opzionale): una funzione che descrive un'azione da operare
     *                                su tutti i dati
     */
    pullAllData(dataurls) {
      //prima costruisco un array di Promise...
      var promises = [];
      for (let i = 0; i < dataurls.length; i++) {
        let record = dataurls[i];
        promises.push(
          this.pullDataFromOurServer(record.url, record.onDatasets)
        );
      }
      //...e restituisco la Promise collettiva
      return Promise.all(promises);
    },
    /**
     * Restituisce una Promise che si risolve quando i dati sono stati scaricati dalla url
     * indicata e inseriti in tutti i dataset interessati, secondo le indicazioni dell'array
     * onDatasets.
     * Ciascun elemento di onDatasets deve contenere le seguenti proprietà:
     *  - index: la posizione nell'array datasets in cui si trova il dataset interessato
     *  - xprop: indica quale prorprietà dall'oggetto JSON inviato dal server contiene
     *           il valore da usare come coordinata x dei dati
     *  - yprop: idem, ma per la coordinata y
     *  - applyToAllData (opzionale): una funzione che descrive un'azione da operare
     *                                su tutti i dati
     */
    pullDataFromOurServer(url, onDatasets) {
      return axios.get(url).then(resp => {
        //recupero la parte importante della risposta
        var serverData = resp.data.dataPoints;
        //applico applyData a tutti i dataset interessati
        for (let j = 0; j < onDatasets.length; j++) {
          let record = onDatasets[j];
          this.applyData(
            serverData,
            record.index,
            record.xprop,
            record.yprop,
            record.applyToAllData
          );
        }
      });
    },
    /**
     * Inserisce i dati contenuti in serverData nel dsIndex-esimo dataset di questo
     * grafico. La proprietà xprop dei serverData viene usata come coordinata x,
     * la yprop come coordinata y.
     * Infine, se applyToAllData è stata specificata, viene applicata a tutti
     * i dati prima di ritornare.
     */
    applyData(serverData, dsIndex, xprop, yprop, applyToAllData) {
      //recupero il dataset interessato
      var chartDataset = this.chartdata.datasets[dsIndex];
      //inserisco i dati come coppie (x: xprop, y: yprop)
      chartDataset.data = [];
      serverData.forEach(v =>
        chartDataset.data.push({
          x: v[xprop],
          y: v[yprop]
        })
      );
      //applico una funzione personalizzata (es. moltiplicare tutto per -1) se richiesto
      if (applyToAllData != undefined) {
        chartDataset.data.forEach(applyToAllData);
      }
    }
  }
};
