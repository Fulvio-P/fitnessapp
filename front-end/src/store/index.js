import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
const loginURL = "http://localhost:5000/api/user/login";
const regURL = "http://localhost:5000/api/user/register";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /* loginDialog: false, */ //Overlay disabilitato

    //stati usati per il login vero
    token: localStorage.getItem("user-token") || "", //JWT conservato anche se localstorage non disponibile
    status: "" //status interno della applicazione per richieste di login, regitrazione e altre API
  },

  getters: {
    isAuthenticated: state => !!state.token,
    getStatus: state => state.status
  },

  mutations: {
    /* Mutazioni usate dal login */

    //segna l'inizio del login
    AUTH_REQUEST(state) {
      state.status = "loading";
    },

    //segna successo nel login
    AUTH_SUCCESS(state, token) {
      state.status = "success";
      state.token = token;
    },

    /* Mutazione del logout */
    AUTH_LOGOUT(state) {
      state.token = "";
      state.status = "";
    },

    /* Mutazioni registrazione */

    //segna l'inizio della registrazione
    REGISTER_REQUEST(state) {
      state.status = "reg-loading";
    },

    //segna successo della registrazione
    REGISTER_SUCCESS(state) {
      state.status = "reg-success";
    },

    /* Mutazioni generiche per chiamate API */

    //segna l'inizion di una richesta
    API_REQUEST(state) {
      state.status = "api-loading";
    },

    //segna il successo di una richiesta
    API_SUCCESS(state) {
      state.status = "api-success";
    },

    /* Mutazione errori */

    //segna errore
    REQUEST_ERROR(state, error) {
      if (error.response) {
        // Request made and server responded
        state.status = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        state.status = error.request;
      } else {
        // Something happened in setting up the request that triggered an Error
        state.status = error.message;
      }
    }
  },

  actions: {
    /* Azione del login*/
    AUTH_REQUEST({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("AUTH_REQUEST");
        axios
          .post(loginURL, user)

          //gestisco la risposta positiva
          .then(resp => {
            //salvo il token
            const token = resp.data.token;
            localStorage.setItem("user-token", token);
            //imposto il token come header di default
            axios.defaults.headers.common["Authorization"] = 'Bearer '+token;
            commit("AUTH_SUCCESS", token);
            resolve(resp);
          })

          //gestisco risposte negative
          .catch(err => {
            commit("REQUEST_ERROR", err);
            //rimuovo il token dal local storage
            localStorage.removeItem("user-token");
            //rimuovo il token dall'header
            delete axios.defaults.headers.common["Authorization"];
            reject(err);
          });
      });
    },

    /* Azione di logout */
    AUTH_LOGOUT({ commit }) {
      return new Promise(resolve => {
        commit("AUTH_LOGOUT");
        localStorage.removeItem("user-token");
        resolve();
      });
    },

    /* Azione di registrazione */
    REGISTER_REQUEST({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("REGISTER_REQUEST");
        axios
          .post(regURL, user)

          //gestisco successo registrazione
          .then(resp => {
            commit("REGISTER_SUCCESS");
            resolve(resp);
          })

          //gestisco risposte negative
          .catch(error => {
            commit("REQUEST_ERROR", error);
            //rimuovo il token dal local storage per sicurezza
            localStorage.removeItem("user-token");
            //rimuovo il token dall'header per sicurezza
            delete axios.defaults.headers.common["Authorization"];
            reject(error);
          });
      });
    },

    /* Azioni per tutte le altre chiamate API */
    API_GET({ commit }, url) {
      return new Promise((resolve, reject) => {
        commit("API_REQUEST");
        axios
          .get(url)

          //gestisco il successo
          .then(resp => {
            commit("API_SUCCESS");
            resolve(resp);
          })

          //gestisco errori
          .catch(error => {
            commit("REQUEST_ERROR");
            reject(error);
          });
      });
    },

    API_POST({ commit }, url, payload) {
      return new Promise((resolve, reject) => {
        commit("API_REQUEST");
        axios
          .post(url, payload)

          //gestisco il successo
          .then(resp => {
            commit("API_SUCCESS");
            resolve(resp);
          })

          //gestisco errori
          .catch(error => {
            commit("REQUEST_ERROR");
            reject(error);
          });
      });
    },

    API_PUT({ commit }, url, payload) {
      return new Promise((resolve, reject) => {
        commit("API_REQUEST");
        axios
          .put(url, payload)

          //gestisco il successo
          .then(resp => {
            commit("API_SUCCESS");
            resolve(resp);
          })

          //gestisco errori
          .catch(error => {
            commit("REQUEST_ERROR");
            reject(error);
          });
      });
    },

    API_DELETE({ commit }, url) {
      return new Promise((resolve, reject) => {
        commit("API_REQUEST");
        axios
          .delete(url)

          //gestisco il successo
          .then(resp => {
            commit("API_SUCCESS");
            resolve(resp);
          })

          //gestisco errori
          .catch(error => {
            commit("REQUEST_ERROR");
            reject(error);
          });
      });
    }
  },

  modules: {}
});
