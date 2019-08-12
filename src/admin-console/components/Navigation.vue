<template>
  <div>
    <b-navbar class="nav" fixed="top">
      <b-navbar-brand href="/">
        <img src="~/assets/img/logo.png" width="130" height="40" class="d-inline-block align-top" alt="logo">
      </b-navbar-brand>

    </b-navbar>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
}
</script>

<style scoped lang="scss">
  .nav {
    z-index: 1000;
    background-color: white;
    border-bottom: 0.5px solid #e8e8e8;
  }
</style>
