import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
const loginURL = 'http://localhost:5000/api/user/login';
const regURL = "http://localhost:5000/api/user/register";

Vue.use(Vuex);

export default new Vuex.Store({
  
  state: {
    
    /* loginDialog: false, */ //Overlay disabilitato

    //stati usati per il login vero
    token: localStorage.getItem('user-token') || '', //JWT conservato anche se localstorage non disponibile
    status: '', //status del login: loading|success|error
  },

  getters:{
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status
  },

  mutations: {
    
    /* Mutazioni usate dal login */
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

    /* Mutazione del logout */
    AUTH_LOGOUT(state){
      state.token = '';
      state.status = '';
    },

    /* Mutazioni registrazione */
    //segna l'inizio della registrazione
    REGISTER_REQUEST(state){
      state.status='reg-loading';
    },

    //segna successo della registrazione
    REGISTER_SUCCESS(state, token){
      state.status = 'reg-success';
      state.token = token;
    },

    //segna errore della registrazione
    REGISTER_ERROR(state){
      state.status = 'reg-error';
    },
    /* Fine mutazioni registrazione */



  },
  
  actions: {

    /* Azione del login*/
    AUTH_REQUEST({commit}, user){
      
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

    /* Azione di registrazione */
    REGISTER_REQUEST({commit}, user){
      
      return new Promise((resolve,reject)=>{
        commit('REGISTER_REQUEST');
        axios.post(regURL, user)

        //gestisco successo registrazione
        .then(resp => {
          //salvo il token
          const token = resp.data.token;
          localStorage.setItem('user-token', token);
          //imposto il token come header di default
          axios.defaults.headers.common['Authorization'] = token;
          commit('REGISTER_SUCCESS', token);
          resolve(resp);
        })

        //gestisco risposte negative
        .catch(err => {
          commit('REQUEST_ERROR', err);
          //rimuovo il token dal local storage per sicurezza
          localStorage.removeItem('user-token');
          //rimuovo il token dall'header per sicurezza
          delete axios.defaults.headers.common['Authorization'];
          reject(err)
        })
        
      })
    }


  },
  
  modules: {}
});
