<template>
    <div class="padding">
        <h1>Pagina developer</h1>
        <h3>Registra una nuova applicazione</h3>
        <DeveloperForm />
        <hr />
        <h3>Le tue applicazioni</h3>
        <DeveloperTable />
    </div>
</template>

<script>
import DeveloperForm from '@/components/DeveloperForm.vue';
import DeveloperTable from '@/components/DeveloperTable.vue';

export default {
    components:{
        DeveloperForm,
        DeveloperTable
    }    
}
</script>