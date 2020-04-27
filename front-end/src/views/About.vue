<template>
  <div class="about">
    <SideNav />
    <div class="body">
      <h1>This is an about page</h1>
      <p>Usiamo questa pagina per i test</p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
        quasi consequatur reiciendis maxime delectus animi vel, et ad culpa.
        Fugit tenetur corporis eius quaerat impedit, unde numquam nobis enim
        commodi!
      </p>
      <b-button router-link to="/"> BACK HOME </b-button>
    </div>
  </div>
</template>

<script>
import SideNav from "@/components/SideNavbar.vue";
export default {
  name: "About",
  components: {
    SideNav
  }
};
</script>

<style scoped>
.body {
  color: rebeccapurple;
  margin: 0;
  padding: 0;
  margin-left: 5rem;
}
</style>
