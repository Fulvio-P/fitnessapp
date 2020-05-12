<template>
  <div class="landing-bottom padding">
    <b-container fluid>
      <b-row>
        <b-col sm align-self="center" align="center">
          <h1>
            Registra i tuoi allenamenti
          </h1>
          <p>
            FitnessApp ti permette di catalogare tutti gli allenamenti 
            con data, calorie bruciate e uno spazio personalizzato per 
            aggiungere tutti i dettagli che sono importanti per te
          </p>
        </b-col>
        <b-col sm align-self="center" align="center">
          <b-img src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" fluid alt="Ops! Immagine non trovata" /> 
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col sm align-self="center" align="center">
          <b-img src="https://images.pexels.com/photos/5938/food-salad-healthy-lunch.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" fluid alt="Ops! Immagine non trovata" />
        </b-col>
        <b-col sm align-self="center" align="center">
          <h1>
            Tieni traccia delle calorie
          </h1>
          <p>
            Salva i tuoi pasti nel diario di FitnessApp, noi calcoleremo 
            il bilancio totale delle calorie giorno per giorno tenendo in 
            considerazione sia ciò che hai mangiato che i tuoi allenamenti
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm align-self="center" align="center">
          <h1>Registrati</h1>
          <p>
            Registrarsi è semplice, inserisci username e password e 
            inizia subito ad usare FitnessApp
          </p>
        </b-col>
        <b-col align-self="center" align="center">
          <RegistrationForm />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import RegistrationForm from "@/components/RegistrationForm.vue";
export default {
  name: "LandBottom",
  components: {
    RegistrationForm
  }
};
</script>

<style scoped>
.row{
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
