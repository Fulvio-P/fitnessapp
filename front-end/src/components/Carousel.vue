<template>
  <div>
    <b-carousel
      controls
      id="carousel-1"
      :interval="8000"
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Slides with custom text -->
      <b-carousel-slide
        class="slide"
        img-src="https://media.giphy.com/media/WopaNdn9m3dJdbCEtw/giphy.gif"
      >
      </b-carousel-slide>

      <!-- Text slides with image -->
      <b-carousel-slide
        class="slide"
        caption="Inizia subito ad usare FitnessApp"
        text="Scorri verso il basso per scoprire di più"
        img-src="https://images.pexels.com/photos/1954521/pexels-photo-1954521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      ></b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
export default {
  name: "Carousel"
};
</script>

<style>

#carousel-1{
  overflow: hidden;
  max-height: 95vh;
  display: flex;
  align-items: center;
}
@media only screen and (min-width: 600px) {
.carousel-caption {
  transform: translateY(-25%);
}
}

</style>