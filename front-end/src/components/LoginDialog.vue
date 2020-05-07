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
            v-model="username"
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
            v-model="password"
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
    <b-button router-link to='/'>Torna alla home</b-button>
  </div>
</template>

<script>


export default {
  name: "LoginDialog",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    
    loginSubmit() {
      //recupero username e password dal form
      const {username, password} = this;
      //avvio autenticazione (gestita da vuex)
      this.$store.dispatch('AUTH_REQUEST', {username, password})
      //se tutto va bene redirect sulla pagina dei chart
      .then(()=> {this.$router.push('/charts')})
      //se qualcosa va male i campi sono resettati
      .catch(()=>{
        this.username = '';
        this.password = '';
        alert(this.$store.state.status);
      })
    },
  }
};
</script>

<style scoped>

  

  .log-err{
    color: var(--nord11);
  }

</style>
