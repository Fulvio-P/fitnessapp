const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");
const jwt = require('jsonwebtoken');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

//la funzione in globalutils è una funzione middleware che guarda la request,
//qui è inutile
function verifyTokenInMessage(ws, msg) {
    try {
        var decoded = jwt.verify(msg.token, jwtSecret);
    }
    catch (err) {
        console.error(`jwt ${err.name}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di jwt
        if (err.name=="TokenExpiredError") {
            ws.send(JSON.stringify({
                type: "error",
                message: "Token scaduto"
            }));
            return false;
        }
        else {
            ws.send(JSON.stringify({
                type: "error",
                message: "Autenticazione fallita"
            }));
            return false;
        }
    }
    //se va tutto bene...
    return decoded;   //dati utente
}

router.ws("/", function(ws, req) {
    //se ci riuscissimo potremmo autenticare la connessione una volta all'inizio
    //è irrilevante didatticamente, ma "realisticamente" sarebbe utile contro attacchi DoS

    ws.on('message', function(msg) {
        console.log("and websocket got...");
        console.log(msg)
        msg = JSON.parse(msg);

        var user = verifyTokenInMessage(ws, msg);
        if (!user) return;

        if (msg.action!="fitbitsync") {
            return ws.send(JSON.stringify({
                type: "error",
                message: "Azione non riconosciuta, prova fitbitsync"
            }));
        }

        console.log("TODO do all the fitbit stuff");
        
        return ws.send(JSON.stringify({
            type: "success",
            message: "Sincronizzazione riuscita!"
        }));
    });
});

module.exports = router;