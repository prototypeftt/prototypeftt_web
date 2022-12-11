<template>
  <div class="ClientList">
    <AlertsSetup/>
  </div>
</template>

<script>
// @ is an alias to /src

import AlertsSetup from '@/components/AlertsSetup';

export default {
  name: 'AlertsView',
  components: {
    AlertsSetup
}
}
</script>
