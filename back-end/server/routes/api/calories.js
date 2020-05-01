const express = require('express');
const db = require("../../db/index");

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        var rows = await db.getMisureCalorie(req.params.id);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
    if (rows==null) {
        return res.status(404).send("User ID not found");
    }
    var toSend = {
        id: req.params.id,
        dataPoints: rows,
    };
    return res.status(200).send(JSON.stringify(toSend));
});