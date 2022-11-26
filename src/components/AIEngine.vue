
<template>

<div>
      <table>
         <tr>
            <th v-for="item in fields" :key="item">
               {{item}}
            </th>
         </tr>
         
            <tr v-for="item in cryptoList" :key="item.uuid" >
               <td >{{item.assetCategory}}</td>
               <td>{{item.assetName}}</td>
               <td>{{item.assetDate}}</td>
               <td>{{item.closePrice}}</td>
               <td>{{item.predictedPrice}}</td>
               <td>{{item.assetPrediction}}</td>
               <td>{{item.assetMovement}}</td>
               
            </tr>

            <tr v-for="item in stockList" :key="item.uuid" >
               <td >{{item.assetCategory}}</td>
               <td>{{item.assetName}}</td>
               <td>{{item.assetDate}}</td>
               <td>{{item.closePrice}}</td>
               <td>{{item.predictedPrice}}</td>
               <td>{{item.assetPrediction}}</td>
               <td>{{item.assetMovement}}</td>
               
            </tr>
         
      </table>
   </div>

</template>


<script>

import { getAuth } from "firebase/auth";

import { getDatabase, ref, get, child } from "firebase/database";

const auth = getAuth();

// Reference to database
const database = getDatabase();

export default {
   name: 'AIEngine',
   props: {
   },
   data: () => {
      return {
        items: [],
        assetList: [],
        cryptoList: [],
        stockList: [],
        fields: ['Asset Type', 'Asset Name','Last Updated','Close Price','Predicted Price','Movement Prediction', 'Movement Size'],
      }
   },
   computed: {

   },
   methods: {
      checkFormValidity() {
         
         return null
      }, 

   },
   watch: {

   },
   mounted() {
      //alert('mounted');

      var dbref = ref(database, 'assets/');

      get(child(dbref, 'CRYPTO')).then((snapshot) => {
         if (snapshot.exists()) {

            snapshot.forEach( item => {this.cryptoList.push(item.val());}); // Adds each asset type to an array

         } else {
            console.log("No client data available");
         }
      }).then(() => {
            console.log("asset list" + this.cryptoList.length + "current user" + auth.currentUser.uid);

            /*this.items.forEach( item => {this.queryFunction(item,item); //iterates over client data using client UUID's to get client info and update table

            });*/

         }).catch((error) => {
         console.error(error);
      });

      

      get(child(dbref, 'STOCK')).then((snapshot) => {
         if (snapshot.exists()) {

            snapshot.forEach( item => {this.stockList.push(item.val());}); // Adds each asset type to an array

         } else {
            console.log("No client data available");
         }
      }).then(() => {
            console.log("asset list" + this.stockList.length + "current user" + auth.currentUser.uid);

            /*this.items.forEach( item => {this.queryFunction(item,item); //iterates over client data using client UUID's to get client info and update table

            });*/

         }).catch((error) => {
         console.error(error);
      });

   }
   
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