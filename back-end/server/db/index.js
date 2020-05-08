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


/////////////////////////////////////  UTENTI  /////////////////////////////////////////

//aggiunge un nuovo utente al database
async function addUser(username, password) {
    await pool.query("INSERT INTO utente(username, password) VALUES ($1, $2);",[username, password]);
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

//ritorna tutte le misure peso di un utente dato il suo id
async function getAllMisurePeso(id) {
    if (!(await getUsernameIfExists(id))) {
        return null;
    }
    var queryRes = await pool.query("SELECT data as data, peso as peso "+
                                    "FROM misuraPeso WHERE id=$1", [id]);
    return queryRes.rows;
}

//restituisce una misura peso di un utente dati id utente e data in cui è stata effettuata
//credevo che servisse per una cosa, ma invece mi sbagliavo.
//la lascio perché a livello di interfaccia col DB è una cosa che potremmo volere in futuro.
async function getOneMisuraPeso(id, data) {
    if (!(await getUsernameIfExists(id))) {
        return null;
    }
    var queryRes = await pool.query("SELECT data as data, peso as peso "+
                                    "FROM misuraPeso WHERE id=$1 AND data=$2", [id, data]);
    return queryRes.rows[0];
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


//////////////////////////////////  CIBO  /////////////////////////////////////////

//ritorna tutti i cibi di un utente dato il suo id
async function getAllCibi(id) {
    var res = await pool.query(
        "SELECT created, nome, quantita, calin "+
        "FROM cibo "+
        "WHERE id=$1",
        [id]
    );
    return res.rows;
}

//crea un nuovo cibo per un utente
async function addCibo(id, nome, quantita, calin) {
    return await doTransaction(async (client) => {
        var res = await client.query(
            "INSERT INTO cibo(id, nome, quantita, calin) "+
            "VALUES ($1, $2, $3, $4) "+
            "RETURNING created, nome, quantita, calin",
            [id, nome, quantita, calin]
        );
        await addOrSubtractCalories(client, id, res.rows[0].created, calin, 0);  //a quanto pare (non testato a sufficienza) ci pensa node-postgres a convertire un timestamp data-ora in solo data
        return res.rows[0];
    });
}

//modifica un cibo di un utente
async function editCibo(id, ts, nome, quantita, calin) {
    var vecch = await pool.query(   //non modifica nulla, non fa parte della transazione
        "SELECT * "+
        "FROM cibo "+
        "WHERE id=$1 AND created=$2;",
        [id, ts]
    );
    if (vecch.rows.length<1) {
        return undefined;    //se non troviamo nulla è meglio che smettiamo subito prima di avere problemi indesiderati durante la transazione
    }
    return await doTransaction(async client => {
        var nuov = await client.query(
            "UPDATE cibo "+
            "SET nome=$3, quantita=$4, calin=$5 "+
            "WHERE id=$1 AND created=$2 "+
            "RETURNING created, nome, quantita, calin;",
            [id, ts, nome, quantita, calin]
        );
        await addOrSubtractCalories(client, id, ts, nuov.rows[0].calin-vecch.rows[0].calin, 0);
        return nuov.rows[0];
    });
    
}

//elimina un cibo dati id dell'utente e timestamp di creazione
async function deleteCibo(id, ts) {
    return await doTransaction(async client => {
        var res = await client.query(
            "DELETE FROM cibo "+
            "WHERE id=$1 AND created=$2 "+
            "RETURNING created, nome, quantita, calin;",
            [id, ts]
        );
        if (res.rows.length<1) {
            return undefined;    //se non troviamo nulla è meglio che smettiamo subito prima di avere problemi indesiderati nella prossima istruzione
        }
        await addOrSubtractCalories(client, id, ts, -res.rows[0].calin, 0);
        return res.rows[0];
    });
}





/////////////////////////////    AUX    /////////////////////////////

//aggiunge calinMod e caloutMod alla misura di calorie con id e data specificati
//(usare numeri negativi per sottrarre, 0 per lasciare una componente com'è)
//se quella misura non esiste, la crea
//restituisce il nuovo stato della riga, se mai dovesse servire
//l'oggetto che fa la query è parametrizzato pr funzionare correttamente con doTransaction
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

async function getMisureCalorie(id) {
    if (!(await getUsernameIfExists(id))) {
        return null;
    }
    var queryRes = await pool.query("SELECT data as data, calin as calin, calout as calout, "+
                                    "(calin-calout) as bilancio FROM misuraCalorie WHERE id=$1", [id]);
    return queryRes.rows;
}

module.exports = {

    //Funzioni definitive
    addUser,
    getUserByName,
    getUserById,
    getAllMisurePeso,
    getOneMisuraPeso,
    addMisuraPeso,
    editMisuraPeso,
    deleteMisuraPeso,
    getAllCibi,
    addCibo,
    editCibo,
    deleteCibo,
    
    //Funzioni test
    getId,
    newUser,
    setCalorie,
    setPeso,
    getMisureCalorie,
}

//shell();