<template>
  <div>
    <b-button class="back-btn" router-link to="/profile">
      <BIconChevronDoubleLeft />
      Indietro
    </b-button>
    <div class="padding">
      <h1>Pagina developer</h1>
      <h3>Registra una nuova applicazione</h3>
      <DeveloperForm @posted="updateTable" />
      <hr />
      <h3>Le tue applicazioni</h3>
      <DeveloperTable ref="devTable" />
    </div>
    <b-button class="back-btn" router-link to="/profile">
      <BIconChevronDoubleLeft />
      Indietro
    </b-button>
  </div>
</template>

<script>
import DeveloperForm from "@/components/DeveloperForm.vue";
import DeveloperTable from "@/components/DeveloperTable.vue";
import { BIconChevronDoubleLeft } from "bootstrap-vue";

export default {
  components: {
    DeveloperForm,
    DeveloperTable,
    BIconChevronDoubleLeft
  },
  methods: {
    updateTable() {
      this.$refs.devTable.getClients();
    }
  }
};
</script>

<style scoped>
.no-padding-top {
  padding-top: 0;
}
.back-btn {
  position: absolute;
  margin: 0.5rem;
}
</style>
