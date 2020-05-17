const db = require('../db/index');
const utils = require('./fitbitUtils');


/*
    README:
    Questo modulo usa le funzioni semplici di fitbitUtils combinandole
    ed espone servizi più complessi che interagiscono con il database

*/


/*
    Gestione della prima autenticazione:
    dato un id e un authCode ottenuti dal front-end viene fatta richiesta
    dei token a fitbit, in caso di successo questi vengono salvati nel
    datbase, altrimenti l'errore viene rimandato al chiamante per essere
    gestito (possibilmente inviando un qualcosa di adegauto al front-end)
*/
function authenticate(userId, authCode){
    return new Promise((resolve, reject)=>{
        
        //invio richiesta a fitbit per i token
        utils.requestToken(authCode)

        //successo: fitbit ha inviato i token
        .then( async(response) => {
            
            //estraggo i dati dalla risposta
            let fitbitToken = response.data.access_token;
            let fitbitRefresh = response.data.refresh_token;
            
            //provo a salvare i token nel database
            let what = {
                fitbittoken: fitbitToken,
                fitbitrefresh: fitbitRefresh
            }
            try {
                await db.editAdditionalInfo(userId, what);
            } catch (err) {
                console.error(`postgres error no. ${err.code}: ${err.message}`);
                reject("Internal Database Error");
            }

            resolve("Token Fitbit Memorizzati")
        })

        //fallimento: fitbit ha inviato un errore
        .catch((error)=>{

            //visualizzo errore sul server e lo inoltro
            console.error(error.response.data.errors);
            reject('API call failed');
        })
    })
}




/*
    Gestione token scaduto:
    dato uno userId un Url si prova ad aggiornare i token e mandare
    una nuova richiesta al server all'url, questo metodo non viene
    esposto, ma viene usato dalle funzioni di questo modulo

    requestFunction è il metodo da usare per riprrovare dopo aver
    aggiornato i token, request payload è opzionale e serve nel caso
    si abbiano da fare Post o Put (anche se di base non sono previste
    in questa applicazione)

*/
function retry(userId, requestFunction, requestURL, requestPayload){

    return new Promise( async (resolve, reject) =>{

        //provo a recuperare il refresh dal database
        try {
            var dbRes = await db.getAdditionalInfo(userId,'fitbitRefresh')
        } catch (error) {
            console.error(`postgres error no. ${err.code}: ${err.message}`);
            reject("Internal Database Error");
        }
        if(!dbRes) reject("Refresh Token Not Found");
        let refreshToken = dbRes.fitbitrefresh;

        
        //provo a ottnere nuovi token da fitbit
        utils.requestRefresh(refreshToken)


        //fallimento: fitbit invia un errore
        .catch(error=>{
            //stampo errore e inoltro messaggio
            console.error(error.response.data.errors);
            reject("Token Refresh Failed");

        })

        //successo: fitbit ha inviato i token
        .then( async(response) => {
            
            //estraggo i dati dalla risposta
            let fitbitToken = response.data.access_token;
            let fitbitRefresh = response.data.refresh_token;
            
            //provo a salvare i token nel database
            let what = {
                fitbittoken: fitbitToken,
                fitbitrefresh: fitbitRefresh
            }
            try {
                await db.editAdditionalInfo(userId, what);
            } catch (err) {
                console.error(`postgres error no. ${err.code}: ${err.message}`);
                reject("Internal Database Error");
            }





            //Adesso posso riprovare con il nuovo token!
            requestFunction(requestURL, fitbitToken, requestPayload)

            //fallimento: anche questa prova da errore
            .catch((error)=>{
                console.error(error.response.data.errors)
                reject("API Retry Call Failed");
            })

            //successo: la nuova chiamata ha ottenuto risultati
            .then(response =>{
                resolve(response);
            })


        })
        


    })
}













/*
    Gestione chiamate api GET:
    dato un userId e un URL si prova a prendere il token dal database e
    usarlo per autenticare la richiesta dei dati, se il token è scaduto
    si riprova la richiesta dopo un refresh

    COMMENTO EFFICIENZA: si potrebbe generalizzare questa funziona passando
    la funzione da usare e un eventuale payload come parrametri ma per il
    momento non facciamo che get quindi non serve
*/

function get(userId, requestURL){

    return new Promise( async (resolve, reject)=>{

        //provo a recuperare il token dal database
        try {
            var dbRes = await db.getAdditionalInfo(userId,'fitbitToken')
        } catch (error) {
            console.error(`postgres error no. ${err.code}: ${err.message}`);
            reject("Internal Database Error");
        }
        if(!dbRes) reject("Access Token Not Found");
        const accessToken = dbRes.fitbittoken

        
        //uso il token per eseguire una get
        utils.get(requestURL, accessToken)

        //successo: fitbit ha risposto con i dati
        .then(response => {
            resolve(response)
        })

        //fallimento: fitbit ha risposto con un errore
        .catch(error => {
            
            console.error(error.response.data.errors);
            if(error.response.data.errors[0].errorType === "expired_token"){

                //siamo qui perchè il token è scaduto riproviamo
                retry(userId, utils.get, requestURL)

                //successo: la retry ha ottenuto i dati
                .then(retryResponse => {
                    resolve(retryResponse)
                })

                //fallimento: anche la retry da errore
                .catch(retryError=>{
                    reject(retryError)
                })

            } else {

                //l'errore non è dovuto a token scaduto
                reject(error)
            }
        })


    })
}





module.exports = {
    authenticate,
    get,
}