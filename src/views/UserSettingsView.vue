<template>
  <div class="dashboard">
    <UserSettings/>
  </div>
</template>

<script>
// @ is an alias to /src

import UserSettings from '@/components/UserSettings.vue'

export default {
  name: 'DashBoardView',
  components: {
    UserSettings
  }
}
</script>
