<template>
  <div class="text-center">
    <LoginDialog :loginAction="internalLogin" />
    <b-button router-link to="/">Annulla</b-button>
  </div>
</template>

<script>
import LoginDialog from "@/components/LoginDialog.vue";
export default {
  name: "LoginDialogInternal",
  components: {
    LoginDialog
  },
  extends: LoginDialog,
  methods: {
    internalLogin(username, password) {
      return (
        this.$store
          .dispatch("AUTH_REQUEST", { username, password })
          //se tutto va bene redirect sulla pagina dei chart
          .then(() => {
            this.$router.push("/charts");
          })
      );
    }
  }
};
</script>

<style scoped></style>
