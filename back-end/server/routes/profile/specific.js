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

router.get("/username", async (req, res) => {
    try {
        var user = await db.getUserById(req.user.id);
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di postgres
        return res.status(500).send("Internal Database Error");
    }
    if (!user) {
        return res.status(404).send("User ID not found");
    }
    var toSend = { username: user.username };
    return res.status(200).json(toSend);
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
        
        //DEBUG
        /* console.log('token acquisiti, provo a prendere il nome utente') */

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

router.put("/username", async (req, res) => {
    //al momento se permettiamo quest'operazione c'è una discrepanza coi dati codificati nel token
    return res.status(403).send("This functionality is currently disabled");

    if (!req.body.username) {  //prende anche ""
        return res.status(400).send("Username expected");
    }
    try {
        var edited = db.editUsername(req.user.id, req.body.username)
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                return res.status(413).send("Username too long");
            case "23505": //errore violazione vincolo UNIQUE / PRIMARY KEY
                return res.status(500).send("Username already exists");
            case "23502": //violaz. NOT NULL
                return res.status(400).send("Non dovresti vedere questo messaggio. Dovrei averlo già gestito...");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    //se la query è andata bene...
    if (!edited) {
        //allora non è stata modificata alcuna riga, quindi non è mai esistita una misura con quegli id e ts
        return res.status(404).send("User ID not found");
    }
    return res.status(200).send(edited);
});

router.put("/password", async (req, res) => {
    //al momento se permettiamo quest'operazione c'è una discrepanza coi dati codificati nel token
    return res.status(403).send("This functionality is currently disabled");

    if (!req.body.password) {  //prende anche ""
        return res.status(400).send("Password expected");
    }
    try {
        db.editPassword(req.user.id, req.body.password)
    } catch (err) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        switch (err.code) {
            case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                return res.status(413).send("Password too long");
            case "23502": //violaz. NOT NULL
                return res.status(400).send("Non dovresti vedere questo messaggio. Dovrei essermene già preso cura...");
            default:
                return res.status(500).send("Internal Database Error");
        }
    }
    return res.status(204).send();
});




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