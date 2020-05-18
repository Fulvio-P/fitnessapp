const fitbit = require('../fitbit/fitbit');
const db = require('../db/index');


/*
    README:
    questo file contiene le istruzioni per recuperare le info sulle attività da fitbit
    e inserirle nel database insiame a quelle registrate tramite fitnessApp
*/


function sync(userId){

    return new Promise((resolve, reject)=>{

        //Recupero la data di partenza dal database
        //TODO: capire come e dove salvare la data per avere il giusto formato
        //COMMENTO DEV: per il momento test hardcoded
        let lastChecked = '2020-05-16T10:00:00'

        
        //Imposto i parrametri della richiesta
        let requestUrl ='https://api.fitbit.com/1/user/-/activities/list.json?'+
                        'afterDate='+ lastChecked +
                        '&offset=0'+
                        '&limit=100'+
                        '&sort=asc'
        ;


        //Provo a ottenere i dati da fitbit
        fitbit.get(userId, requestUrl)


        //successo: fitbit ha risposto con dati
        .then( response =>{

            //TEST
            console.log(response.data);

            //Ciclo sulle varie attività nella risposta
            //Per ogni attività creo un rercord nel database



            //Accedo al database per aggiornare last checked all'ora attuale

            //una volta finito tutto
            resolve("activities_synced")

        })

        //fallimento: fitbit ha inviato un messaggio di errore
        .catch(error => {
            reject(error);
        })
    })
}

module.exports = {
    sync,
}