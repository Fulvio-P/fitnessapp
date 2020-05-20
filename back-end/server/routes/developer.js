const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();


router.use(utils.verifyJWT);


router.get("/", async(req, res)=>{

    //estraggo dati richiesta
    const userId = req.user.id;
    const username = req.user.username;
    const internal = req.user.internalToken;

    console.debug(internal);
    //le proprie applicazioni sono visualizzabili solo dal front end
    if(!internal){
        return res.status(403).send("Forbidden");
    }


    //carico le applicazioni dal db
    try{
        var rows = await db.getClientByUser(userId);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        return res.status(500).send("Internal Database Error");
    }

    const toSend = {
        username: username,
        dataPoints: rows,
    };

    return res.status(200).json(toSend);

});


//aggiunge una nuova applicazione client
router.post("/", async (req, res)=>{


    //le proprie applicazioni sono modificabili solo dal front end
    const internal = req.user.internalToken;
    if(!internal){
        return res.status(403).send("Forbidden");
    }

    try {
        var added = await db.addClient(
            req.user.id,
            req.body.clientName,
            req.body.redirect,
        );
    } catch (error) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "23505": //errore violazione vincolo UNIQUE / PRIMARY KEY, praticamente non dovrebbe succedere visto che abbiamo numeri progressivi
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



//rimuove una applicazione client tra quelle registrate dall'utente
router.delete("/:clientid", async (req, res) => {

    //le proprie applicazioni sono cancellabili solo dal front end
    const internal = req.user.internalToken;
    if(!internal){
        return res.status(403).send("Forbidden");
    }

    var deleted;
    try {
        deleted = await db.deleteClient(req.user.id, req.params.clientid);
    } catch (err) {
        //dovrebbe essere impossibile rompere vincoli con questa operazione
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        return res.status(500).send("Internal Database Error");
    };
    //se la query è andata bene...
    if (!deleted) {
        //allora non è stata eliminata alcuna riga, quindi non è mai esistita una misura con quegli id e data
        return res.status(404).send("Questa entry non esisteva neanche prima. Nessuna modifica.");
    }
    return res.status(200).send(deleted);
});


module.exports = router;