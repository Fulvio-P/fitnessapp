<template>
  <div>
    <div id="navigation">
      <Topbar />
    </div>
    <Carousel />
    <LandBottom />
    <Footer />

    <b-overlay :show="$store.state.loginDialog" no-wrap>
      <template v-slot:overlay>
        <LoginDialog />
      </template>
    </b-overlay>
    
  </div>
</template>

<script>
import Topbar from "@/components/Topbar.vue";
import Carousel from "@/components/Carousel.vue";
import LandBottom from "@/components/LandBottom.vue";
import Footer from "@/components/LandingFooter.vue";
import LoginDialog from "@/components/LoginDialog.vue";


export default {
  name: "Home",
  components: {
    Topbar,
    Carousel,
    LandBottom,
    Footer,
    LoginDialog
  }
};
</script>
