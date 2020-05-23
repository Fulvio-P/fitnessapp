const fitbit = require('../fitbit/fitbit');
const db = require('../db/index');


/*
    README:
    questo file contiene le istruzioni per recuperare le info sulle attività da fitbit
    e inserirle nel database insiame a quelle registrate tramite fitnessApp
*/


function sync(userId){

    return new Promise(async (resolve, reject)=>{

        //variabile aggiunta dopo la ristrutturazione della chiamata a fitbit.get,
        //al fine di mantenere la funzionalità originale
        //(resolve va spostata fuori dal ciclo=)
        var canResolve = true;

        do {   //metto su un ciclo per poter ripetere la richiesta più volte se dobbiamo sincronizzare più di 20 attività per volta
            
            //Recupero la data di partenza dal database
            let dbRes;
            try {
                dbRes = await db.getAdditionalInfo(userId, 'lastFitbitUpdate');
            } catch (error) {
                reject("Internal Datbase Error");
            }
            
            let lastChecked = dbRes.lastfitbitupdate

            
            //Imposto i parrametri della richiesta
            let requestUrl ='https://api.fitbit.com/1/user/-/activities/list.json?'+
                            'afterDate='+ lastChecked +
                            '&offset=0'+
                            '&limit=20'+
                            '&sort=asc'
            ;






            //trasformo l'uso esplicito di .then e .catch nell'uso di await
            //per poter fare un ciclo più facilmente
            try {

                //Provo a ottenere i dati da fitbit
                //mi serve scope di funzione per usarla nella condizione del do-while
                var response = await fitbit.get(userId, requestUrl);
                console.log(response.data);
                
                //successo: fitbit ha risposto con dati

                const activities =  response.data.activities
                //Ciclo sulle varie attività nella risposta
                for( activity of activities){
            
                    let nome = activity.activityName,
                        calout = activity.calories,
                        data = activity.startTime.split('T')[0],
                        lastFitbit = activity.lastModified.split('.')[0]
                    ;
                    
                    
                    //Questo controllo serve ad escludere record già considerati
                    if(lastFitbit != lastChecked){
                        
                        //Per ogni attività creo un rercord nel database
                        try {
                            await db.addAttivita(userId, data, nome, calout, 'Attività importata da Fitbit');
                        } catch (error) {
                            reject("Internal Datbase Error");
                        }

                    }
                    
                    lastChecked = lastFitbit;
                };
                

            
                //Accedo al database per aggiornare last checked all'ora del record più recente
                let what = {lastfitbitupdate: lastChecked};
                try {
                    await db.editAdditionalInfo(userId, what);
                } catch (error) {
                    reject("Internal Database Error")
                }
                

            } catch (error) {
                canResolve=false;
                //fallimento: fitbit ha inviato un messaggio di errore
                reject(error);
            }
        } while (response.data.pagination.next);   //una stringa che se non-vuota indica che c'è ancora dell'altro
        //alla fine dell'iterazione il campo lastfitbitupdate viene aggiornato,
        //quindi la prossima richiesta riprenderà dove l'altra era arrivata.

        //una volta finito tutto
        if (canResolve) resolve("activities_synced")
    })
}

module.exports = {
    sync,
}