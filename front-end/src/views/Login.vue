<template>
  <LoginViewGeneric>
    <LoginDialogInternal />
  </LoginViewGeneric>
</template>

<script>
import LoginDialogInternal from "@/components/LoginDialogInternal.vue";
import LoginViewGeneric from "@/components/LoginViewGeneric.vue";

export default {
  name: "Login",
  components: {
    LoginDialogInternal,
    LoginViewGeneric
  }
};
</script>

<style scoped></style>