<template>
  <div class="text-center">
    <LoginDialog :loginAction="oAuthLogin"/>
    <div>
      E il tuo ClientID è: {{ this.$route.query.id }} <br />
      E la tua CallbackURL è: {{ this.$route.query.callback }}
    </div>
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
      alert("Ho fatto il controllo callback url?!");
      return this.$store
        .dispatch("API_POST", {
          url: "http://localhost:5000/api/user/oauth",
          payload: { username, password }
        })
        //se tutto va bene redirect sulla callbackURL con il token in querystring
        .then(resp => {
          window.location.href = this.callback+"?token="+resp.data.token;
        })
    }
  }
}
</script>

<style scoped>

</style>