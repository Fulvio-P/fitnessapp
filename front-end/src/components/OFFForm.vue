<template>
  <div class="off-form">
    <b-form @submit.prevent="OFFCall">
      <b-form-group label="Codice a barre del cibo consumato">
        <b-form-input
          id="off-barcode"
          v-model="barcode"
          placeholder="0123456123456"
          type="number"
          required
        />
      </b-form-group>

      <b-form-group
        label="Quantità consumata (in g, ml, o altra unità appropriata)"
      >
        <b-form-input
          id="off-quantita"
          v-model="quantita"
          placeholder="100"
          type="number"
        />
      </b-form-group>

      <b-form-group label="Giorno associato al record">
        <b-form-datepicker id="food-data" v-model="data" />
      </b-form-group>

      <b-button type="submit"
        >Chiedi a Open Food Facts e registra calorie</b-button
      >
    </b-form>
  </div>
</template>

<script>
const OFF_URL = "http://localhost:5000/api/food/off";
export default {
  name: "OFFForm",
  data() {
    return {
      barcode: undefined,
      quantita: undefined,
      data: undefined
    };
  },
  methods: {
    OFFCall() {
      //recupero dati dal form
      const { barcode, quantita, data } = this;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_POST", {
          url: OFF_URL,
          payload: { barcode, quantita, data }
        })
        //se tutto va bene
        .then(() => {
          alert("Record inserito correttamente");
          this.barcode = undefined;
          this.quantita = undefined;
          this.data = undefined;
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
          //in questo caso il form non si resetta, l'utente può subito riprovare
        });
    }
  }
};
</script>

<style scoped></style>
