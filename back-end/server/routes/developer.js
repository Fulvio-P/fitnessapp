const express = require('express');
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();


router.use(utils.verifyJWT);


router.get("/", async(req, res)=>{

    //estraggo dati richiesta
    const userId = req.user.id;
    const username = req.user.username;
    const internal = req.internalToken;


    //le proprie applicazioni sono visualizzabili solo dal front end
    if(!internal){
        res.status(403).send("Forbidden");
    }


    //carico le applicazioni dal db
    try{
        var rows = await db.getClientByUser(userId);
    } catch (error) {
        console.error(`postgres error no. ${err.code}: ${err.message}`);
        return res.status(500).send("Internal Database Error");
    }

    const toSend = {
        username: username,
        dataPoints: rows,
    };

    return res.status(200).json(toSend);

})


module.exports = router;