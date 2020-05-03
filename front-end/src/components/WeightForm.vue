<template>
  <div class="weight-form">
    <b-form @submit="sendWeight">
      <b-container>
        <b-row>
          <b-col>
            Inserisci il tuo peso
          </b-col>
          <b-col>
            <b-form-spinbutton
              id="weight-input"
              inline
              min="0"
              max="500"
              step="0.1"
              v-model="weight"
            ></b-form-spinbutton>
          </b-col>
          <b-col>
            <b-form-select :options="options" required></b-form-select>
          </b-col>
        </b-row>
      </b-container>

      <b-button type="submit">Registra peso</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";

//Non sono riuscito a far funzionare dotenv

export default {
  name: "WeightForm",
  data() {
    return {
      weight: 60,
      options: [
        { value: "kg", text: "kg" },
        { value: "lb", text: "lb" }
      ]
    };
  },
  methods: {
    sendWeight() {
      axios
        .post("http://localhost:5000/weight", {
          weight: this.weight
        })
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }
  }
};
</script>
