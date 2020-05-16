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
Vue.use(VueNativeSock, 'ws://localhost:5000/echo', { format: 'json' });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
