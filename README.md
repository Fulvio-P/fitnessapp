# FitnessApp

## Scopo del progetto
FitnessApp è una web application che permette di monitorare il proprio bilancio calorico, allenamenti e peso. Dopo essersi registrato e aver eseguito il login l'utente può usare l'interfaccia web per inserire alimenti che ha mangiato, le attività che ha svolto e il proprio peso per il giorno corrente, dopodichè potrà visualizzare grafici per calorie e peso e un diario che raccoglie tutti i pasti e gli allenamenti.

FitnessApp può anche essere integrato con altri progetti: sono fornite API che permettono di recuperare, modificare e inserire dati per gli utenti. Dato che si tratta di informazioni private le API esposte usano oAuth2 nella modalità implicit grant. Per usare le API è necessario un account FitnessApp e registrare la propria applicazione nella sezione sviluppatori del profilo. Il token emesso con la procedura oAuth ha delle limitazioni e non permette di accedere ai dati delle applicazioni registrate, nè di cancellare gli account degli utenti.

## Tecnologie utilizzate
FitnessApp è diviso in due moduli: il back-end scritto in Node si occupa di gestire i dati, mentre il front-end scritto in Vue si occupa della visualizzazione.

Il back-end usa richieste HTTP secondo il paradigma REST per comunicare con Open Food Facts dal quale recupera informazioni nutrizionali e Fitbit da cui legge i dati sulle attività dell'utente. L'accesso ai dati Fitbit è ottenuto utilizzando oAuht nella modalità Authorization Code Grant. A sua volta il back-end espone una varietà di endpoint REST protette mediante l'utilizzo di JSON Web Token. Sono forniti due tipi di token: quelli interni (Internal Token) sono usati solo per la comunicazione con il front-end, mentre quelli esterni (External Token) sono inviati alle applicazioni registrate mediante una procedura oAuth di tipo Implicit Grant, entrambi i tipi di token sono validi per 5 ore. Infine il back-end espone anche una Websocket usata per accettare richieste di importare dati delle attività Fitbit che vengono eseguite in modo asincrono. Tutti i dati sono inviati e coservati a un database relazionale PostgreSQL che ai fini di test è stato istanziato in un container Docker, prima di essere salvate le password vengono cifrate.

Il front-end è una single-page application in cui tutto il codice è iniettato in una sola pagina HTML da Vue e in base alle azioni dell'utente singole componenti vengono visualizzate, nascoste o aggiornate. Il codice sorgente è reso modulare attraverso l'uso di Vue CLI che permette di avere file.vue che descrivono ognuno una componente con una struttura in HTML, una logica JavaScript e uno stile CSS. Oltre che a componenti create da zero con il solo uso di questi tre linguaggi ce ne sono altre importate dalla libreria BootStrap. Il front-end comunica con il back-end attraverso chiamate HTTP secondo il paradigma REST usando la tecnologia OpenID per validare le richieste a dati privati e con Websocket per l'aggionamento asincrono dei dati di Fitbit. Tutte le parti del front-end hanno un design responsivo e vengono visualizzate in modo diverso su PC, tablet e mobile a seconda delle dimensioni dello schermo.

## Come scaricare e provare il progetto
Per scaricare il progetto si può clonare la repository con git, per farlo è sufficiente posizionarsi da terminale nella cartella in cui si vuole scaricare il codice ed eseguire
```bash
git clone https://github.com/Fulvio-P/fitnessapp.git
```
### Dipendenze
Per eseguire correttamente il codice è necessario avere installato **Node**, per installare tutte le altre dipendenze del progetto occorre anche **npm**. Una volta scaricato npm posizionarsi nella cartella fitnessapp/backend-end ed eseguire 
```bash
npm install
```
poi ripetere la stessa operazione nella cartella fitnessapp/front-end.

Dopo aver installato correttamente tutte le dipendenze occorre creare in un container Docker una istanza di PostgreSQL e configurare il file .env nella cartella back-end con le opportune credenziali.
Per installare il container docker assicurarsi che dockerd sia attivo con il comando
```bash
sudo dockerd
```
poi per scaricare l'immagine e creare il container eseguire in un altro terminale
```bash
sudo docker run -d --name elefante -v /var/lib/postgresql/data:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=prova postgres
```
e per permettere all'applicazione di connettersi creare nella cartella fitnessapp/back-end un file di nome .env che contanga il seguente codice
```
PGUSER='admin'
PGPASSWORD='pass'
PGDATABASE='prova'
PGHOST='localhost'
PGPORT=5432
```

