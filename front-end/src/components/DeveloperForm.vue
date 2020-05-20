<template>
    <div>
        <b-form @submit.prevent="registerApp">
            <b-form-group label="Nome applicazione">
                <b-form-input
                    id="dev-clientname"
                    v-model="clientname"
                    placeholder="Inserisci un nome..."
                    required
                />
            </b-form-group>

            <b-form-group label="Redirect URL">
                <b-form-input
                    id="dev-redirect"
                    v-model="redirect"
                    placeholder="Inserisci una URL..."
                    type="url"
                    required
                />
            </b-form-group>

            <b-button type="submit">Registra applicazione</b-button>
        </b-form>
    </div>
</template>

<script>
const devURL = "http://localhost:5000/api/developer";

export default {
    name: "DeveloperForm",
    data() {
        return {
            clientname: "",
            redirect: ""
        }
    },
    methods: {
        registerApp() {
            //recupero dati dal form
            const { clientname, redirect } = this;
            //avvio chiamata API (gestita da vuex)
            this.$store
                .dispatch("API_POST", {
                    url: devURL,
                    payload: { clientname, redirect }
                })
                //se tutto va bene
                .then(() => {
                    alert("Applicazione registrata correttamente");
                    this.clientname = "";
                    this.redirect = "";
                    this.$emit("posted")
                })
                //se qualcosa va male
                .catch(() => {
                    alert(this.$store.state.status);
                    //in questo caso il form non si resetta, l'utente può subito riprovare
                });
        }
    }
}
</script>

<style scoped>

</style>