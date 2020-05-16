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
//c'è la possibilità di integrazione con vuex (vd. readme github),
//ma prima voglio fare un prototipo funzionante
import VueNativeSock from 'vue-native-websocket';
Vue.use(VueNativeSock, 'ws://localhost:5000/fitbitsync', { format: 'json' });
/*
i benefici del format:json sono SOLO due:
 - permette di usare sendObj che fa stringify automatico
 - fa parse automatico quando passa la risposta a vuex
E BASTA.
In particolare, NON ha effetto sulla risposta ricevuta dai listener.
E non esiste una funzione simile per express-ws.
*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
