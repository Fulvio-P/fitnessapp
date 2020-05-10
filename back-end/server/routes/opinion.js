const express = require('express');
const db = require("../db/index");
const router = express.Router();

router.post('/', async (req, res) => {
    
    let newRow;
    try {
        //prova a inserire il record nel db
        newRow = await db.addOpinione(req.body.email, req.body.testo);    
    } catch (err) {
        //in caso di errore manda un messaggio adeguato
        console.error(`postgres error no. ${err.code}: ${err.message}`);
    }
    //se tutto è andato bene invia conferma
    res.status(201).send(req.body)
})


module.exports = router;