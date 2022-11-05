
<template>

   <div>
      <table>
         <tr>
            <th v-for="item in fields" :key="item">
               {{item}}
            </th>
         </tr>
         
            <tr v-for="item in items" :key="item.uuid" >
               <td >{{item.uuid}}</td>
               <td>{{item.broker}}</td>
               <td>{{item.name}}</td>
               <td>{{item.direct}}</td>
               
               <td>
               <table>
                  <tr><th v-for="item in assetFields" :key="item">
                  {{item}}
                  </th></tr>
                  <tr v-for="(value, key, index) in item.cryptos" :key="`crypto-${ key }-${ index }`">
                     <td>{{value.child("cryptoId").val()}}</td>
                     <td>{{value.child("cryptoName").val()}}</td>
                     <td>{{value.child("price").val()}}</td>
                     <td>{{value.child("qty").val()}}</td>                  
                  </tr>

               </table>
            </td>
            <td>
               <table>
                  <tr><th v-for="item in assetFields" :key="item">
                  {{item}}
                  </th></tr>
                  <tr v-for="(value, key, index) in item.shares" :key="`shares-${ key }-${ index }`">  
                     <td>{{value.child("shareId").val()}}</td>
                     <td>{{value.child("shareName").val()}}</td>
                     <td>{{value.child("price").val()}}</td>
                     <td>{{value.child("qty").val()}}</td>
                  </tr>
               </table>
            </td>

            </tr>
         
      </table>
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
        clientList: [],
        items: [],
        fields: ['uuid','broker','name','direct','crypto','shares'],
        assetFields: ['ID','Name','Price','Qty'],
        cryptos: [],
        shares: []
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

                  snapshot.child("cryptos").forEach( item => {this.cryptos.push(item);});
                  
                  //var cryptoField='';

                  //this.crypto.forEach(item => {cryptoField=item.val()});

                  //console.log("crypto:" + this.cryptos.length);
                  snapshot.child("shares").forEach( item => {this.shares.push(item)});
                  //console.log("shares length :" + this.shares.length);

                  this.items.push({
                     uuid:uuid,
                     broker:snapshot.child("broker").val(),
                     name:snapshot.child("name").val(),
                     direct:snapshot.child("direct").val(),
                     //cryptos:Array(this.cryptos),
                     cryptos:this.cryptos,
                     //crypto:cryptoField,
                     shares:this.shares
                  });
                  
                  this.cryptos=[];
                  this.shares=[];

                  //console.log("array2" + JSON.stringify(this.items));
        
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

      console.log(`brokers/${auth.currentUser.uid}/clients`);

      var dbref = ref(database, 'brokers/');
      
      // Only allows the logged in Broker to see their own clients

      get(child(dbref, `${auth.currentUser.uid}/clients`)).then((snapshot) => {
         if (snapshot.exists()) {

            snapshot.forEach( item => {this.clientList.push(item.val());}); // Adds each client UUID to an array

         } else {
            console.log("No client data available");
         }
      }).then(() => {
            console.log("clientList 1:" + this.clientList.length + "current user" + auth.currentUser.uid);

            this.clientList.forEach( item => {this.queryFunction(item,item); //iterates over client data using client UUID's to get client info and update table

            });

         }).catch((error) => {
         console.error(error);
      });

   },
};

</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  margin: 5px;
  padding-left: 5px;
  padding: 5px;
  vertical-align:top;
  table-layout: auto;
}  
</style>