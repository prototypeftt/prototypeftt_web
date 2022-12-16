<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="./dashboard">FTT Broker Portal</b-navbar-brand>
      <nav>
        <b-navbar-nav>
          <b-nav-item v-if="!loggedIn" to="/">Home</b-nav-item> 
          <b-nav-item v-if="!loggedIn" to="/about">About</b-nav-item> 
          <b-nav-item v-if="loggedIn" to="/clients">Clients</b-nav-item>
          <b-nav-item v-if="loggedIn" to="/aiengine">AI Engine</b-nav-item>
          <b-nav-item v-if="loggedIn" to="/alerts">Alerts</b-nav-item>
          <b-nav-item v-if="loggedIn" to="/inbox">Inbox</b-nav-item>
         <!-- <b-nav-item-dropdown v-if="loggedIn" text="Reports" right>
            <b-dropdown-item href="#">Shares</b-dropdown-item>
            <b-dropdown-item href="#">Crypto</b-dropdown-item>
          </b-nav-item-dropdown>        -->  
          <b-nav-item-dropdown v-if="loggedIn" text="User" right>
            <!--<b-dropdown-item href="settings">Settings</b-dropdown-item> -->
            <b-dropdown-item to="logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </nav>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>

import { getAuth, onAuthStateChanged } from "firebase/auth";
import institutionsConfig from './json/institutionsConfig.json';

import firebase from 'firebase/compat/app';
import firebaseConfig from './helpers/firebaseConfig';
import { getDatabase, set, ref } from "firebase/database";

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Reference to database
const database = getDatabase();
var loggedIn;

export default {
  name: 'App',
  data() {
    return {
      loggedIn,

    }
  },
  mounted() {

    // Add the institutions to the database
    console.log('app view mounted');
    this.writeInsitutionData(institutionsConfig);

    // Check if the user is logged in

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log('user state changed logged in' + user)
        this.loggedIn = true;

      } else {

        console.log('user logout:' + auth.currentUser)
        this.loggedIn = false;

      }
    });
  },
  beforeCreate() {

  },
  beforeUpdate() {

  }, methods: {
    writeInsitutionData: function (institutionsConfig) {

      let institutions = '';

      institutions += '{';
      institutionsConfig.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
          //console.log(`${key} ${value}`);
          institutions += '"' + key + '" : "' + value + '",';
        });
      });

      institutions = institutions.slice(0, - 1); //remove the trailing , from the json data
      institutions += '}';
      console.log(institutions);
      var myObj = JSON.parse(institutions);

      set(ref(database, '/institutions'),
        myObj
      )
    }
  }

}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
