<template>
  <b-button @click="clickHandler">
    ELIMINA ACCOUNT
  </b-button>
</template>

<script>
export default {
  name: "DeleteAccountBtn",
  methods: {
    clickHandler() {
      if (
        confirm(
          "ATTENZIONE!\nQuest'operazione cancellerà PERMANENTEMENTE il tuo " +
            "account FitnessApp e TUTTI i dati che ci hai caricato sopra.\n" +
            "(I dati di eventuali account collegati resteranno al sicuro.)\n" +
            "Questa operazione NON PUÒ essere annullata.\n" +
            "Sei sicuro?"
        )
      ) {
        let url = "http://localhost:5000/api/profile?sure=true";
        //avvio chiamata API (gestita da vuex)
        this.$store
          .dispatch("API_DELETE", url)
          //se tutto va bene
          .then(() => {
            alert("Account eliminato con successo.");
            return this.$store.dispatch("AUTH_LOGOUT");
          })
          .then(() => {
            this.$router.push("/");
          })
          //se qualcosa va male
          .catch(() => {
            alert(this.$store.state.status);
          });
      }
    }
  }
};
</script>

<style scoped>
* {
  background: var(--nord11);
}
*:hover {
  background: var(--nord12);
}
</style>
