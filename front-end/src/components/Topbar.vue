<template>
  <div class="topbar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand router-link to="/">Fitness App</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item router-link to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            v-if="!$store.state.isUserLoggedIn"
            @click="displayOverlay()"
            >Log in</b-nav-item
          >

          <!-- Questo pulsante deve essere sostituito con la foto del profilo e il nome una volta implementato il login -->
          <b-nav-item
            v-if="$store.state.isUserLoggedIn"
            router-link
            to="/profile"
            >Profile</b-nav-item
          >

          <!-- Questo pulsante va spostato come item della sidebar della pagina del profilo oppure come dropdown del pulsate profilo -->
          <b-nav-item
            v-if="$store.state.isUserLoggedIn"
            @click="logout"
            >Log out</b-nav-item
          >
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
      this.$store.dispatch("AUTH_LOGOUT")
      .then(()=>{
        this.$router.push('/');
      })
    },
    displayOverlay() {
      this.$store.dispatch("displayLoginDialog", true);
    }
  }
};
</script>

<style scoped>
.topbar {
  background: var(--nord0);
}
</style>
