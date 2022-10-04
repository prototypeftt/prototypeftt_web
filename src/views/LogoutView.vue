<template>
    <div class="logout">
      <h1>Logout</h1>

    </div>
</template>

<script>
  alert("logged out");
  localStorage.loggedIn = false;
  window.dispatchEvent(new CustomEvent('loggedIn-localstorage-changed', {
            detail: {
               storage: localStorage.getItem('loggedIn')
            }
            }));
  //this.$router.push('/');
</script>
  