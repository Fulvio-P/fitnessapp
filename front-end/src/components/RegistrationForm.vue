<template>
  <div>
    <b-form @submit="registerNewUser">
      <b-form-group
        id="registration-group-1"
        label="Indirizzo e-mail"
        label-for="registration-email"
      >
        <b-form-input
          id="registration-email"
          v-model="email"
          type="email"
          required
          placeholder="Inserisci la tua mail"
        ></b-form-input>
      </b-form-group>

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

      <b-button class="form-btn" type="submit">
        Registrati
      </b-button>
    </b-form>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: "RegistrationForm",
  data() {
    return {
      email: undefined,
      username: undefined,
      password: undefined
    }
  },
  methods: {
    
    registerNewUser(){
      axios
      .post("http://localhost:5000/register", {
        email: this.email,
        username: this.username,
        password: this.password
      })
    }

  },
};
</script>

<style scoped>
.form-btn {
  background: #2e3440;
}
</style>
