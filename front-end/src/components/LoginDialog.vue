<template>
    <div
        ref="dialog"
        tabindex="-1"
        role="dialog"
        aria-modal="false"
        aria-labelledby="form-confirm-label"
        class="text-center p-3"
        >
        <p><strong id="form-confirm-label">Log in</strong></p>
            <b-button @click="login">Log in with Google</b-button>
    </div>
</template>


<script>
export default {
    name:"LoginDialog",
    methods: {
        login() {
        this.$store.dispatch("login");
        } 
    }  

}
</script>