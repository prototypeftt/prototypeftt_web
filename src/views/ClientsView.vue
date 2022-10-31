<template>
  <div class="ClientList">
    <ClientsList/>
  </div>
</template>

<script>
// @ is an alias to /src

import ClientsList from '@/components/ClientsList.vue';

export default {
  name: 'ClientsView',
  components: {
    ClientsList
}
}
</script>
