import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/*var firebaseConfig = {
  apiKey: "YourConfigHere",
  authDomain: "YourConfigHere",
  projectId: "YourConfigHere",
  storageBucket: "YourConfigHere",
  messagingSenderId: "YourConfigHere",
  appId: "YourConfigHere"
}; */

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH4xa6OG8IO8QT03suoVvOk54kK4X4f9Y",
  authDomain: "prototypeftt-cca12.firebaseapp.com",
  databaseURL: "https://prototypeftt-cca12-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "prototypeftt-cca12",
  storageBucket: "prototypeftt-cca12.appspot.com",
  messagingSenderId: "860306654067",
  appId: "1:860306654067:web:0dce368ef3a5ff5fd2fb06",
  measurementId: "G-KB1LGZ2TM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase
//initializeApp(firebaseConfig);


Vue.config.productionTip = false

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

export { app, auth }

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
