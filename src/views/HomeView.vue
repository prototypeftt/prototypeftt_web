<template>
  <div class="home">
    <LoginUser/>
    <ChatBot/>
  </div>
</template>

<script>
// @ is an alias to /src

import LoginUser from '@/components/LoginUser.vue'
import ChatBot from '@/components/ChatBot.vue'

export default {
  name: 'HomeView',
  components: {
    LoginUser,ChatBot

  }
}
</script>
