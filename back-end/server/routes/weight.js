const express = require('express');
const db = require("../db/index");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

router.get("/:token", async (req, res) => {
    var decoded;
    try {
        decoded = jwt.verify(req.params.token, jwtSecret);
    }
    catch (err) {
        if (err.name=="TokenExpiredError") {
            res.status(400).send("Token Expired");
        }
        else {
            res.status(400).send("Wrong Token");
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