const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

router.ws("/", function(ws, req) {
    //se ci riuscissimo potremmo autenticare la connessione una volta all'inizio
    //è irrilevante didatticamente, ma "realisticamente" sarebbe utile contro attacchi DoS

    ws.on('message', function(msg) {
        console.log("and websocket got...");
        console.log(msg)
        msg = JSON.parse(msg);

        //TODO controllo token

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