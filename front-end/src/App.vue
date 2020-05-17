<template>
  <div id="app">
    <ShySideNavbar :avoidroutes="['/', '/login']" />
    <router-view />
    <WebsocketInbox ref="inbox" />
  </div>
</template>

<script>
import axios from "axios";
import ShySideNavbar from "@/components/ShySideNavbar";
import WebsocketInbox from "@/components/WebsocketInbox";

export default {
  name: "App",
  components: {
    ShySideNavbar,
    WebsocketInbox
  },
  /* Da quando la pagina viene creata tutte le rispote che axios
  intecetta se sono errori di non autorizzazione fanno logout e
  lo ridirigono alla pagina di login */
  mounted() {
    axios.interceptors.response.use(undefined, err => {
      return new Promise(() => {
        console.log(JSON.stringify(err))
        if (err.message.includes('401') && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("AUTH_LOGOUT");
          this.$router.push("/login");
        }
        throw err;
      });
    });
    //mettiamo su un listener per i websocket
    //mettendolo qui, tutta l'applicazione può ricevere i messaggi, indipendentemente dalla route corrente
    this.$options.sockets.onmessage = (msg) => {
      console.log(msg);
      this.$refs.inbox.msgobj = JSON.parse(msg.data);
    }
    //un listener anche per la chiusura della connessione da parte del server
    this.$options.sockets.onclose = () => {
      this.$disconnect();
    }
    //può capitare che l'utente entri direttamente nell'area protetta senza essere passato
    //per la pagina di login, se c'è ancora un token valido in localstorage.
    //in tal caso, non c'è stata la connessione automatica col login che sta in vuex,
    //quindi tocca connettersi manualmente
    if (this.$store.state.token) {   //sembra che vuex sia caricato correttamente a questo punto
      this.$connectwithtoken(this.$store.state.token)  //funzione definita da me in main.js
    }
  }
};
</script>

<style>
:root {
  /*mi sono stufato di copincollare dal sito di nord 30 volte per scegliere il colore giusto*/
  --nord0: #2e3440;
  --nord1: #3b4252;
  --nord2: #434c5e;
  --nord3: #4c566a;
  --nord4: #d8dee9;
  --nord5: #e5e9f0;
  --nord6: #eceff4;
  --nord7: #8fbcbb;
  --nord8: #88c0d0;
  --nord9: #81a1c1;
  --nord10: #5e81ac;
  --nord11: #bf616a;
  --nord12: #d08770;
  --nord13: #ebcb8b;
  --nord14: #a3be8c;
  --nord15: #b48ead;

  /* servono anche queste così posso applicare trasparenza*/
  --nord8rgb: 136, 192, 208;
  --nord11rgb: 191, 97, 106;
  --nord14rgb: 163, 190, 140;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--nord6);
  color: var(--nord0);
}

body {
  background: var(--nord6);
}

/* Large screens */
@media only screen and (min-width: 600px) {
  .sidebar-margin {
    margin: 0;
    margin-left: 5.5rem;
  }

  .padding {
    padding: 3rem;
  }
}

/* Small screens */
@media only screen and (max-width: 600px) {
  .sidebar-margin {
    margin: 0;
    margin-bottom: 5.5rem;
  }

  .padding {
    padding: 2rem;
  }
}

.btn-secondary {
  background: var(--nord0);
}
.btn-secondary:hover {
  background: var(--nord2);
}

.red-btn {
  background: var(--nord11);
  border: none;
}
.red-btn:hover {
  background: var(--nord12);
}
</style>
