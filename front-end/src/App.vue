<template>
  <div id="app">
    <ShySideNavbar :avoidroutes="['/']" />
    <router-view />
  </div>
</template>

<script>
import ShySideNavbar from "@/components/ShySideNavbar";

export default {
  name: "App",
  components: {
    ShySideNavbar
  }
};
</script>

<style>
:root {
  /*mi sono stufato di copincollare dal sito di nord 30 volte per scegliere il colore giusto*/
  --nord0: #2e3440;
  --nord1: #3b4252;
  --nord2: #434c5e;
  --nord3: #4c566a;
  --nord4: #d8dee9;
  --nord5: #e5e9f0;
  --nord6: #eceff4;
  --nord7: #8fbcbb;
  --nord8: #88c0d0;
  --nord9: #81a1c1;
  --nord10: #5e81ac;
  --nord11: #bf616a;
  --nord12: #d08770;
  --nord13: #ebcb8b;
  --nord14: #a3be8c;
  --nord15: #b48ead;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--nord6);
  color: var(--nord0);
}

.sidebar-margin {
  margin: 0;
  padding: 0;
  margin-left: 5.5rem;
}

/*
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
