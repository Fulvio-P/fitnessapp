<template>
  <div class="about">
    <div class="body sidebar-margin padding">
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
      <FormsPage />
    </div>
  </div>
</template>

<script>
import FormsPage from "@/components/FormsPage.vue";
import ChartsPage from "@/components/ChartsPage.vue";
export default {
  name: "About",
  components: {
    FormsPage,
    ChartsPage
  }
};
</script>

<style scoped></style>
