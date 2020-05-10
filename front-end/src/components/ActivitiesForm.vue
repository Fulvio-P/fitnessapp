<template>
  <div class="activities-form">
    <b-form @submit.prevent="addActivity">
      <!-- Nome dell' attività -->
      <b-form-group label="Nome attività">
        <b-form-input
          id="activity-nome"
          v-model="nome"
          placeholder="Corsa"
          type="search"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Calorie del cibo -->
      <b-form-group label="Kcal bruciate">
        <b-form-input
          id="activity-calout"
          v-model="calout"
          placeholder="200"
          type="number"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Selettore del giorno -->
      <b-form-group label="Giorno associato al record">
        <b-form-datepicker
          id="activity-data"
          v-model="data"
          required
        ></b-form-datepicker>
      </b-form-group>

      <!-- Descrizione agginutiva -->
      <b-form-group label="Informazioni aggiuntive">
        <b-form-textarea
          id="activity-descrizione"
          v-model="descrizione"
          placeholder="Aggiungi dettagli"
          rows="3"
          no-resize
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit">Regitra attività</b-button>
    </b-form>
  </div>
</template>

<script>
const activitiesURL = "http://localhost:5000/api/activities";

export default {
  name: "ActivitiesForm",

  data() {
    return {
      data: undefined, //giono a cui si riferisce il record
      nome: undefined, //nome dell'attività
      calout: undefined, //calorie bruciate
      descrizione: "" //info aggiuntive
    };
  },

  methods: {
    addActivity() {
      //recupero dati dal form
      const { data, nome, calout, descrizione } = this;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_POST", {
          url: activitiesURL,
          payload: {
            data,
            nome,
            calout,
            descrizione
          }
        })
        //se tutto va bene
        .then(() => {
          alert("Record inserito correttamente");
          this.data = undefined;
          this.nome = undefined;
          this.calout = undefined;
          this.descrizione = "";
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
