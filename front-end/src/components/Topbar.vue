<template>
  <div class="topbar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand router-link to="/">Fitness App</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Qeusta pagina va eliminata -->
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item router-link to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            v-if="!$store.state.isUserLoggedIn"
            v-bind:href="loginURL"
          >
            Log in
          </b-nav-item>

          <!--TODO marcato per rimozione
          <b-nav-item
            router-link
            to="/login"
            v-if="!$store.state.isUserLoggedIn"
            >Log in</b-nav-item
          >
          -->

          <!-- Questo pulsante va spostato come item della sidebar della pagina del profilo oppure come dropdown del pulsate profilo -->
          <b-nav-item v-if="$store.state.isUserLoggedIn" @click="logout">
            Log out
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Topbar",
  methods: {
    logout() {
      this.$store.dispatch("AUTH_LOGOUT").then(() => {
        this.$router.push("/");
      });
    }

    //overlay disattivato per il momento
    /* displayOverlay() {
      this.$store.dispatch("displayLoginDialog", true);
    } */
  },
  computed: {
    loginURL() {
      return `http://localhost:5000/login?successURL=${window.location.origin}/savetoken`
    }
  }
};
</script>

<style scoped>
.topbar {
  background: var(--nord0);
}
</style>
