<template>
    <div>
        <div id="main">
            <p v-if="isDispMode" class="disp">
                [valore della proprietà...]
            </p>
            <span v-else-if="isEditMode" class="edit">
                <b-form-input
                    type="text"
                    v-model="editInput"
                    placeholder="magari potremmo far dipendere il type dalla proprietà che stiamo modificando..."
                />
            </span>
        </div>
        <div id="buttons">
            <span v-if="isDispMode" class="disp">
                <b-button
                    v-if="isDispMode"
                    @click="TEMP_setMode(EDIT_MODE)"
                    class="pide-button"
                >
                    Modifica
                </b-button>
            </span>
            <span v-else-if="isEditMode" class="edit">
                <b-button
                    v-if="isEditMode"
                    @click="alert('TODO invio al server...')"
                    class="pide-button"
                >
                    Conferma
                </b-button>
                <b-button
                    v-if="isEditMode"
                    @click="alert('TODO sei sicuro!??!')"
                    class="pide-button"
                >
                    ELIMINA
                </b-button>
                <b-button
                    v-if="isEditMode"
                    @click="TEMP_setMode(DISP_MODE)"
                    class="pide-button"
                >
                    Annulla
                </b-button>
            </span>
        </div>
    </div>
</template>

<script>
const DISP_MODE=0;
const EDIT_MODE=1;
var mode = 0;
var editInput = "";
export default {
    name: "ProfileInfoDisplayEdit",
    data() {
        return {
            DISP_MODE,
            EDIT_MODE,
            mode,
            editInput
        }
    },
    computed: {
        isDispMode() {
            return this.mode==DISP_MODE;
        },
        isEditMode() {
            return this.mode==EDIT_MODE;
        }
    },
    methods: {
        TEMP_setMode(m) {
            this.mode=m;
        }
    }
}
</script>

<style scoped>
#main .disp {
    margin: 0.45em 0;  /*margine totale 0.9em, ma testo centrato verticalmente*/
}
.pide-button {
    margin: 5px 2px;
}
</style>