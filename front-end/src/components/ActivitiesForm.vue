<template>
    <div class="activities-form">
        <b-form>

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
export default {
    name:"ActivitiesForm",
    data(){
        return{
            activityItem: undefined,
            activityTime: undefined,
            activityEnergy: undefined
        }
    }
}
</script>