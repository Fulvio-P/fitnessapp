// Questa sotto-route di cibo gestisce la richiesta a Open Food Facts.

const express = require('express');
const axios = require('axios').default;
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

//la verifica della JWT è già stata fatta da food.js

router.post("/off", async (req, res) => {
    //verifichiamo che gli argomenti ci siano
    if (!req.body.barcode) {
        return res.status(400).send("Specificare il codice a barre è obbligatorio");
    }
    if (!req.body.quantita) {
        req.body.quantita=100;  //default
    }
    if (!req.body.data) {
        req.body.data = new Date();   //default
    }

    //facciamo la richiesta a OFF
    try {
        var axiosResp = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${req.body.barcode}.json`
        );
    } catch (err) {  //gestiamo vari tipi d'errore
        if (err.response) {
            // Request made and server responded
            console.error(`OFF request resulted in erroneous response:\n${err}`);
            return res.status(500).send("Il server Open Food Facts ha risposto con un errore.");
        } else if (err.request) {
            // The request was made but no response was received
            console.error(`No respose received for OFF request:\n${err}`);
            return res.status(500).send("Il server Open Food Facts non ha risposto.");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error(`OFF request setup triggered an error:\n${err}`);
            return res.status(500).send("Errore interno durante la richiesta a Open Food Facts.");
        }
    }

    //dato che OFF cerca sempre di mandare qualcosa, il nostro criterio per il fallimento
    //di una ricerca sarà l'assenza di informazioni nutrizionali.
    if (!axiosResp.data || !axiosResp.data.product || !axiosResp.data.product.nutriments) {
        return res.status(404).send("La ricerca su Open Food Facts non ha prodotto risultati.");
    }

    const prod = axiosResp.data.product;
    const nutr = prod.nutriments;

    //cominciamo dalle cose importanti: estraiamo l'apporto energetico (per 100g)
    //del cibo richiesto e dimensioniamolo in base a quanto ne ha mangiato l'utente
    var energy100g = nutr["energy-kcal_value"];
    if (!energy100g) { energy100g = nutr["energy_value"]; }
    if (!energy100g) {   //senza kcal non possiamo registrare il cibo: lo consideriamo un fallimento
        return res.status(404).send("La ricerca su Open Food Facts non ha prodotto risultati.");
    }
    const energy = energy100g * req.body.quantita / 100;

    //estraiamo il nome del cibo, in italiano se c'è
    var name = prod["product_name_it"];
    //!name prende sia undefined che ""
    if (!name) { name = prod["product_name"]; }
    //se non c'è un nome ci arrendiamo e usiamo l'unico identificatore che abbiamo
    if (!name) { name = `Codice a barre no. ${req.body.barcode}`; }

    //TODO fare inserimento, ma per adesso mi assicuro che funzioni
    console.log({id: req.user.id, data: req.body.data, nome: name, calin: energy});
    return res.status(200).send("Fatto, vedi un po' la console...")
});

module.exports = router;