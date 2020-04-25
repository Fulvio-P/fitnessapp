<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
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
          <b-nav-item
            v-if="$store.state.isUserLoggedIn"
            @click="logout"
            router-link
            to="/"
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
      this.$store.dispatch("logout");
    },
    displayOverlay() {
      this.$store.dispatch("displayLoginDialog", true);
    }
  }
};
</script>
