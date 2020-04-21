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

//crea un nuovo utente nel DB di test
async function newUser(username, password) {
    pool
        .query("INSERT INTO accesso(username, password) VALUES ($1, $2);", [username, password])
        .then(res=>console.log(res.rows[0]))
        .catch(err=>console.error(err.stack));
    pool
        .query("INSERT INTO nutrizione(username) VALUES ($1);", [username])
        .then(res=>console.log(res.rows[0]))
        .catch(err=>console.error(err.stack));
}

//imposta i valori di nutrizione di un utente se la sua password è corretta
async function setNutrition(username, password, zuccheri, proteine, grassi) {
    //TODO
}

/*
Inizializza le tabelle di un DB di test.
Ovviamente una funzione del genere non può esistere in produzione, ma in qualche modo
devo partire, e in più mi alleno con la libreria di postgres.
Questo DB avrà due tabelle molto semplici, per il solo gusto di averne due.
Vedremo poi quante e quali tabelle ci servono.
*/
async function initDB() {
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
}

//cancella le tabelle del DB, per permettermi di ricominciare da capo
//ancora, è una funzione irrealistica che mi serve per giocare un po'
async function destroyDB() {
    await pool.query("DROP TABLE accesso;");
    await pool.query("DROP TABLE nutrizione;");
}

//mi permette di scrivere interattivamente tutte le query che voglio
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function shell() {
    await initDB();
    var stop=false;
    while(!stop) {
        rl.question("PG> ", ans=>{
            if (ans==quit) {
                stop=true;
            }
            else {
                pool
                    .query(ans)
                    .then(res=>console.log(res.rows))
                    .catch(err=>console.error(err.stack));
            }
        });
    }
    await destroyDB();
    rl.close();
}

shell();

//per adesso ho ECONNREFUSED, continuo a testare un'altra volta