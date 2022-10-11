<template>
  <div class="logout">
    <h1>User Logged Out</h1>
  </div>
</template>

<script>

import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
console.log("logging out" + auth.currentUser.email);
//auth.signOut();

signOut(auth).then(() => {
      console.log("logged out");
    }).catch((error) => {
      // An error happened.
      console.log("error:" + error);
    })

export default {
  name: 'LogoutUser',
  props: {
  }, methods: {
    

  }
};

</script>