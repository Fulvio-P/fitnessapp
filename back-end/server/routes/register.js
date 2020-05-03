const express = require('express');
const db = require("../db/index");
const router = express.Router();


//POST : riceve dati e crea un utente nel database se non esiste già
router.post('/', (req, res) => {
    console.log(req.body);
    res.send("200 OK");
})


module.exports = router;