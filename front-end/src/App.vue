<template>
  <div id="app">
    <ShySideNavbar :avoidroutes="['/', '/login']" />
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import ShySideNavbar from "@/components/ShySideNavbar";

export default {
  name: "App",
  components: {
    ShySideNavbar
  },
  /* Da quando la pagina viene creata tutte le rispote che axios
  intecetta se sono errori di non autorizzazione fanno logout e
  lo ridirigono alla pagina di login */
  created: () => {


    /*
      BUG: l'inteceptor non funziona, riesce a vadere gli errori,
      ma l'unica cosa che legge sono i messaggi che scriviamo del
      tipo "Token Expired", non so se il problema è del backend
      che non inserisce abbastanza info oppure qui che non si legge
      bene il codice di errore, un fix brutto nel caso e fare i
      confronti con i nostri messaggi di errore al posto di 401 
    */

    //versione 1
    /* axios.interceptors.response.use(undefined, err => {
      return new Promise(() => {
        console.log(err.status);
        if (err.status === 401) { //qui la condizione era un po' piu severa
          console.log("Err intercepted")
          this.$store.dispatch("AUTH_LOGOUT");
          this.$router.push("/login");
        }
        throw err;
      });
    }); */

    //versione 2
    axios.interceptors.response.use(
      function (response) {
        return response
      }, 
      function (error) {
        console.log(error.status)
        if (error.status === 401) {
          this.$store.dispatch("AUTH_LOGOUT");
          this.$router.push("/login");
        }
      return Promise.reject(error)
    })
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
