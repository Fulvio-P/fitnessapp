import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedId: null,
    isUserLoggedIn: false,
    loginDialog: false
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
    }
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
    }
  },
  modules: {}
});
