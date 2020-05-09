const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

//recupera la lista delle attività registrate da un utente
router.get("/", async (req, res) => {
    try {
        var rows = await db.getAllAttivita(req.user.id);
    } catch (err) {
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

//crea una nuova attività per l'utente coi parametri indicati
router.post("/", async (req, res) => {
    try {
        var added = await db.addAttivita(
            req.user.id,
            req.body.data,
            req.body.nome,
            req.body.calout,
            req.body.descrizione
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

//modifica un'attività esistente dato il suo timestamp
//(che magari è stato recuperato esaminando la risposta GET)
router.put("/:ts", async (req, res) => {
    try {
        var edited = await db.editAttivita(
            req.user.id,
            req.params.ts,
            req.body.data,
            req.body.nome,
            req.body.calout,
            req.body.descrizione
        );
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "23505": //violaz. UNIQUE / PRIMARY KEY, impossibile perché questa chiamata non modifica id o data.
            case "23503": //violaz. FOREIGN KEY, impossibile perché idem
                return res.status(500).send("Non dovresti vedere questo messaggio. Aaahh, che imbarazzo!!");
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

//elimina un'attività esistente dato il suo timestamp
//(che magari è stato recuperato esaminando la risposta GET)
router.delete("/:ts", async (req, res) => {
    try {
        var deleted = await db.deleteAttivita(req.user.id, req.params.ts);
    } catch (err) {
        //dovrebbe essere impossibile rompere vincoli con questa operazione
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        return res.status(500).send("Internal Database Error");
    }
    //se la query è andata bene...
    if (!deleted) {
        //allora non è stata eliminata alcuna riga, quindi non è mai esistita una misura con quegli id e data
        return res.status(404).send("Questa entry non esisteva neanche prima. Nessuna modifica.");
    }
    return res.status(200).send(deleted);
});

module.exports = router;