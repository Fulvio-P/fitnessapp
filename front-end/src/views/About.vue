<template>
  <div class="about">
    <div class="body sidebar-margin padding">
      <h1>This is an about page</h1>
      <p>Usiamo questa pagina per i test</p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
        quasi consequatur reiciendis maxime delectus animi vel, et ad culpa.
        Fugit tenetur corporis eius quaerat impedit, unde numquam nobis enim
        commodi!
      </p>

      <b-button
        style="padding: 1.65em 0.9em; font-size:42pt"
        @click="goingSocketsPackets"
      >
        FIRE THE SOCKET UP IN THE SERVER!
      </b-button>






      <!-- Abbiamo appurato che sta roba funziona a meraviglia, adesso togliamo l'impaccio
      <ChartsPage />
      <br />
      <FormsPage />
      <br />
      <TablePage />
      -->
    </div>
  </div>
</template>

<script>
/*
import FormsPage from "@/components/FormsPage.vue";
import ChartsPage from "@/components/ChartsPage.vue";
import TablePage from "@/components/TablePage.vue";
*/
export default {
  name: "About",
  components: {
    /*
    FormsPage,
    ChartsPage,
    TablePage
    */
  },
  methods: {
    goingSocketsPackets() {
      // $socket is [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) instance
      //this.$socket.send("rabbit, don't you say that I didn't didn't give you a chance")
      // or with {format: 'json'} enabled
      this.$socket.sendObj({
        name: "LotusJuice",
        msg: "rabbit, don't you say that I didn't didn't give you a chance"
      });
    }
  }
};
</script>

<style scoped></style>
