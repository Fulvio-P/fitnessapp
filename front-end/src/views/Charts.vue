<template>
  <div class="chartsview sidebar-margin padding">
    <h1>Grafici</h1>
    <ChartsPage />
  </div>
</template>

<script>
import ChartsPage from "@/components/ChartsPage.vue";
export default {
  name: "Charts",
  components: {
    ChartsPage
  }
};
</script>

<style scoped></style>
