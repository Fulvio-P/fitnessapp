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

//TODO: tabella calorie

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

async function getId(username) {
    var queryRes = await pool.query("SELECT * FROM utente WHERE username=$1", [username]);
    if (queryRes.rows.length<1) {
        throw new Error("getId "+username+": L'utente non esiste");
    }
    return queryRes.rows[0].id;
}

//aggiunge/modifica una misura di peso di un utente in una data
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

/*
Inizializza le tabelle di un DB di test.
Ovviamente una funzione del genere non può esistere in produzione, ma in qualche modo
devo partire.
*/
async function initDB() {
    console.log("N.B: Avere risposte vuote per insert/update è buon segno!");
    await pool.query("CREATE TABLE utente ("+
                        "id SERIAL PRIMARY KEY, "+
                        "username VARCHAR(50) UNIQUE NOT NULL, "+
                        "password VARCHAR(50) NOT NULL);"
    );
    await pool.query("CREATE TABLE misuraPeso ("+
                        "id integer NOT NULL REFERENCES utente(id), "+
                        "data DATE NOT NULL DEFAULT CURRENT_DATE, "+    //DATE è solo giorno, senza ora, e con questo DEFAULT possiamo prendere in automatico la data corrente.
                        "peso NUMERIC NOT NULL, "+
                        "PRIMARY KEY (id, data));"    //solo una misurazione al giorno per utente
    );
    await pool.query("CREATE TABLE misuraCalorie ("+
                        "id integer NOT NULL REFERENCES utente(id), "+
                        "data DATE NOT NULL DEFAULT CURRENT_DATE, "+
                        "calin NUMERIC NOT NULL DEFAULT 0, "+
                        "calout NUMERIC NOT NULL DEFAULT 0, "+
                        "PRIMARY KEY (id, data));"
    );
    await newUser("AkihikoSanada", "polydeuces");
    await newUser("ChieSatonaka", "tomoe");
    await newUser("EdelgardVonHresvelg", "blackeagle");
    console.log(await setPeso("AkihikoSanada", new Date("2020-04-25"), 80));
    console.log(await setPeso("AkihikoSanada", new Date("2020-04-26"), 70));
    console.log(await setPeso("AkihikoSanada", new Date("2020-04-27"), 75));
    console.log(await setPeso("EdelgardVonHresvelg", new Date("2020-04-27"), 60.005));
    console.log(await setPeso("LukeTriton", new Date("2020-04-27"), 50));   //no utente
    console.log(await setCalorie("ChieSatonaka", new Date("2020-04-25"), 100, 100));
    console.log(await setCalorie("ChieSatonaka", new Date("2020-04-26"), 50, 0));
    console.log(await setCalorie("ChieSatonaka", new Date("2020-04-27"), 0, 60));
    console.log(await setCalorie("EdelgardVonHresvelg", new Date("2020-04-27"), 150.25, 200));
    console.log(await setCalorie("JunpeiIori", new Date("2020-04-27"), 0, 0));   //no utente
}

//cancella le tabelle del DB, per permettermi di ricominciare da capo
//ancora, è una funzione irrealistica che mi serve per giocare un po'
async function destroyDB() {
    try {
        await pool.query("DROP TABLE misuraPeso;");
    } catch (err) {
        ;
    }
    try {
        await pool.query("DROP TABLE misuraCalorie;");
    } catch (err) {
        ;
    }
    try {
        await pool.query("DROP TABLE utente;");
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