<template>
  <div>
    <SideNav v-show="isCurrentRouteOk" />
  </div>
</template>

<script>
import SideNav from "@/components/SideNavbar.vue"; //il nome del file è diverso dal nome della componente
export default {
  name: "ShySideNavbar",
  props: ["avoidroutes"],
  extends: SideNav,
  computed: {
    isCurrentRouteOk() {
      return this.avoidroutes.every(r => r != this.$route.path);
    }
  },
  components: {
    SideNav
  }
};
</script>

<style></style>
