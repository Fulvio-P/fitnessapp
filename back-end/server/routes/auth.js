const express = require('express');
const db = require("../db/index");
const bcrypt = require('bcryptjs');
const router = express.Router();


//POST api/user/register: riceve dati e crea un utente nel database se non esiste già
router.post('/register', async (req, res) => {

    /*estraggo dati dalla richiesta*/
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;





    /* Controllo che l'utente non sia già registrato */
    try {
        let user = await db.getUserByEmail(email);
        if(user) return res.status(400).send("Utente già registrato");
    } catch (err) {
        res.status(500).send("Il controllo utente già registrato ha dato errore: "+err);
    }





    /* Hashing della password */
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    
    


    
    /* Provo ad aggiungere l'utente al database */
    try {
        await db.addUser(email, username, hashedPassword)
        res.status(200).send("Registrato utente: "+username+"\nhash: "+ hashedPassword);
    } catch (err) {
        res.status(500).send("Errore inserimento nel database: "+err)
    }

})


module.exports = router;