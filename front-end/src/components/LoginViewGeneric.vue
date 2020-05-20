<template>
  <div class="login-page padding">
    <!-- Modo barbaro di centrare il login, ma funziona bene quindi... -->
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col sm><slot></slot></b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "LoginViewGeneric"
};
</script>

<style scoped>
.login-page {
  height: 100vh;
}
</style>