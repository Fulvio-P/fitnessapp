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

      <div v-if="this.$store.state.status === 'reg-error'" class="reg-err">
          {{error}}
        </div>
        <br/>

      <b-button class="form-btn" type="submit">
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
      username: undefined,
      password: undefined,
      error: '',
    }
  },
  methods: {
    
    registerNewUser(){
      //recupero username e password dal form
      const {username, password} = this;
      //avvio registrazione (gestita da vuex)
      this.$store.dispatch('REGISTER_REQUEST', {username, password})
      //se tutto va bene redirect sulla pagina dei chart
      .then(()=> {this.$router.push('/charts')})
      //se qualcosa va male i campi sono resettati
      .catch((err)=>{
        this.username = '';
        this.password = '';
        this.error = err;
      })
    }

  },
};
</script>

<style scoped>
.form-btn {
  background: var(--nord0);
}
</style>
