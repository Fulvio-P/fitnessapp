const express = require('express');
const db = require("../../db/index");
const utils = require("../../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

//fornisce username e tutte le info addizionali dell'utente autenticato
router.get("/", async (req, res) => {
    try {
        var info = await db.getAdditionalInfo(req.user.id, "*");
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di postgres
        return res.status(500).send("Internal Database Error");
    }
    if (!info) {
        return res.status(404).send("User ID not found");
    }
    info.id = undefined;
    for (prop in info) {
        if (info[prop]==null) info[prop]=undefined;
    }
    info.username = req.user.username;
    return res.status(200).json(info);
});

//modifica più info addizionali contemporaneamente (NON username o password)
router.patch("/", async (req, res) => {
    //TODO
});

module.exports = router;


/*
TODO
file per email e altezza con GET, PUT e DELETE
se finisco presto: file username con GET e PUT, file password con PUT
*/