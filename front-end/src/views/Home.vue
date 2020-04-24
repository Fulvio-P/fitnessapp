<template>
  <div>
    <Carousel />
    <LandBottom />
    <Footer />
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";
import LandBottom from "@/components/LandBottom.vue";
import Footer from "@/components/LandingFooter.vue";

export default {
  name: "Home",
  components: {
    Carousel,
    LandBottom,
    Footer
  }
};
</script>