Adesso che il database è stato configurato sempre nel file .env appena creato è necessario aggiungere delle altre variabili di ambiente
```
JWT_SECRET='secret'

FITBIT_ID=CLIENT_ID
FITBIT_SEC=CLIENT_SECRET
```
Il valore di JWT_SECRET può essere deciso arbitrariamente ed è la chiave che FitnessApp userà per firmare i JSON Web Token che proteggono gli endpoint REST. Le altre due variabili invece sono fornite da Fitbit e servono per la procedura oAuth. Per ottenerle bisogna eseguire il login nel sito Fitbit e nella sezione sviluppatori registrare FitnessApp con rerdirect URL 
<!-- TODO: aggiornare il link post build -->
```
http://localhost:8080/profile
```
Infine è necessario creare un ulteriore file .env nella catella fitenssapp/front-end e impostare la variabile di ambiente con lo stesso codice ottenuto da Fitbit
```
VUE_APP_FITBIT_ID=CLIENT_ID
```
quindi sempre nella cartella fitenssapp/front-end costruire il codice ottimizzato con il comando
```
npm run build
```

### Avviare l'applicazione 
Una volta che tutto è stato configurato occorre avviare il container del database e i server node.

Per avviarre il container eseguire
```bash
sudo docker start elefante
```
Dopodichè per inizializzare il database posizionarsi nella cartella fitnessapp/back-end ed eseguire
```bash
node server/db/dev-stuff.js
```
Nella shell interattiva digitare CT per creare il database con gli utenti di prova.
(NB: una volta inizializzato il database sarà salvato e non ci sarà bisogno di ricrearlo, per distruggere, resettare o navigare il database usare gli altri comandi, la shell va chiusa con Ctrl+C dopo l'esecuzione di qualsiasi comando prima di poterne eseguire uno nuovo)

Per avviare il server API posizionarsi nella cartella back-end ed eseguire
```
npm run start
```

Per avviare il server che distribuisce la pagina web posizionarsi nella cartella front-end ed eseguire
```bash
node deploy.js
```

Quindi per iniziare a utilizzare FitnessApp connettersi con un browser all'indirizzo
```
http://localhost:8080
```

## Documentazione

### API REST

La documentazione è inclusa in formato JSON nella cartella reference di questo repository ed è consultabile in formato human-readable alla seguente URL:
```
https://stoplight.io/p/docs/gh/fulvio-p/fitnessapp/reference/FitnessApp.v1.json
```

I corpi di richiesta e risposta, se presenti, sono sempre in JSON.

### Websocket

Il server back-end mette a disposizione una Websocket per ricevere richieste di sincronizzazione delle attività dell'account FitBit collegato e comunicare il completamento di tale operazione. La Websocket è disponibile all'URL ```ws://localhost:5000/ws/fitbitsync```.

Per potersi autenticare, è necessario inviare un token valido come parametro di query chiamato "token". Quindi, l'indirizzo completo a cui connettersi assume questa forma:
```
ws://localhost:5000/ws/fitbitsync?token=<token>
```
Se l'autenticazione fallisce, il server rigetta la connessione inviando oggetto JSON con "type":"error", se invece l'autenticazione riesce, l'handshake si conclude semplicemente con successo e il server si mette in ascolto di ulteriori messaggi.

L'unico tipo di messaggio accettato dal server è un oggetto JSON con la proprietà "action":"fitbitsync". Messaggi diversi generano un errore.

Quando il server riceve un messaggio fitbitsync, esso invia un acknowledgement nella forma di un oggetto JSON con la proprietà "type":"info" e prende in carico l'operazione di sincronizzazione delle attività dell'account FitBit collegato all'utente a cui appartiene il token usato per l'autenticazione. Il successo o fallimento dell'operazione viene comunicato tramite un successivo messaggio lungo la stessa Websocket, formattato ancora una volta come un JSON dove la proprietà "type" avrà, rispettivamente, valore "success" o "error".

Una volta che l'autenticazione ha avuto successo, la Websocket rimane aperta e disponibile finché il client non decide di chiuderla.

## Testare l'applicazione
Dopo essersi collegati all'applicazione è possibile registrarsi con il modulo in fondo alla landing page oppure accedere con uno degli account di test.

| Username            | Password    | Note                    |
|---------------------|-------------|-------------------------|
| AkihikoSanada       | polydeuces  | Utente completo         |
| CassiusBright       | estelle1186 | Solo misure di peso     |
| ChieSatonaka        | tomoe       | Solo misure di calorie  |
| EdelgardVonHresvelg | blackeagle  | Un record di ogni campo |

<!-- 
## TODO controllare/riscrivere questa parte quando sappiamo che tipo di test vuole Vit
<!-- Poi cancellare quest'intestazione 

[Per avere un token ...]

Ciascuna API REST della documentazione (vedi sopra) può essere testata configurando la richiesta corrispondente su un client REST come Postman, avendo cura di includere il token fornito [...] nell'header Authorization (formato: ```Bearer <token>```).

Se la richiesta richiede un corpo, la documentazione contiene almeno un esempio per ogni richiesta, pronto per essere copiato e incollato direttamente nel corpo della richiesta corrispondente.

Se la richiesta richiede uno o più parametri nel path, i valori dipendono dai dati con cui si ha effettivamente a che fare: si consiglia di fare prima una GET senza parametri di path sullo stesso endpoint per avere un'idea di quali valori usare. -->