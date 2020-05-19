<template>
  <div class="login-page padding">
    <!-- Modo barbaro di centrare il login, ma funziona bene quindi... -->
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col sm><LoginDialogInternal /></b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import LoginDialogOAuth from "@/components/LoginDialogOAuth.vue";

export default {
  name: "Login",
  components: {
    LoginDialogOAuth
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
}
</style>
