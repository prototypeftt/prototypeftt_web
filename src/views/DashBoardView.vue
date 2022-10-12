<template>
  <div class="dashboard">
    <DashBoard/>
  </div>
</template>

<script>
// @ is an alias to /src

import DashBoard from '@/components/DashBoard.vue'

export default {
  name: 'DashBoardView',
  components: {
    DashBoard

  }
}
</script>
