# FitnessApp

## Scopo del progetto
FitnessApp è una web application che permette di monitorare il proprio bilancio calorico, allenamenti e peso.
Dopo essersi registrati e aver eseguito il login l'utente può usare l'interrfaccia web per inserire alimenti che ha mangiato, le attività che ha svolto e il proprio peso per il giorno corrente, dopodichè potrà visualizzare grafici per calorie e peso e un diario che raccoglie tutti i pasti e gli allenamenti.

FitnessApp può anche essere integrato con altri progetti: sono fornite API che permettono di recuperare, modificare e inserire dati per gli utenti. Dato che si tratta di infromzioni private le API esposte usano oAuth2 nella modalità inplicit code grant. Per usare le API è necessario un account FitnessApp e registrare la propria applicazione nella sezione sviluppatori del profilo. Il token emesso con la procedura oAuth ha delle limitazioni e non permette di accedere ai dati delle applicazioni registrate, nè di cancellare gli account degli utenti.

## Tecnologie utilizzate
FitnessApp è diviso in due moduli: il back-end scritto in Node si occupa di gestire i dati, mentre il front-end scritto in Vue si occupa della visualizzazione.

Il back-end usa richieste HTTP secondo il paradigma REST per comunicare con Open Food Facts dal quale recupera informazioni nutrizionali e Fitbit da cui legge i dati sulle attività dell'utente. L'accesso ai dati Fitbit è ottenuto utilizzando oAuht nella modalità Authorization Code Grant. A sua volta il back-end espone una varietà di endpoint REST protette mediante l'utilizzo di JSON Web Token. Sono forniti due tipi di token: quelli interni (Internal Token) sono usati solo per la comunicazione con il front-end, mentre quelli esterni (External Token) sono inviati alle applicazioni registrate mediante una procedura oAuth di tipo Implicit Code Grant. Infine il back-end espone anche una Websocket usata per accettare richieste di sincronizzazione con Fitbit che vengono eseguite in modo asincrono nel mentre che l'utente fa altro. Tutti i dati sono inviati e coservati a un database relazionale PostgreSQL che ai fini di test è stato istanziato in un container Docker.

Il front-end è una single-page application in cui tutto il codice è iniettato in una singola pagina HTML da Vue e le in base alle azioni dell'utente singole componenti vengono visualizzate, nascoste o aggiornate. Il codice sorgente è reso modulare attraverso l'uso di Vue CLI che permette di avere file.vue che descrivono ognuno una componente con una struttura in HTML, una logica JavaScript e uno stile CSS. Oltre che a componenti create da zero con il solo uso di questi tre linguaggi ce ne sono altre importate dalla libreria BootStrap. Il front-end comunica con il back-end attraverso chiamate HTTP secondo il paradigma REST usando <!-- Da controllare --> la tecnologia OpenID per validare le richieste a dati privati e con Websocket per l'aggionamento asincrono dei dati di Fitbit.

## Come scaricare e provare il progetto
<!-- NB: questo va rivisto dopo la build definitiva -->
Per scaricare il progetto si può clonare la repository con git, per farlo è sufficiente posizionarsi da terminale nella cartella in cui si vuole scaricare il codice ed eseguire
<!-- TODO inserire link corretto -->
```bash
git clone urldigit.github.com
```
### Dipendenze
Per eseguire correttamente dil codice è necessario avere installato Node, per installare tutte le altre dipendenze del progetto occorre nmp. Una volta scaricato npm posizionarsi nella cartella fitnessapp/backend-end ed eseguire 
```bash
npm install
```
poi ripetere la stessa operazione nella cartella fitnessapp/front-end. <!-- Questo potrebbe cambiare con la build -->

Dopo aver installato correttamente tutte le dipendenze occorre avviare in un container Docker una istanza di PostgreSQL e configuarare il file .env nella cartella back-end con le opportune credenziali.
Per installare il container docker assicurarsi che dockerd sia attivo con il comando
```bash
sudo dockerd
```
poi per scaricare l'immagine e creare il container eseguire in un altro terminale
```bash
sudo docker run -d --name elefante -v /var/lib/postgresql/data:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=prova postgres
```
e per permettere all'applicazione di connettersi creare in nella cartella fitnessapp/backend un file di nome .env che contanga il seguente codice
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
Il valore di JWT_SECRET può essere deciso arbitrariamente ed è la chiave che FitnessApp userà per firmare i JSON Web Token che proteggono gli endpoint REST. Le altre due variabili invece devono sono fornite da Fitbit e servono per la procedura oAuth. Per ottenerle bisogna eseguire il login nel sito Fitbit e nella sezione sviluppatori registrare FitnessApp con rerdirect URL 
<!-- TODO: aggiornare il link post build -->
```
http://localhost:5000/profile
```
Infine è necessario creare un ulteriore file .env nella catella fitenssapp/front-end e impostare la variabile di ambiente con lo stesso codice ottenuto da Fitbit
```
VUE_APP_FITBIT_ID=CLIENT_ID
```

### Avviare l'applicazione 
Una volta che tutto è stato configurato occorre avviare il container del database e il server node.

Per avviarre il container eseguire
```bash
sudo docker start elefante
```

Per avviare il server node posizionarsi nella cartella back-end ed eseguire
```
npm run start
```
<!-- Quando sarà fatta la build non credo sarà necessario avviare il server Vue -->
Quindi per iniziare a utilizzare FitnessApp connettersi con un browser all'indirizzo
```
http://localhost:5000
```
