<template>
    <div class="food-form">
        <b-form>

            <!-- Cibo mangiato -->
            <b-form-input
            id="food-input"
            v-model="foodItem"
            placeholder="Cosa hai mangiato ?"
            type="search"
            required
            ></b-form-input>

            <!-- Quantità del cibo -->
            <b-form-input
            id="food-input"
            v-model="foodQuantity"
            placeholder="Quanti grammi ?"
            type="number"
            min="0"
            max="1000"
            ></b-form-input>

            <b-form-input
            id="food-energy"
            v-model="foodEnergy"
            placeholder="350"
            type="number"
            required
            ></b-form-input>

            <b-button type="submit">Regitra calorie</b-button>
            
        </b-form>
        
    </div>
</template>


<script>
export default {
    name:"FoodForm",
    data(){
        return{
            foodItem: undefined,
            foodQuantity: undefined,
            foodEnergy: undefined
        }
    }
}
</script>