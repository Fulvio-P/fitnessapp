<template>
    <div class="off-form">
        <b-form @submit.prevent="pippo">

            <b-form-group label="Codice a barre del cibo consumato">
                <b-form-input
                    id="off-barcode"
                    v-model="barcode"
                    placeholder="0123456123456"
                    type="number"
                    required
                />
            </b-form-group>

            <b-form-group label="Quantità consumata (in g, ml, o altra unità appropriata)">
                <b-form-input
                    id="off-quantita"
                    v-model="quantita"
                    placeholder="100"
                    type="number"
                />
            </b-form-group>

            <b-form-group label="Giorno associato al record">
                <b-form-datepicker
                    id="food-data"
                    v-model="data"
                />
            </b-form-group>

            <b-button type="submit">Chiedi a Open Food Facts e registra calorie</b-button>

        </b-form>
    </div>
</template>

<script>
export default {
    name: "OFFForm",
    data() {
        return {
            barcode: undefined,
            quantita: undefined,
            data: undefined
        }
    },
    methods: {
        pippo() {
            alert("pippo");
        }
    }
}
</script>

<style scoped>

</style>