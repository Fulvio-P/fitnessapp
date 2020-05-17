<template>
    <div>
        <b-button
            @click="richiediFitbitsync"
        >
            Clicca qui per sincronizzare con FitBit
        </b-button>
        <b-card style="background-color:var(--nord13);">
            TODO <i>(eliminare una volta fatto)</i>
            <ul>
                <li>
                    Questo bottone ora sta qui per usare il minor numero di clic possibile,
                    ma <b>se alla fine finisce che sincronizziamo solo le attività</b>
                    potremmo anche metterlo nella pagina form con un separatore,
                    similmente a come è messo il form di OpenFoodFacts.<br />
                    Se invece rimane qui, potremmo comunque sistemarlo un po' meglio,
                    ad esempio affiancando affiancando 2-3 bottoni in un b-container.
                </li>
                <li>
                    TODO: v-bindare dinamicamente la proprietà "disabled" di questo bottone
                    per impedire di cliccarlo se non c'è un account FitBit collegato.
                    In ogni caso l'assenza di un account FitBit andrà gestita come erroe nel
                    backend, ma la disabilitare il bottone (e magari mostrare un messaggio che
                    spieghi perché è bloccato) è comunque buon design per il frontend.
                </li>
            </ul>
        </b-card>
    </div>
</template>

<script>
export default {
    name: "FitbitSyncBtn",
    methods: {
        richiediFitbitsync() {
            try {
                this.$socket.sendObj({
                //l'autemticazione è spostata all'apertura della connessione, non serve più inviare il token qui
                action: "fitbitsync"
                });
            } catch (err) {   //in realtà da lato vue non sembra lanciare errori, ma comunque è sempre meglio un try-catch in più che uno in meno
                console.error("and the ws error is...");
                console.error(err);
                alert("Errore durante l'invio della richiesta di sincronizzazione");
            }
        }
    }
}
</script>

<style scoped>

</style>