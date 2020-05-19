const fitbit = require('../fitbit/fitbit');
const db = require('../db/index');


/*
    README:
    questo file contiene le istruzioni per recuperare le info sulle attività da fitbit
    e inserirle nel database insiame a quelle registrate tramite fitnessApp
*/


function sync(userId){

    return new Promise(async (resolve, reject)=>{

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
                        '&limit=100'+
                        '&sort=asc'
        ;


        //Provo a ottenere i dati da fitbit
        fitbit.get(userId, requestUrl)


        //successo: fitbit ha risposto con dati
        .then( async response =>{
            


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