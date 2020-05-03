<!--
Un router-link che assume classe "active" se la route corrente è la sua route bersaglio.
Utile da usare nelle navbar.
-->

<template>
    <router-link :to="toProp" v-bind:class="activeCondition">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    name: "ActivatingRouterLink",
    props: ["to"],
    computed: {
        toProp() {
            return this.to;
        },
        activeCondition() {
            return { active: this.$route.path == this.to };
        }
    }
}
</script>

<style scoped>

</style>