/*
Metto tutti gli usi diretti della libreria pg nello stesso file,
come suggerito da quelli di node-postgres.com:
https://node-postgres.com/guides/project-structure
*/

/*
Seguo il tutorial di node-postgres.com:
https://node-postgres.com/features/connecting
https://node-postgres.com/features/queries
https://node-postgres.com/features/pooling
*/

const { Pool } = require("pg");
const pool = new Pool();

require("dotenv").config();

// date/timestamp speciali che rappresentano l'assenza di limiti superiore o inferiore
const INFINITY = "infinity";
const MINFINITY = "-infinity";


/////////////////////////////////////  UTENTI  /////////////////////////////////////////

//aggiunge un nuovo utente al database
//gli argomenti dopo i primi due corrispondono a informazioni facoltative.
//se un'informazione non è fornita, passare come argomento null o undefined,
//oppure non passare affatto quell'argomento se possibile (equivale a dare undefined).
//in fase di inserimento, node-postgres tratta null e undefined come NULL.
async function addUser(username, password, email, altezza) {
    return await doTransaction(async client => {
        var res = await client.query(
            "INSERT INTO utente(username, password) "+
            "VALUES ($1, $2) "+
            "RETURNING * ;",
            [username, password]
        );   //se un errore avviene qui, lasciamo che si propaghi al chiamante
        await client.query(
            "INSERT INTO infoAddizionali "+
            "VALUES ($1, $2, $3);",
            [res.rows[0].id, email, altezza]
        );  //se un errore si verifica qui, l'utente non viene creato affatto:
            //la scelta di progetto è che un utente abbia sempre una riga di questa tabella associata,
            //per semplicità.
        return res.rows[0];
    })
    
}

//ritorna i dati di un utente dato il suo id
async function getUserById(id) {
    var queryRes = await pool.query("SELECT * FROM utente WHERE id=$1", [id]);
    if (queryRes.rows.length<1) {
        return undefined;
    }
    return queryRes.rows[0];
}

//ritorna i dati di un utente dato il suo id
async function getUserByName(username) {
    var queryRes = await pool.query("SELECT * FROM utente WHERE username=$1", [username]);
    if (queryRes.rows.length<1) {
        return undefined;
    }
    return queryRes.rows[0];
}


////////////////////////////////////  PESO  //////////////////////////////////////////

//ritorna tutte le misure peso dell'utente dato che sono comprese in un range di date.
//ENTRAMBI GLI ESTREMI SONO INCLUSIVI.
async function getRangeMisurePeso(id, from, to) {
    if (!from) from=MINFINITY;    //per sicurezza...
    if (!to) to=INFINITY;        //'''
    if (!(await getUsernameIfExists(id))) {
        return null;
    }
    var queryRes = await pool.query(
        "SELECT data as data, peso as peso "+
        "FROM misuraPeso "+
        "WHERE id=$1 AND $2<=data AND data<=$3",
        [id, from, to]);
    return queryRes.rows;
}

//ritorna tutte le misure peso di un utente dato il suo id
async function getAllMisurePeso(id) {
    return await getRangeMisurePeso(id, MINFINITY, INFINITY);
}

//restituisce una misura peso di un utente dati id utente e data in cui è stata effettuata
//credevo che servisse per una cosa, ma invece mi sbagliavo.
//la lascio perché a livello di interfaccia col DB è una cosa che potremmo volere in futuro.
async function getOneMisuraPeso(id, data) {
    return await getRangeMisurePeso(id, data, data);
}

//aggiunge una nuova misura di peso per la data odierna all'utente indicato
//restituisce la riga appena creata (senza id)
//non mi aspetto che vorremo rendere possibile aggiungere misure in altre date.
async function addMisuraPeso(id, peso) {
    var res = await pool.query(
        "INSERT INTO misurapeso(id, peso) "+
        "VALUES ($1, $2)"+
        "RETURNING data as data, peso as peso",
        [id, peso]
    );
    return res.rows[0];
}

