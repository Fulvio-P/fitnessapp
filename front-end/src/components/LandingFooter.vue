<template>
  <div class="footer">
    <b-container 
    class="footer-content"
    fluid
    >
      <b-row>
        <b-col sm class="footer-section about">
          <h1 class="logo-text">FitnessApp</h1>
          <p>
            Una semplice applicazione per registrare
            dati sul proprio benessere e fitness. La
            versione attuale è presentata come progetto
            per il corso di Linguaggi e Teconolgie Web.
          </p>
        </b-col>
        <b-col sm class="footer-section links">
          <h1>Link Rapidi</h1>
          <ul>
            <li><a href="#">Servizi</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="https://github.com/Fulvio-P/fitnessapp" class="git-hub">Pagina GitHub</a></li>
            <li><a href="#">Termini e condizioni</a></li>
          </ul>
        </b-col>
        <b-col sm class="footer-section contact-form">
          <h1>Contattaci</h1>
          <b-form>
            <b-form-group
            label="Indirizzo e-mail"
            label-for="input-1"
            description="Non condiveremo il tuo indirizzo e-mail con terze parti"
            >
              <b-form-input
              id="input-1"
              type="email"
              required
              placeholder="pippo@email.com"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-textarea
              id="input-textarea"
              placeholder="7/10 too much water"
              no-resize
              ></b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="primary">Invia</b-button>
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
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer {
  background: #ffff00;
}

.footer .footer-content .footer-section {
  padding: 25px;
}

.footer .footer-bottom {
  background: #ffffff;
  height: 50px;
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
