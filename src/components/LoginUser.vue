
<template>

   <div class="login-page">

      <transition name="fade">
         <div v-if="!registerActive" class="wallpaper-login"></div>
      </transition>
      <div class="wallpaper-register"></div>
      <h1></h1>
      <div class="container">
         <section id="firebaseui-auth-container"></section>
      </div>

   </div>

</template>


<script>

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import "firebaseui/dist/firebaseui.css";
import firebaseConfig from '../helpers/firebaseConfig';

import { getDatabase, set, ref, get, child, update } from "firebase/database";
//import { getDatabase, set, ref } from "firebase/database";

// Initialize Firebase app
var app = firebase.initializeApp(firebaseConfig);

// Reference to database
const database = getDatabase();

export default {
   name: 'LoginUser',
   props: {
   },
   data: () => {
      return {
         name: '',
         password: '',
         loggedIn: false,
         registerActive: false,
         emailLogin: "",
         passwordLogin: "",
         emailReg: "",
         passwordReg: "",
         confirmReg: "",
         emptyFields: false,
      }
   },
   computed: {

   },
   methods: {

      signInAttempSuccessful(authResult, redirectUrl) {
         console.log('Sign in successfull. See dev console for authorization response')
         console.log('authResult', authResult)
         console.log('redirectUrl', redirectUrl)

         // temp method call to create client data
         // this.writeClientData("nVfSoiQK9EexBq1JvXPACbqwk4x1");
         // this.writeClientData("kyg7MadtkiaklY8qfzDe1CxtDR73");
         //this.writeMessages(authResult.user.uid);

         // Setup the Chatbot Decision Tree
         this.writeChatBotTree();

         //Setup the alerts data structure for testing
         //this.alertsSetup(authResult.user.uid, "GOOGL");
         //this.alertsSetup(authResult.user.uid, "MSFT");

         // Do what you wish with authResult... save to session, cookie, etc.
         // Check if there is a broker entry in the database.
         // if there is then do nothing
         // if there isn't then create one and prompt the broker to add more info

         console.log(`brokers/${authResult.user.uid}`);

         var dbref = ref(database, 'brokers/');
         get(child(dbref, `${authResult.user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
               console.log("broker exists in database");
               // do this last redirect to dashboard page
               this.$router.push('dashboard');
            } else {
               console.log("No data available");
               this.writeUserData(authResult.user.uid);
               this.setupAlerts(authResult.user.uid);
            }
         }).catch((error) => {
            console.error(error);
         });

         // do this last redirect to dashboard page
         //this.$router.push('dashboard');

      },
      // Note, bad credentials is not a sign-in failure
      signInAttempFailure(error) {
         console.log('Sign in failed. See dev console for error response')
         console.log('error', error)
      },
      firebaseUiShown: function () {
         console.log('Firebase UI widget rendered')
      },
      writeUserData: function (userId) {
         //const db = getDatabase();
         set(ref(database, 'brokers/' + userId), {
            "premium": "0.00",
            "institution": "None",
            "name": "No Name",
            "broker": true,
            "clients": ["kyg7MadtkiaklY8qfzDe1CxtDR73", "nVfSoiQK9EexBq1JvXPACbqwk4x1"],
            "require_setup": true
         }).then(() => {
            // Data saved successfully!
            console.log("broker data saved async");
            // do this last redirect to dashboard page
            this.$router.push('dashboard');
         })
            .catch((error) => {
               // The write failed...
               console.log("error" + error);
            });
      }, writeMessages: function (uuid) {
         set(ref(database, 'messages/' + uuid), [{
            "uuid": "No sender uuid",
            "name": "sender name",
            "message": "1 test message from sender"
         }, {
            "uuid": "No sender uuid",
            "name": "sender name",
            "message": "2 test message from sender"
         }, {
            "uuid": "No sender uuid",
            "name": "sender name",
            "message": "3 test message from sender"
         }],
         ).then(() => {
            // Data saved successfully!
            console.log("client data saved async");
            // do this last redirect to dashboard page
            //this.$router.push('dashboard');
         })
            .catch((error) => {
               // The write failed...
               console.log("error client data" + error);
            });

      },
      writeClientData: function (uuid) {
         //const db = getDatabase();
         set(ref(database, 'clients/' + uuid), {
            "name": "No Name",
            "broker": true,
            "direct": false,
            "shares": [{ "shareId": "share 1", "shareName": "Tesla", "price": "10.00", "qty": "100" },
            { "shareId": "share 2", "shareName": "Twitter", "price": "0.00", "qty": "100" },
            { "shareId": "share 3", "shareName": "SpaceX", "price": "0.00", "qty": "100" },
            { "shareId": "share 4", "shareName": "Meta", "price": "0.00", "qty": "100" },
            { "shareId": "share 5", "shareName": "Microsoft", "price": "0.00", "qty": "100" }],
            "cryptos": [{ "cryptoId": "crypto 1", "cryptoName": "Doge", "price": "20.00", "qty": "100" }, { "cryptoId": "crypto 2", "cryptoName": "Bitcoin", "price": "0.00", "qty": "100" }],
            "require_setup": true
         }).then(() => {
            // Data saved successfully!
            console.log("client data saved async");
            // do this last redirect to dashboard page
            //this.$router.push('dashboard');
         })
            .catch((error) => {
               // The write failed...
               console.log("error client data" + error);
            });
      }, writeChatBotTree: function () {
         //const db = getDatabase();
         set(ref(database, 'chatbot/tree/'), {
            "menu": {
               "message": "Welcome, choose one -",
               "options": { "A": "Buy Assets", "B": "Asset Prices", "C": "Contact Broker" }
            }
         }).then(() => {
            // Data saved successfully!
            console.log("client data saved async");
         })
            .catch((error) => {
               // The write failed...
               console.log("error client data" + error);
            });

         var updates = {};
         /*updates['chatbot/tree/'] = {
            "menu" : {
            "message" : "Welcome, choose one -",
            "options" : {"A": "A - Buy Assets","B": "B - View Asset Prices","C": "C - Contact Broker"}         
         }};*/
         updates['chatbot/tree/option/A/'] = {
            "message": "Download the app and register to buy assets",
            "options": { "AA": "Download", "XX": "Main Menu" }
         };
         update(ref(database), updates);
         updates['chatbot/tree/option/B/'] = {

            "message": "Asset Prices",
            "options": { "BA": "Buy Assets", "XX": "Main Menu" }
         };
         update(ref(database), updates);
         updates['chatbot/tree/option/C/'] = {

            "message": "Choose Contact Method:",
            "options": { "CA": "Email Broker", "CB": "Phone Broker", "XX": "Main Menu" }
         };

         update(ref(database), updates);

         // Second Level

         //updates = {};

         updates['chatbot/tree/option/AA/'] = {
            "message": "Download the client app from the App Store",
            "options": { "XX": "Main Menu" }
         };
         update(ref(database), updates);

         updates['chatbot/tree/option/BA/'] = {
            "message": "Download the App and register to buy assets",
            "options": { "XX": "Main Menu" }
         };
         update(ref(database), updates);

         updates['chatbot/tree/option/CA/'] = {
            "message": "Download and register on app to email broker",
            "options": { "XX": "Main Menu" }
         };
         update(ref(database), updates);

         updates['chatbot/tree/option/CB/'] = {
            "message": "Phone Broker on 555-456178 to buy assets",
            "options": { "XX": "Main Menu" }
         };
         update(ref(database), updates);

         updates['chatbot/tree/option/XX/'] = {
            "message": "Choose One ",
            "options": { "A": "Buy Assets", "B": "Asset Prices", "C": "Contact Broker" }
         };
         update(ref(database), updates);

      }

   },
   watch: {

   },
   mounted() {

      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      // https://firebaseopensource.com/projects/firebase/firebaseui-web/#configuration
      var firebaseConfigUI = {
         signInFlow: 'popup',
         signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            // These need to be independently enabled through the web console.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
         ],
         callbacks: {
            signInSuccessWithAuthResult: this.signInAttempSuccessful,
            signInFailure: this.signInAttempFailure,
            uiShown: this.firebaseUiShown
         },
         // tosUrl and privacyPolicyUrl accept either url string or a callback
         // function.
         // Terms of service url/callback.
         tosUrl: '/about',
         // Privacy policy url/callback.
         privacyPolicyUrl: function () {
            window.location.assign('/about');
         }
      }
      // Initialize the FirebaseUI Widget using the Firebase app.
      var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(app.auth())
      // The start method will wait until the DOM is loaded.

      ui.start('#firebaseui-auth-container', firebaseConfigUI)
   },
};

</script>



<style scoped>
p {
   line-height: 1rem;
}

.card {
   padding: 20px;
}

.form-group {
   input {
      margin-bottom: 20px;
   }
}

.login-page {
   align-items: center;
   display: flex;
   height: 100vh;

   .wallpaper-login {
      background: url(https://images.pexels.com/photos/32237/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260) no-repeat center center;
      background-size: cover;
      height: 100%;
      position: absolute;
      width: 100%;
   }

   .fade-enter-active,
   .fade-leave-active {
      transition: opacity .5s;
   }

   .fade-enter,
   .fade-leave-to {
      opacity: 0;
   }

   .wallpaper-register {
      background: url(https://images.pexels.com/photos/533671/pexels-photo-533671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260) no-repeat center center;
      background-size: cover;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: -1;
   }

   h1 {
      margin-bottom: 1.5rem;
   }
}

.error {
   animation-name: errorShake;
   animation-duration: 0.3s;
}

@keyframes errorShake {
   0% {
      transform: translateX(-25px);
   }

   25% {
      transform: translateX(25px);
   }

   50% {
      transform: translateX(-25px);
   }

   75% {
      transform: translateX(25px);
   }

   100% {
      transform: translateX(0);
   }
}
</style>