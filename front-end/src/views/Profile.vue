<template>
  <div class="profileview sidebar-margin padding">
    <h1>Impostazioni Profilo</h1>
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
