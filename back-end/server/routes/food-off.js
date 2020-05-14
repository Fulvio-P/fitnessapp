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

    //estraiamo info addizionali che ci faranno da descrizione
    var desc = `Quantità consumata: ${req.body.quantita} unità`;
    //definiamo una lista di proprietà nutrizionali che ci interessano
    const coseDaEsaminare = [
        {it: "Carboidrati", en: "carbohydrates"},
        {it: "Proteine", en: "proteins"},
        {it: "Grassi", en: "fat"}
    ];
    for (cosa of coseDaEsaminare) {
        //cerchiamo la proprietà nutrizionale in vari punti dell'oggetto nutriments
        //(OFF è *molto* ridondante a volte)
        var val100 = nutr[cosa.en];
        if (!val100) val100 = nutr[cosa.en+"_100g"];
        if (!val100) val100 = nutr[cosa.en+"_value"];
        //cerchiamo di recuperare l'unità di misura (proviamo a fidarci, va'?)
        var um = nutr[cosa.en+"_unit"];
        if (!um) um="";
        //se abbiamo trovato qualcosa, lo inseriamo nella descrizione
        if (val100) {
            const val = val100 * req.body.quantita / nutr_per;
            desc+=`\n${cosa.it}: ${val}${um}`;
        }
    }

    //inserimento nel DB
    const toInsert = {
        id: req.user.id,
        data: req.body.data,
        nome: name,
        calin: energy,
        descrizione: desc
    };
    var timesMet22001Error = 0;  //una misura di sicurezza
    var stopTrying = false;
    while (!stopTrying) {
        try {
            var added = await db.addCibo(
                toInsert.id,
                toInsert.data,
                toInsert.nome,
                toInsert.calin,
                toInsert.descrizione
            );
            stopTrying = true;
        } catch (err) {
            console.error(`postgres error no. ${err.code}: ${err.message}`);
            switch (err.code) {
                case "23505": //errore violazione vincolo UNIQUE / PRIMARY KEY, praticamente non dovrebbe succedere visto che il timestamp è preciso al millisecondo
                    return res.status(429).send("Sei troppo veloce! Riprova tra qualche secondo...");
                case "23503": //errore violazione vincolo FOREIGN KEY
                    return res.status(404).send("User ID does not exist");
                case "23502": //errore violazione vincolo NOT NULL
                    return res.status(500).send("Errore interno");
                case "22001": //quando una stringa è più lunga del limite dato nella definizione VARCHAR
                    if (timesMet22001Error>=2) {  //evitiamo loop infiniti
                    //(una volta per nome e una per descrizione)
                        return res.status(500).send("Errore sconosciuto");
                    }
                    timesMet22001Error++;
                    //devo accorciare qualche parametro stringa
                    var oldlen = toInsert.nome.length;
                    toInsert.nome = toInsert.nome.slice(0,47);   //il limite del nome è 50
                    //se si cerca di fare slice oltre il limite della stringa, non si ha alcun effetto aggiuntivo
                    var newlen = toInsert.nome.length;
                    if (newlen!=oldlen) {   //se la stringa à veramente stata tagliata
                        toInsert.nome+="...";
                    } else {  //la colpa è necessariamente della descrizione (per quanto spazio abbia...)
                        toInsert.descrizione = toInsert.descrizione.slice(0,509)+"...";  //limite 512
                    }
                    //poi riprova
                    break;
                default:
                    return res.status(500).send("Internal Database Error");
            }
        }
    }
    //se va tutto bene...
    return res.status(201).send(added);
});

module.exports = router;