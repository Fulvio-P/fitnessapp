require('dotenv').config();



//Crea l'header Authorization da mettere della richiesta del token
function makeBasicHeader(){
    
    let clientId = process.env.FITBIT_ID;
    let clientSec = process.env.FITBIT_SEC;
    let plainString = clientId + ':' + clientSec;
    
    let buff = new Buffer.from(plainString);
    let encodedString = buff.toString('base64');
    
    let authToken = "Basic "+encodedString;
    return authToken;
}
















module.exports = {
    makeBasicHeader,
    //Aggiungere qui le funzioni da esportare
}