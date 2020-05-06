import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import store from '../store';

Vue.use(VueRouter);


/* recupero info autenticazione */
const ifNotAuthenticated = (to, from, next) => {
  if(!store.getters.isAuthenticated){
    next();
    return;
  }
  next('/');
}
const ifAuthenticated = (to, from, next) => {
  if(store.getters.isAuthenticated){
    next();
    return;
  }
  next('/');
}






const routes = [
  
  /* Path di test */
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue")
  },

  /* Path buoni */
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated

  },
  {
    path: "/charts",
    name: "Charts",
    component: () => import("../views/Charts.vue"),
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/forms",
    name: "Forms",
    component: () => import("../views/Forms.vue"),
    beforeEnter: ifAuthenticated,
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
