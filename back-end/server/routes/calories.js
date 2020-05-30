const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

//get generica che viene usata in varie declinazioni dai vari tipi di route get
async function generalGet(req, res, from, to) {
    try {
        var rows = await db.getRangeMisureCalorie(req.user.id, from, to);
    }
    catch (err) {
        return res.status(500).send(err.message);
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

//recupera la lista delle misure delle calorie di un utente
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

module.exports = router;