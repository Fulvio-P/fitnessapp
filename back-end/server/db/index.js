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
        var res = await pool.query("INSERT INTO accesso(username, password) VALUES ($1, $2);",
                                    [username, password]);
        console.log("insert "+username+" in accesso: "+res.rows);
        res = await pool.query("INSERT INTO nutrizione(username) VALUES ($1);", [username]);
        console.log("insert "+username+" in nutrizione: "+res.rows);
    } catch(err) {
        console.error("newUser("+username+","+password+"): "+err.stack);
    }
}

//imposta i valori di nutrizione di un utente se la sua password è corretta
async function setNutrition(username, password, zuccheri, proteine, grassi) {
    var queryRes = await pool.query("SELECT * FROM accesso WHERE username=$1", [username]);
    if (queryRes.rows.length<1) {
        return "setNutrition "+username+": L'utente non esiste";
    }
    if (queryRes.rows[0].password!=password) {
        return "setNutrition "+username+": Password sbagliata";
    }
    queryRes = await pool.query("SELECT * FROM nutrizione WHERE username=$1", [username]);
    if (queryRes.length<1) {
        let res = await pool.query("INSERT INTO nutrizione VALUES ($1,$2,$3,$4)", 
                        [username, zuccheri, proteine, grassi]);
        return "setNutrition "+username+": "+res.rows+"(insert)";
    }
    let res =  await pool.query("UPDATE nutrizione SET username=$1, "+
                                                        "carboidrati=$2, "+
                                                        "proteine=$3, "+
                                                        "grassi=$4"+
                                                "WHERE username=$1",
                                [username, zuccheri, proteine, grassi]);
    return "setNutrition "+username+": "+res.rows+"(update)";
}

/*
Inizializza le tabelle di un DB di test.
Ovviamente una funzione del genere non può esistere in produzione, ma in qualche modo
devo partire, e in più mi alleno con la libreria di postgres.
Questo DB avrà due tabelle molto semplici, per il solo gusto di averne due.
Vedremo poi quante e quali tabelle ci servono.
*/
async function initDB() {
    console.log("N.B: Avere risposte vuote per insert/update è buon segno!");
    await pool.query("CREATE TABLE accesso ("+
                        "username VARCHAR(50) PRIMARY KEY, "+
                        "password VARCHAR(50) NOT NULL);"
    );
    await pool.query("CREATE TABLE nutrizione ("+
                        "username VARCHAR(50) PRIMARY KEY REFERENCES accesso(username), "+
                        "carboidrati NUMERIC NOT NULL DEFAULT 0, "+
                        "proteine NUMERIC NOT NULL DEFAULT 0, "+
                        "grassi NUMERIC NOT NULL DEFAULT 0);"
    );
    await newUser("AkihikoSanada", "polydeuces");
    await newUser("ChieSatonaka", "tomoe");
    await newUser("EdelgardVonHresvelg", "blackeagle");
    console.log(await setNutrition("AkihikoSanada", "polydeuces", 10, 1000, 5));   //ok
    console.log(await setNutrition("ChieSatonaka", "tomoe", 20, 20, 20));    //ok
    console.log(await setNutrition("EdelgardVonHresvelg", "blackeagle", 100, 10, 5));   //ok
    console.log(await setNutrition("ChieSatonaka", "jiraiya", 10000, 0, 10000));   //no password
    console.log(await setNutrition("LukeTriton", "puzzles<3", 10, 10, 10));   //no utente
}

//cancella le tabelle del DB, per permettermi di ricominciare da capo
//ancora, è una funzione irrealistica che mi serve per giocare un po'
async function destroyDB() {
    try {
        await pool.query("DROP TABLE nutrizione;");
    } catch (err) {
        ;
    }
    try {
        await pool.query("DROP TABLE accesso;");
    } catch (err) {
        ;
    }
}

//mi permette di scrivere interattivamente tutte le query che voglio
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function questionPromise(rl) {
    return new Promise((resolve, reject) => {
        rl.question("PG> ", ans=>{
            if (ans=="quit") {
                resolve(true);
            }
            else if (ans=="") {
                resolve(false);
            }
            else {
                pool
                    .query(ans)
                    .then(res=>{console.log(res.rows);resolve(false);})
                    .catch(err=>{console.error("shell query "+ans+": "+err.stack);resolve(false);})
            }
        });
    });
}
async function shell() {
    await destroyDB();   //resetta in caso il server sia crashato l'ultima volta
    try {
        await initDB();
    } catch(err) {
        console.error("crashato initDB:\n"+err.message);
        return;
    }
    var stop=false;
    while(!stop) {
        stop = await questionPromise(rl);
    }
    await destroyDB();
    rl.close();
}

shell();