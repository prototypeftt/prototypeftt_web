
<template>

   <div>

         <b-table striped hover :items="messageList"> 
            <p>Message Go Here</p>
         </b-table> 

   </div>

</template>


<script>

import { getAuth } from "firebase/auth";

import { getDatabase, ref, get, child} from "firebase/database";

const auth = getAuth();

// Reference to database
const database = getDatabase();

export default {
   name: 'MessageInbox',
   props: {
   },
   data: () => {
      return {
        messageList:[],
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

      console.log(`messages/${auth.currentUser.uid}`);

      var dbref = ref(database, `messages/${auth.currentUser.uid}/`);

      // Only allows the logged in Broker to see their own messages

      get(child(dbref, `/`)).then((snapshot) => {
         if (snapshot.exists()) {

            snapshot.forEach( item => {this.messageList.push(item.val());}); // Adds each message to an array

         } else {
            console.log("No message data available");
         }
      }).then(() => {
            console.log("message list then");

   }).catch((error) => {
   console.error(error);
});

   },
};

</script>

<style scoped>

</style>