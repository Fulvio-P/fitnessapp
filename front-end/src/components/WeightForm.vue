<template>
  <div class="weight-form">
    <b-form @submit.prevent="addWeight">
      <b-form-group label="Il tuo peso oggi (kg)">
        <b-form-input
          id="weight-value"
          v-model="peso"
          type="number"
          min="0"
          max="1000"
          placeholder="Inserisci il tuo peso in kg"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit">Registra peso</b-button>
    </b-form>
  </div>
</template>

<script>
const weightUrl = "http://localhost:5000/api/weight";

export default {
  name: "WeightForm",
  data() {
    return {
      peso: undefined
    };
  },
  methods: {
    addWeight() {
      //recupero dati dal form
      const { peso } = this;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_POST", {
          url: weightUrl,
          payload: { peso }
        })
        //se tutto va bene
        .then(() => {
          alert("Record inserito correttamente");
          this.peso = undefined;
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
