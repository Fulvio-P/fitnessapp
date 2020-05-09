<template>
  <div class="food-form">
    <b-form @submit.prevent='addFood'>
      
      <!-- Nome del cibo -->
      <b-form-group label='Nome del cibo'>
        <b-form-input
          id="food-nome"
          v-model="nome"
          placeholder="Banana"
          type="search"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Calorie del cibo -->
      <b-form-group label='Importo enegetico (kcal)'>
        <b-form-input
          id="food-calin"
          v-model="calin"
          placeholder="60"
          type="number"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Selettore del giorno -->
      <b-form-group label='Giorno associato al record'>
        <b-form-datepicker
          id="food-data"
          v-model="data"
          required
          value-as-date
        ></b-form-datepicker>
      </b-form-group>

      <!-- Descrizione agginutiva -->
      <b-form-group label='Informazioni aggiuntive'>
        <b-form-textarea
          id="food-descrizione"
          v-model="descrizione"
          placeholder="Aggiungi dettagli"
          rows="3"
          no-resize
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit">Regitra calorie</b-button>
    </b-form>
  </div>
</template>

<script>
const foodURL = "http://localhost:5000/api/food";

export default {
  name: "FoodForm",
  
  data() {
    return {
      data: undefined,  //giono a cui si riferisce il record
      nome: undefined,  //nome del cibo
      calin: undefined, //importo calorico
      descrizione: '',  //info aggiuntive
    };
  },

  methods: {
    
    addFood(){
      //recupero dati dal form
      const {data, nome, calin, descrizione} = this;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch('API_POST', foodURL, {data, nome, calin, descrizione})
        //se tutto va bene
        .then(()=>{
          alert('Record inserito correttamente');
          this.data = undefined;
          this.nome = undefined;
          this.calin = undefined;
          this.descrizione = '';
        })
        //se qualcosa va male
        .catch(()=>{
          alert(this.$store.state.status);
          //in questo caso il form non si resetta, l'utente può subito riprovare
        })
    }

  }
};
</script>
