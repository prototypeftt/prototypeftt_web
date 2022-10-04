<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <!-- <div v-if="loggedIn"> -->
        <router-link v-if="loggedIn" to="/logout">| Logout</router-link>
       <!-- </div> -->
    </nav>
    <router-view/>
  </div>
</template>

<script>

  var loggedIn;
  
  export default {
    name: 'App',
    data() {
      return {
        loggedIn,
  
      }
    },
    mounted() {
      this.loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
      window.addEventListener('loggedIn-localstorage-changed', (event) => {
        this.loggedIn = event.detail.storage;
        //alert("event info : " + this.loggedIn);
      });   
    },
    beforeCreate() {
      //alert('mounted loggedin value: ' + JSON.parse(localStorage.getItem('loggedIn')));
      //loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
      this.loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    },
    beforeUpdate() {
      /*alert('beforeUpdate() val: ' + this.loggedIn)
      loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
      alert('after beforeUpdate() val: ' + this.loggedIn)*/
      this.loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
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
