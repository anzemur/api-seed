<template>
  <div>
    <b-navbar class="nav" fixed="top">
      <div style="font-size: 0.8rem;">
        <i @click="toggleSideMenu()" class="menu-icon mr-3 side-nav-ic fa fa-bars fa-lg"></i>
      </div>
      <b-navbar-brand>
        <nuxt-link to="/settings">
          <img src="~/assets/img/logo.png" width="130" height="40" class="d-inline-block align-top" alt="logo">
        </nuxt-link>
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
  methods: {
    toggleSideMenu() {
      this.$store.dispatch('ui/toggleSideMenu');
    },
  }
}
</script>

<style scoped lang="scss">
  @import '~/assets/scss/styles';

  .nav {
    z-index: 1000;
    background-color: white;
    border-bottom: 0.5px solid #e8e8e8;
  }

  .menu-icon {
    cursor: pointer;
    color: $gray;
     &:hover {
      color: $primary;
    }
  }
</style>
