import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
const loginURL = 'http://localhost:5000/api/user/login';

Vue.use(Vuex);

export default new Vuex.Store({
  
  state: {
    loggedId: null,
    isUserLoggedIn: false,
    loginDialog: false,

    //stati usati per il login vero
    token: localStorage.getItem('user-token') || '', //JWT conservato anche se localstorage non disponibile
    status: '', //status del login: loading|success|error
  },

  getters:{
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status
  },

  mutations: {
    setLoggedId(state, id) {
      state.loggedId = id;
      if (id) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    displayLoginDialog(state, payload) {
      state.loginDialog = payload;
    },



    /* Mutazioni usate dal login vero */

    //segna l'inizio del login
    AUTH_REQUEST(state){
      state.status='loading';
    },

    //segna successo nel login
    AUTH_SUCCESS(state, token){
      state.status = 'success';
      state.token = token;
    },

    //segna errore del login
    AUTH_ERROR(state){
      state.status = 'error';
    },

    /* Fine mutazioni del login vero */



  },
  
  actions: {
    login({ commit }) {
      //TODO fare versione con id parametrico una volta pronto il login fatto bene
      commit("setLoggedId", 1);
    },
    logout({ commit }) {
      commit("setLoggedId", null);
    },
    displayLoginDialog({ commit }, payload) {
      commit("displayLoginDialog", payload);
    },

    /* Azione del login vero*/
    AUTH_REQUEST({commit, dispatch}, user){
      
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        axios.post(loginURL, user)

        //gestisco la risposta positiva
        .then(resp => {
          //salvo il token
          const token = resp.data.token;
          localStorage.setItem('user-token', token);
          //imposto il token come header di default
          axios.defaults.headers.common['Authorization'] = token;
          commit('AUTH_SUCCESS', token);
          dispatch('USER_REQUEST');
          resolve(resp);
        })
        
        //gestisco risposte negative
        .catch(err => {
          commit('AUTH_ERROR', err);
          //rimuovo il token dal local storage
          localStorage.removeItem('user-token');
          //rimuovo il token dall'header
          delete axios.defaults.headers.common['Authorization'];
          reject(err)
        })

      })
    },

    /* Azione di logout */
    AUTH_LOGOUT({commit}){
      return new Promise((resolve) =>{
        commit('AUTH_LOGOUT');
        localStorage.removeItem('user-token');
        resolve();
      })
    },


  },
  
  modules: {}
});
