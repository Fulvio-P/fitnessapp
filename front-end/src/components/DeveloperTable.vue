<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">
      <template v-slot:cell(delete)="row">
        <b-button
          size="sm"
          @click="deleteClient(row.item.clientid)"
          class="mr-2 red-btn"
        >
          Elimina
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
const developerURL = "http://localhost:5000/api/developer/";

export default {
  data() {
    return {
      fields: [
        { key: "clientname", label: "Nome Applicazione" },
        { key: "clientid", label: "Codice Applicazione" },
        { key: "redirect", label: "Redirect URL" },
        { key: "delete", label: "" }
      ],
      items: []
    };
  },
  methods: {
    deleteClient(key) {
      let url = developerURL + key;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_DELETE", url)
        //se tutto va bene
        .then(() => {
          this.getClients();
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    },

    getClients() {
      this.$store
        //avvio chiamata API (gestita da vuex)
        .dispatch("API_GET", developerURL)
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
    this.getClients();
  }
};
</script>
