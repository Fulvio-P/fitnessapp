<template>
  <div
    ref="dialog"
    tabindex="-1"
    role="dialog"
    aria-modal="false"
    aria-labelledby="form-confirm-label"
    class="text-center p-3"
  >
    <p><strong id="form-confirm-label">Log in</strong></p>
    <p class="login-form">
      <b-form @submit.prevent="loginSubmit">
        <b-form-group
          label="Username"
          label-for="login-username"
          class="text-left"
          ><b-form-input
            id="login-username"
            v-model="loginUsername"
            required
            placeholder="Inserisci username..."
          ></b-form-input
        ></b-form-group>

        <b-form-group
          label="Password"
          label-for="login-password"
          class="text-left"
          ><b-form-input
            id="login-password"
            type="password"
            v-model="loginPassword"
            required
            placeholder="Inserisci password..."
          ></b-form-input
        ></b-form-group>

        <b-button class="form-btn" type="submit">
          Login
        </b-button>
      </b-form>
    </p>
    <hr />
    <b-button @click="testLogin"
      >[TESTING ONLY] Login diretto come AkihikoSanada</b-button
    >
    <br />
    <b-button @click="close">Annulla</b-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginDialog",
  data() {
    return {
      loginUsername: undefined,
      loginPassword: undefined
    };
  },
  methods: {
    loginSubmit() {
      alert(
        `Hai scritto: ${this.loginUsername} - ${this.loginPassword}.\nInvio al server...`
      );
      axios
        .post("http://localhost:5000/api/user/login", {
          username: this.loginUsername,
          password: this.loginPassword
        })
        .then(resp => {
          alert(`[PLACEHOLDER]\nE il server ha risposto...\n${resp}`);
        })
        .catch(() => {
          alert("Errore");
        })
        .finally(() => {
          alert("Sono un alert nella finally");
        });
      return false;
    },
    testLogin() {
      this.$store.dispatch("login");
      this.$store.dispatch("displayLoginDialog", false);
    },
    close() {
      this.$store.dispatch("displayLoginDialog", false);
    }
  }
};
</script>
