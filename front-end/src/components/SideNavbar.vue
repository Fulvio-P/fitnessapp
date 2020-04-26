<template>
  <nav class="SideNav">
    <ul class="SideNavList">
      <li class="SideNavItem">
        <a href="#" class="SideNavLink">
          <SvgTest class="centopercento" />
          <span class="LinkText">Food</span>
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
.SideNav {
  font-size: 16px;
  width: 5rem;
  height: 100vh;
  position: fixed;
  background: pink;
}

.SideNavList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.SideNavItem {
  width: 100%;
}

.SideNavItem:last-child {
  margin-top: auto;
}

.SideNavLink {
  display: flex;
  height: 5rem;
  text-decoration: none;
  align-items: center;
}

.centopercento {
  width: 100%;
  height: 100%;
}

.path1 {
  fill: blue;
}
.path2 {
  fill: green;
}
</style>
