<template>
  <div>
    <SideMenu/>
    <Navigation />
    <nuxt id="main-content"/>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'
import SideMenu from '../components/SideMenu'

export default {
  components: {
    Navigation,
    SideMenu
  }
}

</script>

<style>
  body {
    background-color: #f5f5f5;
    margin-top: 100px;
  }
</style>
