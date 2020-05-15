<template>
  <div>
    Login riuscito! Caricamento in corso...
  </div>
</template>

<script>
export default {
  name: "SaveToken",
  created() {
    this.$store
      .dispatch("AUTH_SAVETOKEN", this.$route.query.token)
      .then(()=>{
        this.$router.push("/charts")
      });
  }
};
</script>

<style scoped></style>