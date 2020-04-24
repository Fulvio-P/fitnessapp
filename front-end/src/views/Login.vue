<template>
  <div>
    <h1>Questa è la pagina di login</h1>
    <button v-if="!$store.state.isUserLoggedIn" @click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    login() {
      this.$store.dispatch("login");
    }
  }
};
</script>
