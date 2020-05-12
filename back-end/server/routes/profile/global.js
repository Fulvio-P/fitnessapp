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
    //estraiamo manualmente le singole proprietà permesse perché la funzione che fa la query ha bisogno di concatenare i nomi delle proprietà direttamente alla query, e non voglio injection
    var args = {};
    for (prop of ["email", "altezza"]) {   //<-- aggiungere qui eventuali altre info addizionali
        if (req.body[prop]) args[prop]=req.body[prop];
    }
    try {
        var newInfo = await db.editAdditionalInfo(req.user.id, args);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                return res.status(413).send("String too long");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    //generiamo l'oggetto di risposta per contenere i nuovi valori delle sole proprietà modificate
    var toSend = {};
    for (prop in args) {  //prendiamo solo le prop. che sono state passate nella richiesta
        toSend[prop]=newInfo[prop];
    }
    res.status(200).json(toSend);
});

//metto le route specifiche in un altro file per evitare cluttering di questo,
//questa dichiarazione è in questo punto per farle dopo la verifica del JWT
//e dopo aver controllato le route di questo file

const specific_rtr = require("./specific");
router.use("/", specific_rtr);

module.exports = router;


/*
TODO
file per email e altezza con GET, PUT e DELETE
    (sarebbe carino impostare le loro route qui piuttosto che in server/index)
se finisco presto: file username con GET e PUT, file password con PUT
*/