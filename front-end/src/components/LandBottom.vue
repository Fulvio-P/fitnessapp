<template>
  <div class="landing-bottom">
    <b-container fluid>
      <b-row>
        <b-col sm>
          <h1>
            Titolo bello
          </h1>
          <p>
            Spiegazione del perchè Fintess App è la cosa migliore della vita.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor nemo
            quae quidem placeat, inventore modi. Unde impedit ipsam, omnis
            veritatis blanditiis illum fugit reprehenderit consequatur
            consequuntur deserunt eos sunt exercitationem.
          </p>
        </b-col>
        <b-col sm>
          <img src="@/assets/logo.png" alt="Ops! Immagine non trovata" />
        </b-col>
      </b-row>
      <b-row>
        <b-col sm>
          <img src="@/assets/logo.png" alt="Ops! Immagine non trovata" />
        </b-col>
        <b-col sm>
          <h1>
            Titolo bello
          </h1>
          <p>
            Spiegazione del perchè Fintess App è la cosa migliore della vita.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor nemo
            quae quidem placeat, inventore modi. Unde impedit ipsam, omnis
            veritatis blanditiis illum fugit reprehenderit consequatur
            consequuntur deserunt eos sunt exercitationem.
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm>
          <h1>Registrati ORA!</h1>
          <p>
            FitnessApp è la cosa più bella del mondo: iscrivendoti con la tua
            email potrai tenere traccia delle calorie e del peso, funzioni più
            avanzate sono disponibili se colleghi altri account. Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Saepe porro eius
            fugiat rerum possimus nesciunt, aut, totam error, odit debitis
            officia. Et delectus quod mollitia laudantium ullam, nobis
            accusamus? Corrupti.
          </p>
        </b-col>
        <b-col>
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
.landing-bottom {
  padding: 5rem;
}
</style>