//modifica la misura peso dell'utente indicato alla data indicata.
//restituisce la nuova riga (senza id)
//oppure undefined se non è stata modificata alcuna riga
async function editMisuraPeso(id, data, peso) {
    var res = await pool.query(
        "UPDATE misurapeso "+
        "SET peso=$3 "+
        "WHERE id=$1 AND data=$2 "+
        "RETURNING data as data, peso as peso;",
        [id, data, peso]
    );
    return res.rows[0];
}

//elimina la misura peso dell'utente indicato alla data indicata.
//restituisce la riga eliminata (senza id)
//oppure undefined se non è stata eliminata alcuna riga
async function deleteMisuraPeso(id, data) {
    var res = await pool.query(
        "DELETE FROM misurapeso "+
        "WHERE id=$1 AND data=$2 "+
        "RETURNING data as data, peso as peso",
        [id, data]
    );
    return res.rows[0];
}


///////////////////////////////  CALORIE  ////////////////////////////////////
//(hanno solo get perché vengono modificate tramite cibi e attività)

//trova le misure calorie di un utente entro il range di date [from, to] (INCLUSE)
async function getRangeMisureCalorie(id, from, to) {
    if (!from) from=MINFINITY;    //per sicurezza...
    if (!to) to=INFINITY;        //'''
    if (!(await getUsernameIfExists(id))) {
        return null;
    }
    var queryRes = await pool.query(
        "SELECT data, calin, calout, (calin-calout) as bilancio "+
        "FROM misuraCalorie "+
        "WHERE id=$1 AND $2<=data AND data<=$3",
        [id, from, to]);
    return queryRes.rows;
}

async function getAllMisureCalorie(id) {
    return await getRangeMisureCalorie(id, MINFINITY, INFINITY);
}


//////////////////////////////////  CIBO  /////////////////////////////////////////

//trova tutti i cibi di un utente la cui "data" si trova nel range [from, to].
//ESTREMI INLUSI.
async function getRangeCibi(id, from, to) {
    if (!from) from=MINFINITY;    //per sicurezza...
    if (!to) to=INFINITY;        //'''
    var res = await pool.query(
        "SELECT created, data, nome, calin, descrizione "+
        "FROM cibo "+
        "WHERE id=$1 AND $2<=data AND data<=$3",
        [id, from, to]
    );
    return res.rows;
}

//ritorna tutti i cibi di un utente dato il suo id
async function getAllCibi(id) {
    return await getRangeCibi(id, MINFINITY, INFINITY);
}

//crea un nuovo cibo per un utente
async function addCibo(id, data, nome, calin, descrizione) {
    const [plusInsert, plusValues, plusParams] = generateInsertOptionals(data, descrizione);
    return await doTransaction(async (client) => {
        var res = await client.query(
            "INSERT INTO cibo(id, nome, calin"+plusInsert+") "+
            "VALUES ($1, $2, $3"+plusValues+") "+
            "RETURNING created, data, nome, calin, descrizione",
            [id, nome, calin].concat(plusParams)
        );
        await addOrSubtractCalories(client, id, res.rows[0].data, calin, 0);
        return res.rows[0];
    });
}

//modifica un cibo di un utente
async function editCibo(id, ts, data, nome, calin, descrizione) {
    var vecch = await pool.query(   //non modifica nulla, non fa parte della transazione
        "SELECT * "+
        "FROM cibo "+
        "WHERE id=$1 AND created=$2;",
        [id, ts]
    );
    if (vecch.rows.length<1) {
        return undefined;    //se non troviamo nulla è meglio che smettiamo subito prima di avere problemi indesiderati durante la transazione
    }
    const [plusSet, plusParams] = generateUpdateOptionals(data, descrizione);
    return await doTransaction(async client => {
        var nuov = await client.query(
            "UPDATE cibo "+
            "SET nome=$3, calin=$4"+plusSet+" "+
            "WHERE id=$1 AND created=$2 "+
            "RETURNING created, data, nome, calin, descrizione;",
            [id, ts, nome, calin].concat(plusParams)
        );
        await addOrSubtractCalories(client, id, vecch.rows[0].data, -vecch.rows[0].calin, 0);
        await addOrSubtractCalories(client, id, nuov.rows[0].data, nuov.rows[0].calin, 0);
        return nuov.rows[0];
    });
}

