<template>
  <div class="about">
    <div class="body">
      <h1>This is an about page</h1>
      <p>Usiamo questa pagina per i test</p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
        quasi consequatur reiciendis maxime delectus animi vel, et ad culpa.
        Fugit tenetur corporis eius quaerat impedit, unde numquam nobis enim
        commodi!
      </p>
      <ChartsPage />
      <b-button router-link to="/"> BACK HOME </b-button>
      <div>
        <h1>Test Form</h1>
        <WeightForm/>
        <FoodForm/>
        <ActivitiesForm/>
      </div>
    </div>
  </div>
</template>

<script>
import WeightForm from "@/components/WeightForm.vue";
import FoodForm from "@/components/FoodForm";
import ActivitiesForm from "@/components/ActivitiesForm.vue";
import ChartsPage from "@/components/ChartsPage.vue";
export default {
  name: "About",
  components: {
    WeightForm,
    FoodForm,
    ActivitiesForm,
    ChartsPage
  }
};
</script>

<style scoped>
.body {
  margin: 0;
  padding: 0;
  margin-left: 5rem;
}
</style>
