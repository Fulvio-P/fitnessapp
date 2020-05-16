const db = require('../db/index');
const utils = require('./fitbitUtils');


/*
    README:
    Questo modulo usa le funzioni semplici di fitbitUtils combinandole
    ed espone servizi più complessi che interagiscono con il database

    COMMENTO WARNING:
    per il momento sto stampando gli errori qui, potrebbe essere oppurtuno
    spostare la stampa a livelli superiori o inferiori 
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

    COMMENTO WARNING: 
    request function è fatta per essere una util.get oppure una tra
    le ipotetiche util.post util.put o util.delet (che però il nostro
    token di base non ci permette di usare) adesso in teoria visto che
    JavaScript se ne frega degli argomenti quando retry viene usata senza
    request payload lo considera undefined, il che non ci importa perchè
    poi quando lo passiamo come argomento extra alla requestFunction che
    non lo vuole viene semplicemente scartato

    COMMENTO WARNING:
    questa funzione ha un .then detro un .then il che potrebbe dare dei
    problemi dato che di solito i then si mettono in fila NECESSITA DI 
    TEST ACCURATI
*/
function retry(userId, requestFunction, requestURL, requestPayload){

    return new Promise( async (resolve, reject) =>{

        //provo a recuperare il refresh dal database
        try {
            var refreshToken = db.getAdditionalInfo(userId,'fitbitRefresh')
        } catch (error) {
            console.error(`postgres error no. ${err.code}: ${err.message}`);
            reject("Internal Database Error");
        }
        if(!refreshToken) reject("Refresh Token Not Found");



        //provo a ottnere nuovi token da fitbit
        utils.requestRefresh(refreshToken)

        //fallimento: fitbit invia un errore
        .catch(error=>{

            //stampo errore e inoltro messaggio
            console.error(error.response.data.errors);
            reject("Token Refresh Failed")

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
*/





module.exports = {
    authenticate,
}