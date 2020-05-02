<template>
    <div class="weight-form">
        <b-form>
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
                        <b-form-select :options="options"></b-form-select>
                    </b-col>
                </b-row>
            </b-container>
            
            <b-button type="submit">Registra peso</b-button>
        </b-form>
        
    </div>
</template>

<script>
export default {
    name:"WeightForm",
    data(){
        return{
            weight: 60,
            options: [
                {value: "kg", text: "kg"},
                {value: "lb", text: "lb"}
            ]
        }
    }
}
</script>