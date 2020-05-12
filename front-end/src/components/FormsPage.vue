<template>
  <div class="formspage">
    Seleziona un form e compilalo: <br />
    <b-card no-body class="alt-bg">
      <b-tabs content-class="mt-3" card pills align="center" justified>
        <b-tab title="Cibo" active>
          <FoodForm />
        </b-tab>
        <b-tab title="Attività">
          <ActivitiesForm />
        </b-tab>
        <b-tab title="Peso">
          <WeightForm />
        </b-tab>
      </b-tabs>
      <b-overlay :show="this.$store.getters.isLoading" no-wrap> </b-overlay>
    </b-card>
  </div>
</template>

<script>
import ActivitiesForm from "@/components/ActivitiesForm.vue";
import FoodForm from "@/components/FoodForm.vue";
import WeightForm from "@/components/WeightForm.vue";

export default {
  name: "FormsPage",
  components: {
    ActivitiesForm,
    FoodForm,
    WeightForm
  }
};
</script>

<!--Lo style va necessariamente NON scoped affinché raggiunga le b-tabs-->
<style>
.formspage .alt-bg {
  background-color: var(--nord5);
}

/* nav, nav-link e active  sono classi possedute dalle b-tabs di default */

.formspage .nav .nav-link.active {
  /*non ho idea di cosa sia !important, ma senza non applica i colori, percui :/ */
  background-color: var(--nord10) !important;
  color: var(--nord6) !important;
}
.formspage .nav .nav-link:not(.active) {
  color: var(--nord0) !important;
}
.formspage .nav .nav-link:not(.active):hover {
  color: var(--nord10) !important;
}
</style>
