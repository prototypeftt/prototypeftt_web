
<template>

   <div>

            <b-form-group label="Financial Institution" label-for="institution-input" invalid-feedback="Institution required" :state="institutionState">
               <b-form-select id="institution-input" v-model="institution" :options="institutionList" :state="institutionState" required></b-form-select>
            </b-form-group>

   </div>

</template>


<script>

import { getAuth } from "firebase/auth";

import { getDatabase, ref, get, child, update } from "firebase/database";

const auth = getAuth();

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
       writeUserData: function (userId) {
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

      console.log(`brokers/${auth.currentUser.uid}/clients`);

      //Use filter to only select clients for that broker
      var dbref = ref(database, 'brokers/');

      // Only allows the logged in Broker to see their own clients

      get(child(dbref, `${auth.currentUser.uid}/clients`)).then((snapshot) => {
         if (snapshot.exists()) {
            //console.log("institutions exist " + snapshot.val());
            //this.institutionList = snapshot.val();
            snapshot.forEach( item => {this.institutionList.push({ value: item.val(), text: item.val() });}
           // this.institutionList.push({ value: snapshot.val(), text: snapshot.val() });
            //  console.log("insti");
            );
            this.$bvModal.show('modal-setup');
         } else {
            console.log("No client data available");
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