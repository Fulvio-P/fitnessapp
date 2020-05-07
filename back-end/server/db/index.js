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

//aggiunge una nuva misura di peso per la data odierna all'utente indicato
//restituisce la riga appena creata (senza id)
//non mi aspetto che vorremo rendere possibile aggiungere misure in altre date.
async function addMisuraPeso(id, peso) {
    var res = await pool.query(
        "INSERT INTO misurapeso(id, peso) "+
        "VALUES ($1, $2)"+
        "RETURNING data as data, peso as peso", [id, peso]
    );
    return res.rows[0];
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
    
    //Funzioni test
    getId,
    newUser,
    setCalorie,
    setPeso,
    getMisureCalorie,
}

//shell();