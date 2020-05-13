// Questa sotto-route di cibo gestisce la richiesta a Open Food Facts.

const express = require('express');
const axios = require('axios').default;
const db = require("../db/index");
const utils = require("../globalutils");

const router = express.Router();

//la verifica della JWT è già stata fatta da food.js

router.post("/off", async (req, res) => {
    //verifichiamo che l'argomento principale (e richiesto per la chiamata OFF) ci sia
    if (!req.body.barcode) {
        return res.status(400).send("Specificare il codice a barre è obbligatorio");
    }
    //la verifica della presenza degli altri argomenti sta dopo aver determinato nutr_per

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

    //recuperiamo la quantità di prodotto rispetto a cui sono date le info nutrizionali
    //(tipicamente sono 100g, ma non si sa mai...)
    //(solo la quantità perché l'unità di misura ci interessa poco,
    // inoltre apparentemente anche per le bevande OFF dà "100g", quindi è proprio inutile)
    const nutr_per = parseInt(prod["nutrition_data_per"]);
    //parseInt taglia lettere successive al numero, ma dà NaN se comincia per una lettera
    //dà NaN anche se l'argomento è "" o undefined, quindi possiamo fare un unico controllo adesso
    if (isNaN(nutr_per))  nutr_per = 100;  //default

    //verifichiamo che gli altri argomenti ci siano
    if (!req.body.quantita) {
        req.body.quantita=nutr_per;  //default
    }
    if (!req.body.data) {
        req.body.data = new Date();   //default
    }

    //cominciamo dalle cose importanti: estraiamo l'apporto energetico (per 100g, o qualunque sia nutr_per)
    //del cibo richiesto e dimensioniamolo in base a quanto ne ha mangiato l'utente
    var energy100 = nutr["energy-kcal_value"];
    if (!energy100) { energy100 = nutr["energy_value"]; }
    if (!energy100) {   //senza kcal non possiamo registrare il cibo: lo consideriamo un fallimento
        return res.status(404).send("La ricerca su Open Food Facts non ha prodotto risultati.");
    }
    const energy = energy100 * req.body.quantita / nutr_per;

    //estraiamo il nome del cibo, in italiano se c'è
    var name = prod["product_name_it"];
    //!name prende sia undefined che ""
    if (!name) { name = prod["product_name"]; }
    //se non c'è un nome ci arrendiamo e usiamo l'unico identificatore che abbiamo
    if (!name) { name = `Codice a barre no. ${req.body.barcode}`; }

    //TODO fare inserimento, ma per adesso mi assicuro che funzioni
    console.log({ id: req.user.id, data: req.body.data, nome: name, calin: energy });
    return res.status(200).send("Fatto, vedi un po' la console...")
});

module.exports = router;