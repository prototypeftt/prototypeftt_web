
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

      <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
      Dismiss Alert!
         <h4 class="alert-heading">Price Alert Triggered!</h4>

      <hr>
      <p class="mb-0">
         <b-table striped hover :items="alertTriggers"></b-table>
      </p>
      </b-alert>

      <!-- No alerts setup - prompt setup-->

      <b-alert
      v-model="showSetupAlertPrompt"
      dismissible
      variant="warning"
      > Dismiss Alert!
         <p><b-button variant="danger" href="./alerts">Click Here</b-button> to Setup Alerts to warn you of large % movements in price.</p>
         
      </b-alert>
      

   </div>

</template>


<script>

import { getAuth } from "firebase/auth";
//import firebase from 'firebase/compat/app';
import { getDatabase, ref, get, child, update,set } from "firebase/database";

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
        institutionList: [],
        assetList:[],
        createAlerts: false,
        showDismissibleAlert: false,
        alerts: [],
        alertTriggers:[],
        showSetupAlertPrompt: true,
        dismissSecs: 10,
        dismissCountDown: 0,
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
         this.createAlerts=true;
      },setupAlerts(uuid) { 
         console.log("setup alerts");
         this.assetList.forEach((asset)=>{
            console.log("assets "+asset.assetId)

            set(ref(database, 'alerts/' + uuid + '/' + asset.assetId), {
            "assetCategory": asset.assetCategory,
            "assetId": asset.assetId,
            "assetName": asset.assetName,
            "alertLevel": "0"
         }).then(() => {
            // Data saved successfully!
            console.log("alerts saved");
            // do this last redirect to dashboard page
            //this.$router.push('dashboard');
         })
            .catch((error) => {
               // The write failed...
               console.log("error alerts not saved" + error);
            });

         });
      },checkAlerts() {
         console.log("check alerts");
         this.alerts.forEach(alert => {
            this.assetList.forEach(asset => {
               if (asset.assetId == alert.assetId) {
                  console.log("Alert Matched to Asset");
                  if (asset.assetMovement > alert.alertLevel){
                     this.alertTriggers.push(alert);
                     this.showDismissibleAlert=true;
                     this.showSetupAlertPrompt=false;
                     console.log("higher");
                  }
               }
            })
         })
      },countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      }

   },
   watch: {
      createAlerts(){
         this.setupAlerts(auth.currentUser.uid); //setup alerts default
      }

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

      // Get list of institutions
      dbref = ref(database, 'institutions/');
      get(child(dbref, `/`)).then((snapshot) => {
         if (snapshot.exists()) {
            //console.log("institutions exist " + snapshot.val());
            //this.institutionList = snapshot.val();
            snapshot.forEach( item => {this.institutionList.push({ value: item.val(), text: item.val() });}
           // this.institutionList.push({ value: snapshot.val(), text: snapshot.val() });
            //  console.log("insti");
            );
         } else {
            console.log("No institution data available");
            //this.writeUserData(auth.currentUser.uid);
         }
      }).catch((error) => {
         console.error(error);
      });

      // Get list of assets

      dbref = ref(database,'assets/');

      get(child(dbref, 'CRYPTO')).then((snapshot) => {
            if (snapshot.exists()) {

               snapshot.forEach( item => {
                  
                  this.assetList.push(item.val());
                  
               }); // Adds each asset type to an array

            } else {
               console.log("No client data available");
            }
         }).then(() => {
               console.log("asset list" + this.assetList.length + "current user" + auth.currentUser.uid);

            }).catch((error) => {
            console.error(error);
         });

         get(child(dbref, 'STOCK')).then((snapshot) => {
            if (snapshot.exists()) {

               snapshot.forEach( item => {
                  
                  this.assetList.push(item.val());
                  
               }); // Adds each asset type to an array

            } else {
               console.log("No client data available");
            }
         }).then(() => {
               console.log("asset list" + this.assetList.length + "current user" + auth.currentUser.uid);

            }).catch((error) => {
            console.error(error);
         });     
         

         // Get the list of alerts that have been setup

         dbref = ref(database, 'alerts/');
         get(child(dbref, `${auth.currentUser.uid}/`)).then((snapshot) => {
            if (snapshot.exists()) {
               console.log("alerts exist");

               snapshot.forEach( item => {
                  
                  if (item.val().alertLevel != "0"){
                     this.alerts.push(item.val());
                     this.showSetupAlertPrompt=false;
                  }
                  
               }); // Adds each alert to an array

               this.checkAlerts(); // check if alerts have been triggered by asset movement

            } else {
               console.log("No alerts exist");  // show prompt
               //this.writeUserData(auth.currentUser.uid);
               this.showSetupAlertPrompt = true;
            }
         }).catch((error) => {
            console.error(error);
         });
         

   },
};

</script>



<style>

</style>