<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">

      <template v-slot:cell(delete)="row">
        <b-button size="sm" @click="deleteWeigth(row.item.data)" class="mr-2">
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
        { key: "data", label: "Giorno" },
        { key: "peso", label: "Kg" },
        { key: "delete", label: "" }
      ],
      items: [
        {
          data: "0101010101",
          peso: 75
        },
        {
          data: "0101010101",
          peso: 76
        },
        {
          data: "0101010101",
          peso: 75
        },
      ]
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
          this.items = resp.body;
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
        });
    }
  },
  created() {
      this.getWeight();
  },
};
</script>
