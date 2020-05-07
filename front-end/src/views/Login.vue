<template>
    <div class="login-page">
        <LoginDialog />
    </div>
</template>


<script>

import LoginDialog from '@/components/LoginDialog.vue';

export default {
    name:'Login',
    components: {
        LoginDialog,
    }
}
</script>

<style scoped>
    .login-page{
        height: 100vh;
    }
</style>