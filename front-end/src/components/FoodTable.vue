<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">
      <template v-slot:cell(details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Nascodi" : "Mostra" }} Dettagli
        </b-button>
      </template>

      <template v-slot:cell(delete)="row">
        <b-button size="sm" @click="deleteFood(row.item.ts)" class="mr-2 red-btn">
          Elimina
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          {{ row.item.descrizione }}
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
const foodUrl = "http://localhost:5000/api/food/";

export default {
  data() {
    return {
      fields: [
        { key: "nome", label: "Cibo" },
        { key: "calin", label: "Kcal" },
        { key: "data", label: "Giorno" },
        { key: "details", label: "" },
        { key: "delete", label: "" }
      ],
      items: []
    };
  },
  methods: {
    deleteFood(key) {
      let url = foodUrl + key;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_DELETE", url)
        //se tutto va bene
        .then(() => {
          this.getFood();
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    },

    getFood() {
      this.$store
        //avvio chiamata API (gestita da vuex)
        .dispatch("API_GET", foodUrl)
        //se tutto va bene
        .then(resp => {
          this.items = resp.data.dataPoints;
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    }
  },
  created() {
      this.getFood();
  },
};
</script>
