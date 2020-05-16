<!--
Un bottone con un effetto grafico unico, creato per essere un memorabile bottone di
registrazione quando volevamo mettere i form d'accesso sul back-end.
Quell'idea è naufragata, ma non voglio buttare l'effetto di questo bottone.
-->

<template>
  <b-button v-bind:href="registerURL">
    Registrati ORA!
  </b-button>
</template>

<script>
export default {
  name: "CoolButton",
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