//elimina un cibo dati id dell'utente e timestamp di creazione
async function deleteCibo(id, ts) {
    return await doTransaction(async client => {
        var res = await client.query(
            "DELETE FROM cibo "+
            "WHERE id=$1 AND created=$2 "+
            "RETURNING created, data, nome, calin, descrizione;",
            [id, ts]
        );
        if (res.rows.length<1) {
            return undefined;    //se non troviamo nulla è meglio che smettiamo subito prima di avere problemi indesiderati nella prossima istruzione
        }
        await addOrSubtractCalories(client, id, res.rows[0].data, -res.rows[0].calin, 0);
        return res.rows[0];
    });
}

//////////////////////////////////  ATTIVITA  /////////////////////////////////////////

//cerca tutte le attività di un utente la cui "data" è compresa in [from, to],
//ESTREMI INCLUSI
async function getRangeAttivita(id, from, to) {
    if (!from) from=MINFINITY;    //per sicurezza...
    if (!to) to=INFINITY;        //'''
    var res = await pool.query(
        "SELECT created, data, nome, calout, descrizione "+
        "FROM attivita "+
        "WHERE id=$1 AND $2<=data AND data<=$3;",
        [id, from, to]
    );
    return res.rows;
}

//ritorna tutte le attività di un utente dato il suo id
async function getAllAttivita(id) {
    return await getRangeAttivita(id, MINFINITY, INFINITY);
}

//crea una nuova attività per un utente
async function addAttivita(id, data, nome, calout, descrizione) {
    const [plusInsert, plusValues, plusParams] = generateInsertOptionals(data, descrizione);
    return await doTransaction(async (client) => {
        var res = await client.query(
            "INSERT INTO attivita(id, nome, calout"+plusInsert+") "+
            "VALUES ($1, $2, $3"+plusValues+") "+
            "RETURNING created, data, nome, calout, descrizione",
            [id, nome, calout].concat(plusParams)
        );
        await addOrSubtractCalories(client, id, res.rows[0].data, 0, calout);
        console.debug('Aggiuta '+nome);
        return res.rows[0];
    });
}

//modifica un'attività di un utente
async function editAttivita(id, ts, data, nome, calout, descrizione) {
    var vecch = await pool.query(   //non modifica nulla, non fa parte della transazione
        "SELECT * "+
        "FROM attivita "+
        "WHERE id=$1 AND created=$2;",
        [id, ts]
    );
    if (vecch.rows.length<1) {
        return undefined;    //se non troviamo nulla è meglio che smettiamo subito prima di avere problemi indesiderati durante la transazione
    }
    const [plusSet, plusParams] = generateUpdateOptionals(data, descrizione);
    return await doTransaction(async client => {
        var nuov = await client.query(
            "UPDATE attivita "+
            "SET nome=$3, calout=$4"+plusSet+" "+
            "WHERE id=$1 AND created=$2 "+
            "RETURNING created, data, nome, calout, descrizione;",
            [id, ts, nome, calout].concat(plusParams)
        );
        await addOrSubtractCalories(client, id, vecch.rows[0].data, 0, -vecch.rows[0].calout);
        await addOrSubtractCalories(client, id, nuov.rows[0].data, 0, nuov.rows[0].calout);

        return nuov.rows[0];
    });
}

//elimina un'attività dati id dell'utente e timestamp di creazione
async function deleteAttivita(id, ts) {
    return await doTransaction(async client => {
        var res = await client.query(
            "DELETE FROM attivita "+
            "WHERE id=$1 AND created=$2 "+
            "RETURNING created, data, nome, calout, descrizione;",
            [id, ts]
        );
        if (res.rows.length<1) {
            return undefined;    //se non troviamo nulla è meglio che smettiamo subito prima di avere problemi indesiderati nella prossima istruzione
        }
        await addOrSubtractCalories(client, id, res.rows[0].data, 0, -res.rows[0].calout);
        return res.rows[0];
    });
}


