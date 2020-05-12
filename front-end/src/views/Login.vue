<template>
  <div class="login-page padding">
    <!-- Modo barbaro di centrare il login, ma funziona bene quindi... -->
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col sm><LoginDialog /></b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import LoginDialog from "@/components/LoginDialog.vue";

export default {
  name: "Login",
  components: {
    LoginDialog
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
}
</style>
