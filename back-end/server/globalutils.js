/*Per funzioni che vanno usate in più punti del backend.*/

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

/**
 * Verifica un JWT e restituisce le info che contiene,
 * gestendo un po' d'errori nel frattempo.
 * Tutte le chiamate API devono usare questa funzione,
 * pressoché invariata.
 * L'ideale però sarebbe non necessitare affatto di questo file
 * e dover includere questa funzione solo una volta,
 * magari si possono mettere tutte le api che richiedono autorizzazione
 * sotto uno stesso path comune...
 */
function verifyJWT(req, res, next) {
    var token, decoded;
    try {
        const authHeader = req.headers.authorization || "";   //in questo modo anche se Authorization non viene fornito affatto l'esecuzione può comunque andare avanti e darci un messaggio d'errore di jwt
        token = authHeader.split(" ")[1];  //formato header = "Bearer TOKEN"
        decoded = jwt.verify(token, jwtSecret);
    }
    catch (err) {
        console.error(`jwt ${err.name}: ${err.message}`);   //non sono sicuro che vogliamo rimandare al client il messaggio d'errore di jwt
        if (err.name=="TokenExpiredError") {
            return res.status(401).send("Token Expired");
        }
        else {
            return res.status(401).send("Wrong Token or No token");
        }
    }
    //se va tutto bene...
    req.token=token;
    req.user=decoded;
    return next();
}

module.exports = {
    verifyJWT,
}