<template>
  <div>
    <h1>Questa è la pagina di login</h1>
    <button v-if="!$store.state.isUserLoggedIn" @click="logIn">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    logIn() {
      this.$store.dispatch("logIn");
    }
  }
};
</script>
