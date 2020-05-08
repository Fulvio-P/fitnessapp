const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

//recupera la lista dei cibi registrati da un utente
router.get("/", async (req, res) => {
    try {
        var rows = await db.getAllCibi(req.user.id);
    }
    catch (err) {
        //questa è una get, non ci sono vincoli da violare
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

//crea un nuovo cibo per l'utente coi parametri indicati
router.post("/", async (req, res) => {
    try {
        var added = await db.addCibo(
            req.user.id,
            req.body.foodItem,
            req.body.foodQuantity,
            req.body.foodEnergy
        );
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "23505": //errore violazione vincolo UNIQUE / PRIMARY KEY, praticamente non dovrebbe succedere visto che il timestamp è preciso al millisecondo
                return res.status(429).send("Sei troppo veloce! Riprova tra qualche secondo...");
            case "23503": //errore violazione vincolo FOREIGN KEY
                return res.status(404).send("User ID does not exist");
            case "23502": //errore violazione vincolo NOT NULL
                return res.status(400).send("Non hai specificato tutti gli argomenti obbligatori");
            case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                return res.status(413).send("String too long");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    //se va tutto bene...
    res.status(201).json(added);
});

//modifica un cibo esistente dato il suo timestamp
//(che magari è stato recuperato esaminando la risposta GET)
router.put("/:ts", async (req, res) => {
    try {
        var edited = await db.editCibo(
            req.user.id,
            req.params.ts,
            req.body.foodItem,
            req.body.foodQuantity,
            req.body.foodEnergy
        );
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "23505": //violaz. UNIQUE / PRIMARY KEY, impossibile perché questa chiamata non modifica id o data.
            case "23503": //violaz. FOREIGN KEY, impossibile perché idem
                return res.status(500).send("Non dovresti vedere questo messaggio. Andrei nel panico se succedesse!");
            case "23502": //violaz. NOT NULL
                return res.status(400).send("Non hai specificato tutti gli argomenti obbligatori");
            case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                return res.status(413).send("String too long");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    //se la query è andata bene...
    if (!edited) {
        //allora non è stata modificata alcuna riga, quindi non è mai esistita una misura con quegli id e ts
        return res.status(404).send("Questa entry non esiste affatto. Nessuna modifica.");
    }
    return res.status(200).send(edited);
});

module.exports = router;