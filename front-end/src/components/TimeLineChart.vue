<!--
Nulla da documentare, non facciamo altro che "concretizzare" il grafico assegnandogli un tipo.
Tutta la logica è già stata definita altrove.
-->

<!--
NON mettere <template> nei grafici, per indicazione della documentazione:
https://vue-chartjs.org/guide/#vue-single-file-components
-->

<script>
import { Line } from "vue-chartjs";
import timeChartCommons from "@/components/timeChartCommons.js";

export default {
  extends: Line,
  mixins: [timeChartCommons]
  //le proprietà sono in chartUtils
  //mounted è in timeChartCommons
};
</script>

<style scoped></style>
