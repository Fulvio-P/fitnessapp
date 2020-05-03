/*
Questo script non verrà usato dalla app.
Serve solo a noi sviluppatori per setuppare il DB.
E come documentazione delle tabelle che lo compongono.
Potrebbe (Dovrebbe) anche essere rimosso dalla versione finale.
*/

const index = require("./index");
const { Pool } = require("pg");
const pool = new Pool();

//Crea le tabelle del DB e le riempie coi dati di qualche utente di test.
async function initDB() {

    //Tabella utente TODO: modificare in modo che accetta le cose !
    console.log("N.B.: Avere risposte vuote per insert/update è buon segno!");
    await pool.query("CREATE TABLE utente ("+
                        "id SERIAL PRIMARY KEY, "+
                        "username VARCHAR(50) UNIQUE NOT NULL, "+
                        "password VARCHAR(50) NOT NULL);"
    );

    //Tabella peso
    await pool.query("CREATE TABLE misuraPeso ("+
                        "id integer NOT NULL REFERENCES utente(id), "+
                        "data DATE NOT NULL DEFAULT CURRENT_DATE, "+    //DATE è solo giorno, senza ora, e con questo DEFAULT possiamo prendere in automatico la data corrente.
                        "peso REAL NOT NULL, "+   //ha una precisione limitata (6 cifre decimali), ma non va convertito ogni volta da stringa a float
                        "PRIMARY KEY (id, data));"    //solo una misurazione al giorno per utente
    );


    //Tabella calorie
    await pool.query("CREATE TABLE misuraCalorie ("+
                        "id integer NOT NULL REFERENCES utente(id), "+
                        "data DATE NOT NULL DEFAULT CURRENT_DATE, "+
                        "calin REAL NOT NULL DEFAULT 0, "+
                        "calout REAL NOT NULL DEFAULT 0, "+
                        "PRIMARY KEY (id, data));"
    );



    
    
    //user di default
    await index.newUser("AkihikoSanada", "polydeuces");   //un utente completo, il protagonista dei test che andrò a fare sul frontend
    await index.newUser("CassiusBright", "estelle1184");  //ha misure di peso, non di calorie
    await index.newUser("ChieSatonaka", "tomoe");        //ha misure di calorie, non di peso
    await index.newUser("EdelgardVonHresvelg", "blackeagle");    //ha una misura di entrambi, e dimostra che il tipo NUMERIC accetta anche i decimali
    console.log(await index.setPeso("AkihikoSanada", new Date("2020-04-25"), 80));
    console.log(await index.setPeso("AkihikoSanada", new Date("2020-04-26"), 70));
    console.log(await index.setPeso("AkihikoSanada", new Date("2020-04-27"), 75));
    console.log(await index.setPeso("CassiusBright", new Date("2020-04-25"), 80));
    console.log(await index.setPeso("CassiusBright", new Date("2020-04-26"), 70));
    console.log(await index.setPeso("CassiusBright", new Date("2020-04-27"), 75));
    console.log(await index.setPeso("EdelgardVonHresvelg", new Date("2020-04-27"), 60.005));
    console.log(await index.setCalorie("AkihikoSanada", new Date("2020-04-25"), 100, 100));
    console.log(await index.setCalorie("AkihikoSanada", new Date("2020-04-26"), 50, 0));
    console.log(await index.setCalorie("AkihikoSanada", new Date("2020-04-27"), 0, 60));
    console.log(await index.setCalorie("ChieSatonaka", new Date("2020-04-25"), 100, 100));
    console.log(await index.setCalorie("ChieSatonaka", new Date("2020-04-26"), 50, 0));
    console.log(await index.setCalorie("ChieSatonaka", new Date("2020-04-27"), 0, 60));
    console.log(await index.setCalorie("EdelgardVonHresvelg", new Date("2020-04-27"), 150.25, 200));
}

//cancella le tabelle del DB, per permettere di ricominciare da capo se necessario
async function destroyDB() {
    try {
        await pool.query("DROP TABLE misuraPeso;");
    } catch (err) {
        console.error("errore destroyDB(misuraPeso): "+err.message);
    }
    try {
        await pool.query("DROP TABLE misuraCalorie;");
    } catch (err) {
        console.error("errore destroyDB(misuraCalorie): "+err.message);
    }
    try {
        await pool.query("DROP TABLE utente;");
    } catch (err) {
        console.error("errore destroyDB(utente): "+err.message);
    }
}



















////////////////////////////////////////////////////////////////////////////////////////////
/////Metto anche una shell interattiva in caso serva dare comandi arbitrari a postgres//////
////////////////////////////////////////////////////////////////////////////////////////////


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
    /*
    await destroyDB();   //resetta in caso il server sia crashato l'ultima volta
    try {
        await initDB();
    } catch(err) {
        console.error("crashato initDB:\n"+err.message);
        return;
    }
    */
    var stop=false;
    while(!stop) {
        stop = await questionPromise(rl);
    }
    //await destroyDB();
    rl.close();
}

async function main() {
    console.log("Cosa vuoi?\n1: Shell\n200: Crea\n30000: Distruggi\n40000: Reset\n50000: Reset->Shell->Distruggi");
    rl.question("PG> ", async (ans) => {
        const n = parseInt(ans);
        switch (n) {
            case 1:
                await shell();
                break;
            case 200:
                await initDB();
                break;
            case 30000:
                await destroyDB();
                break;
            case 40000:
                await destroyDB();
                await initDB();
                break;
            case 50000:
                await destroyDB();
                await initDB();
                await shell();
                await destroyDB();
                break;
            default:
                console.log("Numero non riconosciuto");
                break;
        }
    });
}

main();