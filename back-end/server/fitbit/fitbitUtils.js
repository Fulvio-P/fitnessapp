require('dotenv').config();
const axios = require('axios');



/*
    README:
    Questo modulo include le funzioni che sono utili per comunicare con fitbit,
    ma fanno solo cose semplici e non toccano il database e trattano i dati il
    minimo necessario
*/




//Crea l'header Authorization da mettere della richiesta dei token
function makeBasicHeader(){
    
    let clientId = process.env.FITBIT_ID;
    let clientSec = process.env.FITBIT_SEC;
    let plainString = clientId + ':' + clientSec;
    
    let buff = new Buffer.from(plainString);
    let encodedString = buff.toString('base64');
    
    let authToken = "Basic "+encodedString;
    return authToken;
}




//Chiede a fitbit di avere un nuovo token dato il refresh token
function requestRefresh(fitbitRefresh){
    return new Promise((resolve,reject) =>{

        //preparo i dati per la richista verso fitbit
        let basicHeader = makeBasicHeader();
        let tokenURI = 'https://api.fitbit.com/oauth2/token';
        
        let headers = {
            'Authorization': basicHeader
        }
        
        let payload =
            'grant_type=refresh_token&'+
            'refresh_token='+fitbitRefresh;
        ;


        //tutto pronto inviamo il messaggio con axios
        axios.post(
        tokenURI,
        payload,
        {headers: headers}
        )
        
        //qualunque sia il risultato lo do da gestire a chi mi ha chiamato
        .then(response=>{
            resolve(response);
        })
        .catch((error=>{
            reject(error)
        }))
    })
}

//Chiede a fitbit di rispondere con i token
function requestToken(authCode){
    return new Promise((resolve,reject) => {

        //configurazione richiesta verso fitbit
        let basicHeader = makeBasicHeader();
        let client_id = process.env.FITBIT_ID;
        let tokenURI = 'https://api.fitbit.com/oauth2/token';
        
        let headers = {
            'Authorization': basicHeader
        }
        
        let payload =
            'client_id='+client_id+'&'+
            'grant_type=authorization_code&'+
            'redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fprofile&'+
            'expires_in=3600&'+
            'code='+authCode
        ;

        //tutto pronto inviamo il messaggio con axios
        axios.post(
            tokenURI,
            payload,
            {headers: headers}
        )
        
        //qualsiasi sia l'esito se la vede il chiamante
        .then(response=>{
            resolve(response);
        })
        .catch(error=>{
            reject(error);
        })

    })
}




function get(apiURL, token){
    return new Promise((resolve, reject)=>{
        
        //preparo header per la get
        let bearerHeader = "Bearer "+token
        let headers = {
            'Authorization': bearerHeader
        }


        //tutto pronto inviamo il messaggio con axios
        axios.get(
            apiURL,
            {headers: headers}
        )

        
        
        //qualsiasi sia l'esito se la vede il chiamante
        .then(response=>{
            resolve(response);
        })
        .catch(error=>{
            reject(error);
        })
    })
    
}





module.exports = {
    makeBasicHeader,
    requestRefresh,
    requestToken,
    get
}