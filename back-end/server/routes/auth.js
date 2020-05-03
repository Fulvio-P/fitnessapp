const express = require('express');
const db = require("../db/index");
const router = express.Router();


//POST : riceve dati e crea un utente nel database se non esiste già
router.post('/register', async (req, res) => {

    /*estraggo dati dalla richiesta*/
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    /* INSERIRE HASHING PASSWORD*/

    
    
    
    /* Controllo che l'utente non sia già registrato */
    try {
        let user = await db.getUserByEmail(email);
        if(user) return res.status(400).send("Utente già registrato");
    } catch (err) {
        res.status(500).send("Il controllo utente già registrato ha dato errore: "+err);
    } 

    
    
    
    
    /* Provo ad aggiungere l'utente al database */
    try {
        await db.addUser(email, username, password)
        res.status(200).send("Registrato utente: "+username);
    } catch (err) {
        res.status(500).send("Errore inserimento nel database: "+err)
    }

})


module.exports = router;