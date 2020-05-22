<template>
  <span>
    <b-overlay
      :show="this.$store.getters.isSocketLoading"
      class="d-inline-block"
      rounded
      spinner-small
    >
      <b-button @click="richiediFitbitsync">
        Sincronizza
      </b-button>
    </b-overlay>
  </span>
</template>

<script>
export default {
  name: "FitbitSyncBtn",
  methods: {
    richiediFitbitsync() {
      this.$store.dispatch("FITBIT_SYNC", this.$socket);
    }
  }
};
</script>

<style scoped></style>
