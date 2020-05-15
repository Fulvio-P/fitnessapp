<!--Il nome rimane questo per compatibilità con tutto il resto del codice,
anche se è un po' inesatto
TODO? cambiare nome se possibile
-->

<template>
  <b-button v-bind:href="registerURL">
    Registrati ORA!
  </b-button>
</template>

<script>
export default {
  name: "RegistrationForm",
  computed: {
    registerURL() {
      return `http://localhost:5000/register?successURL=${window.location.origin}/savetoken`
    }
  }
}
</script>

<style scoped>
/*Il bottone di registrazione deve essere speciale*/
/*Senza "*" non prende il bottone*/
* {
  font-size: 30pt;
  transition: 500ms;
  box-shadow: 0 0 0 2em var(--nord0) inset, 0 0 0 5em var(--nord8) inset;
}
*:hover {
  background-color: var(--nord6);
  color: var(--nord0);
  box-shadow: 0 0 0 0 var(--nord0) inset, 0 0 15px 0.002em var(--nord14) inset;
  filter: brightness(105%);
}

/* Large screens */
@media only screen and (min-width: 600px) {
  * {
    padding: 1em 2em;
    margin: 1em;
  }
}

/* Small screens */
@media only screen and (max-width: 600px) {
  * {
    padding: 0.5em 1em;
  }
}
</style>

























<!--
Vecchia versione di quando questo form era nella GUI,
TODO marcata per rimozione

<template>
  <div>
    <b-form @submit.prevent="registerNewUser">
      <b-form-group
        id="registration-group-2"
        label="Username"
        label-for="registration-username"
      >
        <b-form-input
          id="registration-username"
          v-model="username"
          required
          placeholder="Inserisci username"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="registration-group-3"
        label="Password"
        label-for="registration-password"
      >
        <b-form-input
          id="registration-password"
          v-model="password"
          type="password"
          placeholder="Inserisci password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit">
        Registrati
      </b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "RegistrationForm",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    registerNewUser() {
      //recupero username e password dal form
      const { username, password } = this;
      //avvio registrazione (gestita da vuex)
      this.$store
        .dispatch("REGISTER_REQUEST", { username, password })

        //se tutto va bene provo ridirico al login
        .then(() => {
          this.$router.push("/login");
        })

        //se qualcosa va male i campi sono resettati
        .catch(() => {
          this.username = "";
          this.password = "";
          alert(this.$store.state.status);
        });
    }
  }
};
</script>
-->
