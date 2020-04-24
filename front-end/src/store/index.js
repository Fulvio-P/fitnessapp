import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isUserLoggedIn: false,
    loginDialog: false
  },
  mutations: {
    login(state) {
      state.isUserLoggedIn = true;
    },
    logout(state) {
      state.isUserLoggedIn = false;
    },
    displayLoginDialog(state, payload){
      state.loginDialog = payload;
    }

  },
  actions: {
    login({ commit }) {
      commit("login");
    },
    logout({ commit }) {
      commit("logout");
    },
    displayLoginDialog({commit}, payload){
      commit('displayLoginDialog', payload);
    }
  },
  modules: {}
});
