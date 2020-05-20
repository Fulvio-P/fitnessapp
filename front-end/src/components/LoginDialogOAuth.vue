<template>
  <div class="text-center">
    <b-card class="card">
      <p>Un'applicazione vuole accedere ai tuoi dati su FitnessApp</p>
    </b-card>
    
    <LoginDialog :loginAction="oAuthLogin"/>
    
  </div>
</template>

<script>
import LoginDialog from "@/components/LoginDialog.vue"
export default {
  name: "LoginDialogOAuth",
  components: {
    LoginDialog
  },
  extends: LoginDialog,
  methods: {
    oAuthLogin(username, password) {
      return this.$store
        .dispatch("API_POST", {
          url: "http://localhost:5000/api/user/oauth",
          payload: {
            id: this.$route.query.id,
            redirect: this.$route.query.redirect,
            username,
            password
          }
        })
        //se tutto va bene redirect sulla redirectURL con il token in querystring
        .then(resp => {
          window.location.href = this.$route.query.redirect+"?token="+resp.data.token;
        })
    }
  }
}
</script>

<style scoped>
.card {
  margin-bottom: 1em;
  background-color: var(--nord6);
  filter: brightness(103%)
}
</style>