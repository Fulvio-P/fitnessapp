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
        .catch((fitbitErr)=>{

            //visualizzo errore sul server e lo inoltro
            console.log(fitbitErr.response.data.errors);
            reject('API call failed');
        })
    })
}





module.exports = {
    authenticate,
}