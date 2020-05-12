<template>
  <div class="footer">
    <b-container class="footer-content" fluid>
      <b-row>
        <b-col sm class="footer-section about">
          <h1 class="logo-text">FitnessApp</h1>
          <p>
            Una semplice applicazione per registrare dati sul proprio benessere
            e fitness. La versione attuale è presentata come progetto per il
            corso di Linguaggi e Teconolgie Web.
          </p>
          <a href="https://github.com/Fulvio-P/fitnessapp" class="git-hub">
            Pagina GitHub
          </a>
        </b-col>
        <b-col sm class="footer-section contact-form">
          <h1>Contattaci</h1>
          <b-form @submit.prevent="addOpinion">
            <b-form-group
              label="Indirizzo e-mail"
              label-for="input-1"
              description="Non condiveremo il tuo indirizzo e-mail con terze parti"
            >
              <b-form-input
                id="input-1"
                type="email"
                required
                placeholder="La tua email"
                v-model="email"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-textarea
                id="input-textarea"
                placeholder="Inserisci un messaggio"
                no-resize
                v-model="testo"
              ></b-form-textarea>
            </b-form-group>
            <b-button type="submit" class="footer-form-btn">Invia</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
    <div class="footer-bottom">
      Fulvio Pio Mignano | Francesco Petri
    </div>
  </div>
</template>

<script>
const opinionUrl = 'http://localhost:5000/opinion';

export default {
  name: "Footer",
  data() {
    return {
      email: undefined,
      testo: undefined
    }
  },
  methods: {
    addOpinion(){
      //recupero dati dal form
      const { email, testo } = this;
      //avvio chiamata API (gestita da vuex)
      this.$store
        .dispatch("API_POST", {
          url: opinionUrl,
          payload: { email, testo }
        })
        //se tutto va bene
        .then(() => {
          alert("Messaggio inviato correttamente");
          this.email = undefined;
          this.testo = undefined;
        })
        //se qualcosa va male
        .catch(() => {
          alert(this.$store.state.status);
          //in questo caso il form non si resetta, l'utente può subito riprovare
        });
    }
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: var(--nord6);
}

a:hover{
  text-decoration: underline;
}

.footer-form-btn {
  background: var(--nord1);
}

.footer {
  background: var(--nord0);
  color: var(--nord6);
}

.footer-section {
  padding: 3rem;
}

.footer .footer-bottom {
  background: var(--nord1);
  color: var(--nord3);
  height: 50px;
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
