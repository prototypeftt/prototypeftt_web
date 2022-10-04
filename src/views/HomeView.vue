<template>
  <div class="home">
    <LoginUser msg="FTT Broker"/>
  </div>
</template>

<script>
// @ is an alias to /src

import LoginUser from '@/components/LoginUser.vue'

export default {
  name: 'HomeView',
  components: {
    LoginUser,

  }
}
</script>
