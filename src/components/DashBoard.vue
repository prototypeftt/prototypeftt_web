
<template>

   <div>
      <!--<b-button v-b-modal.modal-1>Launch demo modal</b-button> -->

      <b-modal id="modal-setup" title="Welcome, please provide some details" @show="resetModal" @hidden="resetModal"
         @ok="handleOk">

         <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="Broker Name" label-for="name-input" invalid-feedback="Name is required" :state="nameState">
               <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
            </b-form-group>
            <b-form-group label="Financial Institution" label-for="institution-input" invalid-feedback="Institution required" :state="institutionState">
               <b-form-select id="institution-input" v-model="institution" :options="institutionList" :state="institutionState" required></b-form-select>
            </b-form-group>
            <b-form-group label="Premium Charged" label-for="premium-input" invalid-feedback="Premium required" :state="premiumState">
               <b-form-input id="premium-input" v-model="premium" :state="premiumState" required></b-form-input>
            </b-form-group>
         </form>

      </b-modal>
   </div>

</template>


<script>

import { getAuth } from "firebase/auth";
//import firebase from 'firebase/compat/app';
import { getDatabase, ref, get, child, update } from "firebase/database";

const auth = getAuth();

// Initialize Firebase app
//var app = firebase.initializeApp(firebaseConfig);

// Reference to database
const database = getDatabase();

export default {
   name: 'DashBoard',
   props: {
   },
   data: () => {
      return {
         name: '',
        nameState: null,
        submittedNames: [],
        premium: '',
        premiumState: null,
        institution: '',
        institutionState: null,
        institutionList: []
      }
   },
   computed: {

   },
   methods: {
      checkFormValidity() {
         const valid = this.$refs.form.checkValidity()
         this.nameState = valid
         this.institutionState = valid
         this.premiumState = valid
         return valid
      }, resetModal() {
         this.name = ''
         this.nameState = null
      }, handleOk(bvModalEvent) {
         // Prevent modal from closing
         bvModalEvent.preventDefault()
         // Trigger submit handler
         this.handleSubmit()
      }, handleSubmit() {
         // Exit when the form isn't valid
         if (!this.checkFormValidity()) {
            return
         }
         // Push the name to submitted names
         //this.submittedNames.push(this.name)
         this.writeUserData(auth.currentUser.uid);
         // Hide the modal manually
         this.$nextTick(() => {
            this.$bvModal.hide('modal-setup')
         })
      }, writeUserData: function (userId) {
         const updates = {};
         updates['/brokers/' + userId + '/premium'] = this.premium;
         updates['/brokers/' + userId + '/name'] = this.name;
         updates['/brokers/' + userId + '/institution'] = this.institution;
         updates['/brokers/' + userId + '/require_setup'] = false;
         update(ref(database), updates);
      },

   },
   watch: {

   },
   mounted() {
      //alert('mounted');

      console.log(`brokers/${auth.currentUser.uid}/require_setup`);

      var dbref = ref(database, 'brokers/');
      get(child(dbref, `${auth.currentUser.uid}/require_setup`)).then((snapshot) => {
         if (snapshot.exists()) {
            console.log("broker exists & modal check " + snapshot.val());

            if (snapshot.val()) {
               this.$bvModal.show('modal-setup');

            } else {
               console.log('not first time here for broker');
            }

         } else {
            console.log("No broker data available");
            //this.writeUserData(auth.currentUser.uid);
         }
      }).catch((error) => {
         console.error(error);
      });

      dbref = ref(database, 'institutions/');
      get(child(dbref, `/`)).then((snapshot) => {
         if (snapshot.exists()) {
            //console.log("institutions exist " + snapshot.val());
            this.institutionList = snapshot.val();
            /*snapshot.forEach(
            this.institutionList.push({ value: snapshot.val(), text: snapshot.val() });
              console.log("insti");
            );*/
         } else {
            console.log("No institution data available");
            //this.writeUserData(auth.currentUser.uid);
         }
      }).catch((error) => {
         console.error(error);
      });

   },
};

</script>



<style scoped>

</style>