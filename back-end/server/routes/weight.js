const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

//get generica che viene usata in varie declinazioni dai vari dipi di route get
async function generalGet(req, res, from, to) {
    try {
        var rows = await db.getRangeMisurePeso(req.user.id, from, to);
    }
    catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);   //non vogliamo rimandare al client il messaggio d'errore di postgres
        return res.status(500).send("Internal Database Error");
    }
    if (rows==null) {
        return res.status(404).send("User ID not found");
    }
    var toSend = {
        username: req.user.username,
        dataPoints: rows,
    };
    return toSend;
}

//recupera la lista delle misure del peso di un utente
router.get("/", async (req, res) => {
    const toSend =  await generalGet(req, res, db.MINFINITY, db.INFINITY);
    return res.status(200).json(toSend);
});

//recupera una misura di un giorno specifico.
//ha un comportamento speciale se non esiste una misurazione per quel giorno.
router.get("/:data", async (req, res) => {
    const toSend = await generalGet(req, res, req.params.data, req.params.data);
    if (toSend.dataPoints.length<1) {
        return res.status(404).send("Nessuna misura per questo giorno...")
    }
    return res.status(200).json(toSend);
});

//recupera le misure in un range di date. ESTREMI INCLUSI.
router.get("/:from/:to", async (req, res) => {
    //definiamo un carattere speciale per dire infinity.
    if (req.params.from=='-') req.params.from=db.MINFINITY;
    if (req.params.to=='-') req.params.to=db.INFINITY;
    const toSend = await generalGet(req, res, req.params.from, req.params.to);
    return res.status(200).json(toSend);
});

//aggiunge una nuova misura di peso alla data di oggi, dà errore se c'è già
router.post("/", async (req, res) => {
    var newrow;
    try {
        newrow = await db.addMisuraPeso(req.user.id, req.body.peso);
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

//modifica la misura peso dell'utente in una data arbitraria,
//dà errore se non c'è.
//ci aspettiamo che la data sia in un formato parsabile dall'oggetto Date,
//preferibilmente YYYY-MM-DD.
router.put("/:data", async (req, res) => {
    var edited;
    try {
        edited = await db.editMisuraPeso(req.user.id, new Date(req.params.data), req.body.peso);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "23505": //violaz. UNIQUE / PRIMARY KEY, impossibile perché questa chiamata non modifica id o data.
            case "23503": //violaz. FOREIGN KEY, impossibile perché idem
                return res.status(500).send("Non dovresti vedere questo messaggio. Quale magia nera hai fatto per farlo apparire? Me la insegni?");
            case "23502": //violaz. NOT NULL
                return res.status(400).send("Peso non specificato");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    //se la query è andata bene...
    if (!edited) {
        //allora non è stata modificata alcuna riga, quindi non è mai esistita una misura con quegli id e data
        return res.status(404).send("Questa misura non esiste affatto. Nessuna modifica.");
    }
    return res.status(200).send(edited);
});

//elimina una misura di peso dell'utente in una data arbitraria.
//stesso formato per la data.
router.delete("/:data", async (req, res) => {
    var deleted;
    try {
        deleted = await db.deleteMisuraPeso(req.user.id, new Date(req.params.data));
    } catch (err) {
        //dovrebbe essere impossibile rompere vincoli con questa operazione
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        return res.status(500).send("Internal Database Error");
    }
    //se la query è andata bene...
    if (!deleted) {
        //allora non è stata eliminata alcuna riga, quindi non è mai esistita una misura con quegli id e data
        return res.status(404).send("Questa misura non esisteva neanche prima. Nessuna modifica.");
    }
    return res.status(200).send(deleted);
});

module.exports = router;