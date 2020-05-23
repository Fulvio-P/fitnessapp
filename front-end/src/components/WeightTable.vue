<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">
      <template v-slot:cell(delete)="row">
        <b-button
          size="sm"
          @click="deleteWeight(row.item.data)"
          class="mr-2 red-btn"
        >
          Elimina
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
const weightUrl = "http://localhost:5000/api/weight/";

export default {
  data() {
    return {
      fields: [
        { key: "dataFixed", label: "Giorno" },
        { key: "peso", label: "Kg" },
        { key: "delete", label: "" }
      ],
      items: []
    };
  },
  methods: {
    deleteWeight(key) {
      let url = weightUrl + key;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_DELETE", url)
        //se tutto va bene
        .then(() => {
          this.getWeight();
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    },

    getWeight() {
      this.$store
        //avvio chiamata API (gestita da vuex)
        .dispatch("API_GET", weightUrl)
        //se tutto va bene
        .then(resp => {
          this.items = this.fixDates(resp.data.dataPoints);
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    },

    fixDates(array) {
      array.forEach(element => {
        //differenza con le altre tabelle perchè data serve nelle query
        element.dataFixed = new Date(element.data).toLocaleString("default", {
          day: "numeric",
          month: "long"
        });
      });
      return array;
    }
  },
  created() {
    this.getWeight();
  }
};
</script>
