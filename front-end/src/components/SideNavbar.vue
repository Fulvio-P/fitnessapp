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
          <span class="LinkText">Paper.</span>
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
  filter: grayscale(100%) opacity(0.7);
  transition: 600ms
}
.SideNavLink:hover {
  filter: grayscale(0%) opacity(1);
  background: purple;
  color: skyblue;
}

.centopercento {
  width: 100%;
  height: 100%;
}

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
</style>
