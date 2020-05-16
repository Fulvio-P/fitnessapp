const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");
const jwt = require('jsonwebtoken');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

/*
Ovviamente anche i websocket possono dare errori, ad esempio se si cerca di
inviare un messaggio lungo una connessione chiusa
*/
function trySend(ws, msg) {
    try {
        ws.send(msg);
    } catch (err) {
        console.error(`ws error: ${err.message}`);
    }
}

//la funzione in globalutils è una funzione middleware che guarda la request,
//qui è inutile
function verifyTokenInMessage(ws, msg) {
    try {
        var decoded = jwt.verify(msg.token, jwtSecret);
    }
    catch (err) {
        console.error(`jwt ${err.name}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di jwt
        if (err.name=="TokenExpiredError") {
            trySend(ws, JSON.stringify({
                type: "error",
                message: "Token scaduto"
            }));
            return false;
        }
        else {
            trySend(ws, JSON.stringify({
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
            return trySend(ws, JSON.stringify({
                type: "error",
                message: "Azione non riconosciuta, prova fitbitsync"
            }));
        }

        console.log("TODO do all the fitbit stuff");
        
        return trySend(ws, JSON.stringify({
            type: "success",
            message: "Sincronizzazione riuscita!"
        }));
    });
});

module.exports = router;