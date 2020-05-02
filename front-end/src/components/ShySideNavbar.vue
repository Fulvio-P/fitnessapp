<!--
Una variante della SideNav che non compare in alcuna delle route
che vengono elencate nell'array avoidroutes.
-->

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
      return this.avoidroutes.every(r => r != this.$route.path);   //programmazione funzionale <3
    }
  },
  components: {
    SideNav
  }
};
</script>

<style></style>
