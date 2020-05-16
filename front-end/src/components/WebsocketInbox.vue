<template>
    <div id="box" v-bind:class="classBindings">
        <p>{{ msgobj.message }}</p>
        <b-button
            @click="hide"
            class="float-right"
        >
            Chiudi
        </b-button>
    </div>
</template>

<script>
export default {
    name: "WebsocketInbox",
    data() {
        return {
            msgobj: {type: "", message:"" }
        }
    },
    computed: {
        classBindings() {
            return {
                //d-block e d-none sono classi boostrapvue, le uso visto che posso
                "d-block": this.msgobj.message,
                "d-none": !this.msgobj.message,
                //invece per i colori voglio quelli della palette, per cui faccio classi custom
                "col-succ": this.msgobj.type=="success",
                "col-err": this.msgobj.type=="error"
            }
        }
    },
    methods: {
        hide() {
            this.msgobj.type="";
            this.msgobj.message="";
        }
    }
}
</script>

<style scoped>
#box {
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 1em 3em;
    border: 2px solid #000000b0;   /*uso il nero trasparente per ottenere un "bordo scuro"*/
    border-radius: 8px;
}
.col-succ {
    background-color: rgba(var(--nord14rgb), 0.8);
}
.col-err {
    background-color: rgba(var(--nord11rgb), 0.8);
}
#box:not(.col-succ):not(.col-err) {  /*non dovrebbe succedere, ma se succede evitiamo situazioni imbarazzanti*/
    background-color: rgba(var(--nord8rgb), 0.8);  /*e poi potrebbe pure servire, chissà*/
}
</style>