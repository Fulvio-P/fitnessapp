<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="6">
          <Status />
        </b-col>
        <b-col md="6">
          <Status />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Status from "@/components/Status.vue";

export default {
  name: "Home",
  components: {
    Status
  }
};
</script>
