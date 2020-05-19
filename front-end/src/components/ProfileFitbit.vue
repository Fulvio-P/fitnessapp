<template>
    <div>
        <h1>Account FitBit</h1>
        <div v-show="fitbitConnected">
            <p> Hai eseguito l'acesso a FitBit come {{fitbitUser}} </p>
            <b-button @click="fitbitLogout" > Dissocia </b-button>
            <p> Premi questo bottone per importare attività da Fitbit</p>
            <FitbitSyncBtn />
        </div>
        <div v-show="!fitbitConnected">
            <p> Associa un account FitBit per ottenere la possibilità di importare gli allenamenti </p>
            <b-button v-bind:href="authURI" > Associa </b-button>
        </div>
    </div>
</template>

<script>
import FitbitSyncBtn from "@/components/FitbitSyncBtn.vue";
const clientID = process.env.VUE_APP_FITBIT_ID;
const callbackURL = "http://localhost:8080/profile";

const authURI = "https://www.fitbit.com/oauth2/authorize?"+
                "response_type=code&"+
                "client_id="+clientID+"&"+
                "redirect_uri="+callbackURL+"&"+
                "scope=activity%20profile";
                


const fitbitURL = "http://localhost:5000/api/profile/fitbit"


export default {
    components: {
        FitbitSyncBtn,
    },
    data() {
        return {
            fitbitUser: undefined,
            authURI: authURI,
        }
    },
    methods: {

        //invia il l'auth code al backend che lo scabierà per i token
        fitbitLogin(){

            //recupero payload dalla URL query
            console.log(this.$route.query.code);
            const payload = {authCode: this.$route.query.code};
            //reset della route
            this.$router.push(this.$route.path)
            
            //chiamata API di vuex
            this.$store
            .dispatch("API_PUT",{
                url: fitbitURL,
                payload: payload
            })
            
            //DA MODIFICARE: se tutto va bene messagio di confema
            .then((res)=>{
                alert(res.data);
                //se tutto va bene recupero username per farlo vedere
                this.getFitbitInfo();
            })

            //se qualcosa va male alert di errore
            .catch(()=>{
                alert(this.$store.state.status);
            })

        },
        
        //recupera username di fitbit se presente nel backend
        getFitbitInfo() {
            
            this.$store
            .dispatch("API_GET", fitbitURL)
            
            //se tutto va bene aggiorna i dati locali
            .then(resp => {
                this.fitbitUser = resp.data.fitbituser;
            })
            
            //se qualcosa va male alert di errore
            .catch(()=>{
                alert(this.$store.state.status);
            })

        },
        
        //cancella token e username di fitbit se presenti nel backend
        fitbitLogout(){
            this.$store
            .dispatch("API_DELETE", fitbitURL)
            
            //se tutto va bene aggiorna i dati locali
            .then( () => {
                this.fitbitUser = undefined;
            })
            
            //se qualcosa va male alert di errore
            .catch(()=>{
                alert(this.$store.state.status);
            })
        },
    
    },
    created() {
        //decommentare solo quando il backend salva i dati nel db
        this.getFitbitInfo();

        //quando l'utente viene ridiretto da fitbit questo si attiva
        if(!this.fitbitConnected && this.$route.query.code){
            this.fitbitLogin();
        }
    },
    computed: {

        //vale true se nel backend è sono presenti dati fibit
        fitbitConnected () {
            if(this.fitbitUser) return true;
            else return false;
        },
    },
}
</script>