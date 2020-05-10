<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">
      <template v-slot:cell(details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Nascondi" : "Mostra" }} Dettagli
        </b-button>
      </template>

      <template v-slot:cell(delete)="row">
        <b-button size="sm" @click="deleteActivity(row.item.ts)" class="mr-2">
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
const activitiesUrl = "http://localhost:5000/api/activities/";

export default {
  data() {
    return {
      fields: [
        { key: "nome", label: "Attività" },
        { key: "calout", label: "Kcal" },
        { key: "data", label: "Giorno" },
        { key: "details", label: "" },
        { key: "delete", label: "" }
      ],
      items: []
    };
  },
  methods: {
    deleteActivity(key) {
      let url = activitiesUrl + key;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_DELETE", url)
        //se tutto va bene
        .then(() => {
          this.getActivities();
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    },

    getActivities() {
      this.$store
        //avvio chiamata API (gestita da vuex)
        .dispatch("API_GET", activitiesUrl)
        //se tutto va bene
        .then(resp => {
          this.items = resp.body.dataPoints;
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    }
  },
  created() {
      this.getActivities();
  },
};
</script>
