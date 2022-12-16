
<template>

   <div>
      <table>
         <tr>
            <th v-for="item in fields" :key="item">
               {{ item }}
            </th>
         </tr>

         <tr v-for="item in alertList" :key="item.uuid">
            <td>{{ item.assetCategory }}</td>
            <td>{{ item.assetId }}</td>
            <td>{{ item.assetName }}</td>
            <td v-if="item.alertLevel > 0"><input type="text" :id="item.assetId" placeholder="Enter % movement to alert" :value="item.alertLevel" @input="displaySave(item.assetName,item.assetCategory)"/></td>
            <td v-else><input type="text" :id="item.assetId" placeholder="Enter % movement to alert" @input="displaySave(item.assetName,item.assetCategory)"/>
            <b-button variant="success" disabled v-show="saving === item.assetId">
            <b-spinner small></b-spinner>
            <span class="sr-only"> Saving...</span>
            </b-button>
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
   name: 'AlertsSetup',
   props: {
   },
   data: () => {
      return {
         items: [],
         assetList: [],
         alertList: [],
         fields: ['Asset Type', 'Asset ID', 'Asset Name', 'Alert %'],
         alertCheck: false,
         saving: '',
      }
   },
   computed: {
      alertValue() {
         return 6.66;
         
         //return item.assetId;
      }
   },
   methods: {
      displaySave(assetName,assetCategory) {

         var updates = {};
         this.saving = event.target.id;
         console.log("saving:"+this.saving);

         updates['alerts/'+auth.currentUser.uid+'/'+event.target.id+'/'] = {
            "assetId": event.target.id,
            "assetName": assetName,
            "assetCategory": assetCategory,
            "alertLevel": event.target.value
         };

         update(ref(database), updates);

         this.timer = setTimeout(() => {
         this.saving = '';
        console.log("execute me")
      }, 1000)

      }
      },
   watch: {

   },
   mounted() {

      var dbref = ref(database,'assets/');

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


      dbref = ref(database, `alerts/${auth.currentUser.uid}/`);

      // Only allows the logged in Broker to see their own alerts

      get(child(dbref, `/`)).then((snapshot) => {
         if (snapshot.exists()) {

            snapshot.forEach(item => { this.alertList.push(item.val()); }); // Adds each message to an array

         } else {
            console.log("No message data available");
         }
      }).then(() => {
         console.log("alert list then");

      }).catch((error) => {
         console.error(error);
      });

   }

};

</script>

<style scoped>
table,
th,
td {
   border: 1px solid black;
   margin: 5px;
   padding-left: 5px;
   padding: 5px;
   vertical-align: top;
   table-layout: auto;
}
</style>