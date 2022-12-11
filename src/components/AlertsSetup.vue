
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
            <td v-if="item.alertLevel > 0"><input type="text" :id="item.assetId" placeholder="Enter % movement to alert" :value="item.alertLevel"/></td>
            <td v-else><input type="text" :id="item.assetId" placeholder="Enter % movement to alert" /></td>
         </tr>

      </table>
   </div>

</template>


<script>

import { getAuth } from "firebase/auth";

import { getDatabase, ref, get, child, set } from "firebase/database";


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
      }
   },
   computed: {
      alertValue() {
         return 6.66;
         
         //return item.assetId;
      }
   },
   methods: {
      setAlert(id,alertLevel) {
         console.log("alert set:" + id +"alertLevel:" + alertLevel);
      }, getAlertValue(assetId) {  //Gets the currently set alert value from the array

         this.alertList.forEach((alert) => {
            if (assetId == alert.assetId) {
               console.log("alert level" + alert.alertLevel);
               return alert.alertLevel;
            }else{
               return null;
            }
         });

         return null;

      },checkAlertValue(assetId) {  //Gets the currently set alert value from the array

         this.alertList.forEach((alert) => {
            if (assetId == alert.assetId) {
               console.log("alert asset found " + alert.assetId);
               this.alertCheck = true;
               return alert.assetId;
            }else{
               this.alertCheck = false;
               return null;
            }
         });
         this.alertCheck = false;
         return null;

      },setupAlerts() { 
         console.log("setup alerts");
         this.assetList.forEach((asset)=>{
            console.log("assets "+asset.assetId)

            set(ref(database, 'alerts/' + auth.currentUser.uid + '/' + asset.assetId), {
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

               this.setupAlerts();

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