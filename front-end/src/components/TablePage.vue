<template>
  <div class="table-page">
    <b-card no-body class="alt-bg">
      <b-tabs content-class="mt-3" card pills align="center" justified>
        <b-tab title="Cibo" active>
          <FoodTable />
        </b-tab>
        <b-tab title="Attività">
          <ActivitiesTable />
        </b-tab>
        <b-tab title="Peso">
          <WeightTable />
        </b-tab>
      </b-tabs>

      <b-overlay :show="this.$store.getters.isLoading" no-wrap> </b-overlay>
    </b-card>
  </div>
</template>

<script>
import ActivitiesTable from "@/components/ActivitiesTable.vue";
import FoodTable from "@/components/FoodTable.vue";
import WeightTable from "@/components/WeightTable.vue";

export default {
  name: "TablePage",
  components: {
    ActivitiesTable,
    FoodTable,
    WeightTable
  }
};
</script>

<!--Lo style va necessariamente NON scoped affinché raggiunga le b-tabs-->
<style>
.table-page .alt-bg {
  background-color: var(--nord5);
}

/* nav, nav-link e active  sono classi possedute dalle b-tabs di default */

.table-page .nav .nav-link.active {
  /*non ho idea di cosa sia !important, ma senza non applica i colori, percui :/ */
  background-color: var(--nord10) !important;
  color: var(--nord6) !important;
}
.table-page .nav .nav-link:not(.active) {
  color: var(--nord0) !important;
}
.table-page .nav .nav-link:not(.active):hover {
  color: var(--nord10) !important;
}
</style>
