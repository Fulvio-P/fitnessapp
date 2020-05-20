<template>
  <div>
    <div id="navigation">
      <Topbar />
    </div>
    <Carousel />
    <LandBottom />
    <Footer />
  </div>
</template>

<script>
import Topbar from "@/components/Topbar.vue";
import Carousel from "@/components/Carousel.vue";
import LandBottom from "@/components/LandBottom.vue";
import Footer from "@/components/LandingFooter.vue";

export default {
  name: "Home",
  components: {
    Topbar,
    Carousel,
    LandBottom,
    Footer
  }
};
</script>
