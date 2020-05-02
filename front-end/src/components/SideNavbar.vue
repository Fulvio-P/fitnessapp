<template>
  <nav class="SideNav">
    <ul class="SideNavList">
      <li class="SideNavItem">
        <a href="#" class="SideNavLink">
          <SvgTest class="centopercento luigi" />
          <span class="LinkText">Luigi</span>
        </a>
      </li>
      <li class="SideNavItem">
        <a href="#" class="SideNavLink">
          <SvgTest class="centopercento mario" />
          <span class="LinkText">Mario</span>
        </a>
      </li>
      <li class="SideNavItem">
        <a href="#" class="SideNavLink">
          <SvgTest class="centopercento pippo" />
          <span class="LinkText">Pippo</span>
        </a>
      </li>
      <li class="SideNavItem">
        <a href="#" class="SideNavLink">
          <SvgTest class="centopercento paperino" />
          <span class="LinkText">Paperino</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
//import SvgTest from "@/components/SvgTest.vue";
import SvgTest from "../assets/icons/user-profile.svg";
export default {
  name: "SideNav",
  components: {
    SvgTest
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
  --text-primary: #eceff4; /* nord 6 */
  --text-secondary: #88c0d0; /* nord 8 */
  --bg-primary: #3b4252; /* nord 1 */
  --bg-secondary: #434c5e; /* nord 2 */
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

.SideNavLink:hover {
  filter: grayscale(0%) opacity(1);
  background: var(--bg-secondary);
  color: var(--text-secondary);
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

/* Colori icone */
.luigi .path1 {
  fill: blue;
}
.luigi .path2 {
  fill: green;
}

.mario .path1 {
  fill: blue;
}
.mario .path2 {
  fill: red;
}

.pippo .path1 {
  fill: black;
}
.pippo .path2 {
  fill: green;
}

.paperino .path1 {
  fill: blue;
}
.paperino .path2 {
  fill: yellow;
}

.path1,
.path2 {
  transition: var(--transition-speed);
}
</style>
