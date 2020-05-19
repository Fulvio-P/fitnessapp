<template>
  <div class="text-center">
    <LoginDialog :loginAction="oAuthLogin"/>
    <div>
      E il tuo ClientID è: {{ this.$route.query.id }} <br />
      E la tua CallbackURL è: {{ this.$route.query.callback }}
      <b-card style="background-color:var(--nord15);">
        TODO:
        <ul>
          <li>Controllare CallbackURL nel backend</li>
          <li>Dire alla ShySideNavbar di evitare la route /oauth</li>
        </ul>
      </b-card>
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
      return this.$store
        .dispatch("API_POST", {
          url: "http://localhost:5000/api/user/oauth",
          payload: {
            id: this.$route.query.id,
            callback: this.$route.query.callback,
            username,
            password
          }
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