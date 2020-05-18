const express = require('express');
const db = require("../../db/index");
const utils = require("../../globalutils");
const fitbit = require("../../fitbit/fitbit");

require('dotenv').config();

const router = express.Router();

//la JWT è già stata controllata in global.js

///////////////////////////////////// GET /////////////////////////////////////

//recupera una info di un utente, null se non ce l'ha
//name NON DEVE ESSERE SCELTO LIBERAMENTE DLL'UTENTE.
async function generalGet(req, res, name) {
    try {
        var info = await db.getAdditionalInfo(req.user.id, name);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di postgres
        return res.status(500).send("Internal Database Error");
    }
    if (!info) {
        return res.status(404).send("User ID not found");
    }
    info.username = req.user.username;
    return res.status(200).json(info);
}

router.get("/email", async (req, res) => {
    return await generalGet(req, res, "email");
});
router.get("/height", async (req, res) => {
    return await generalGet(req, res, "altezza");
});
router.get("/fitbit", async (req, res) => {
    return await generalGet(req, res, "fitbituser");
});








///////////////////////////////////// PUT /////////////////////////////////////

//modifica un'info dell'utente
//name NON DEVE ESSERE SCELTO LIBERAMENTE DLL'UTENTE.
async function generalPut(req, res, name) {
    var what = {};
    what[name] = req.body[name];
    try {
        var edited = await db.editAdditionalInfo(req.user.id, what);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                return res.status(413).send("String too long");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    const toSend = { username: req.user.username };
    toSend[name] = edited[name];
    return res.status(200).json(toSend);
}

router.put("/email", async (req, res) => {
    return await generalPut(req, res, "email");
});
router.put("/height", async (req, res) => {
    return await generalPut(req, res, "altezza");
});

router.put("/fitbit", async(req,res) => {
    
    let authCode = req.body.authCode;
    let userId = req.user.id;

    //COMMENTO EFFICIENZA:
    //si potrebbe evitare di andare oltre se abbiamo già token

    fitbit.authenticate(userId, authCode)

    //fallimento: fitbit ha risposto con un errore
    .catch((error)=>{
        return res.status(500).send(error);
    })

    //successo i token sono stati inseriti correttamente
    .then(()=>{
        
        

        fitbit.get(userId,"https://api.fitbit.com/1/user/-/profile.json")
        
        //successo: fitbit restituisce i dati utente
        .then( async (response)=>{

            //provo a inserire il nome utente nel database
            let what ={
                "fitbituser":response.data.user.displayName
            };
            try {
                db.editAdditionalInfo(userId, what);
            } catch (err) {
                console.error(`postgres error no. ${err.code}: ${err.message}`);
                return res.status(500).send("Internal Database Error");
            }

            return res.status(200).send("Account Fitbit Collegato")
        })

        .catch( error =>{
            return res.status(500).send(error);
        })
    })

    

})




///////////////////////////////////// DELETE /////////////////////////////////////

//rimuove un'info dell'utente
//name NON DEVE ESSERE SCELTO LIBERAMENTE DLL'UTENTE.
async function generalDelete(req, res, name) {
    try {
        var deleted = await db.deleteOneAdditionalInfo(req.user.id, name);
    } catch (err) {
         //dovrebbe essere impossibile rompere vincoli con questa operazione
         console.error(`postgres error no. ${err.code}: ${err.message}`);
         return res.status(500).send("Internal Database Error");
    }
    deleted.username = req.user.username;
    return res.status(200).json(deleted);
}

router.delete("/email", async(req, res) => {
    return await generalDelete(req, res, "email");
});
router.delete("/height", async(req, res) => {
    return await generalDelete(req, res, "altezza");
});
//per questo non posso usare general delete dato che deve cancellare diverse colonne
router.delete("/fitbit", async(req, res) => {
    
    //provo a cancellare fitbit token
    try {
        await db.deleteOneAdditionalInfo(req.user.id, "fitbittoken");
    } catch (err) {
         //dovrebbe essere impossibile rompere vincoli con questa operazione
         console.error(`postgres error no. ${err.code}: ${err.message}`);
         return res.status(500).send("Internal Database Error");
    }

    //provo a cancellare fitbit refresh
    try {
        await db.deleteOneAdditionalInfo(req.user.id, "fitbitrefresh");
    } catch (err) {
         //dovrebbe essere impossibile rompere vincoli con questa operazione
         console.error(`postgres error no. ${err.code}: ${err.message}`);
         return res.status(500).send("Internal Database Error");
    }

    //provo a cancellare fitbit user
    try {
        await db.deleteOneAdditionalInfo(req.user.id, "fitbituser");
    } catch (err) {
         //dovrebbe essere impossibile rompere vincoli con questa operazione
         console.error(`postgres error no. ${err.code}: ${err.message}`);
         return res.status(500).send("Internal Database Error");
    }

    //invio conferma come risposta
    return res.status(200).send("Account scollegato")
});

module.exports = router;