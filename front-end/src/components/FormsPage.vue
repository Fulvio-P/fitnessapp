<template>
  <div class="formspage">
    Seleziona un form e compilalo: <br />
    <b-card no-body class="alt-bg">
      <b-tabs content-class="mt-3" card pills align="center" justified>
        <b-tab title="Cibo" active>
          <h5>
            Inserisci questi dati per caricare il resto in automatico dal
            database di
            <a href="https://it.openfoodfacts.org/" target="_blank"
              >Open Food Facts</a
            >:
          </h5>
          <OFFForm />
          <hrWithText>OPPURE</hrWithText>
          <h5>Inserisci manualmente quello che hai mangiato:</h5>
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
import OFFForm from "@/components/OFFForm.vue";
import WeightForm from "@/components/WeightForm.vue";
import hrWithText from "@/components/hrWithText.vue";

export default {
  name: "FormsPage",
  components: {
    ActivitiesForm,
    FoodForm,
    OFFForm,
    WeightForm,
    hrWithText
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
  /* !important serve a far applicare i colori correttamente */
  background-color: var(--nord10) !important;
  color: var(--nord6) !important;
}
.formspage .nav .nav-link:not(.active) {
  color: var(--nord0) !important;
}
.formspage .nav .nav-link:not(.active):hover {
  color: var(--nord10) !important;
}

.hr-with-text {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  font-weight: bold;
  font-size: 15pt;
}
</style>
