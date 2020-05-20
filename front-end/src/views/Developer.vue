<template>
    <div class="padding">
        <h1>Pagina developer</h1>
        <h3>Registra una nuova applicazione</h3>
        <DeveloperForm @posted="updateTable" />
        <hr />
        <h3>Le tue applicazioni</h3>
        <DeveloperTable ref="devTable" />
    </div>
</template>

<script>
import DeveloperForm from '@/components/DeveloperForm.vue';
import DeveloperTable from '@/components/DeveloperTable.vue';

export default {
    components:{
        DeveloperForm,
        DeveloperTable
    },
    methods: {
        updateTable() {
            this.$refs.devTable.getClients();
        }
    }
}
</script>