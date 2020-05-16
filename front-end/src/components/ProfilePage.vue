<template>
  <div class="profilepage">
    <b-table
      :items="items"
      :fields="fields"
      striped
      hover
      responsive
      thead-class="hidden"
    >
      <template v-slot:cell(comp)="row">
        <ProfileInfoDisplayEdit :infoname="row.item.head" />
      </template>
    </b-table>
    <h1>Sincronizzazione FitBit</h1>
    <b-button
      @click="richiediFitbitsync"
    >
      Clicca qui per sincrinizzare con FitBit
    </b-button>
    <b-card style="background-color:var(--nord13);">
      TODO <i>(eliminare una volta fatto)</i>
      <ul>
        <li>
          Questo bottone ora sta qui per usare il minor numero di clic possibile,
          ma <b>se alla fine finisce che sincronizziamo solo le attività</b>
          potremmo anche metterlo nella pagina form con un separatore,
          similmente a come è messo il form di OpenFoodFacts.<br />
          Se invece rimane qui, potremmo comunque sistemarlo un po' meglio,
          ad esempio affiancando affiancando 2-3 bottoni in un b-container.
        </li>
        <li>
          TODO: v-bindare dinamicamente la proprietà "disabled" di questo bottone
          per impedire di cliccarlo se non c'è un account FitBit collegato.
          In ogni caso l'assenza di un account FitBit andrà gestita come erroe nel
          backend, ma la disabilitare il bottone (e magari mostrare un messaggio che
          spieghi perché è bloccato) è comunque buon design per il frontend.
        </li>
      </ul>
    </b-card>
    <h1>Logout</h1>
    <b-button @click="logout()">Clicca qui per effettuare il logout</b-button>
  </div>
</template>

<script>
import ProfileInfoDisplayEdit from "@/components/ProfileInfoDisplayEdit.vue";
export default {
  name: "ProfilePage",
  components: {
    ProfileInfoDisplayEdit
  },
  data() {
    return {
      fields: [{ key: "head", tdClass: "headcol" }, { key: "comp" }],
      items: [{ head: "Email" }, { head: "Altezza" }]
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("AUTH_LOGOUT").then(() => {
        this.$router.push("/");
      });
    },
    richiediFitbitsync() {
      this.$socket.sendObj({
        token: this.$store.state.token,
        action: "fitbitsync"
      });
    }
  }
};
</script>

<style>
.profilepage .hidden {
  display: none;
}
.profilepage .headcol {
  font-weight: bold;
  width: 10%;
}
</style>
