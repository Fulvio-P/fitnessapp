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
        return res.status(200).send("Success");
    } catch (err) {
        return res.status(500).send("Errore inserimento nel database: "+err)
    }

});



//contiene tutta la logica di login.
//la metto fuori perché i due endpoint seguenti dovranno svolgere la
//medesima operazione, ma con valori diversi dell'argomento internalToken,
//che vengono hardcodati nei rispettivi endpoint
//internalToken è true se il login è stato effettuato su FitnessApp
//(e non per un altro servizio tramite OAuth).
//un token interno dà permessi particolari che non vogliamo rendere
//disponibili a terza perti (tipo cancellare l'account).
async function genericLogin(req, res, internalToken) {

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




    //aggiungo alle info da inserire nel token il valore internalToken
    user.internalToken = internalToken;




    /* Creazione del token */
    const token = jwt.sign(user,jwtSecret,{
        expiresIn: "5h"
    })





    /* Invio risposta al front-end */
    return res.status(200).send({
        token,
        username
    });

}



//POST api/user/login : riceve i dati e ritorna un id se corretti
router.post('/login', async (req, res) => {
    await genericLogin(req, res, true);
});

//POST api/user/oauth : riceve i dati e ritorna un id se corretti
router.post('/oauth', async (req, res) => {
    const client = await db.getClientById(req.body.id);
    if (!client) {
        return res.status(404).send("Client ID not found");
    }
    if (client.redirect != req.body.redirect) {
        return res.status(400).send("Incorrect redirect URL");
    }
    await genericLogin(req, res, false);
});

module.exports = router;