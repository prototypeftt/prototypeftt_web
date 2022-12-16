
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
               <td >{{item.assetId}}</td>
               <td>{{item.assetName}}</td>
               <td>{{item.assetDate}}</td>
               <td>{{item.closePrice}}</td>
               <td>{{item.predictedPrice}}</td>
               <td>{{item.assetPrediction}}</td>
               <td>{{item.assetMovement}}</td>
               <td><b-button id="report-button" class="mr-2" block :href="item.reportPDF" target="_blank">View</b-button></td>
            </tr>

            <tr v-for="item in stockList" :key="item.uuid" >
               <td >{{item.assetCategory}}</td>
               <td >{{item.assetId}}</td>
               <td>{{item.assetName}}</td>
               <td>{{item.assetDate}}</td>
               <td>{{item.closePrice}}</td>
               <td>{{item.predictedPrice}}</td>
               <td>{{item.assetPrediction}}</td>
               <td>{{item.assetMovement}}</td>
               <td><b-button id="report-button" class="mr-2" block :href="item.reportPDF" target="_blank">View</b-button></td>
               
            </tr>
         
      </table>
   </div>

</template>


<script>

import { getAuth } from "firebase/auth";

import { getDatabase, ref, get, child, update } from "firebase/database";

import { getStorage, ref as ref1, getDownloadURL } from "firebase/storage";

const auth = getAuth();

// Reference to database
const database = getDatabase();

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();


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
        fields: ['Asset Type', 'Asset ID', 'Asset Name','Last Updated','Close Price','Predicted Price','Movement Prediction', 'Movement Size %' , ' View Report'],
      }
   },
   computed: {

   },
   methods: {
      checkFormValidity() {
         
         return null
      }, generateReport(item){

         this.generateLink(item.assetId,item);

         // console.log("pdf link" + pdfLink);

      }, generateLink(ticker,item){
         
         const pathReference = ref1(storage, 'graphs/' + ticker + '.pdf');
         console.log("pathref:"+pathReference);
         getDownloadURL(pathReference)
         .then((url) => {
            // Insert url into an <img> tag to "download"
            console.log('url:'+ url);
            this.updateAssets(item,url);
            return url;
         })
         .catch((error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
               case 'storage/object-not-found':
               // File doesn't exist
               break;
               case 'storage/unauthorized':
               // User doesn't have permission to access the object
               break;
               case 'storage/canceled':
               // User canceled the upload
               break;

               // ...

               case 'storage/unknown':
               // Unknown error occurred, inspect the server response
               break;
            }
         });

      }, updateAssets(item,url){       
         console.log('add pdf link'+ url);
         const updates = {};
         updates['/assets/' + item.assetCategory + '/' + item.assetId + '/reportPDF' ] = url;
         update(ref(database), updates); 
        
      }

   },
   watch: {

   },
   mounted() {
      //alert('mounted');

      var dbref = ref(database, 'assets/');

     get(child(dbref, 'CRYPTO')).then((snapshot) => {
         if (snapshot.exists()) {

            snapshot.forEach( item => {
               this.generateLink(item.val().assetId,item.val());
               this.cryptoList.push(item.val());
               
            }); // Adds each asset type to an array

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

            snapshot.forEach( item => {
               this.generateLink(item.val().assetId,item.val());
               this.stockList.push(item.val());
               
            }); // Adds each asset type to an array

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