<template>
  <div class="profileview sidebar-margin">
    <h1>Impostazioni Profilo</h1>
    Questa è la pagina del profilo qui metteremo il grosso delle funzionalità
    <ProfilePage />
  </div>
</template>

<script>
import ProfilePage from "@/components/ProfilePage.vue";
export default {
  name: "Profile",
  components: {
    ProfilePage
  }
};
</script>

<style scoped></style>
