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
    <FitbitSyncBtn />
    <h1>Logout</h1>
    <b-button @click="logout()">Clicca qui per effettuare il logout</b-button>
  </div>
</template>

<script>
import ProfileInfoDisplayEdit from "@/components/ProfileInfoDisplayEdit.vue";
import FitbitSyncBtn from "@/components/FitbitSyncBtn.vue";
export default {
  name: "ProfilePage",
  components: {
    ProfileInfoDisplayEdit,
    FitbitSyncBtn
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
