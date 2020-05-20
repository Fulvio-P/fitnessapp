<template>
  <div class="topbar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand router-link to="/">FitnessApp</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <!--eventuali elementi non allineati a destra (ora nessuno)-->

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            router-link
            to="/login"
          >
            Log in
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
  }
};
</script>

<style scoped>
.topbar {
  background: var(--nord0);
}
</style>