/////////////////////////////////////// INFO ADDIZIONALI //////////////////////////////////////

//restituisce una info addizionale o tutte, in base al parametro what.
//esso viene concatenato direttamente alla query, ma è solo un parametro di servizio.
//bisogna assicurarsi che IL SUO VALORE NON VENGA MAI SCELTO DALL'UTENTE.
//non ne ho intenzione, ma quest'avvertimento resta per il futuro.
async function getAdditionalInfo(id, what) {
    var res = await pool.query(
        "SELECT "+what+" "+
        "FROM infoAddizionali "+
        "WHERE id=$1",
        [id]
    );
    
    /* //DEBUG
    console.log("DB result: "+JSON.stringify(res.rows[0])); */
    return res.rows[0];
}

//modifica più info addizionali in un colpo solo
//solo le info passate nell'argomento verranno modificate
//l'argomento è un oggetto che contiene coppie nome_info:nuovo_valore_info
//in teoria si può usare null per cancellare un'info in questo modo,
//ma non è ortodosso a livello di API (e il gestore di PATCH [...]/profile non lo consente)
//ancora, i nomi_info verranno concatenati direttamente alla query,
//ma sono solo parametri di servizio.
//per evitare sbagli futuri: NON LASCIARLI DECIDERE ALL'UTENTE!
async function editAdditionalInfo(id, args) {
    const [plusSet, plusParams] = generateUpdateOptionalsGeneric(args, 2, false);
    var res = await pool.query(
        "UPDATE infoAddizionali "+
        "SET "+plusSet+" "+
        "WHERE id=$1 "+
        "RETURNING * ",
        [id].concat(plusParams)
    );
    return res.rows[0];
}

//rimuove una info addizionale, quella indicata dal parametro what.
//esso viene concatenato direttamente alla query, ma è solo un parametro di servizio.
//bisogna assicurarsi che IL SUO VALORE NON VENGA MAI SCELTO DALL'UTENTE.
//non ne ho intenzione, ma quest'avvertimento resta per il futuro.
async function deleteOneAdditionalInfo(id, what) {
    var vecch = await pool.query(
        "SELECT "+what+" "+
        "FROM infoAddizionali "+
        "WHERE id=$1;",
        [id]
    );
    await pool.query(
        "UPDATE infoAddizionali "+
        "SET "+what+"=null "+
        "WHERE id=$1",
        [id]
    );
    return vecch.rows[0];
}











////////////////////////////////////  OPINIONI  //////////////////////////////////////////

//aggiunge una nuova opinione al database
//ritorna la riga appena aggiunta (anche se forse non serve)
async function addOpinione(email, testo) {
    var res = await pool.query(
        "INSERT INTO opinioni(email, testo) "+
        "VALUES ($1, $2)"+
        "RETURNING email, testo;",
        [email, testo]
    );
    return res.rows[0];
}







/////////////////////////////    AUX    /////////////////////////////

//aggiunge calinMod e caloutMod alla misura di calorie con id e data specificati
//(usare numeri negativi per sottrarre, 0 per lasciare una componente com'è)
//se quella misura non esiste, la crea
//restituisce il nuovo stato della riga, se mai dovesse servire
//l'oggetto che fa la query è parametrizzato pr funzionare correttamente con doTransaction
//se a seguito dell'operazione non ci sono più calorie ingerite né consumate,
//la riga viene considerata inutile e cancellata.
async function addOrSubtractCalories(agent, id, data, calinMod, caloutMod) {
    var res = await agent.query(
        "UPDATE misuraCalorie "+
        "SET calin=calin+$3, calout=calout+$4 "+   //testato sulla nostra shell che postgres (e JS, e persino python) si comporta bene con comandi del tipo "calin=calin+-100". Da umano è una sintassi strana, ma in effetti per un albero sintattico non fa una piega.
        "WHERE id=$1 AND data=$2 "+
        "RETURNING data, calin, calout;",
        [id, data, calinMod, caloutMod]
    );
    if (res.rows.length<1) {    //allora non è stata modificata alcuna riga, quindi quella riga non esisteva: bisogna crearla
        res = await agent.query(
            "INSERT INTO misuraCalorie(id, data, calin, calout) "+
            "VALUES ($1, $2, $3, $4) "+
            "RETURNING data, calin, calout;",
            [id, data, calinMod, caloutMod]
        );
    }
    if (res.rows[0].calin==0 && res.rows[0].calout==0) {   //allora è il caso di cancellare questa riga
        res = await agent.query(
            "DELETE FROM misuraCalorie "+
            "WHERE id=$1 AND data=$2 "+
            "RETURNING data, calin, calout;",
            [id, data]
        );
    }
    return res.rows[0];
}

