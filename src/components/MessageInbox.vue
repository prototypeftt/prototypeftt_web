
<template>

   <div>
         <b-table striped hover :items="messageList" :fields="fields" > 
            <template v-slot:cell(uuid)="row">
               <b-col>{{ row.item.uuid }}</b-col>
            </template>
            
            <template #cell(reply)="row">
               <b-button size="sm" @click="showNewMessage(row.item)" class="mr-2">
                  Reply
               </b-button>
            </template>
         </b-table> 

         <b-modal id="message-reply" title="Enter message to send:" @show="resetModal" @hidden="resetModal"
         @send="handleSend" hide-footer>

         <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="Message" label-for="name-input" invalid-feedback="Message required" :state="messageState">
               <b-form-input id="message-input" v-model="message" :state="messageState" required></b-form-input>
            </b-form-group>
         </form>
         <b-button id="discard-button" class="mt-3" variant="outline-danger" block @click="resetModal">Discard</b-button>
         <b-button class="mt-2" variant="outline-warning" block @click="messageReply(modalData)">Send
         
            <b-spinner v-show="sendingReply" id="spinner-sending" small></b-spinner>
    
         </b-button>


      </b-modal>

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
        fields:['message','name','uuid','Delete','Reply'],
        messageState: null,
        modalData:null,
        sendingReply: false
      }
   },
   computed: {

   },
   methods: {
      checkFormValidity() {
         const valid = this.$refs.form.checkValidity()
         this.messageState = valid
         return valid
      }, resetModal() {
         this.$bvModal.hide('message-reply')
      }, handleSend(bvModalEvent) {
         // Prevent modal from closing
         bvModalEvent.preventDefault()
         // Trigger submit handler
         this.handleSubmit()
      },
      handleSubmit() {
         // Exit when the form isn't valid
         //if (!this.checkFormValidity()) {
         //   return
        // }
         // Push the name to submitted names
         //this.submittedNames.push(this.name)
         //this.writeUserData(auth.currentUser.uid);
         // Hide the modal manually
         this.$nextTick(() => {
            this.$bvModal.hide('message-reply')
         })
      },showNewMessage(item){
         //console.log("reply to:" + item.uuid);
         this.$bvModal.show('message-reply')
         this.modalData = item;
      }
      ,messageReply(modalData){
//         this.$bvModal.show('message-reply')
         console.log("api call: " + modalData.uuid);
         //let currentObj = this;
         this.sendingReply = true;
         
         this.axios.post('https://us-central1-prototypeftt-cca12.cloudfunctions.net/api/newmessage', {
            "message": this.message,
            "receiverUuid" : modalData.uuid,
            "senderUuid" : auth.currentUser.uid,
            "name" : auth.currentUser.displayName,
            })

            .then(function (response) {

            //currentObj.output = response.data;

            //this.$bvModal.hide('discard-button');
            
            console.log("api call success " + response);
            //this.sendingReply = false;

            })

            .catch(function (error) {
            this.sendingReply = false;
            //currentObj.output = error;

            console.log("api call failure " + error);

            });

            
      }

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