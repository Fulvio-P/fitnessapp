<template>
  <div class="profilepage">
    <!-- Tabella info addizionali -->
    <b-table
      :items="items"
      :fields="fields"
      striped
      responsive
      thead-class="hidden"
    >
      <template v-slot:cell(comp)="row">
        <ProfileInfoDisplayEdit :infoname="row.item.head" />
      </template>
    </b-table>

    <b-container fluid class="profile-container">
      <b-row>
        <b-col>
          <!-- Fitbit -->
          <ProfileFitbit />
        </b-col>

        <b-col>
          <!-- Devloper -->
          <h1>Sviluppatori</h1>
          <b-button router-link to="/developer">Pagina developer</b-button>
          <p>
            Regitra la tua applicazione per usare le API di FitnessApp usando
            oAuth 2 (è supportato solo il workflow implicit grant)
          </p>
        </b-col>

        <b-col>
          <!-- Logout -->
          <h1>Logout</h1>
          <b-button @click="logout()">
            <BIconBoxArrowLeft />
            Logout
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <!-- Eliminazione account -->
    <h1 class="pericolo">Pericolo!</h1>
    <DeleteAccountBtn />
  </div>
</template>

<script>
import ProfileInfoDisplayEdit from "@/components/ProfileInfoDisplayEdit.vue";
import ProfileFitbit from "@/components/ProfileFitbit.vue";
import DeleteAccountBtn from "@/components/DeleteAccountBtn.vue";
import { BIconBoxArrowLeft } from "bootstrap-vue";

export default {
  name: "ProfilePage",
  components: {
    ProfileInfoDisplayEdit,
    ProfileFitbit,
    DeleteAccountBtn,
    BIconBoxArrowLeft
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

.pericolo {
  margin-top: 5em;
  color: var(--nord11);
}

.profile-container {
  text-align: center;
}
</style>
