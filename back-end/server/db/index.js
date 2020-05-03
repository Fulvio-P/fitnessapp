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

//crea un nuovo utente nel DB di test
async function newUser(username, password) {
    try {
        var res = await pool.query("INSERT INTO utente(username, password) VALUES ($1, $2);",
                                    [username, password]);
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

async function getMisurePeso(id) {
    if (!(await getUsernameIfExists(id))) {
        return null;
    }
    var queryRes = await pool.query("SELECT data as data, peso as peso "+
                                    "FROM misuraPeso WHERE id=$1", [id]);
    return queryRes.rows;
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
    getId,
    newUser,
    setCalorie,
    setPeso,
    getMisurePeso,
    getMisureCalorie,
}

//shell();