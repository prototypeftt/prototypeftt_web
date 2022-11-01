
<template>

   <div>

            <b-form-group label="Financial Institution" label-for="institution-input" invalid-feedback="Institution required" :state="institutionState">
               <b-form-select id="institution-input" v-model="institution" :options="clientList" :state="institutionState" required></b-form-select>
            </b-form-group>

            <b-table striped hover :items="items">

            </b-table>

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
        clientList: [],
        items: []
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
      },queryFunction: function(item,uuid){
         
         var dbref = ref(database, 'clients/');
         
               get(child(dbref, item)).then((snapshot) => {
               if (snapshot.exists()) {
                  console.log("client data" + snapshot.child("broker").val());
                  
                  this.items.push({
                     uuid:uuid,
                     broker:snapshot.child("broker").val(),
                     name:snapshot.child("name").val(),
                     direct:snapshot.child("direct").val(),
                     crypto:snapshot.child("crypto").val()
                  });
                  
                  //snapshot.forEach( item => {this.clientList.push(item.val());});
                  //snapshot.forEach( item => {this.items.push(item.val);});
                  //this.items.push(snapshot.child("crypto").toJSON);
         
               } else {
                  console.log("No client data available");
               }
               }).catch((error) => {
                  console.error(error);
               });

      },

   },
   watch: {

   },
   mounted() {
      //alert('mounted');

      console.log(`brokers/${auth.currentUser.uid}/clients`);

      //Use filter to only select clients for that broker
      var dbref = ref(database, 'brokers/');

      //var client = {name:"no name", uuid:"none", broker:true, direct:false, shares:[{name:"no share name", qty:"200", price:"6.66"}], crypto:[{name:"no crypto name", qty:"100", price:"7.77"}] };
      
      // Only allows the logged in Broker to see their own clients

      get(child(dbref, `${auth.currentUser.uid}/clients`)).then((snapshot) => {
         if (snapshot.exists()) {
            //console.log("institutions exist " + snapshot.val());
            //this.institutionList = snapshot.val();
            snapshot.forEach( item => {this.clientList.push(item.val());});
           // this.institutionList.push({ value: snapshot.val(), text: snapshot.val() });

         } else {
            console.log("No client data available");
            //this.writeUserData(auth.currentUser.uid);
         }
      }).then(() => {
            console.log("clientList 1:" + this.clientList.length + "current user" + auth.currentUser.uid);

            //dbref = ref(database, 'clients/');

            this.clientList.forEach( item => {this.queryFunction(item,auth.currentUser.uid);
            //this.clientList.forEach( item => {console.log("the value:" + item);

            });

         }).catch((error) => {
         console.error(error);
      });

   },
};

</script>



<style scoped>

</style>