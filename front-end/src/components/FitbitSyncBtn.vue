<template>
    <div>
        <b-overlay :show="this.$store.getters.isSocketLoading" 
        class="d-inline-block"
        rounded
        spinner-small 
        >
        <b-button
            @click="richiediFitbitsync"
        >
            Clicca qui per sincronizzare con FitBit
             
        </b-button>
        </b-overlay>
        <b-card style="background-color:var(--nord13);">
            <p>
                A causa dei limiti delle API Fitbit si possonon importare al massimo <br>
                20 record di attività per volta, se la tua attività più recente non <br>
                appare, invia una nuova richiesta di sincronizzazione.
            </p>
        </b-card>
    </div>
</template>

<script>
export default {
    name: "FitbitSyncBtn",
    methods: {
        richiediFitbitsync() {
            this.$store.dispatch("FITBIT_SYNC", this.$socket);
        }
    }
}
</script>

<style scoped>

</style>