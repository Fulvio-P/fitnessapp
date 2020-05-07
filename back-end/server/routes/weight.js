const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

//recupera la lista delle misure del peso di un utente
router.get("/", async (req, res) => {
    try {
        var rows = await db.getAllMisurePeso(req.user.id);
    }
    catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di postgres
        return res.status(500).send("Internal Database Error");
    }
    if (rows==null) {
        return res.status(404).send("User ID not found");
    }
    var toSend = {
        username: req.user.username,
        dataPoints: rows,
    };
    return res.status(200).json(toSend);
});

//aggiunge una nuova misura di peso alla data di oggi, dà errore se c'è già
router.post("/", async (req, res) => {
    var newrow;
    try {
        newrow = await db.addMisuraPeso(req.user.id, req.body.weight);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "23505": //errore violazione vincolo UNIQUE / PRIMARY KEY
                return res.status(409).send("Esiste già una misurazione per oggi, prova PUT per modificarla");
            case "23503": //errore violazione vincolo FOREIGN KEY
                return res.status(404).send("User ID does not exist");
            case "23502": //errore violazione vincolo NOT NULL
                return res.status(400).send("Peso non specificato");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    //se va tutto bene...
    res.status(201).json(newrow);
});

module.exports = router;