/*
Questo script non verrà usato dalla app.
Serve solo a noi sviluppatori per setuppare il DB.
E come documentazione delle tabelle che lo compongono.
Potrebbe (Dovrebbe) anche essere rimosso dalla versione finale.
*/

const index = require("./index");
const bcrypt = require('bcryptjs');
const { Pool } = require("pg");
const pool = new Pool();

async function addTestUser(username, password, email, altezza) {
    /* Hashing della password */
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    await index.addUser(username, hashedPassword, email, altezza);
}

//Crea le tabelle del DB, se testUsers == true le popola con dati di alcuni utenti
async function initDB(testUsers) {

    //Tabella utente
    console.log("N.B.: Avere risposte vuote per insert/update è buon segno!");
    await pool.query("CREATE TABLE utente ("+
                        "id SERIAL PRIMARY KEY, "+
                        "username VARCHAR(50) UNIQUE NOT NULL, "+
                        "password VARCHAR(200) NOT NULL);"
    );

    //Tabella info addizionali
    await pool.query(
        "CREATE TABLE infoAddizionali ("+
            "id integer PRIMARY KEY REFERENCES utente(id), "+
            "email VARCHAR(300), "+           //sembra che il limite standard sia 254, e ci prendiamo un altro po' di spazio per buona misura
            "altezza SMALLINT, "+             //in centimetri (limite superiore: 32768)
            "fitbitToken VARCHAR(1024), "+    //i token fitbit possono essere fino a 1024 byte
            "fitbitRefresh VARCHAR(1024), "+
            "fitbitUser VARCHAR(100)"+        //non sono sicuro del limite per questo ma 100 caratteri dovrebbero essere abbastanza 
            //eventuali altre
            ");"
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

    //Tabella cibo
    await pool.query(
        "CREATE TABLE cibo ("+
            "id integer NOT NULL REFERENCES utente(id), "+
            "created TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "+
            //precisione al millisecondo per usare la stessa prec di JS
            "data DATE NOT NULL DEFAULT CURRENT_DATE, "+
            "nome VARCHAR(50) NOT NULL, "+
            "calin REAL NOT NULL DEFAULT 0, "+
            "descrizione VARCHAR(512) NOT NULL DEFAULT '', "+
            "PRIMARY KEY (id, created)"+
        ");"
    );

    //Tabella attività
    await pool.query(
        "CREATE TABLE attivita ("+
            "id integer NOT NULL REFERENCES utente(id), "+
            "created TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "+
            "data DATE NOT NULL DEFAULT CURRENT_DATE, "+
            "nome VARCHAR(50) NOT NULL, "+
            "calout REAL NOT NULL DEFAULT 0, "+
            "descrizione VARCHAR(512) NOT NULL DEFAULT '', "+
            "PRIMARY KEY (id, created)"+
        ");"
    );

    //Tabella opinioni
    await pool.query("CREATE TABLE opinioni ("+
                        "created TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "+
                        "email VARCHAR(50) NOT NULL, "+
                        "testo VARCHAR(512) NOT NULL DEFAULT '', "+
                        "PRIMARY KEY (created)"+
                    ");"
    );



    
    
    if(testUsers){
        //user di default
        await addTestUser("AkihikoSanada", "polydeuces", 'a.sanada@gekkoukan.edu', 175);   //un utente completo, il protagonista dei test che andrò a fare sul frontend
        await addTestUser("CassiusBright", "estelle1184");  //ha misure di peso, non di calorie
        await addTestUser("ChieSatonaka", "tomoe", 'c.satonaka@yasogami.edu');        //ha misure di calorie, non di peso
        await addTestUser("EdelgardVonHresvelg", "blackeagle", undefined, 158);    //ha una misura di entrambi, e dimostra che il tipo NUMERIC accetta anche i decimali
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
        //purtroppo non posso usare le funzioni che modificano pure le calorie
        //perché sono troppo veloci e le entry hanno tutte lo stesso timestamp
        await pool.query(
            "INSERT INTO cibo(id, created, data, nome, calin) VALUES "+
            "(1, '2020-05-01', '2020-05-01', 'pollo', 300), "+
            "(1, '2020-05-02', '2020-05-02', 'sushi', 250), "+
            "(1, '2020-05-03', '2020-05-03', 'uova', '350'), "+
            "(1, '2020-05-04', '2020-05-04', 'fagioli', 200), "+
            "(3, '2020-05-05', '2020-05-05', 'carne', 999), "+
            "(4, '2020-05-06', '2020-05-06', 'gratin veloce di pesce', 200.5);"
        );
        await pool.query(
            "INSERT INTO attivita(id, created, data, nome, calout) VALUES "+
            "(1, '2020-05-01', '2020-05-01', 'boxe', 200), "+
            "(1, '2020-05-02', '2020-05-02', 'tartarus',500), "+
            "(1, '2020-05-03', '2020-05-03', 'boxe', 200), "+
            "(1, '2020-05-04', '2020-05-04', 'tartarus', 500), "+
            "(1, '2020-05-05', '2020-05-05', 'boxe e tartarus (contemporaneamente)', 700), "+
            "(2, '2020-05-04', '2020-05-04', 'allenam. combatt. bastone con Estelle', 300), "+
            "(2, '2020-05-05', '2020-05-05', 'pesca con Joshua', 50), "+
            "(2, '2020-05-06', '2020-05-06', 'lavoro con la gilda', 400), "+
            "(3, '2020-05-01', '2020-05-01', 'kung fu', 200), "+
            "(3, '2020-05-04', '2020-05-04', 'esplorazione castello', 999), "+
            "(4, '2020-05-01', '2020-05-01', 'esercitazione ascia', 200.5), "+
            "(4, '2020-05-02', '2020-05-02', 'esercitazione comando', 200.5), "+
            "(4, '2020-05-03', '2020-05-03', 'esercitazione armatura', 200.5), "+
            "(4, '2020-05-04', '2020-05-04', 'allenamento con Byleth', 200.5), "+
            "(4, '2020-05-06', '2020-05-06', 'incarico mensile', 350.75);"
        );
        console.log("Tutto OK, Ctrl+C per uscire");
    }
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
        await pool.query("DROP TABLE cibo;");
    } catch (err) {
        console.error("errore destroyDB(cibo): "+err.message);
    }
    try {
        await pool.query("DROP TABLE attivita;");
    } catch (err) {
        console.error("errore destroyDB(attivita): "+err.message);
    }
    try {
        await pool.query("DROP TABLE infoAddizionali;");
    } catch (err) {
        console.error("errore destroyDB(infoAddizionali): "+err.message);
    }
    try {
        await pool.query("DROP TABLE utente;");
    } catch (err) {
        console.error("errore destroyDB(utente): "+err.message);
    }
    try {
        await pool.query("DROP TABLE opinioni;");
    } catch (err) {
        console.error("errore destroyDB(opinioni): "+err.message);
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
                    .catch(err=>{console.error("shell query "+ans+": [code "+err.code+"] "+err.stack);resolve(false);})
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
    console.log("Cosa vuoi?\nS: Shell\nC: Crea\nCT: Crea con user di test\nD: Distruggi\nR: Reset\nRT: Reset con user di test\nX: Reset->Shell->Distruggi");
    rl.question("PG> ", async (ans) => {
        switch (ans) {
            case 'S':
                await shell();
                break;
            case 'C':
                await initDB(false);
                break;
            case 'CT':
                await initDB(true);
                break;
            case 'D':
                await destroyDB();
                break;
            case 'R':
                await destroyDB();
                await initDB();
                break;
            case 'RT':
                await destroyDB();
                await initDB(true);
                break;
            case 'X':
                await destroyDB();
                await initDB(true);
                await shell();
                await destroyDB();
                break;
            default:
                console.log("Comando non riconosciuto");
                break;
        }
    });
}

main();