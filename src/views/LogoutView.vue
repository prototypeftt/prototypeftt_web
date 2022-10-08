<template>
  <div class="logout">
    <h1>Logout</h1>

  </div>
</template>

<script>

import { getAuth } from "firebase/auth";

const auth = getAuth();
console.log("logged out" + auth.currentUser.email)
auth.signOut();

//alert("logged out");

/*localStorage.loggedIn = false;
window.dispatchEvent(new CustomEvent('loggedIn-localstorage-changed', {
          detail: {
             storage: localStorage.getItem('loggedIn')
          }
          }));*/
  //this.$router.push('/');
</script>
  