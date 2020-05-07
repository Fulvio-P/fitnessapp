<template>
  <nav class="SideNav">
    <ul class="SideNavList">
      <li class="SideNavItem">
        <ActivatingRouterLink to="/charts" class="SideNavLink">
          <BIconGraphUp class="centopercento" />
          <span class="LinkText">Grafici</span>
        </ActivatingRouterLink>
      </li>
      <li class="SideNavItem">
        <ActivatingRouterLink to="/forms" class="SideNavLink">
          <BIconPencilSquare class="centopercento" />
          <span class="LinkText">Registra</span>
        </ActivatingRouterLink>
      </li>
      <li class="SideNavItem">
        <div @click="logout()" class="SideNavLink">
          <BIconHouse class="centopercento" />
          <span class="LinkText">Home</span>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
//import SvgTest from "@/components/SvgTest.vue";
//import SvgTest from "../assets/icons/user-profile.svg";
import { BIconGraphUp, BIconPencilSquare, BIconHouse } from "bootstrap-vue";
import ActivatingRouterLink from "@/components/ActivatingRouterLink.vue";
export default {
  name: "SideNav",
  components: {
    //SvgTest,
    BIconGraphUp,
    BIconPencilSquare,
    BIconHouse,
    ActivatingRouterLink
  },
  methods: {
    logout() {
      this.$store.dispatch("AUTH_LOGOUT").then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style scoped>
/* Large screens */
@media only screen and (min-width: 600px) {
  .SideNav {
    top: 0;
    width: 5rem;
    height: 100vh;
  }

  .SideNav:hover {
    width: 16rem;
  }

  .SideNav:hover .LinkText {
    display: inline;
  }

  .SideNavList {
    flex-direction: column;
  }
}

/* Small screens */
/* ATTENZIONE : sugli schermi piccoli dobbiamo limitare 
il numero di item se ne mettiamo di più*/
@media only screen and (max-width: 600px) {
  .SideNav {
    bottom: 0;
    height: 5rem;
    width: 100%;
  }
  .SideNavList {
    flex-direction: row;
  }

  .SideNavLink {
    justify-content: center;
  }
}

.SideNav {
  --text-primary: var(--nord6);
  --text-secondary: var(--nord8);
  --bg-primary: var(--nord1);
  --bg-secondary: var(--nord2);
  --transition-speed: 600ms;
  position: fixed;
  background-color: var(--bg-primary);
  transition: width 600ms ease;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 16px;
  z-index: 100; /*gli elementi con valori alti vengono mostrati "in primo piano"*/
}

.SideNavList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

.SideNavItem {
  width: 100%;
}

.SideNavItem:last-child {
  margin-top: auto;
}

.SideNavLink {
  display: flex;
  align-items: center;
  height: 5rem;
  color: var(--text-primary);
  text-decoration: none;
  filter: grayscale(100%) opacity(0.7);
  transition: var(--transition-speed);
}

.SideNavLink:hover:not(.active) {
  filter: grayscale(0%) opacity(1);
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.SideNavLink.active {
  background: var(--nord8);
  color: var(--nord2);
  filter: grayscale(0%) opacity(1);
}

.LinkText {
  display: none;
  margin-left: 1rem;
}

.SideNavLink svg {
  width: 2rem;
  min-width: 2rem;
  margin: 0 1.5rem;
}

.centopercento {
  width: 100%;
  height: 100%;
} /*dovrebbe essere inutile, width è data dalla regola .SideNavLink svg*/
</style>
