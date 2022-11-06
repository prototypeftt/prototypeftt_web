<template>
  <div class="Inbox">
    <MessageInbox/>
  </div>
</template>

<script>
// @ is an alias to /src

import MessageInbox from '@/components/MessageInbox';

export default {
  name: 'InboxView',
  components: {
    MessageInbox
}
}
</script>
