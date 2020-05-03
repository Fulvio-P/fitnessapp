<template>
  <div class="activities-form">
    <b-form @submit="sendActivity">
      <!-- Cibo mangiato -->
      <b-form-input
        id="activity-input"
        v-model="activityItem"
        placeholder="Inserisci una attività"
        type="text"
        required
      ></b-form-input>

      <!-- Quantità del cibo -->
      <b-form-input
        id="activity-time"
        v-model="activityTime"
        type="time"
      ></b-form-input>

      <b-form-input
        id="activity-energy"
        v-model="activityEnergy"
        placeholder="350"
        type="number"
        required
      ></b-form-input>

      <b-button type="submit">Regitra attività</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ActivitiesForm",
  data() {
    return {
      activityItem: undefined,
      activityTime: undefined,
      activityEnergy: undefined
    };
  },
  methods: {
    sendActivity(ev) {
      ev.preventDefault();
      axios.post("http://localhost:5000/activities", {
        activityItem: this.activityItem,
        activityTime: this.activityTime,
        activityEnergy: this.activityEnergy
      });
      ev.target.reset();
    }
  }
};
</script>
