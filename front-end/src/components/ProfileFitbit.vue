<template>
    <div>
        <h1>Account FitBit</h1>
        <div v-show="fitbitConnected">
            <p> Hai eseguito l'acesso a FitBit come {{fitbit_user}} </p>
            <b-button @click="fitbitLogout" > Dissocia </b-button>
        </div>
        <div v-show="!fitbitConnected">
            <p> Associa un account FitBit per ottenere la possibilità di importare gli allenamenti </p>
            <b-button v-bind:href="authURI" > Associa </b-button>
        </div>
    </div>
</template>

<script>

const clientID = process.env.VUE_APP_FITBIT_ID;
const callbackURL = "http://localhost:8080/profile";

const authURI = "https://www.fitbit.com/oauth2/authorize?"+
                "response_type=code&"+
                "client_id="+clientID+"&"+
                "redirect_uri="+callbackURL+"&"+
                "scope=activity%20profile";
                

//Da modificare: link legacy
const fitbitUserUrl = "http://localhost:5000/api/profile/fitbitusr";
const fitbitUrl = "http://localhost:5000/fitbit";

export default {
    data() {
        return {
            fitbit_user: undefined,
            fitbitUrl: fitbitUrl,
            authURI: authURI,
        }
    },
    methods: {
        
        //recupera username di fitbit se presente nel backend
        getFitbitInfo() {
            this.$store
            //avvio chiamata API (gestita da vuex)
            .dispatch("API_GET", fitbitUserUrl )
            //se tutto va bene
            .then(resp => {
                this.fitbit_user = resp.fitbit_user;
            })
            //se qualcosa va male
            .catch(err => {
                console.log(err);
                alert(this.$store.state.status);
            });
        },
        
        //cancella token e username di fitbit se presenti nel backend
        fitbitLogout(){
            this.$store
            //avvio chiamata API (gestita da vuex)
            .dispatch("API_DELETE", fitbitUserUrl )
            //se tutto va bene
            .then( () => {
                alert("Account Fitbit dissociato")
            })
            //se qualcosa va male
            .catch(err => {
                console.log(err);
                alert(this.$store.state.status);
            });
        },
    
    },
    created() {
        //decommentare solo quando il backend salva i dati nel db
        /* this.getFitbitInfo(); */
    },
    computed: {

        //vale true se nel backend è sono presenti dati fibit
        fitbitConnected () {
            if(this.fitbit_user) return true;
            else return false;
        },
    },
}
</script>