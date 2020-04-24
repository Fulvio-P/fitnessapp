<template>
  <div>
    <!-- <h1>Questa è la pagina di login</h1>
    <button v-if="!$store.state.isUserLoggedIn" @click="login">Login</button> -->
    <LoginDialog />
  </div>
</template>

<script>

import LoginDialog from "@/components/LoginDialog.vue"

export default {
  name: "Login",
  components:{
    LoginDialog
  },
  methods: {
    login() {
      this.$store.dispatch("login");
    }
  }
};
</script>
