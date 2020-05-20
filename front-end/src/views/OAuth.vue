<template>
  <LoginViewGeneric>
    <LoginDialogOAuth />
  </LoginViewGeneric>
</template>

<script>
import LoginDialogOAuth from "@/components/LoginDialogOAuth.vue";
import LoginViewGeneric from "@/components/LoginViewGeneric.vue";

export default {
  name: "OAuth",
  components: {
    LoginDialogOAuth,
    LoginViewGeneric
  }
};
</script>

<style scoped></style>