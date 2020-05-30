const fitbit = require('../fitbit/fitbit');
const db = require('../db/index');


/*
    README:
    questo file contiene le istruzioni per recuperare le info sulle attività da fitbit
    e inserirle nel database insieme a quelle registrate tramite FitnessApp
*/


function sync(userId){

    return new Promise(async (resolve, reject)=>{

        //variabile aggiunta dopo la ristrutturazione della chiamata a fitbit.get,
        //al fine di mantenere la funzionalità originale
        //(resolve va spostata fuori dal ciclo)
        var canResolve = true;

        do {   //metto su un ciclo per poter ripetere la richiesta più volte se dobbiamo sincronizzare più di attività di quante FitBit ce ne mandi in una sola risposta
            
            //Recupero la data di partenza dal database
            let dbRes;
            try {
                dbRes = await db.getAdditionalInfo(userId, 'lastFitbitUpdate');
            } catch (error) {
                reject("Internal Datbase Error");
            }
            
            const lastChecked = dbRes.lastfitbitupdate   //le const hanno scope di blocco, quindi la posso ridichiarare bene a ogni iterazione

            
            //Imposto i parametri della richiesta
            let requestUrl ='https://api.fitbit.com/1/user/-/activities/list.json?'+
                            'afterDate='+ lastChecked +
                            '&offset=0'+
                            '&limit=20'+
                            '&sort=asc'
            ;




            var newLastChecked = lastChecked;  //scope di funzione, ci serve nella finally

            try {

                //Provo a ottenere i dati da fitbit
                //mi serve scope di funzione per usarla nella condizione del do-while
                var response = await fitbit.get(userId, requestUrl);
                
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
                    if (new Date(lastFitbit) > new Date(lastChecked)) {
                        
                        //Per ogni attività creo un rercord nel database
                        try {
                            await db.addAttivita(userId, data, nome, calout, 'Attività importata da Fitbit');
                            newLastChecked = lastFitbit;
                        } catch (error) {
                            canResolve=false;
                            reject("Internal Datbase Error");
                        }

                    }
                };
                

            

            } catch (error) {
                canResolve=false;
                //fallimento: fitbit ha inviato un messaggio di errore
                reject(error);
            } finally {
                //Accedo al database per aggiornare last checked all'ora del record più recente
                //deve aggiornarsi sempre, anche in caso d'errore
                let what = {lastfitbitupdate: newLastChecked};
                try {
                    await db.editAdditionalInfo(userId, what);
                } catch (error) {
                    reject("Internal Database Error")
                }
            }
        } while (response.data.pagination.next && canResolve);
        // next è una stringa che se non-vuota indica che c'è ancora dell'altro
        // la condizione su canResolve serve a terminare il ciclo in caso d'errore
        //alla fine dell'iterazione il campo lastfitbitupdate viene aggiornato,
        //quindi la prossima richiesta riprenderà dove l'altra era arrivata.

        //una volta finito tutto
        if (canResolve) resolve("activities_synced")
    })
}

module.exports = {
    sync,
}