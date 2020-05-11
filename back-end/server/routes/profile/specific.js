const express = require('express');
const db = require("../../db/index");
const utils = require("../../globalutils");

const router = express.Router();

//la JWT è già stata controllata in profile.js

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

module.exports = router;