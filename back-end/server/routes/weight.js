const express = require('express');
const db = require("../db/index");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

router.get("/", async (req, res) => {
    var token, decoded;
    try {
        const authHeader = req.headers.authorization || "";   //in questo modo anche se Authorization non viene fornito affatto l'esecuzione può comunque andare avanti e darci un messaggio d'errore di jwt
        token = authHeader.split(" ")[1];  //formato header = "Bearer TOKEN"
        decoded = jwt.verify(token, jwtSecret);
    }
    catch (err) {
        if (err.name=="TokenExpiredError") {
            return res.status(401).send("Token Expired");
        }
        else {
            console.error(`jwt ${err.name}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di jwt
            return res.status(401).send("Wrong Token or No token");
            
        }
    }
    try {
        var rows = await db.getMisurePeso(decoded.id);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
    if (rows==null) {
        return res.status(404).send("User ID not found");
    }
    var toSend = {
        username: decoded.username,
        dataPoints: rows,
    };
    return res.status(200).send(JSON.stringify(toSend));
});

module.exports = router;