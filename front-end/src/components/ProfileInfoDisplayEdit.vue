<template>
  <div>
    <div id="main">
      <p v-if="isDispMode" class="disp">
        {{ infoDisplay }}
      </p>
      <span v-else-if="isEditMode" class="edit">
        <b-form @submit.prevent="putInfo" id="theform">
          <b-form-input
            required
            :type="inputType"
            v-model="editInput"
            :placeholder="'Nuovo/a ' + infoname.toLowerCase()"
          />
        </b-form>
      </span>
    </div>
    <div id="buttons">
      <span v-if="isDispMode" class="disp">
        <b-button v-if="isDispMode" @click="toEditMode()" class="pide-button">
          Modifica
        </b-button>
      </span>
      <span v-else-if="isEditMode" class="edit">
        <!--Questo bottone è un po' diverso dagli altri: è collegato alla form che contiene il campo di input e ne scatena l'evento submit. Il tutto è stato necessario per permettermi di sfruttare la validazione automatica del campo di input di una form.-->
        <b-button
          form="theform"
          type="submit"
          v-if="isEditMode"
          class="pide-button pide-confirm-btn"
        >
          Conferma
        </b-button>
        <b-button v-if="isEditMode" @click="deleteInfo()" class="pide-button pide-delete-btn">
          Elimina
        </b-button>
        <b-button v-if="isEditMode" @click="toDispMode" class="pide-button">
          Annulla
        </b-button>
      </span>
    </div>
  </div>
</template>

<script>
const DISP_MODE = 0;
const EDIT_MODE = 1;
var mode = 0;
var infoDisplay = "";
var editInput = "";
const profileUrl = "http://localhost:5000/api/profile/"; //manca il nome della specifica info di profilo, da passare come prop di questa componente
const translator = {
  Email: "email",
  Altezza: "height"
};
export default {
  name: "ProfileInfoDisplayEdit",
  props: ["infoname"],
  data() {
    return {
      DISP_MODE,
      EDIT_MODE,
      mode,
      infoDisplay,
      editInput
    };
  },
  computed: {
    isDispMode() {
      return this.mode == DISP_MODE;
    },
    isEditMode() {
      return this.mode == EDIT_MODE;
    },
    inputType() {
      switch (this.infoname) {
        case "Email":
          return "email";
        case "Altezza":
          return "number";
        default:
          return "text";
      }
    }
  },
  methods: {
    toEditMode() {
      this.mode = EDIT_MODE;
    },
    toDispMode() {
      this.mode = DISP_MODE;
      this.editInput = "";
    },
    setDisplay(newDisp) {
      this.infoDisplay = newDisp ? newDisp : "[non presente]";
    },
    getInfo() {
      this.$store
        //avvio chiamata API (gestita da vuex)
        .dispatch("API_GET", profileUrl + translator[this.infoname])
        //se tutto va bene
        .then(resp => {
          this.setDisplay(resp.data[this.infoname.toLowerCase()]);
        })
        //se qualcosa va male
        .catch(err => {
          alert(this.$store.state.status);
        });
    },
    putInfo() {
      if (
        confirm(
          "Sei sicuro di voler apportare questa modifica?\nNon può essere annullata."
        )
      ) {
        var payload = {};
        payload[this.infoname.toLowerCase()] = this.editInput;
        this.$store
          //avvio chiamata API (gestita da vuex)
          .dispatch("API_PUT", {
            url: profileUrl + translator[this.infoname],
            payload
          })
          //se tutto va bene
          .then(resp => {
            //alla PUT faccio comunque tornare la nuova info, quindi la scrivo tranquillamente senza bisogno di un'altra GET
            this.setDisplay(resp.data[this.infoname.toLowerCase()]);
            this.toDispMode();
          })
          //se qualcosa va male
          .catch(err => {
            alert(this.$store.state.status);
          });
      }
    },
    deleteInfo() {
      if (
        confirm(
          "Sei sicuro di voler ELIMINARE DEFINITIVAMENTE questa proprietà?\nQuest'azione non può essere annullata."
        )
      ) {
        this.$store
          //avvio chiamata API (gestita da vuex)
          .dispatch("API_DELETE", profileUrl + translator[this.infoname])
          //se tutto va bene
          .then(resp => {
            this.getInfo();
            this.toDispMode();
          })
          //se qualcosa va male
          .catch(err => {
            alert(this.$store.state.status);
          });
      }
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style scoped>
#main .disp {
  margin: 0.45em 0; /*margine totale 0.9em, ma testo centrato verticalmente*/
}
.pide-button {
  margin: 5px 2px;
  width: 7em;
}
.pide-confirm-btn {
  background-color: var(--nord14);
  transition: 500ms
}
.pide-confirm-btn:hover {
  filter: hue-rotate(-15deg) brightness(110%)  /*schiarisce e diventa un po' giallino*/
}
.pide-delete-btn {
  background-color: var(--nord11);
}
.pide-delete-btn:hover {
  background-color: var(--nord12);
}
</style>
