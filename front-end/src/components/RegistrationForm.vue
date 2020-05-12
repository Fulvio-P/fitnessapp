<template>
  <div>
    <b-form @submit.prevent="registerNewUser">
      <b-form-group
        id="registration-group-2"
        label="Username"
        label-for="registration-username"
      >
        <b-form-input
          id="registration-username"
          v-model="username"
          required
          placeholder="Inserisci il tuo nome"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="registration-group-3"
        label="Password"
        label-for="registration-password"
      >
        <b-form-input
          id="registration-password"
          v-model="password"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit">
        Registrati
      </b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "RegistrationForm",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    registerNewUser() {
      //recupero username e password dal form
      const { username, password } = this;
      //avvio registrazione (gestita da vuex)
      this.$store
        .dispatch("REGISTER_REQUEST", { username, password })

        //se tutto va bene provo ridirico al login
        .then(() => {
          this.$router.push("/login");
        })

        //se qualcosa va male i campi sono resettati
        .catch(() => {
          this.username = "";
          this.password = "";
          alert(this.$store.state.status);
        });
    }
  }
};
</script>


