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
            msgobj: {type: "success", message:"TODO mettere un messaggio none" }
        }
    },
    computed: {
        classBindings() {
            return {
                "d-block": this.msgobj.type!="none",  //classe bootstrapvue
                "d-none": this.msgobj.type=="none",   //classe bootstrapvue
                "col-succ": this.msgobj.type=="success",
                "col-err": this.msgobj.type=="error"
            }
        }
    },
    methods: {
        hide() {
            this.msgobj.type="none";
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
    border: 2px solid #000000b0;
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