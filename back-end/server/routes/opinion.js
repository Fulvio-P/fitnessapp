const express = require('express');
const db = require("../db/index");
const router = express.Router();

router.post('/', async (req, res) => {
    
    try {
        //prova a inserire il record nel db    
    } catch (error) {
        //in caso di errore manda un messaggio adeguato
    }
    //se tutto è andato bene invia conferma
    res.status(201).send(req.body)
})


module.exports = router;