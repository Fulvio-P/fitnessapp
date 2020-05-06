const express = require('express');
const db = require("../db/index");
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


//POST api/user/register: riceve dati e crea un utente nel database se non esiste già
router.post('/register', async (req, res) => {

    /* Estraggo dati dalla richiesta */
    let username = req.body.username;
    let password = req.body.password;





    /* Controllo che l'utente non sia già registrato */
    try {
        let user = await db.getUserByName(username);
        if(user) return res.status(400).send("Utente già registrato");
    } catch (err) {
        return res.status(500).send("Il controllo utente già registrato ha dato errore: "+err);
    }





    /* Hashing della password */
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    
    



    /* Provo ad aggiungere l'utente al database */
    try {
        await db.addUser(username, hashedPassword)
        return res.status(200).send("Registrato utente: "+username+"\nhash: "+ hashedPassword);
    } catch (err) {
        return res.status(500).send("Errore inserimento nel database: "+err)
    }

});





//POST api/user/login : riceve i dati e ritorna un id se corretti
router.post('/login', async (req, res) => {

    /* Estraggo i dati dalla richesta */
    let username = req.body.username;
    let password = req.body.password;
    





    /* Controllo che l'utente esista nel database */
    let user;
    try {
        user = await db.getUserByName(username);
        if(!user) return res.status(403).send("Utente non registrato");
    } catch (err) {
        return res.status(500).send("Errore controllo registrazione: "+err);
    }





    /* Cotrollo password */
    let passMatch = bcrypt.compareSync(password, user.password);
    if(!passMatch){
        return res.status(403).send("Credenziali errate");
    }





    /* Creazione del token */
    const token = jwt.sign(user,jwtSecret,{
        expiresIn: "5h"
    })
    authData="Bearer "+token
    //a quanto pare questo è il modo giusto di inviare token





    /* Invio risposta al front-end */
    return res.status(200).set('Authentication',authData).send(user);

});


module.exports = router;