//fa una transazione che esegue le istruzioni date, restituendo l'eventuale valore di ritorno.
//body deve essere una funzione async che prende come argomento il client che farà la transazione.
async function doTransaction(body) {
    //uso un client specifico per la transazione secondo quanto indicato dal tutorial node-postgres
    //https://node-postgres.com/features/transactions
    //e poi così mi sento un pochino più sicuro nel caso di più transazioni di qusto tipo fatte in concorrenza/parallelo.
    const client = await pool.connect();
    try {
        await client.query("BEGIN;");
        var toReturn = await body(client);
        await client.query("COMMIT;");
        return toReturn;
    } catch (err) {
        await client.query("ROLLBACK;");
        throw err;
    } finally {
        client.release();
    }
}

//genera stringhe e array da aggiungere alle query INSERT per cibo e attività per gestire
//correttamente i parametri opzionali (pg non ha una keyword DEFAULT da usare, purtroppo).
//questa funzione è estremamente specifica e, allo stato attuale, NON PORTABILE
//è una funzione solo perché viene usata IDENTICA in cibo e attività
function generateInsertOptionals(data, descrizione) {
    const plusInsert = (data ? ", data" : "") + (descrizione ? ", descrizione" : "");
    const plusValues = (data||descrizione ? ", $4": "") + (data&&descrizione ? ", $5": "");
    const plusParams = [data, descrizione].filter(i=>i);  //prende i non-undefined
    return [plusInsert, plusValues, plusParams];
}

//genera stringhe e array da aggiungere alle query UPDATE per cibo e attività per gestire
//correttamente i parametri opzionali (pg non ha una keyword DEFAULT da usare, purtroppo).
//questa funzione è estremamente specifica e, allo stato attuale, NON PORTABILE
//è una funzione solo perché viene usata IDENTICA in cibo e attività
//se vogliamo provare a farne una versione generica, forse potremmo considerare il ciclo for...in
//per poter passare un oggetto come parametro e iterare sulle sue proprietà...
function generateUpdateOptionals(data, descrizione) {
    const theArray = [[data, ", data"], [descrizione, ", descrizione"]].filter(a=>a[0]);  //prende i non-undefined
    const plusParams = theArray.map(a=>a[0]);
    const nomi = theArray.map(a=>a[1]);
    const dollari = ["=$5", "=$6"];
    // adesso facciamo praticamente una specie di zip di nomi e dollari
    var plusSet = "";
    for (let i=0; i<nomi.length; i++) {
        plusSet += nomi[i] + dollari[i];
    }
    return [plusSet, plusParams];
}

//come quella sopra, ma generica.
//passare come parametro un oggetto con nome_proprietà:valore_proprietà
//per ogni proprietà da modificare.
//startFrom è il numero da cui cominciare per generare i placeholder $
//per i parametri di node-postgres. (è meglio che gli opzionali siano gli ultimi)
//startWithComma è un booleano che indica se la stringa plusSet dovrà cominciare con una virgola
//o no. Usare false se non si sono altre assegnazioni nella SET originale, true se invece
//quelle restituite da questa funzione saranno le prime.
//TODO una volta accertato che funziona, tradurre quella in funzione di questa
function generateUpdateOptionalsGeneric(args, startFrom, startWithComma) {
    var i = startFrom;
    var plusSet = startWithComma ? ", " : "";
    var plusParams = [];
    for (name in args) {
        plusSet += `${name}=$${i}, `;
        i++;
        const val = args[name];
        plusParams.push(val);
    }
    //elimina gli ultimi due caratteri (saranno sempre ", " (a meno che la stringa non sia vuota, nel qual caso si riotterrà al stringa vuota))
    plusSet = plusSet.slice(0, -2);
    return [plusSet, plusParams];
}

















