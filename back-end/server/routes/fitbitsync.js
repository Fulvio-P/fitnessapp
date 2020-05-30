const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");
const jwt = require('jsonwebtoken');
const sync = require('../syncWork/syncActivities');

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
        console.error(`ws.send error: ${err.message}`);
    }
}
function tryClose(ws) {
    try {
        ws.close();
    } catch (err) {
        console.error(`ws.close error: ${err.message}`);
    }
}

//la funzione in globalutils è una funzione middleware che guarda la request,
//qui è inutile
function verifyTokenInQuery(ws, query) {
    try {
        var decoded = jwt.verify(query.token, jwtSecret);
    }
    catch (err) {
        console.error(`jwt ${err.name}: ${err.message}`);   //non vogliamo rimandare al client il messaggio d'errore di jwt
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

    /*
      il modo in cui funziona l'autenticazione è: invia il token nella querystring.
      i browser non fanno caching delle URL ws, quindi non c'è lo stesso
      rischio di caching che c'è in HTTP, e tolto questo una querystring è
      equivalente a un header (che l'api ws nativa non fa usare).
    */

    //i ws possono avere uno stato: questa variabile user si può usare
    //nei vari gestori del ws, ed è indipendente per ogni ws aperto
    var user = verifyTokenInQuery(ws, req.query);  //abbiamo la req.query normale di express a disposizione
    if (!user) {
        trySend(ws, JSON.stringify({
            type: "error",
            message: "Autenticazione fallita"
        }));
        tryClose(ws)
    } else {
        console.log(user.username+" ws connected");
    }

    ws.on('message', function(msg) {
        console.log(`${user.username} ws: ${msg}`)
        msg = JSON.parse(msg);

        if (msg.action!="fitbitsync") {
            return trySend(ws, JSON.stringify({
                type: "error",
                message: "Azione non riconosciuta, prova fitbitsync"
            }));
        }

        //una sorta di ack che la richiesta è stata presa in carico
        trySend(ws, JSON.stringify({
            type: "info",
            message: "Sincronizzazione avviata..."
        }));

        sync.sync(user.id)
        .then(()=>{
            return trySend(ws, JSON.stringify({
                type: "success",
                message: "Sincronizzazione riuscita!"
            }));
        })
        .catch((error)=>{
            console.error(error);
            return trySend(ws, JSON.stringify({
                type: "error",
                message: "Sincronizzazione fallita :("
            }));
        })
        
    });

    ws.on("close", ()=>{
        console.log(user.username+" ws disconnected");
    })
});

module.exports = router;