import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
const loginURL = "http://localhost:5000/api/user/login";
const regURL = "http://localhost:5000/api/user/register";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

    //stati usati per il login vero
    token: localStorage.getItem("user-token") || "", //JWT conservato anche se localstorage non disponibile
    status: "", //status interno della applicazione per richieste di login, regitrazione e altre API
    socket: {
      isConnected: false, //questo stato non viene mai usato, ma potrebbe servire quindi lo tengo
      loading: false,
    }
  },

  getters: {
    isAuthenticated: state => !!state.token,
    getStatus: state => state.status,
    isLoading: state =>
      state.status == "loading" ||
      state.status == "reg-loading" ||
      state.status == "api-loading"
    ,
    isSocketConneted: state => state.socket.isConnected,
    isSocketLoading: state => state.socket.loading,
    
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
    },

    /* Mutazioni Websocket */

    //COMMENTO: ONOPEN e ONCLOSE non sono usate per il momento
    //          però potrebbero essere utili quindi le tengo
    SOCKET_ONOPEN (state)  {
      /* Vue.prototype.$socket = event.currentTarget */ 
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state)  {
      state.socket.isConnected = false
    },
    SOCKET_ONMESSAGE (state)  {
      state.socket.loading = false
    },
    SOCKET_ONSEND (state) {
      state.socket.loading = true
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
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            commit("AUTH_SUCCESS", token);
            //apro il websocket, this._vm accede all'istanza Vue
            this._vm.$connectwithtoken(this.state.token)  //funzione definita da me in main.js
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
        //chiudo il websocket, this._vm accede all'istanza Vue
        this._vm.$disconnect();
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
            commit("REQUEST_ERROR", error);
            reject(error);
          });
      });
    },

    API_POST({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit("API_REQUEST");
        axios
          .post(params.url, params.payload)

          //gestisco il successo
          .then(resp => {
            commit("API_SUCCESS");
            resolve(resp);
          })

          //gestisco errori
          .catch(error => {
            commit("REQUEST_ERROR", error);
            reject(error);
          });
      });
    },

    API_PUT({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit("API_REQUEST");
        axios
          .put(params.url, params.payload)

          //gestisco il successo
          .then(resp => {
            commit("API_SUCCESS");
            resolve(resp);
          })

          //gestisco errori
          .catch(error => {
            commit("REQUEST_ERROR", error);
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
            commit("REQUEST_ERROR", error);
            reject(error);
          });
      });
    },


    /* Azioni websocket */
    FITBIT_SYNC({ commit }, socket) {
      try {
        socket.sendObj({
        //l'autemticazione è spostata all'apertura della connessione, non serve più inviare il token qui
        action: "fitbitsync"
        });
        commit("SOCKET_ONSEND");
      } catch (err) {   //in realtà da lato vue non sembra lanciare errori, ma comunque è sempre meglio un try-catch in più che uno in meno
        alert("Errore durante l'invio della richiesta di sincronizzazione");
      }
    }
  },

  modules: {}
});
