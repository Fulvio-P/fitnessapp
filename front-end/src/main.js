import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

Vue.config.productionTip = false;

//se si ha un token questo va in automatico negli header
const token = localStorage.getItem("user-token");
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

//websocket setup
import VueNativeSock from "vue-native-websocket";
Vue.use(VueNativeSock, "ws://localhost:5000/ws/fitbitsync?token=pippo", {
  //url irrilevante perché durante la connessione manuale vorrò una querystring col token
  connectManually: true, //connessioni gestite manualmente
  store: store
});
/*
i benefici del format:json sono SOLO due:
 - permette di usare sendObj che fa stringify automatico
 - fa parse automatico quando passa la risposta a vuex
E BASTA.
In particolare, NON ha effetto sulla risposta ricevuta dai listener.
E non esiste una funzione simile per express-ws.
*/

//definiamo una funzione globale, visto che dobbiamo connetterci in due punti diversi
Vue.prototype.$connectwithtoken = function(token) {
  this.$connect("ws://localhost:5000/ws/fitbitsync?token=" + token, {
    format: "json"
  });
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
