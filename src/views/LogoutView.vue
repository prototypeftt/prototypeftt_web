<template>
  <div class="logout">
    <h1>Logout</h1>
    <LogoutUser/>

  </div>
</template>

<script>

import LogoutUser from '@/components/LogoutUser.vue'
//import { getAuth } from "firebase/auth";





//console.log("logged out" + auth.currentUser.email);
//this.$router.push('dashboard');

export default {
  name: 'LogoutView',
  components: {
    LogoutUser,

  }
}

</script>
  