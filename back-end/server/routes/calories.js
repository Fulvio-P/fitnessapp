const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
router.use(utils.verifyJWT);

router.get("/", async (req, res) => {
    try {
        var rows = await db.getMisureCalorie(req.user.id);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
    if (rows==null) {
        return res.status(404).send("User ID not found");
    }
    var toSend = {
        id: req.user.id,
        dataPoints: rows,
    };
    return res.status(200).json(toSend);
});

module.exports = router;