/* FUNZIONI USATE PER I TEST */

//crea un nuovo utente nel DB di test
async function newUser(email, username, password) {
    try {
        var res = await pool.query("INSERT INTO utente(email, username, password) VALUES ($1, $2, $3);",
                                    [email, username, password]);
        console.log("insert "+username+" in utente: "+res.rows);
    } catch(err) {
        console.error("newUser("+username+","+password+"): "+err.stack);
    }
}

//ritorna username se l'utente esuste altrimenti null
async function getUsernameIfExists(id) {
    var queryRes = await pool.query("SELECT * FROM utente WHERE id=$1", [id]);
    if (queryRes.rows.length<1) {
        return null;
    }
    return queryRes.rows[0].username;
}

//ritorna l'id se lutente esiste alrimenti null
async function getId(username) {
    var queryRes = await pool.query("SELECT * FROM utente WHERE username=$1", [username]);
    if (queryRes.rows.length<1) {
        throw new Error("getId "+username+": L'utente non esiste");
    }
    return queryRes.rows[0].id;
}

//aggiunge/modifica una misura di peso di un utente in una data
//TODO mettere id come parametro, non username
async function setPeso(username, data, peso) {
    var id;
    try {
        id = await getId(username);
    } catch (err) {
        return "setPeso: "+err.message;
    }
    var queryRes = await pool.query("SELECT * FROM misuraPeso WHERE id=$1 AND data=$2", 
                                    [id, data]);
    if (queryRes.rows.length<1) {
        let res = await pool.query("INSERT INTO misuraPeso VALUES ($1,$2,$3)", 
                                   [id, data, peso]);
        return "setPeso "+id+": "+res.rows+"(insert)";
    }
    let res =  await pool.query("UPDATE misuraPeso SET peso=$3 "+
                                                  "WHERE id=$1 AND data=$2",
                                [id, data, peso]);
    return "setPeso "+id+": "+res.rows+"(update)";
}

//aggiunge/modifica una misura di calorie di un utente in una data
//TODO mettere id come parametro, non username
async function setCalorie(username, data, calin, calout) {
    var id;
    try {
        id = await getId(username);
    } catch (err) {
        return "setCalorie: "+err.message;
    }
    var queryRes = await pool.query("SELECT * FROM misuraCalorie WHERE id=$1 AND data=$2", 
                                    [id, data]);
    if (queryRes.rows.length<1) {
        let res = await pool.query("INSERT INTO misuraCalorie VALUES ($1,$2,$3,$4)", 
                                   [id, data, calin, calout]);
        return "setCalorie "+id+": "+res.rows+"(insert)";
    }
    let res =  await pool.query("UPDATE misuraCalorie SET calin=$3, calout=$4 "+
                                                  "WHERE id=$1 AND data=$2",
                                [id, data, calin, calout]);
    return "setCalorie "+id+": "+res.rows+"(update)";
}

module.exports = {

    //Costanti
    INFINITY,
    MINFINITY,

    //Funzioni definitive
    addUser,
    getUserByName,
    getUserById,
    getRangeMisurePeso,
    getAllMisurePeso,
    getOneMisuraPeso,
    addMisuraPeso,
    editMisuraPeso,
    deleteMisuraPeso,
    getRangeMisureCalorie,
    getAllMisureCalorie,
    getRangeCibi,
    getAllCibi,
    addCibo,
    editCibo,
    deleteCibo,
    getRangeAttivita,
    getAllAttivita,
    addAttivita,
    editAttivita,
    deleteAttivita,
    getAdditionalInfo,
    editAdditionalInfo,
    deleteOneAdditionalInfo,
    addOpinione,
    
    //Funzioni test
    getId,
    newUser,
    setCalorie,
    setPeso,
}

//shell();