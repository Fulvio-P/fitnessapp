const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

/**
 * Applica la funzione specificata a tutte le richieste che arrivano a questo router,
 * e ha persino il potere di modificare l'oggetto request (e lo fa, aggiungendo token e user)
 */
//router.use(utils.verifyJWT);   non ancora

//temp: ci stampiamo quanto ricevuto per studiare il form time
router.post("/", async (req, res) => {
    console.log(req.body);
});

module.exports = router;